"use client";

import { statsData } from "@/Constants/Home-data";
import HomeHeading from "./HomeHeading";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

function HomeStats() {
    return (
        <section className="flex flex-col items-center justify-center py-16 bg-background">
            <HomeHeading
                title="Our Impact in Numbers"
                desc="Join thousands of learners who are transforming their careers with Codexa"
            />
            <main className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 max-w-5xl w-full px-4">
                {statsData.map((stat, index) => (
                    <StatCard
                        key={index}
                        icon={stat.icon}
                        value={stat.value}
                        label={stat.label}
                        index={index}
                    />
                ))}
            </main>
        </section>
    );
}

export default HomeStats;

function StatCard({ icon: Icon, value, label, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Card className="text-center shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
                <CardContent className="pt-6 space-y-3">
                    <div className="flex justify-center">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <Icon className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-primary">
                        {value}
                    </div>
                    <div className="text-sm md:text-base text-muted-foreground">
                        {label}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
