// @/Constants/AdminContent.js
import { Users, GraduationCap, BookOpen, DollarSign, Video, MessageSquare } from "lucide-react";

// Stats Cards Configuration
export const AdminStatsCards = [
    {
        title: "admin.stats.totalStudents", // key for translation
        key: "totalStudents",
        icon: Users,
    },
    {
        title: "admin.stats.totalInstructors",
        key: "totalInstructors",
        icon: GraduationCap,
    },
    {
        title: "admin.stats.totalCourses",
        key: "totalCourses",
        icon: BookOpen,
    },
    {
        title: "admin.stats.totalRevenue",
        key: "totalRevenue",
        icon: DollarSign,
    },
    {
        title: "admin.stats.activeCourses",
        key: "activeCourses",
        icon: Video,
    },
    {
        title: "admin.stats.communityPosts",
        key: "communityPosts",
        icon: MessageSquare,
    },
];

// Chart Data
export const ChartData = [
    { month: "يناير", revenue: 4000 },
    { month: "فبراير", revenue: 3000 },
    { month: "مارس", revenue: 5000 },
    { month: "أبريل", revenue: 4500 },
    { month: "مايو", revenue: 6000 },
    { month: "يونيو", revenue: 5500 },
];