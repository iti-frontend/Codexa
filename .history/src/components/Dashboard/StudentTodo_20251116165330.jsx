// components/StudentTodo.jsx
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from '../ui/button';
import { Plus, BookOpen, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import TodoListTable from "./TodoListTable";
import { todoService } from "@/services/todoService";
import { Skeleton } from '../ui/skeleton';

// Define the card structure
const TodosCardsConfig = [
  {
    icon: BookOpen,
    text: "Total Tasks",
    key: "total",
    color: "text-blue-500"
  },
  {
    icon: CheckCircle,
    text: "Completed",
    key: "done",
    color: "text-green-500"
  },
  {
    icon: Clock,
    text: "Pending",
    key: "notDone",
    color: "text-yellow-500"
  },
  {
    icon: AlertCircle,
    text: "High Priority",
    key: "highPriority",
    color: "text-red-500"
  }
];

export default function StudentTodo() {
  const [stats, setStats] = useState({ 
    total: 0, 
    done: 0, 
    notDone: 0,
    highPriority: 0
  });
  const [loading, setLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const statsData = await todoService.getTodoStats();
      
      // Fetch high priority todos count
      const todosResponse = await todoService.getTodos({ done: false });
      const highPriorityCount = todosResponse.items.filter(todo => 
        todo.priority === 'high' && !todo.isDone
      ).length;

      setStats({
        ...statsData,
        highPriority: highPriorityCount
      });
    } catch (error) {
      console.error('Error fetching todo stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refetchTrigger]);

  const handleRefetch = () => {
    setRefetchTrigger(prev => prev + 1);
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
        className="rounded-xl bg-foreground/5 p-5 shadow-sm w-full"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4 cursor-pointer">
          {TodosCardsConfig.map((card, index) => {
            const Icon = card.icon;

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
                  {Icon && <Icon size={24} className={card.color} />}
                </div>

                <h3 className="text-sm text-foreground/70 my-1.5">
                  {card.text}
                </h3>
                
                {loading ? (
                  <Skeleton className="h-6 w-8 bg-foreground/20" />
                ) : (
                  <p className="text-xl font-bold text-foreground">
                    {stats[card.key] || 0}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      
      <TodoListTable onRefetch={handleRefetch} />
    </>
  );
}