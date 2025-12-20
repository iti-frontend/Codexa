"use client";

import { ArrowUpRight } from "lucide-react";
import { PieChart, Pie, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts";
import { useTranslation } from "react-i18next";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAdminAnalytics } from "@/hooks/useAdminAnalytics";
import { AdminStatsCards, ProfitDistributionConfig, DefaultProfitData } from "@/Constants/AdminContent";
import AdminRecentActivity from "@/components/adminComponents/AdminRecentActivity";

// Platform commission percentage from config
const PLATFORM_COMMISSION = ProfitDistributionConfig.platformCommission;

export default function AdminDashboard() {
    const { t } = useTranslation();
    const { analytics, loading } = useAdminAnalytics();

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-background">
                <div className="animate-spin h-12 w-12 border-b-2 border-indigo-500 rounded-full"></div>
            </div>
        );
    }

    if (!analytics) {
        return <div>{t("admin.dashboard.noAnalytics")}</div>;
    }

    const dynamicStats = AdminStatsCards.map((item) => ({
        ...item,
        number: item.key === "totalRevenue"
            ? (analytics[item.key] > 0 ? analytics[item.key] : DefaultProfitData.totalRevenue)
            : (analytics[item.key] ?? 0),
    }));

    return (
        <div className="p-6 space-y-8">
            {/* ================= HEADER ================= */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    {t("admin.dashboard.title")}
                </h1>
                <p className="text-muted-foreground">
                    {t("admin.dashboard.subtitle")}
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
                                {t(item.title)}
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
                                <ArrowUpRight size={14} />
                                {t("admin.dashboard.updatedNow")}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Separator />

            {/* ================= PROFIT DISTRIBUTION CHART ================= */}
            {(() => {
                // Use default profit data if no analytics data available
                // This will be replaced with actual backend data later
                const hasRealData = analytics?.totalRevenue && analytics.totalRevenue > 0;

                const totalRevenue = hasRealData
                    ? analytics.totalRevenue
                    : DefaultProfitData.totalRevenue;

                const platformProfit = hasRealData
                    ? totalRevenue * PLATFORM_COMMISSION
                    : DefaultProfitData.platformProfit;

                const instructorProfit = hasRealData
                    ? totalRevenue * (1 - PLATFORM_COMMISSION)
                    : DefaultProfitData.instructorProfit;

                const profitData = [
                    {
                        name: t("admin.chart.platformProfit"),
                        value: platformProfit,
                        percentage: PLATFORM_COMMISSION * 100,
                    },
                    {
                        name: t("admin.chart.instructorProfit"),
                        value: instructorProfit,
                        percentage: (1 - PLATFORM_COMMISSION) * 100,
                    },
                ];

                const COLORS = ["var(--chart-1)", "var(--chart-2)"];

                const CustomTooltip = ({ active, payload }) => {
                    if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                            <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                                <p className="font-semibold text-foreground">{data.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    ${data.value.toFixed(2)}
                                </p>
                                <p className="text-sm text-primary font-medium">
                                    {data.percentage.toFixed(0)}%
                                </p>
                            </div>
                        );
                    }
                    return null;
                };

                const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    return (
                        <text
                            x={x}
                            y={y}
                            fill="white"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="text-sm font-bold"
                        >
                            {`${percentage.toFixed(0)}%`}
                        </text>
                    );
                };

                return (
                    <Card className="w-full rounded-xl border">
                        <CardHeader>
                            <CardTitle>{t("admin.chart.title")}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {t("admin.chart.subtitle")}
                            </p>
                        </CardHeader>

                        <CardContent>
                            <div className="flex flex-col lg:flex-row items-center gap-8">
                                {/* Pie Chart */}
                                <div className="w-full lg:w-1/2">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={profitData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={120}
                                                paddingAngle={5}
                                                dataKey="value"
                                                label={renderCustomLabel}
                                                labelLine={false}
                                            >
                                                {profitData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={COLORS[index % COLORS.length]}
                                                        stroke="transparent"
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Legend & Stats */}
                                <div className="w-full lg:w-1/2 space-y-4">
                                    <div className="text-center lg:text-start mb-6">
                                        <p className="text-sm text-muted-foreground">
                                            {t("admin.chart.totalRevenue")}
                                        </p>
                                        <p className="text-3xl font-bold text-foreground">
                                            ${totalRevenue.toFixed(2)}
                                        </p>
                                    </div>

                                    {profitData.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-4 h-4 rounded-full"
                                                    style={{ backgroundColor: COLORS[index] }}
                                                />
                                                <span className="font-medium text-foreground">
                                                    {item.name}
                                                </span>
                                            </div>
                                            <div className="text-end">
                                                <p className="font-bold text-foreground">
                                                    ${item.value.toFixed(2)}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {item.percentage.toFixed(0)}%
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })()}

            {/* ================= RECENT ACTIVITY ================= */}
            <AdminRecentActivity />
        </div>
    );
}