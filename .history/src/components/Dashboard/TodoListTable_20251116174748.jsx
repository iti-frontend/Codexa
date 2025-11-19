"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { CalendarIcon, Trash2, Loader2 } from "lucide-react";
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
    toggleDone,
    removeTodo,
  } = useTodos();

  // Form State
  const [newTask, setNewTask] = useState("");
  const [newStatus, setNewStatus] = useState("Pending");
  const [newPriority, setNewPriority] = useState("medium");
  const [newDate, setNewDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Add Task Handler ---
  const handleAddTask = async () => {
    if (!newTask.trim()) {
      toast.error("Task title is required");
      return;
    }

    setIsSubmitting(true);
    const result = await addTodo({
      title: newTask,
      body: "", // Optional
      priority: newPriority,
      dueDate: newDate.toISOString(),
    });

    setIsSubmitting(false);

    if (result.success) {
      toast.success("Task added successfully");
      // Reset form
      setNewTask("");
      setNewStatus("Pending");
      setNewPriority("medium");
      setNewDate(new Date());
    } else {
      toast.error(result.message || "Failed to add task");
    }
  };

  // --- Toggle Checkbox ---
  const handleCheckboxToggle = async (id, currentDone) => {
    const result = await toggleDone(id, currentDone);
    if (!result.success) {
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

  // --- Client-side Filters (Priority & Date) ---
  const filteredTasks = useMemo(() => {
    return todos.filter((task) => {
      // Priority Filter
      const matchPriority =
        filterPriority === "all" || task.priority === filterPriority;

      // Date Filter
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

        {/* Priority Select */}
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

        {/* Date Picker */}
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

        {/* Add Button */}
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
        {/* Date Filter */}
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

        {/* Status Filter (Done/Not Done) */}
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

        {/* Priority Filter */}
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
              <TableHead>Action</TableHead>
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
                <TableRow key={task._id}>
                  <TableCell className="flex items-center gap-2">
                    <Checkbox
                      checked={task.isDone}
                      onCheckedChange={() =>
                        handleCheckboxToggle(task._id, task.isDone)
                      }
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </motion.div>
  );
}