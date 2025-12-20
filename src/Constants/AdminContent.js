import { DollarSign, GraduationCap, User, Video } from "lucide-react";

export const AdminStatsCards = [
    { title: "admin.stats.totalStudents", key: "students", icon: User },
    { title: "admin.stats.totalInstructors", key: "instructors", icon: GraduationCap },
    { title: "admin.stats.totalCourses", key: "courses", icon: Video },
    { title: "admin.stats.totalRevenue", key: "totalRevenue", icon: DollarSign },
];

// Default profit distribution data (until backend integration)
// Platform takes 30%, Instructors get 70%
export const ProfitDistributionConfig = {
    platformCommission: 0.30, // 30% platform commission
    defaultTotalRevenue: 12600, // Default total revenue for display
};

// Pre-calculated default values for display
export const DefaultProfitData = {
    totalRevenue: 12600,
    platformProfit: 3780, // 30% of 12600
    instructorProfit: 8820, // 70% of 12600
};