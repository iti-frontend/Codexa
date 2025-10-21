"use client";
import React from "react";
import { Performances } from "@/Constants/InstructorContent";
import { motion } from "framer-motion";

function InstructorPerformance() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl bg-foreground/5 p-5 shadow-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4 cursor-pointer">
                {Performances.map((performance, index) => {
                    const Icon = performance.icon;

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
                                {performance.text}
                            </h3>
                            <p className="text-xl font-bold text-foreground">
                                {performance.number}
                            </p>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

export default InstructorPerformance;
