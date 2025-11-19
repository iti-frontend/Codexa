"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, Trash2 } from "lucide-react";
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

  // Fetch todos from API
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStatus !== "all") {
        params.done = filterStatus === "Completed";
      }
      
      const response = await todoService.getTodos(params);
      setTasks(response.items || []);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Add new task
  const handleAddTask = async () => {
    if (!newTask.trim()) return;

    try {
      const todoData = {
        title: newTask,
        priority: newPriority,
        dueDate: newDate.toISOString(),
      };

      await todoService.createTodo(todoData);
      setNewTask("");
      setNewPriority("medium");
      setNewDate(new Date());
      fetchTodos();
      onTodoUpdate?.();
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    try {
      await todoService.deleteTodo(id);
      fetchTodos();
      onTodoUpdate?.();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Toggle completion status
const handleCheckboxToggle = async (task) => {
  try {
    await todoService.updateTodo(task.id, { 
      isDone: !task.isDone 
    });
    fetchTodos();
    onTodoUpdate?.();
  } catch (error) {
    console.error("Error updating todo:", error);
  }
};

  // Map API status to display status
  const getDisplayStatus = (isDone) => {
    return isDone ? "Completed" : "Pending";
  };

  // Map API priority to display priority
  const getDisplayPriority = (priority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  // Apply local filters
  const filteredTasks = tasks.filter((task) => {
    const matchDate = filterDate
      ? format(filterDate, "yyyy-MM-dd") === format(new Date(task.dueDate), "yyyy-MM-dd")
      : true;

    const matchPriority = filterPriority !== "all"
      ? task.priority === filterPriority.toLowerCase()
      : true;

    return matchDate && matchPriority;
  });

  useEffect(() => {
    if (profile) {
      fetchTodos();
    }
  }, [profile, filterStatus]);

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
            if (e.key === 'Enter') {
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
            <Button
              variant="outline"
              size="sm"
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

        <Button onClick={handleAddTask} className='px-10 font-bold'>
          Add
        </Button>
      </div>

      {/* Filter Section */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-[140px] h-9 justify-start text-left"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filterDate ? format(filterDate, "PPP") : <span>Filter by date</span>}
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
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.map((task, index) => (
            <TableRow key={task.id || task._id || `task-${index}`}>
              <TableCell className="flex items-center gap-2">
                <Checkbox
                  checked={task.isDone}
                  onCheckedChange={() => handleCheckboxToggle(task)}
                />
                <span
                  className={`${task.isDone
                    ? "line-through text-muted-foreground"
                    : ""
                    }`}
                >
                  {task.title}
                </span>
              </TableCell>
              <TableCell>{getDisplayStatus(task.isDone)}</TableCell>
              <TableCell>
                <span
                  className={`font-medium ${task.priority === "high"
                    ? "text-red-500"
                    : task.priority === "medium"
                      ? "text-yellow-500"
                      : "text-green-500"
                    }`}
                >
                  {getDisplayPriority(task.priority)}
                </span>
              </TableCell>
              <TableCell>
                {task.dueDate ? format(new Date(task.dueDate), "PPP") : "No date"}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredTasks.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          No tasks found. Create your first task!
        </div>
      )}
    </motion.div>
  );
}