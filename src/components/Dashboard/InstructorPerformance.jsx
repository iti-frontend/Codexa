"use client";
import React from "react";
import { Performances } from "@/Constants/InstructorContent";
import { motion } from "framer-motion";
function InstructorPerformance() {
    return (
        <div className="rounded-xl bg-foreground/5 p-5 shadow-sm w-full ">
            <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>

            <div className="grid sm:grid-cols-4 gap-4 cursor-pointer">
                {Performances.map((performance, index) => {
                    const Icon = performance.icon;

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.12 }}
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                                transition: { type: "spring", stiffness: 300, damping: 20 }
                            }}
                            className="rounded-xl bg-background/60 p-4 text-center border border-border flex flex-col items-center gap-2"
                        >
                            <div className="flex justify-center w-full">
                                {Icon && <Icon size={20} className="text-primary" />}
                            </div>
                            <h3 className="text-sm text-foreground/70 my-1.5">{performance.text}</h3>
                            <p className="text-xl font-bold text-foreground">{performance.number}</p>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

export default InstructorPerformance;
