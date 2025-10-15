"use client";
import { quickLinks } from "@/Constants/InstructorContent";
import React from "react";
import { motion } from "framer-motion";

function QuickLinks() {
    return (
        <motion.div

            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="rounded-xl bg-foreground/5 p-5 shadow-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
            <div className="flex flex-col gap-3">
                {quickLinks.map((link, index) => {
                    const Icon = link.icon;

                    return (
                        <motion.div
                            key={index}
                            whileHover={{
                                scale: 1.03,
                                boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                                transition: { type: "spring", stiffness: 300, damping: 20 },
                            }}
                            className="flex items-center gap-3 rounded-xl bg-background/60 p-4 cursor-pointer"
                        >
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                                {Icon && <Icon size={17} className="text-primary" />}
                            </div>
                            <p className="text-sm text-foreground/80">{link.text}</p>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

export default QuickLinks;
