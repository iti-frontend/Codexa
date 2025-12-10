"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CirclePlay, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

// أيقونات Hero Cards
import {
  BookOpen,
  Users,
  Target,
} from "lucide-react";

const HeroDataIcons = {
  expertCourses: BookOpen,
  community: Users,
  trackProgress: Target,
};

const HeroKeys = ["expertCourses", "community", "trackProgress"];

const HomeHero = () => {
  const { t } = useTranslation("home");

  return (
    <section className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <Badge
              variant="secondary"
              className="gap-2 px-4 py-2 rounded-full border animate-bounce-slow"
            >
              <Sparkles className="w-3 h-3 text-primary" />
              {t("hero.badge")}
            </Badge>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center tracking-tight">
              {t("hero.heading", { codexa: "Codexa" })}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed">
              {t("hero.subheading")}
            </p>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <Button
              size="lg"
              className="gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
              asChild
            >
              <Link href="/login">
                {t("hero.buttons.getStarted")}
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 hover:bg-primary/5 transition-all"
              asChild
            >
              <a href="#courses">
                <CirclePlay className="w-4 h-4" />
                {t("hero.buttons.exploreCourses")}
              </a>
            </Button>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid sm:grid-cols-3 gap-8 pt-8">
            {HeroKeys.map((key, index) => (
              <HeroCard
                key={key}
                icon={HeroDataIcons[key]}
                title={t(`hero.cards.${key}.title`)}
                description={t(`hero.cards.${key}.description`)}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;

function HeroCard({ icon: Icon, title, description, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
    >
      <Card className="max-w-sm gap-2 shadow-lg rounded-2xl justify-center hover:shadow-xl hover:scale-105 transition-all duration-300 border-primary/10 hover:border-primary/30">
        <CardHeader>
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-3 w-fit rounded-full shadow border border-primary/20">
            <Icon size={20} className="text-primary" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <h3 className="text-xl font-bold text-primary/90">{title}</h3>
          <p className="text-muted-foreground line-clamp-3 leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
