'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { CalendarIcon, Loader2, Video, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import liveSessionService from '@/services/liveSessionService';
import courseService from '@/services/courseService';
import Link from 'next/link';

export default function CreateSessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit'); // Get session ID for editing
  const isEditMode = !!editId;

  const [loading, setLoading] = useState(false);
  const [loadingSession, setLoadingSession] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [courses, setCourses] = useState([]);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('18:00');
  const [sessionType, setSessionType] = useState('public');
  const [selectedCourse, setSelectedCourse] = useState('');

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      title: '',
      description: '',
      sessionType: 'public',
    },
  });

  // Fetch instructor's courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        const data = await courseService.getMyCourses();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load courses');
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch session data if in edit mode
  useEffect(() => {
    if (!isEditMode || !editId) return;

    const fetchSession = async () => {
      try {
        setLoadingSession(true);
        const session = await liveSessionService.getSession(editId);
        
        // Pre-fill form
        setValue('title', session.title);
        setValue('description', session.description || '');
        setSessionType(session.sessionType);
        
        // Set date and time
        const scheduledDate = new Date(session.scheduledAt);
        setDate(scheduledDate);
        setTime(format(scheduledDate, 'HH:mm'));
        
        // Set course if private
        if (session.sessionType === 'private' && session.course) {
          setSelectedCourse(session.course.title);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        toast.error('Failed to load session data');
        router.push('/live-sessions/create');
      } finally {
        setLoadingSession(false);
      }
    };

    fetchSession();
  }, [isEditMode, editId, setValue, router]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Validate course selection for private sessions
      if (sessionType === 'private' && !selectedCourse) {
        toast.error('Please select a course for private session');
        setLoading(false);
        return;
      }

      // Combine date and time
      const [hours, minutes] = time.split(':');
      const scheduledAt = new Date(date);
      scheduledAt.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const sessionData = {
        title: data.title,
        description: data.description,
        scheduledAt: scheduledAt.toISOString(),
      };

      // Add courseName if private session
      if (sessionType === 'private' && selectedCourse) {
        sessionData.courseName = selectedCourse;
      }

      let response;
      if (isEditMode) {
        // Update existing session
        response = await liveSessionService.updateSession(editId, sessionData);
        toast.success('Session updated successfully!');
      } else {
        // Create new session
        sessionData.sessionType = sessionType;
        response = await liveSessionService.createSession(sessionData);
        toast.success('Session created successfully!');
      }
      
      router.push(`/live-sessions/${isEditMode ? editId : response.session._id}`);
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} session:`, error);
      toast.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} session`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-3xl">
      {/* Back Button */}
      <Button asChild variant="ghost" className="mb-4 sm:mb-6 -ml-2 sm:ml-0">
        <Link href="/live-sessions">
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="text-sm sm:text-base">Back to Sessions</span>
        </Link>
      </Button>

      {/* Loading state while fetching session data */}
      {loadingSession ? (
        <Card className="border-2 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-12 sm:py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <span className="text-base sm:text-lg font-medium text-muted-foreground">Loading session data...</span>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 shadow-sm overflow-hidden">
          <CardHeader className="border-b bg-muted/30 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="p-3 bg-primary/10 rounded-xl w-fit">
                <Video className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">
                  {isEditMode ? 'Edit Live Session' : 'Create Live Session'}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  {isEditMode 
                    ? 'Update your live session details' 
                    : 'Schedule a new live session for your students'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm sm:text-base font-semibold">
                Session Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., Introduction to React Hooks"
                {...register('title', { required: 'Title is required' })}
                className={`h-10 sm:h-12 text-sm sm:text-base ${errors.title ? 'border-destructive ring-destructive/20' : ''}`}
              />
              {errors.title && (
                <p className="text-xs sm:text-sm text-destructive font-medium">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm sm:text-base font-semibold">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what you'll cover in this session..."
                rows={4}
                className="text-sm sm:text-base resize-none"
                {...register('description')}
              />
            </div>

            {/* Session Type */}
            <div className="space-y-2">
              <Label className="text-sm sm:text-base font-semibold">
                Session Type <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={sessionType} 
                onValueChange={setSessionType}
                disabled={isEditMode}
              >
                <SelectTrigger className="h-10 sm:h-12 text-sm sm:text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-start gap-3 py-1">
                      <span className="text-lg">🌍</span>
                      <div className="text-left">
                        <p className="font-semibold text-sm sm:text-base">Public</p>
                        <p className="text-xs text-muted-foreground">Open to everyone on the platform</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-start gap-3 py-1">
                      <span className="text-lg">🔒</span>
                      <div className="text-left">
                        <p className="font-semibold text-sm sm:text-base">Private</p>
                        <p className="text-xs text-muted-foreground">Exclusive to enrolled course students</p>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {isEditMode && (
                <p className="text-xs text-muted-foreground mt-1">
                  Session type is locked for existing sessions
                </p>
              )}
            </div>

            {/* Course Selection (if private) */}
            {sessionType === 'private' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <Label htmlFor="courseName" className="text-sm sm:text-base font-semibold">
                  Select Course <span className="text-destructive">*</span>
                </Label>
                {loadingCourses ? (
                  <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-xl bg-muted/20">
                    <Loader2 className="w-5 h-5 mr-3 animate-spin text-primary" />
                    <span className="text-sm sm:text-base text-muted-foreground font-medium">Fetching your courses...</span>
                  </div>
                ) : courses.length === 0 ? (
                  <div className="p-6 border-2 border-dashed rounded-xl bg-destructive/5 text-center">
                    <p className="text-sm sm:text-base text-destructive font-semibold mb-1">
                      No active courses found
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      You need to create a course before scheduling a private session.
                    </p>
                  </div>
                ) : (
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger className="h-10 sm:h-12 text-sm sm:text-base">
                      <SelectValue placeholder="Which course is this for?" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course._id} value={course.title}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {sessionType === 'private' && !selectedCourse && !loadingCourses && courses.length > 0 && (
                  <p className="text-xs sm:text-sm text-destructive font-medium">Assignment to a course is required</p>
                )}
              </div>
            )}

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Date Picker */}
              <div className="space-y-2">
                <Label className="text-sm sm:text-base font-semibold">
                  Date <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-10 sm:h-12 justify-start text-left font-normal text-sm sm:text-base"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date().setHours(0,0,0,0)}
                      initialFocus
                      className="rounded-md border shadow"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Picker */}
              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm sm:text-base font-semibold">
                  Time <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="h-10 sm:h-12 text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-primary/5 rounded-xl p-4 sm:p-5 border-2 border-primary/10 shadow-sm transition-all hover:bg-primary/10">
              <div className="flex items-center gap-3 mb-2 sm:mb-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wider">Scheduled for</p>
              </div>
              <p className="text-base sm:text-xl font-bold text-foreground">
                {format(date, 'EEEE, MMMM dd, yyyy')}
              </p>
              <p className="text-lg sm:text-2xl font-black text-primary mt-1">
                {time}
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:flex-1 h-10 sm:h-12 order-2 sm:order-1"
                onClick={() => router.back()}
                disabled={loading}
              >
                Discard Changes
              </Button>
              <Button
                type="submit"
                className="w-full sm:flex-1 h-10 sm:h-12 order-1 sm:order-2 shadow-lg shadow-primary/20"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isEditMode ? 'Updating...' : 'Scheduling...'}
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4 mr-2" />
                    {isEditMode ? 'Update Session' : 'Launch Session'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      )}
    </div>
  );
}
