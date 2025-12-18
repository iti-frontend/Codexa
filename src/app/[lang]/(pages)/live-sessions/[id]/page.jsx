'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSession } from '@/hooks/useLiveSessions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, Clock, Users, Video, ArrowLeft, Play, Loader2,
  Globe, Lock, BarChart3
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import liveSessionService from '@/services/liveSessionService';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';

export default function SessionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id;

  const { session, loading, error } = useSession(sessionId);
  const { userInfo } = useAuthStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-lg text-destructive">Failed to load session</p>
        <Button asChild className="mt-4">
          <Link href="/live-sessions">Back to Sessions</Link>
        </Button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'live':
        return 'bg-red-500 animate-pulse';
      case 'scheduled':
        return 'bg-blue-500';
      case 'ended':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const isAdmin = userInfo?.role === 'admin';
  const isInstructor = session.instructor?._id === userInfo?._id;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* ... (keep existing back button) */}
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/live-sessions">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sessions
        </Link>
      </Button>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={getStatusColor(session.status)}>
                      {session.status === 'live' ? '🔴 LIVE NOW' : session.status.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {session.sessionType === 'private' ? (
                        <>
                          <Lock className="w-3 h-3" />
                          Private
                        </>
                      ) : (
                        <>
                          <Globe className="w-3 h-3" />
                          Public
                        </>
                      )}
                    </Badge>
                  </div>
                  <CardTitle className="text-3xl">{session.title}</CardTitle>
                  <CardDescription className="mt-3 text-base">
                    {session.description || 'No description available'}
                  </CardDescription>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-6">
                <div className="flex gap-3">
                    {(session.status === 'live' || session.status === 'scheduled' || isAdmin) && (
                      <Button
                        asChild
                        size="lg"
                        className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                      >
                        <Link href={`/live-sessions/${session._id}/room`}>
                          <Video className="w-5 h-5 mr-2" />
                          {session.status === 'live' ? 'Join Live Session' : (isAdmin ? 'Join Session (Admin)' : 'Start / Join Session')}
                        </Link>
                      </Button>
                    )}
                    {session.status === 'ended' && session.recordingUrl && (
                      <Button asChild size="lg" className="flex-1">
                        <a href={session.recordingUrl} target="_blank" rel="noopener noreferrer">
                          <Play className="w-5 h-5 mr-2" />
                          Watch Recording
                        </a>
                      </Button>
                    )}
                </div>

                {/* Management Actions (Instructor or Admin) */}
                {(session.status === 'scheduled' || isAdmin) && (
                    <div className="flex gap-3 pt-4 border-t">
                        {/* Edit only for scheduled */}
                        {session.status === 'scheduled' && (isInstructor || isAdmin) && (
                           <Button variant="outline" className="flex-1" onClick={() => router.push(`/live-sessions/${session._id}/edit`)}>
                                Edit Session
                            </Button>
                        )}
                        
                        <Button 
                            variant="destructive" 
                            className="flex-1"
                            onClick={async () => {
                                if (!confirm('Are you sure you want to delete this session?')) return;
                                try {
                                    await liveSessionService.deleteSession(sessionId);
                                    toast.success('Session deleted successfully');
                                    router.push('/live-sessions/instructor'); // Or admin dashboard if admin
                                } catch (error) {
                                    toast.error(error.response?.data?.message || 'Failed to delete session');
                                }
                            }}
                        >
                            Delete Session
                        </Button>
                    </div>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Scheduled Date</p>
                    <p className="font-medium">{format(new Date(session.scheduledAt), 'MMMM dd, yyyy')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{format(new Date(session.scheduledAt), 'hh:mm a')}</p>
                  </div>
                </div>
                {session.status !== 'scheduled' && (
                  <>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Attendees</p>
                        <p className="font-medium">{session.totalViewers || 0}</p>
                      </div>
                    </div>
                  </>
                )}
                {session.duration > 0 && (
                  <div className="flex items-start gap-3">
                    <Video className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium">{session.duration} minutes</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Course Info (if private) */}
          {session.course && (
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  {(session.course.coverImage?.url || session.course.coverImage) && (
                    <img
                      src={session.course.coverImage?.url || session.course.coverImage}
                      alt={session.course.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-lg">{session.course.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Only enrolled students can join this session
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Polls */}
          {session.polls && session.polls.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Polls ({session.polls.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {session.polls.map((poll, index) => (
                  <div key={poll._id || index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <p className="font-medium">{poll.question}</p>
                      <Badge variant={poll.isActive ? 'default' : 'secondary'}>
                        {poll.isActive ? 'Active' : 'Closed'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {poll.options?.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center justify-between text-sm">
                          <span>{option.text}</span>
                          <span className="text-muted-foreground">{option.count || 0} votes</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Instructor Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Instructor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="h-16 w-16 border-2 border-primary/20">
                  <AvatarImage src={session.instructor?.profileImage} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                    {session.instructor?.name?.charAt(0) || 'I'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{session.instructor?.name || 'Instructor'}</p>
                  {session.instructor?.bio && (
                    <p className="text-sm text-muted-foreground mt-1">{session.instructor.bio}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          {session.status !== 'scheduled' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Total Attendees</span>
                    <span className="font-bold text-lg">{session.totalViewers || 0}</span>
                  </div>
                  <Separator />
                </div>
                {session.attendees && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Attendees</span>
                      <span className="font-bold text-lg">{session.attendees.length}</span>
                    </div>
                    <Separator />
                  </div>
                )}
                {session.polls && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Polls</span>
                      <span className="font-bold text-lg">{session.polls.length}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Recording Info */}
          {session.status === 'ended' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recording</CardTitle>
              </CardHeader>
              <CardContent>
                {session.recordingUrl ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Recording available</span>
                    </div>
                    {session.savedToCourse && (
                      <p className="text-xs text-muted-foreground">
                        ✓ Saved to course videos
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No recording available
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
