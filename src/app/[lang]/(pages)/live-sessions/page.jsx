"use client";

import { useState, useMemo, useCallback } from "react";
import { useLiveSessions } from "@/hooks/useLiveSessions";
import SessionCard from "@/components/live-sessions/SessionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Video, Plus, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRoleStore } from "@/store/useRoleStore";

// Status options for the filter dropdown
const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "live", label: "🔴 Live", color: "text-red-500" },
  { value: "scheduled", label: "Scheduled", color: "text-blue-500" },
  { value: "ended", label: "Ended", color: "text-gray-500" },
];

// Type options for the filter dropdown
const TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
];

// Empty state component
function EmptyState({
  message = "No sessions found",
  description = "Check back later or create a new session",
  icon: Icon = Video,
}) {
  return (
    <div className="text-center py-20 bg-muted/30 rounded-lg border-2 border-dashed">
      <div className="flex justify-center mb-4 text-muted-foreground">
        <Icon className="w-12 h-12" />
      </div>
      <p className="text-lg text-muted-foreground font-medium">{message}</p>
      <p className="text-sm text-muted-foreground mt-2">{description}</p>
    </div>
  );
}

// Loading state component
function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <span className="ml-3 text-lg text-muted-foreground">
        Loading sessions...
      </span>
    </div>
  );
}

// Error state component
function ErrorState({ onRetry }) {
  return (
    <div className="bg-destructive/10 border border-destructive rounded-lg p-6 text-center">
      <p className="text-destructive font-medium">Failed to load sessions</p>
      <Button onClick={onRetry} variant="outline" className="mt-4">
        Try Again
      </Button>
    </div>
  );
}

export default function LiveSessionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const { role } = useRoleStore();

  // Build API filters object
  const apiFilters = useMemo(() => {
    const filters = {};

    if (statusFilter !== "all") {
      filters.status = statusFilter;
    }

    if (typeFilter !== "all") {
      filters.sessionType = typeFilter;
    }

    return filters;
  }, [statusFilter, typeFilter]);

  // Fetch sessions with API filters
  const { sessions, loading, error, refetch } = useLiveSessions(apiFilters);

  // Filter sessions by search query using useMemo
  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;

    const query = searchQuery.toLowerCase().trim();

    return sessions.filter(
      (session) =>
        session.title.toLowerCase().includes(query) ||
        session.description?.toLowerCase().includes(query)
    );
  }, [sessions, searchQuery]);

  // Handle filter changes
  const handleStatusFilterChange = useCallback((value) => {
    setStatusFilter(value);
  }, []);

  const handleTypeFilterChange = useCallback((value) => {
    setTypeFilter(value);
  }, []);

  // Handle search input change
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  // Check if we should show empty state
  const showEmptyState = !loading && !error && filteredSessions.length === 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Live Sessions
          </h1>
          <p className="text-muted-foreground mt-2">
            Join live sessions or watch recordings
          </p>
        </div>

        {/* Create Session button - only for instructors */}
        {role === "instructor" && (
          <Button asChild size="lg" className="gap-2">
            <Link href="/live-sessions/create">
              <Plus className="w-5 h-5" />
              Create Session
            </Link>
          </Button>
        )}
      </header>

      {/* Filters Section */}
      <section className="bg-card border rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
              aria-label="Search sessions by title or description"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger
              className="w-full"
              aria-label="Filter sessions by status"
            >
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className={option.color}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={handleTypeFilterChange}>
            <SelectTrigger
              className="w-full"
              aria-label="Filter sessions by type"
            >
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Main Content Area */}
      <main>
        {/* Loading State */}
        {loading && <LoadingState />}

        {/* Error State */}
        {error && <ErrorState onRetry={refetch} />}

        {/* Sessions Grid */}
        {!loading && !error && (
          <>
            {showEmptyState ? (
              <EmptyState
                message={
                  searchQuery.trim()
                    ? "No matching sessions found"
                    : "No sessions available"
                }
                description={
                  searchQuery.trim()
                    ? "Try adjusting your search or filters"
                    : "Check back later or create a new session"
                }
              />
            ) : (
              <>
                {/* Results count (optional) */}
                <div className="mb-4 text-sm text-muted-foreground">
                  Showing {filteredSessions.length} of {sessions.length}{" "}
                  sessions
                </div>

                {/* Sessions Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredSessions.map((session) => (
                    <SessionCard key={session._id} session={session} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
