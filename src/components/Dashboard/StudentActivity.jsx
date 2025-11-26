import React from "react";
import { motion } from "framer-motion";
import { StatsCards } from "@/Constants/StudentContent";
import { useStudentAnalytics } from "@/hooks/useStudentAnaltycs";

function StudentActivity() {
    const { analytics } = useStudentAnalytics();
    if (!analytics) return <div>No analytics found.</div>;

    const dynamicStats = StatsCards.map((item) => ({
        ...item,
        number: analytics[item.key] ?? 0,
    }));
    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl bg-foreground/5 p-4 shadow-sm w-full"
        >
            <h2 className="text-base font-semibold text-foreground mb-4">
                Your Learning Overview
            </h2>


            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 w-full">
                {dynamicStats.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.15 }}
                            whileHover={{
                                scale: 1.03,
                                y: -2,
                                boxShadow: "0 6px 14px rgba(0,0,0,0.1)",
                            }}
                            className="flex flex-row items-center gap-3 rounded-xl bg-background/60 border border-transparent cursor-pointer hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 p-2 h-[90px]"
                        >

                            <div className="flex justify-center items-center bg-primary/10 p-2.5 rounded-full w-[45px] h-[45px] flex-shrink-0">
                                {Icon && <Icon size={22} className="text-primary" />}
                            </div>


                            <div className="flex flex-col text-center">
                                <h3 className="text-xs text-foreground/70 leading-tight">
                                    {card.text}
                                </h3>
                                <p className="text-lg font-bold text-foreground mt-1 leading-none">
                                    {card.number}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

export default StudentActivity;
