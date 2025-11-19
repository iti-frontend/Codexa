// File: components/TodoListTable.jsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { CalendarIcon, Trash2, Edit, Save, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { todoService } from "@/services/todoService";
import useProfile from "@/hooks/useProfile";
import { todoService, getId } from "@/services/todoService";



export default function TodoListTable({ onTodoUpdate }) {
  const { profile } = useProfile();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [newDate, setNewDate] = useState(new Date());
  const [filterDate, setFilterDate] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [editDate, setEditDate] = useState(new Date());
  const [saving, setSaving] = useState(false);

  // Fetch todos from API
  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};

      if (filterStatus !== "all") {
        // API expects isDone (matches our model)
        params.isDone = filterStatus === "Completed";
      }

      // If you want server-side priority filtering, add it here
      if (filterPriority !== "all") {
        params.priority = filterPriority.toLowerCase();
      }

      if (filterDate) {
        // send as YYYY-MM-DD to API if supported
        params.dueDate = format(filterDate, "yyyy-MM-dd");
      }

      const response = await todoService.getTodos(params);
      // normalize items: ensure array
      setTasks(response?.items || response || []);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterPriority, filterDate]);

  // Add new task
  const handleAddTask = async () => {
    if (!newTask.trim()) return;

    try {
      const todoData = {
        title: newTask.trim(),
        priority: newPriority,
        dueDate: newDate ? newDate.toISOString() : null,
      };

      await todoService.createTodo(todoData);
      setNewTask("");
      setNewPriority("medium");
      setNewDate(new Date());
      await fetchTodos();
      onTodoUpdate?.();
    } catch (error) {
      console.error("Error creating todo:", error);
      alert("Failed to create task. Check console for details.");
    }
  };

  // Delete task
  const handleDeleteTask = async (task) => {
    const id = getId(task);
    if (!id) return;

    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await todoService.deleteTodo(id);
      await fetchTodos();
      onTodoUpdate?.();
    } catch (error) {
      console.error("Error deleting todo:", error);
      alert("Failed to delete task. Check console for details.");
    }
  };

  // Start editing task
  const handleEditTask = (task) => {
    const id = getId(task);
    setEditingTaskId(id);
    setEditTitle(task.title || "");
    setEditPriority(task.priority || "medium");
    setEditDate(task.dueDate ? new Date(task.dueDate) : new Date());
  };

  // Save edited task
  const handleSaveEdit = async (task) => {
    const id = getId(task);
    if (!id) return;
    if (!editTitle.trim()) return;

    try {
      setSaving(true);
      await todoService.updateTodo(id, {
        title: editTitle.trim(),
        priority: editPriority,
        dueDate: editDate ? editDate.toISOString() : null,
      });

      setEditingTaskId(null);
      await fetchTodos();
      onTodoUpdate?.();
    } catch (error) {
      console.error("Error updating todo:", error);
      alert("Failed to update task. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingTaskId(null);
  };

  // Toggle completion status
  const handleCheckboxToggle = async (task) => {
    const id = getId(task);
    if (!id) return;

    try {
      await todoService.updateTodo(id, {
        isDone: !task.isDone,
      });
      await fetchTodos();
      onTodoUpdate?.();
    } catch (error) {
      console.error("Error updating todo:", error);
      alert("Failed to update task status. Check console for details.");
    }
  };

  const getDisplayStatus = (isDone) => (isDone ? "Completed" : "Pending");
  const getDisplayPriority = (priority) =>
    priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : "Medium";

  // Local filtering (in case API doesn't fully support all params)
  const filteredTasks = tasks.filter((task) => {
    // Date match
    const matchDate = filterDate
      ? task.dueDate &&
        format(filterDate, "yyyy-MM-dd") === format(new Date(task.dueDate), "yyyy-MM-dd")
      : true;

    // Priority match
    const matchPriority = filterPriority !== "all" ? task.priority === filterPriority.toLowerCase() : true;

    // Status match (if user filtered locally instead of via API)
    const matchStatus = filterStatus !== "all" ? (filterStatus === "Completed" ? task.isDone : !task.isDone) : true;

    return matchDate && matchPriority && matchStatus;
  });

  useEffect(() => {
    if (profile) {
      fetchTodos();
    }
  }, [profile, fetchTodos]);

  if (loading && tasks.length === 0) {
    return <div className="p-4">Loading todos...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-xl bg-foreground/3 p-5 shadow-sm w-full mt-4"
    >
      <h2 className="text-lg font-semibold mb-4">To-Do List</h2>

      {/* Add Task Section */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Input
          type="text"
          placeholder="Enter task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="w-[140px] sm:w-[180px] md:w-[280px] lg:w-[400px]"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleAddTask();
            }
          }}
        />

        <Select value={newPriority} onValueChange={setNewPriority}>
          <SelectTrigger className="w-[120px] h-9">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="w-[200px] h-9 justify-start text-left">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {newDate ? format(newDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={newDate} onSelect={setNewDate} initialFocus />
          </PopoverContent>
        </Popover>

        <Button onClick={handleAddTask} className="px-10 font-bold">
          Add
        </Button>
      </div>

      {/* Filter Section */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="w-[140px] h-9 justify-start text-left">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filterDate ? format(filterDate, "PPP") : <span>Filter by date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={filterDate} onSelect={setFilterDate} initialFocus />
          </PopoverContent>
        </Popover>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setFilterDate(null);
            setFilterPriority("all");
            setFilterStatus("all");
          }}
        >
          Clear
        </Button>
      </div>

      {/* Tasks Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.map((task, index) => (
            <TableRow key={getId(task) || `task-${index}`}>
              <TableCell className="flex items-center gap-2">
                <Checkbox
                  checked={task.isDone || false}
                  onCheckedChange={() => handleCheckboxToggle(task)}
                  disabled={editingTaskId === getId(task)}
                />
                {editingTaskId === getId(task) ? (
                  <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full" placeholder="Task title" />
                ) : (
                  <span className={`${task.isDone ? "line-through text-muted-foreground" : ""}`}>
                    {task.title}
                  </span>
                )}
              </TableCell>

              <TableCell>{getDisplayStatus(task.isDone)}</TableCell>

              <TableCell>
                {editingTaskId === getId(task) ? (
                  <Select value={editPriority} onValueChange={setEditPriority}>
                    <SelectTrigger className="w-[100px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className={`font-medium ${task.priority === "high" ? "text-red-500" : task.priority === "medium" ? "text-yellow-500" : "text-green-500"}`}>
                    {getDisplayPriority(task.priority)}
                  </span>
                )}
              </TableCell>

              <TableCell>
                {editingTaskId === getId(task) ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="w-[150px] h-8 justify-start text-left">
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {editDate ? format(editDate, "PPP") : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={editDate} onSelect={setEditDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                ) : (
                  task.dueDate ? format(new Date(task.dueDate), "PPP") : "No date"
                )}
              </TableCell>

              <TableCell>
                <div className="flex gap-1">
                  {editingTaskId === getId(task) ? (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => handleSaveEdit(task)} disabled={saving}>
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleCancelEdit} disabled={saving}>
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => handleEditTask(task)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(task)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredTasks.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">No tasks found. Create your first task!</div>
      )}
    </motion.div>
  );
}



