"use client";

import { Users, GraduationCap, Video, MessageSquare, DollarSign } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAdminActivity } from "@/hooks/useAdminAnalytics";

export default function AdminRecentActivity() {
    const { activity, loading } = useAdminActivity();

    if (loading) return <div>Loading recent activity...</div>;
    if (!activity) return <div>No activity available</div>;

    const { latestPost, latestStudent, latestInstructor, latestCourse } = activity;

    const activities = [
        latestPost && {
            icon: <MessageSquare className="text-blue-500" />,
            title: "New community post",
            desc: `${latestPost.authorName} posted: "${latestPost.content.slice(0, 20)}..."`,
            time: latestPost.createdAt,
        },
        latestStudent && {
            icon: <Users className="text-emerald-500" />,
            title: "New student registered",
            desc: latestStudent.name,
            time: latestStudent.createdAt,
        },
        latestInstructor && {
            icon: <GraduationCap className="text-purple-500" />,
            title: "New instructor joined",
            desc: latestInstructor.name,
            time: latestInstructor.createdAt,
        },
        latestCourse && {
            icon: <Video className="text-primary" />,
            title: "New course published",
            desc: latestCourse.title,
            time: latestCourse.createdAt,
        },
    ].filter(Boolean); // remove null values

    return (
        <Card className="rounded-xl border">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
                {activities.map((activity, index) => (
                    <ActivityItem
                        key={index}
                        icon={activity.icon}
                        title={activity.title}
                        desc={activity.desc}
                        time={activity.time}
                    />
                ))}
            </CardContent>
        </Card>
    );
}

/* ---------------------- Reusable Item ---------------------- */

function ActivityItem({ icon, title, desc, time }) {
    return (
        <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/60 transition-all">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-muted">
                {icon}
            </div>

            <div className="flex-1">
                <p className="font-medium">{title}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
                <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(time)}
                </p>
            </div>
        </div>
    );
}

/* ---------------------- Formatter ---------------------- */

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
