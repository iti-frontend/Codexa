// components/StudentTodo.jsx
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { TodosCards } from "@/Constants/StudentContent";
import TodoListTable from "./TodoListTable";
import { todoService } from "@/services/todoService";

export default function StudentTodo() {
  const [stats, setStats] = useState({ 
    total: 0, 
    done: 0, 
    notDone: 0 
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const statsData = await todoService.getTodoStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching todo stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Update the TodosCards with dynamic data
  const updatedTodosCards = TodosCards.map((card, index) => {
    let number = 0;
    switch (index) {
      case 0: // Total Tasks
        number = stats.total || 0;
        break;
      case 1: // Completed
        number = stats.done || 0;
        break;
      case 2: // Pending
        number = stats.notDone || 0;
        break;
      case 3: // High Priority (we'll fetch this separately)
        number = 0; // We'll handle this in the component
        break;
      default:
        number = 0;
    }
    return {
      ...card,
      number: loading ? '...' : number
    };
  });

  const handleRefetch = () => {
    fetchStats();
  };

  return (
    <>
      <header className="flex items-start mb-4">
        <h1 className="text-xl lg:text-3xl font-bold mb-1">Todos</h1>
      </header>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-xl bg-foreground/5 p-5 shadow-sm w-full">


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
                  {todo.number}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      <TodoListTable onRefetch={handleRefetch} />
    </>
  );
}