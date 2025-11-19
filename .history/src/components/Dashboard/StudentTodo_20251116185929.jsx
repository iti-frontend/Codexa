// components/StudentTodo.js
"use client";
import React from "react";
import { motion } from "framer-motion";
import { ListTodo, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import useTodos from "@/hooks/useTodos";
import TodoListTable from "./TodoListTable";

export default function StudentTodo() {
  const { stats, loading } = useTodos();

  // Dynamic Cards based on API stats
  const todosCards = [
    {
      icon: ListTodo,
      text: "Total Tasks",
      number: loading ? "..." : stats.total || 0,
    },
    {
      icon: CheckCircle2,
      text: "Completed",
      number: loading ? "..." : stats.done || 0,
    },
    {
      icon: Circle,
      text: "Pending",
      number: loading ? "..." : stats.notDone || 0,
    },
    {
      icon: AlertCircle,
      text: "In Progress",
      number: loading ? "..." : (stats.total - stats.done) || 0,
    },
  ];

  return (
    <>
      <header className="flex items-start mb-4">
        <h1 className="text-xl lg:text-3xl font-bold mb-1">Todos</h1>
      </header>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-xl bg-foreground/5 p-5 shadow-sm w-full"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4 cursor-pointer">
          {todosCards.map((todo, index) => {
            const Icon = todo.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.2 }}
                whileHover={{
                  scale: 1.01,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                  transition: { type: "spring", stiffness: 300, damping: 20 },
                }}
                className="rounded-xl bg-background/60 p-4 text-center border hover:border-primary/50 flex flex-col items-center gap-2"
              >
                <div className="flex justify-center w-full">
                  {Icon && <Icon size={24} className="text-primary" />}
                </div>

                <h3 className="text-sm text-foreground/70 my-1.5">
                  {todo.text}
                </h3>
                <p className="text-xl font-bold text-foreground">
                  {todo.number}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <TodoListTable />
    </>
  );
}