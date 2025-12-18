import {
  BookOpen,
  ChartArea,
  DollarSign,
  Megaphone,
  Star,
  Upload,
  Users,
} from "lucide-react";

// Performance Metrics Structure
export const PerformanceStructure = [
  { text: "instructor.performance.totalStudents", key: "totalStudents", icon: Users },
  { text: "instructor.performance.activeCourses", key: "activeCourses", icon: BookOpen },
  { text: "instructor.performance.rating", key: "rating", icon: Star },
  { text: "instructor.performance.revenue", key: "revenue", icon: DollarSign },
];

// Quick Links
export const quickLinks = [
  { text: "instructor.quickLinks.createCourse", icon: Upload, action: "create-course" },
  { text: "instructor.quickLinks.announcement", icon: Megaphone, action: "announcement" },
  { text: "instructor.quickLinks.analytics", icon: ChartArea, action: "analytics" },
];

// Recent Activity with translation keys
export const recentActivity = [
  { 
    name: "Abdullah Omar", 
    action: "enrolled",
    course: "Next.js",
    time: "twoMinutes",
    imgSrc: "https://static.vecteezy.com/system/resources/previews/036/885/313/non_2x/blue-profile-icon-free-png.png",
    badge: null
  },
  { 
    name: "Zein Mohamed", 
    action: "completed",
    course: "Web Development Fundamentals",
    time: "oneHour",
    imgSrc: "https://static.vecteezy.com/system/resources/previews/036/885/313/non_2x/blue-profile-icon-free-png.png",
    badge: "Completed"
  },
  { 
    name: "Lina Ahmed", 
    action: "question",
    course: null,
    time: "threeHours",
    imgSrc: "https://static.vecteezy.com/system/resources/previews/036/885/313/non_2x/blue-profile-icon-free-png.png",
    badge: "Question"
  },
];