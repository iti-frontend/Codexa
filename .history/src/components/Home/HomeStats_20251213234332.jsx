"use client";

import { useTranslation } from "react-i18next";
import { statsData } from "@/Constants/Home-data";
import HomeHeading from "./HomeHeading";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

function HomeStats() {
    const { t } = useTranslation();

    return (
        <section className="flex flex-col items-center justify-center py-16 bg-background">
            <HomeHeading
                titleKey="home.stats.sectionTitle"
                descKey="home.stats.sectionDesc"
            />
            <main className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 max-w-5xl w-full px-4">
                {statsData.map((stat, index) => (
                    <StatCard
                        key={index}
                        icon={stat.icon}
                        value={stat.value}
                        translationKey={stat.translationKey}
                        index={index}
                    />
                ))}
            </main>
        </section>
    );
}

export default HomeStats;

function StatCard({ icon: Icon, value, translationKey, index }) {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Card className="text-center shadow-lg rounded-2xl hover:shadow-xl transition-shadow transition-all duration-300 group border-primary/10 hover:border-primary/30">
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
                        {t(`home.stats.${translationKey}`)}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}