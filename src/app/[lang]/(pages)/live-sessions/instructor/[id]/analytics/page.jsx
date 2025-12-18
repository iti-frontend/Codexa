'use client';

import { useParams } from 'next/navigation';
import { useSessionAnalytics } from '@/hooks/useLiveSessions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Loader2, ArrowLeft, Users, Clock, BarChart3, TrendingUp, 
  Video, Calendar, CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function SessionAnalyticsPage() {
  const params = useParams();
  const sessionId = params.id;

  const { analytics, loading, error } = useSessionAnalytics(sessionId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-lg text-destructive">Failed to load analytics</p>
        <Button asChild className="mt-4">
          <Link href="/live-sessions/instructor">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const { session, attendance, polls, recording } = analytics;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/live-sessions/instructor">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{session.title}</h1>
        <p className="text-muted-foreground">Session Analytics & Insights</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Attendees</p>
                <p className="text-3xl font-bold">{attendance.totalAttendees}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Peak Viewers</p>
                <p className="text-3xl font-bold">{attendance.peakViewers}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Duration</p>
                <p className="text-3xl font-bold">{session.duration}m</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/10">
                <Clock className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg. Duration</p>
                <p className="text-3xl font-bold">{Math.round(attendance.averageDuration)}m</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-500/10">
                <BarChart3 className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Session Timeline */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Session Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                  <p className="font-medium">{format(new Date(session.scheduledAt), 'PPpp')}</p>
                </div>
              </div>
              <Separator />
              {session.startedAt && (
                <>
                  <div className="flex items-center gap-4">
                    <Video className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Started</p>
                      <p className="font-medium">{format(new Date(session.startedAt), 'PPpp')}</p>
                    </div>
                  </div>
                  <Separator />
                </>
              )}
              {session.endedAt && (
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ended</p>
                    <p className="font-medium">{format(new Date(session.endedAt), 'PPpp')}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Attendees List */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Attendees ({attendance.totalAttendees})</CardTitle>
              <CardDescription>Detailed attendance information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attendance.attendees && attendance.attendees.length > 0 ? (
                  attendance.attendees.map((attendee, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={attendee.user?.profileImage} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {attendee.user?.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{attendee.user?.name || 'Anonymous'}</p>
                          <p className="text-xs text-muted-foreground">{attendee.user?.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{attendee.duration} min</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(attendee.joinedAt), 'hh:mm a')}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No attendees</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Polls Analytics */}
          {polls.totalPolls > 0 && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Polls Analytics</CardTitle>
                <CardDescription>
                  {polls.totalPolls} polls with {polls.totalVotes} total votes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {polls.polls.map((poll, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold mb-1">{poll.question}</p>
                        <p className="text-sm text-muted-foreground">
                          {poll.totalVotes} {poll.totalVotes === 1 ? 'vote' : 'votes'}
                        </p>
                      </div>
                      <Badge variant={poll.isActive ? 'default' : 'secondary'}>
                        {poll.isActive ? 'Active' : 'Closed'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {poll.options.map((option, optIndex) => {
                        const percentage = poll.totalVotes > 0 
                          ? Math.round((option.count / poll.totalVotes) * 100)
                          : 0;
                        
                        return (
                          <div key={optIndex} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">{option.text}</span>
                              <span className="text-muted-foreground">
                                {option.count} ({percentage}%)
                              </span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                    
                    {index < polls.polls.length - 1 && <Separator className="mt-6" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Recording Info */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">Recording</CardTitle>
            </CardHeader>
            <CardContent>
              {recording.available ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Available</span>
                  </div>
                  {recording.savedToCourse && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm">✓ Saved to course videos</p>
                    </div>
                  )}
                  <Button asChild className="w-full">
                    <a href={recording.url} target="_blank" rel="noopener noreferrer">
                      <Video className="w-4 h-4 mr-2" />
                      Watch Recording
                    </a>
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No recording available</p>
              )}
            </CardContent>
          </Card>

          {/* Engagement Summary */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">Engagement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Attendance Rate</span>
                  <span className="font-bold">
                    {attendance.totalAttendees > 0 ? '100%' : '0%'}
                  </span>
                </div>
                <Progress value={attendance.totalAttendees > 0 ? 100 : 0} className="h-2" />
              </div>
              
              <Separator />
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Avg. Watch Time</span>
                  <span className="font-bold">{Math.round(attendance.averageDuration)}m</span>
                </div>
                <Progress 
                  value={session.duration > 0 ? (attendance.averageDuration / session.duration) * 100 : 0} 
                  className="h-2" 
                />
              </div>

              {polls.totalPolls > 0 && (
                <>
                  <Separator />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Poll Participation</span>
                      <span className="font-bold">
                        {polls.totalVotes > 0 ? Math.round((polls.totalVotes / attendance.totalAttendees) * 100) : 0}%
                      </span>
                    </div>
                    <Progress 
                      value={polls.totalVotes > 0 ? (polls.totalVotes / attendance.totalAttendees) * 100 : 0} 
                      className="h-2" 
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge>{session.status}</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Attendees</span>
                <span className="font-semibold">{attendance.totalAttendees}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Peak Viewers</span>
                <span className="font-semibold">{attendance.peakViewers}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Polls Created</span>
                <span className="font-semibold">{polls.totalPolls}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Votes</span>
                <span className="font-semibold">{polls.totalVotes}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
