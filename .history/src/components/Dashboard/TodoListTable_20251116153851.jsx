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
import { getId } from "@/utils/getId";


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