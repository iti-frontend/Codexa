"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { CalendarIcon, Trash2, Loader2, Edit } from "lucide-react";
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
import { toast } from "sonner";
import useTodos from "@/hooks/useTodos";

export default function TodoListTable() {
  const {
    todos,
    loading,
    error,
    filterPriority,
    setFilterPriority,
    filterDate,
    setFilterDate,
    filterDone,
    setFilterDone,
    addTodo,
    editTodo,
    toggleDone,
    removeTodo,
  } = useTodos();

  // Form State
  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [newDate, setNewDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const [editDate, setEditDate] = useState(new Date());

  // --- Add Task Handler ---
  const handleAddTask = async () => {
    if (!newTask.trim()) {
      toast.error("Task title is required");
      return;
    }

    setIsSubmitting(true);
    const result = await addTodo({
      title: newTask,
      body: "",
      priority: newPriority,
      dueDate: newDate.toISOString(),
    });

    setIsSubmitting(false);

    if (result.success) {
      toast.success("Task added successfully");
      setNewTask("");
      setNewPriority("medium");
      setNewDate(new Date());
    } else {
      toast.error(result.message || "Failed to add task");
    }
  };

  // --- Open Edit ---
  const handleOpenEdit = (task) => {
    console.log("Opening edit for task:", task);
    setEditingTask(task);
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditDate(new Date(task.dueDate));
    setIsEditing(true);
  };

  // --- Save Edit ---
  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      toast.error("Task title is required");
      return;
    }

    setIsSubmitting(true);
    const result = await editTodo(editingTask._id || editingTask.id, {
      title: editTitle,
      priority: editPriority,
      dueDate: editDate.toISOString(),
    });

    setIsSubmitting(false);

    if (result.success) {
      toast.success("Task updated successfully");
      setIsEditing(false);
      setEditingTask(null);
    } else {
      toast.error(result.message || "Failed to update task");
    }
  };

  // --- Toggle Checkbox ---
  const handleCheckboxToggle = async (task) => {
    console.log("=== Checkbox Toggle Started ===");
    console.log("Task ID:", task._id || task.id);
    console.log("Current isDone:", task.isDone);
    console.log("Will change to:", !task.isDone);
    
    const result = await toggleDone(task._id || task.id, task.isDone);
    
    console.log("Toggle result:", result);
    
    if (result.success) {
      toast.success(task.isDone ? "Task marked as pending" : "Task completed!");
    } else {
      console.error("Toggle failed with error:", result);
      toast.error(result.message || "Failed to update status");
    }
  };

  // --- Delete Task ---
  const handleDeleteTask = async (id) => {
    const result = await removeTodo(id);
    if (result.success) {
      toast.success("Task deleted successfully");
    } else {
      toast.error(result.message || "Failed to delete task");
    }
  };

  // --- Client-side Filters ---
  const filteredTasks = useMemo(() => {
    return todos.filter((task) => {
      const matchPriority =
        filterPriority === "all" || task.priority === filterPriority;

      const matchDate = filterDate
        ? format(new Date(task.dueDate), "yyyy-MM-dd") ===
          format(filterDate, "yyyy-MM-dd")
        : true;

      return matchPriority && matchDate;
    });
  }, [todos, filterPriority, filterDate]);

  // --- Clear Filters ---
  const handleClearFilters = () => {
    setFilterDate(null);
    setFilterPriority("all");
    setFilterDone(null);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-xl bg-foreground/3 p-5 shadow-sm w-full mt-4"
      >
        <h2 className="text-lg font-semibold mb-4">To-Do List</h2>

        {/* ---- Add Task Section ---- */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Input
            type="text"
            placeholder="Enter task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            disabled={isSubmitting}
            className="w-[140px] sm:w-[180px] md:w-[280px] lg:w-[400px]"
          />

          <Select
            value={newPriority}
            onValueChange={setNewPriority}
            disabled={isSubmitting}
          >
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
              <Button
                variant="outline"
                size="sm"
                disabled={isSubmitting}
                className="w-[200px] h-9 justify-start text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {newDate ? format(newDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={newDate}
                onSelect={setNewDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button
            onClick={handleAddTask}
            disabled={isSubmitting}
            className="px-10 font-bold"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Add"
            )}
          </Button>
        </div>

        {/* ---- Filter Section ---- */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-[140px] h-9 justify-start text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filterDate ? (
                  format(filterDate, "PPP")
                ) : (
                  <span>Filter by date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filterDate}
                onSelect={setFilterDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Select
            value={filterDone === null ? "all" : filterDone ? "done" : "notDone"}
            onValueChange={(val) =>
              setFilterDone(
                val === "all" ? null : val === "done" ? true : false
              )
            }
          >
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="done">Completed</SelectItem>
              <SelectItem value="notDone">Pending</SelectItem>
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

          <Button variant="outline" size="sm" onClick={handleClearFilters}>
            Clear
          </Button>
        </div>

        {/* ---- Error/Loading States ---- */}
        {error && (
          <div className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        )}

        {/* ---- Tasks Table ---- */}
        {!loading && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No tasks found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks.map((task) => (
                  <TableRow key={task._id || task.id}>
                    <TableCell className="flex items-center gap-2">
                      <Checkbox
                        checked={task.isDone}
                        onCheckedChange={() => handleCheckboxToggle(task)}
                      />
                      <span
                        className={`${
                          task.isDone
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {task.title}
                      </span>
                    </TableCell>
                    <TableCell>
                      {task.isDone ? "Completed" : "Pending"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-medium ${
                          task.priority === "high"
                            ? "text-red-500"
                            : task.priority === "medium"
                            ? "text-yellow-500"
                            : "text-green-500"
                        }`}
                      >
                        {task.priority.charAt(0).toUpperCase() +
                          task.priority.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {format(new Date(task.dueDate), "PPP")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(task)}
                          title="Edit task"
                        >
                          <Edit className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTask(task._id || task.id)}
                          title="Delete task"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </motion.div>

      {/* ---- Edit Modal (Simple) ---- */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
          >
            <h3 className="text-lg font-semibold mb-4">Edit Task</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">
                  Task Title
                </label>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Priority
                </label>
                <Select value={editPriority} onValueChange={setEditPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Due Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editDate ? format(editDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={editDate}
                      onSelect={setEditDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditingTask(null);
                }}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}