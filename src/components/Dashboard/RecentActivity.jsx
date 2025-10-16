"use client";
import React from "react";
import { motion } from "framer-motion";
import { recentActivity } from "@/Constants/InstructorContent";

function RecentActivity() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 90 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="rounded-xl bg-foreground/5 p-5 shadow-sm w-full mt-4"
        >
            <h2 className="text-lg font-semibold mb-4">Recent Student Activity</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                {recentActivity.map((reactive, index) => (
                    <motion.div
                        key={index}
                        whileHover={{
                            scale: 1.03,
                            boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                            transition: { type: "spring", stiffness: 300, damping: 20 },
                        }}
                        className="flex flex-col md:flex-col lg:flex-row items-start lg:items-center gap-3 rounded-xl bg-background/60 p-4 cursor-pointer"
                    >

                        <img
                            src="https://static.vecteezy.com/system/resources/previews/036/885/313/non_2x/blue-profile-icon-free-png.png"
                            alt={reactive.name}
                            className="w-12 h-12 md:w-16 md:h-16 lg:w-12 lg:h-12 object-cover rounded-full"
                        />

                        <div className="flex flex-col gap-1 text-center lg:text-left">
                            <span className="font-bold text-foreground">{reactive.name}</span>
                            <p className="text-foreground/80">{reactive.text}</p>
                            <span className="text-sm text-foreground/60">{reactive.time}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

export default RecentActivity;
