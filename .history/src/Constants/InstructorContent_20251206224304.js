import {
  BookOpen,
  ChartArea,
  DollarSign,
  Megaphone,
  Star,
  Upload,
  Users,
} from "lucide-react";

export const PerformanceStructure = [
  { text: "instructor.performance.totalStudents", key: "totalStudents", icon: Users },
  { text: "instructor.performance.activeCourses", key: "activeCourses", icon: BookOpen },
  { text: "instructor.performance.rating", key: "rating", icon: Star },
  { text: "instructor.performance.revenue", key: "revenue", icon: DollarSign },
];

export const quickLinks = [
  { text: "instructor.quickLinks.createCourse", icon: Upload, action: "create-course" },
  { text: "instructor.quickLinks.announcement", icon: Megaphone, action: "announcement" },
  { text: "instructor.quickLinks.analytics", icon: ChartArea, action: "analytics" },
];

export const recentActivity = [
  { name: "Abdullah Omar", text: "just enrolled in 'Next.Js'.", time: "2 minutes ago", imgSrc: "" },
  { name: "Zein Mohamed", text: "completed 'Web Development Fundamentals'.", time: "1 hour ago", imgSrc: "" },
  { name: "Lina Ahmed", text: "asked a question.", time: "3 hours ago", imgSrc: "" },
];
