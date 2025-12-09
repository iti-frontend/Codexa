'use client';

import { useState } from 'react';
import { useLiveSessions } from '@/hooks/useLiveSessions';
import SessionCard from '@/components/live-sessions/SessionCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Video, Plus, Search, Filter, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { useRoleStore } from '@/store/useRoleStore';

export default function LiveSessionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const { role } = useRoleStore();

  // Build filters object
  const filters = {};
  if (statusFilter !== 'all') filters.status = statusFilter;
  if (typeFilter !== 'all') filters.sessionType = typeFilter;

  const { sessions, loading, error, refetch } = useLiveSessions(filters);

  // Filter by search query (client-side)
  const filteredSessions = sessions.filter((session) =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate sessions by status
  const liveSessions = filteredSessions.filter((s) => s.status === 'live');
  const scheduledSessions = filteredSessions.filter((s) => s.status === 'scheduled');
  const endedSessions = filteredSessions.filter((s) => s.status === 'ended');

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Live Sessions
          </h1>
          <p className="text-muted-foreground mt-2">
            Join live sessions or watch recordings
          </p>
        </div>
        {/* Only show Create Session button for instructors */}
        {role === 'instructor' && (
          <Button asChild size="lg" className="gap-2">
            <Link href="/live-sessions/create">
              <Plus className="w-5 h-5" />
              Create Session
            </Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-card border rounded-lg p-4 mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="live">Live Now</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="ended">Ended</SelectItem>
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-lg text-muted-foreground">Loading sessions...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-destructive/10 border border-destructive rounded-lg p-6 text-center">
          <p className="text-destructive font-medium">Failed to load sessions</p>
          <Button onClick={refetch} variant="outline" className="mt-4">
            Try Again
          </Button>
        </div>
      )}

      {/* Sessions Tabs */}
      {!loading && !error && (
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="all" className="gap-2">
              All <span className="text-xs">({filteredSessions.length})</span>
            </TabsTrigger>
            <TabsTrigger value="live" className="gap-2">
              🔴 Live <span className="text-xs">({liveSessions.length})</span>
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="gap-2">
              Scheduled <span className="text-xs">({scheduledSessions.length})</span>
            </TabsTrigger>
            <TabsTrigger value="ended" className="gap-2">
              Ended <span className="text-xs">({endedSessions.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* All Sessions */}
          <TabsContent value="all" className="space-y-6">
            {filteredSessions.length === 0 ? (
              <EmptyState message="No sessions found" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSessions.map((session) => (
                  <SessionCard key={session._id} session={session} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Live Sessions */}
          <TabsContent value="live" className="space-y-6">
            {liveSessions.length === 0 ? (
              <EmptyState message="No live sessions right now" icon={<Video className="w-12 h-12" />} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveSessions.map((session) => (
                  <SessionCard key={session._id} session={session} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Scheduled Sessions */}
          <TabsContent value="scheduled" className="space-y-6">
            {scheduledSessions.length === 0 ? (
              <EmptyState message="No scheduled sessions" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scheduledSessions.map((session) => (
                  <SessionCard key={session._id} session={session} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Ended Sessions */}
          <TabsContent value="ended" className="space-y-6">
            {endedSessions.length === 0 ? (
              <EmptyState message="No ended sessions" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {endedSessions.map((session) => (
                  <SessionCard key={session._id} session={session} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function EmptyState({ message, icon }) {
  return (
    <div className="text-center py-20 bg-muted/30 rounded-lg border-2 border-dashed">
      <div className="flex justify-center mb-4 text-muted-foreground">
        {icon || <Video className="w-12 h-12" />}
      </div>
      <p className="text-lg text-muted-foreground font-medium">{message}</p>
      <p className="text-sm text-muted-foreground mt-2">Check back later or create a new session</p>
    </div>
  );
}
