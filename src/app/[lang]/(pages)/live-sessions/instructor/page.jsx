"use client";

import { useInstructorDashboard } from "@/hooks/useLiveSessions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Video,
  Users,
  Clock,
  BarChart3,
  Plus,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function InstructorDashboardPage() {
  const { dashboard, loading, error } = useInstructorDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-lg text-destructive">Failed to load dashboard</p>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Sessions",
      value: dashboard.totalSessions,
      icon: Video,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Live Now",
      value: dashboard.liveSessions,
      icon: Video,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Scheduled",
      value: dashboard.scheduledSessions,
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Completed",
      value: dashboard.endedSessions,
      icon: BarChart3,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Attendees",
      value: dashboard.totalAttendees,
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Avg. Attendance",
      value: Math.round(dashboard.averageAttendance),
      icon: TrendingUp,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
    {
      title: "Total Duration",
      value: `${dashboard.totalDuration}m`,
      icon: Clock,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
    {
      title: "Total Polls",
      value: dashboard.totalPolls,
      icon: BarChart3,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Instructor Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your live sessions and view analytics
          </p>
        </div>
        <Button asChild size="lg" className="gap-2">
          <Link href="/live-sessions/create">
            <Plus className="w-5 h-5" />
            Create Session
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="border-2 hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Sessions */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Recent Sessions</CardTitle>
              <CardDescription>Your latest live sessions</CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link href="/live-sessions">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {dashboard.recentSessions && dashboard.recentSessions.length > 0 ? (
            <div className="space-y-4">
              {dashboard.recentSessions.map((session) => (
                <div
                  key={session._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{session.title}</h3>
                      <Badge
                        variant={
                          session.status === "live"
                            ? "destructive"
                            : session.status === "scheduled"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {session.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {format(
                          new Date(session.scheduledAt),
                          "MMM dd, yyyy - hh:mm a"
                        )}
                      </span>
                      {session.attendees > 0 && (
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {session.attendees} attendees
                        </span>
                      )}
                      {session.duration > 0 && (
                        <span className="flex items-center gap-1">
                          <Video className="w-4 h-4" />
                          {session.duration} min
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {session.status === "live" && (
                      <Button
                        asChild
                        size="sm"
                        className="bg-red-500 hover:bg-red-600"
                      >
                        <Link href={`/live-sessions/${session._id}/room`}>
                          Join Live
                        </Link>
                      </Button>
                    )}
                    {session.status === "ended" && (
                      <Button asChild size="sm" variant="outline">
                        <Link
                          href={`/live-sessions/instructor/${session._id}/analytics`}
                        >
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Analytics
                        </Link>
                      </Button>
                    )}
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/live-sessions/${session._id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg border-2 border-dashed">
              <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground font-medium">
                No sessions yet
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Create your first live session to get started
              </p>
              <Button asChild className="mt-4">
                <Link href="/live-sessions/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Session
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg">Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">
                {dashboard.totalSessions > 0
                  ? Math.round(
                      (dashboard.totalAttendees / dashboard.totalSessions) * 100
                    ) / 100
                  : 0}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Avg. attendees per session
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg">Total Watch Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">
                {Math.round(dashboard.totalDuration / 60)}h
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Across all sessions
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg">Poll Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">
                {dashboard.totalPolls}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Total polls created
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
