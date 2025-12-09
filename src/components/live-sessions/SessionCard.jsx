'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Users, Video, Lock, Globe } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function SessionCard({ session }) {
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

  const getStatusText = (status) => {
    switch (status) {
      case 'live':
        return 'LIVE NOW';
      case 'scheduled':
        return 'Scheduled';
      case 'ended':
        return 'Ended';
      default:
        return status;
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 overflow-hidden">
      {/* Status Banner */}
      {session.status === 'live' && (
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-center py-2 font-bold text-sm">
          🔴 LIVE NOW - Join the session!
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getStatusColor(session.status)}>
                {getStatusText(session.status)}
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
            <CardTitle className="text-xl group-hover:text-primary transition-colors">
              {session.title}
            </CardTitle>
            <CardDescription className="mt-2 line-clamp-2">
              {session.description || 'No description available'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Instructor Info */}
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarImage src={session.instructor?.profileImage} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {session.instructor?.name?.charAt(0) || 'I'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{session.instructor?.name || 'Instructor'}</p>
            <p className="text-xs text-muted-foreground">Instructor</p>
          </div>
        </div>

        {/* Session Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(session.scheduledAt), 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{format(new Date(session.scheduledAt), 'hh:mm a')}</span>
          </div>
          {session.status !== 'scheduled' && (
            <>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{session.totalViewers || 0} viewers</span>
              </div>
              {session.duration > 0 && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Video className="w-4 h-4" />
                  <span>{session.duration} min</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Course Info (if private) */}
        {session.course && (
          <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-3">
            {(session.course.coverImage?.url || session.course.coverImage) && (
              <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={session.course.coverImage?.url || session.course.coverImage}
                  alt={session.course.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1">Course</p>
              <p className="font-medium text-sm truncate">{session.course.title}</p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-2">
        {session.status === 'live' && (
          <Button asChild className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600">
            <Link href={`/live-sessions/${session._id}/room`}>
              <Video className="w-4 h-4 mr-2" />
              Join Live
            </Link>
          </Button>
        )}
        {session.status === 'scheduled' && (
          <Button asChild variant="outline" className="flex-1">
            <Link href={`/live-sessions/${session._id}`}>
              View Details
            </Link>
          </Button>
        )}
        {session.status === 'ended' && session.recordingUrl && (
          <Button asChild variant="outline" className="flex-1">
            <Link href={`/live-sessions/${session._id}`}>
              <Video className="w-4 h-4 mr-2" />
              Watch Recording
            </Link>
          </Button>
        )}
        {session.status === 'ended' && !session.recordingUrl && (
          <Button asChild variant="outline" className="flex-1">
            <Link href={`/live-sessions/${session._id}`}>
              View Details
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
