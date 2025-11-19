"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TodosCards } from "@/Constants/StudentContent";
import TodoListTable from "./TodoListTable";
import { todoService } from "@/services/todoService";
import useProfile from "@/hooks/useProfile";

export default function StudentTodo() {
  const { profile, loading: profileLoading } = useProfile();
  const [stats, setStats] = useState({ total: 0, done: 0, notDone: 0 });
  const [loading, setLoading] = useState(true);

  // Update TodosCards with dynamic data
  const updatedTodosCards = TodosCards.map((card, index) => {
    if (index === 0) return { ...card, number: stats.total };
    if (index === 1) return { ...card, number: stats.done };
    if (index === 2) return { ...card, number: stats.notDone };
    return card;
  });

  const fetchStats = async () => {
    try {
      setLoading(true);
      const statsData = await todoService.getTodoStats();
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching todo stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile) {
      fetchStats();
    }
  }, [profile]);

  if (profileLoading) {
    return <div className="p-4">Loading...</div>;
  }

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
          {updatedTodosCards.map((todo, index) => {
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
                className="rounded-xl bg-background/60 p-4 text-center border hover:border-primary/50 flex flex-col items-center gap-2 "
              >
                <div className="flex justify-center w-full">
                  {Icon && <Icon size={24} className="text-primary" />}
                </div>

                <h3 className="text-sm text-foreground/70 my-1.5">
                  {todo.text}
                </h3>
                <p className="text-xl font-bold text-foreground">
                  {loading ? "..." : todo.number}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      
      <TodoListTable onTodoUpdate={fetchStats} />
    </>
  );
}