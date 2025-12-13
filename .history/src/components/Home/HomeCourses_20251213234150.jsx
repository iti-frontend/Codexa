"use client";
import HomeHeading from "./HomeHeading";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Award,
  Users,
  TrendingUp,
  BookOpen,
  Video,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";


const benefits = [
  {
    icon: Award,
    title: "Expert-Led Courses",
    description:
      "Learn from industry professionals with years of real-world experience.",
    color: "from-blue-500/10 to-blue-500/5",
    iconColor: "text-blue-500",
  },
  {
    icon: Video,
    title: "High-Quality Content",
    description:
      "Access professionally produced video lessons and comprehensive materials.",
    color: "from-purple-500/10 to-purple-500/5",
    iconColor: "text-purple-500",
  },
  {
    icon: Users,
    title: "Active Community",
    description:
      "Connect with thousands of learners and get support when you need it.",
    color: "from-green-500/10 to-green-500/5",
    iconColor: "text-green-500",
  },
  {
    icon: TrendingUp,
    title: "Track Your Progress",
    description:
      "Monitor your learning journey with detailed analytics and achievements.",
    color: "from-orange-500/10 to-orange-500/5",
    iconColor: "text-orange-500",
  },
  {
    icon: BookOpen,
    title: "Lifetime Access",
    description:
      "Learn at your own pace with unlimited access to all course materials.",
    color: "from-pink-500/10 to-pink-500/5",
    iconColor: "text-pink-500",
  },
  {
    icon: MessageSquare,
    title: "Direct Support",
    description:
      "Get help from instructors and teaching assistants whenever you're stuck.",
    color: "from-cyan-500/10 to-cyan-500/5",
    iconColor: "text-cyan-500",
  },
];

function HomeCourses() {
  const { t } = useTranslation();
  return (
    <section
      className="flex flex-col items-center justify-center py-16 bg-gradient-to-b from-background to-muted/20 px-5"
      id="courses"
    >
      <HomeHeading
        titleKey="home.courses.sectionTitle"
        descKey="home.courses.sectionDesc"
      />

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 max-w-6xl w-full">
        {benefits.map((benefit, index) => (
          <BenefitCard key={index} benefit={benefit} index={index} />
        ))}
      </main>

      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-12"
      >
        <Button
          size="lg"
          className="gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
          asChild
        >
          <Link href="/student/explore">
            {t("home.courses.exploreAll")}
            <ArrowRt className="w-4 h-4" />
          </Link>
        </Button>
      </motion.footer>
    </section>
  );
}

export default HomeCourses;

function BenefitCard({ benefit, index }) {
  const Icon = benefit.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <Card className="h-full shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 group border-primary/10 hover:border-primary/30 overflow-hidden">
        <CardHeader>
          <motion.div
            className={`bg-gradient-to-br ${benefit.color} p-4 w-fit rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <Icon className={`w-8 h-8 ${benefit.iconColor}`} />
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-3">
          <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors">
            {benefit.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {benefit.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
