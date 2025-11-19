"use client";

import React, { useState } from "react";
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
import { tasksData } from "@/Constants/StudentContent";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

export default function StudentTodo() {
    const [tasks, setTasks] = useState(tasksData);
    const [newTask, setNewTask] = useState("");
    const [newStatus, setNewStatus] = useState("Pending");
    const [newPriority, setNewPriority] = useState("Medium");
    const [newDate, setNewDate] = useState(new Date());
    const [filterDate, setFilterDate] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterPriority, setFilterPriority] = useState("all");

    // --- Add new task ---
    const handleAddTask = () => {
        if (!newTask.trim()) return;

        const newTaskObj = {
            id: tasks.length + 1,
            title: newTask,
            status: newStatus,
            priority: newPriority,
            date: newDate,
        };

        setTasks([...tasks, newTaskObj]);
        setNewTask("");
        setNewStatus("Pending");
        setNewPriority("Medium");
        setNewDate(new Date());
    };

    // --- Delete task ---
    const handleDeleteTask = (id) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    // --- Toggle checkbox completion ---
    const handleCheckboxToggle = (id) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id
                    ? {
                        ...task,
                        status:
                            task.status === "Completed" ? "Pending" : "Completed",
                    }
                    : task
            )
        );
    };

    // --- Filters ---
    const filteredTasks = tasks.filter((task) => {
        const matchDate = filterDate
            ? format(filterDate, "yyyy-MM-dd") === format(new Date(task.date), "yyyy-MM-dd")
            : true;

        const matchStatus = filterStatus !== "all"
            ? task.status === filterStatus
            : true;

        const matchPriority = filterPriority !== "all"
            ? task.priority === filterPriority
            : true;

        return matchDate && matchStatus && matchPriority;
    });

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
                {/* Task Input */}
                <Input
                    type="text"
                    placeholder="Enter task"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="w-[140px] sm:w-[180px] md:w-[280px] lg:w-[400px]"
                />

                {/* Status Select */}
                <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger className="w-[120px] h-9">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                </Select>

                {/* Priority Select */}
                <Select value={newPriority} onValueChange={setNewPriority}>
                    <SelectTrigger className="w-[120px] h-9">
                        <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                </Select>

                {/* Date Picker */}
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

                {/* Add Button */}
                <Button
                    onClick={handleAddTask}
                    className='px-10 font-bold'
                >
                    Add
                </Button>
            </div>

            {/* ---- Filter Section ---- */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
                {/* Date filter */}
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

                {/* Status filter */}
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[140px] h-9">
                        <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                </Select>

                {/* Priority filter */}
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="w-[140px] h-9">
                        <SelectValue placeholder="All Priorities" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
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

            {/* ---- Tasks Table ---- */}
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
                    {filteredTasks.map((task) => (
                        <TableRow key={task.id}>
                            <TableCell className="flex items-center gap-2">
                                <Checkbox
                                    checked={task.status === "Completed"}
                                    onCheckedChange={() => handleCheckboxToggle(task.id)}
                                />
                                <span
                                    className={`${task.status === "Completed"
                                            ? "line-through text-muted-foreground"
                                            : ""
                                        }`}
                                >
                                    {task.title}
                                </span>
                            </TableCell>
                            <TableCell>{task.status}</TableCell>
                            <TableCell>
                                <span
                                    className={`font-medium ${task.priority === "High"
                                            ? "text-red-500"
                                            : task.priority === "Medium"
                                                ? "text-yellow-500"
                                                : "text-green-500"
                                        }`}
                                >
                                    {task.priority}
                                </span>
                            </TableCell>
                            <TableCell>{format(new Date(task.date), "PPP")}</TableCell>
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
        </motion.div>
    );
}