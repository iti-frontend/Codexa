"use client";

import { Card, CardContent } from "@/components/ui/card";
import { featuresData } from "@/Constants/Home-data";
import { motion } from "framer-motion";

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Why Choose Codexa?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the features that make Codexa the perfect learning platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, description, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="h-full border border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg">
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="bg-primary/10 p-3 rounded-full w-fit">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-3">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}