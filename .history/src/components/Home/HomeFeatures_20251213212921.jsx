"use client";

import { featuresData } from "@/Constants/Home-data";
import HomeHeading from "./HomeHeading";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
function HomeFeatures() {
  const { t } = useTranslation();
  return (
    <section className="flex flex-col items-center justify-center py-16 border-y bg-gradient-to-b from-background to-muted/20">
            <HomeHeading
                titleKey="home.features.sectionTitle"
                descKey="home.features.sectionDesc"
            />
      
      <main className="flex flex-col md:flex-row items-center justify-center flex-wrap gap-8 mt-8 px-4">
        {featuresData.map((feature, index) => (
          <FeaturesCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            index={index}
          />
        ))}
      </main>
    </section>
  );
}

export default HomeFeatures;

function FeaturesCard({ icon: Icon, title, description, index }) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      whileHover={{ y: -8 }}
    >
      <Card className="max-w-xs gap-2 shadow-lg rounded-2xl hover:shadow-2xl transition-all duration-300 group border-primary/10 hover:border-primary/30 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <motion.div
            className="bg-primary p-3 w-fit rounded-full text-white shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Icon size={20} />
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-2">
          <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors">
             {t(`home.feta.${translationKey}.title`)}
          </h3>
          <p className="text-muted-foreground line-clamp-3 leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
