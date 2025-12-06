"use client";

import {
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
import { useAdminAnalytics } from "@/hooks/useAdminAnalytics";
import { AdminStatsCards, ChartData } from "@/Constants/AdminContent";
import AdminRecentActivity from "@/components/adminComponents/AdminRecentActivity";

export default function AdminDashboard() {
    // Admin Analytics
    const { analytics, loading } = useAdminAnalytics();

    if (loading) {
        return (
            <div className="min-h-screen flex  justify-center bg-background">
                <div className="animate-spin h-12 w-12 border-b-2 border-indigo-500 rounded-full"></div>
            </div>
        );
    }
    if (!analytics) return <div>No analytics found.</div>;

    const dynamicStats = AdminStatsCards.map((item) => ({
        ...item,
        number: analytics[item.key] ?? 0,
    }));

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
                {dynamicStats.map((item, i) => (
                    <Card
                        key={i}
                        className="hover:shadow-lg transition-all border border-border rounded-xl"
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                {item.title}
                            </CardTitle>

                            {/* Icon using theme chart colors */}
                            <item.icon
                                className="w-6 h-6"
                                style={{ color: `var(--chart-${(i % 5) + 1})` }}
                            />
                        </CardHeader>

                        <CardContent>
                            <div className="text-3xl font-bold">
                                {item.key === "totalRevenue"
                                    ? `$${item.number ?? 0}`
                                    : item.number ?? 0}
                            </div>

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
                        <BarChart data={ChartData}>
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
                                {ChartData.map((_, index) => (
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
            <AdminRecentActivity />
        </div>
    );
}
