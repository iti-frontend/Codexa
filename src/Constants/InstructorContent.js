import {
  BookOpen,
  ChartArea,
  DollarSign,
  Megaphone,
  Star,
  Upload,
  Users,
} from "lucide-react";

// Performance Structure
export const PerformanceStructure = [
  { text: "Total Students", key: "totalStudents", icon: Users },
  { text: "Active Courses", key: "activeCourses", icon: BookOpen },
  { text: "Rating", key: "rating", icon: Star },
  { text: "Revenue", key: "revenue", icon: DollarSign },
];

// Quick Links 
export const quickLinks = [
  { text: "Create New Courses", icon: Upload, action: "create-course" },
  { text: "New Announcement", icon: Megaphone, action: "announcement" },
  { text: "View Analytics", icon: ChartArea, action: "analytics" },
];


// Recent Activity (could also be dynamic later)
export const recentActivity = [
  { name: "Abdullah Omar", text: "just enrolled in 'Next.Js'.", time: "2 minutes ago", imgSrc: "" },
  { name: "Zein Mohamed", text: "completed 'Web Development Fundamentals'.", time: "1 hour ago", imgSrc: "" },
  { name: "Lina Ahmed", text: "asked a question.", time: "3 hours ago", imgSrc: "" },
];
