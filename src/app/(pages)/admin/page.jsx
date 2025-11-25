"use client";

import {
    Users,
    GraduationCap,
    Video,
    DollarSign,
    ArrowUpRight,
} from "lucide-react";

import {
    BarChart,
    Bar,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Cell,
} from "recharts";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AdminDashboard() {
    // ===================== STATIC DATA (Replace later with API) =====================
    const stats = [
        { title: "Total Students", value: "1,240", icon: Users },
        { title: "Instructors", value: "88", icon: GraduationCap },
        { title: "Courses", value: "154", icon: Video },
        { title: "Revenue", value: "$23,400", icon: DollarSign },
    ];

    const chartData = [
        { month: "Jan", revenue: 1200 },
        { month: "Feb", revenue: 1600 },
        { month: "Mar", revenue: 2200 },
        { month: "Apr", revenue: 1900 },
        { month: "May", revenue: 2600 },
        { month: "Jun", revenue: 3100 },
    ];

    // =================================================================================

    return (
        <div className="p-6 space-y-8">
            {/* ================= HEADER ================= */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of platform growth, activity & performance.
                </p>
            </div>

            {/* ================= ANALYTICS CARDS ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((item, i) => (
                    <Card
                        key={i}
                        className="hover:shadow-lg transition-all border border-border rounded-xl"
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                {item.title}
                            </CardTitle>

                            {/* Icon uses chart colors */}
                            <item.icon
                                className="w-6 h-6"
                                style={{ color: `var(--chart-${i + 1})` }}
                            />
                        </CardHeader>

                        <CardContent>
                            <div className="text-3xl font-bold">{item.value}</div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <ArrowUpRight size={14} /> Updated now
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Separator />

            {/* ================= CHART SECTION ================= */}
            <Card className="w-full rounded-xl border">
                <CardHeader>
                    <CardTitle>Revenue Growth</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Monthly revenue analytics
                    </p>
                </CardHeader>

                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <XAxis
                                dataKey="month"
                                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                                stroke="var(--muted-foreground)"
                            />
                            <YAxis
                                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                                stroke="var(--muted-foreground)"
                            />

                            <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                                {chartData.map((_, index) => (
                                    <Cell
                                        key={index}
                                        fill={`color-mix(in srgb, var(--chart-${(index % 5) + 1}) 50%, transparent)`}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>


                </CardContent>
            </Card>

            {/* ================= RECENT ACTIVITY ================= */}
            <Card className="rounded-xl border">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>

                <CardContent className="space-y-5">
                    <ActivityItem
                        icon={<Users className="text-blue-500" />}
                        title="New student registered"
                        desc="Ahmed El Sayed joined the platform"
                    />

                    <ActivityItem
                        icon={<Video className="text-green-500" />}
                        title="New course added"
                        desc="React Advanced Course published by Omar"
                    />

                    <ActivityItem
                        icon={<DollarSign className="text-emerald-500" />}
                        title="Payment received"
                        desc="New purchase: Fullstack Bootcamp"
                    />
                </CardContent>
            </Card>
        </div>
    );
}


/* ======================== Reusable Activity Item ========================= */


function ActivityItem({ icon, title, desc }) {
    return (
        <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/60 transition-all">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-muted">
                {icon}
            </div>

            <div>
                <p className="font-medium">{title}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
        </div>
    );
}
