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
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Back Button */}
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/live-sessions">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sessions
        </Link>
      </Button>

      {/* Loading state while fetching session data */}
      {loadingSession ? (
        <Card className="border-2">
          <CardContent className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary mr-3" />
            <span className="text-lg">Loading session data...</span>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Video className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {isEditMode ? 'Edit Live Session' : 'Create Live Session'}
                </CardTitle>
                <CardDescription>
                  {isEditMode 
                    ? 'Update your live session details' 
                    : 'Schedule a new live session for your students'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Session Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., Introduction to React Hooks"
                {...register('title', { required: 'Title is required' })}
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what you'll cover in this session..."
                rows={4}
                {...register('description')}
              />
            </div>

            {/* Session Type */}
            <div className="space-y-2">
              <Label>
                Session Type <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={sessionType} 
                onValueChange={setSessionType}
                disabled={isEditMode}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <span>🌍</span>
                      <div>
                        <p className="font-medium">Public</p>
                        <p className="text-xs text-muted-foreground">Anyone can join</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <span>🔒</span>
                      <div>
                        <p className="font-medium">Private</p>
                        <p className="text-xs text-muted-foreground">Only enrolled students</p>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {isEditMode && (
                <p className="text-xs text-muted-foreground">
                  Session type cannot be changed after creation
                </p>
              )}
            </div>

            {/* Course Selection (if private) */}
            {sessionType === 'private' && (
              <div className="space-y-2">
                <Label htmlFor="courseName">
                  Select Course <span className="text-destructive">*</span>
                </Label>
                {loadingCourses ? (
                  <div className="flex items-center justify-center p-4 border rounded-md">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span className="text-sm text-muted-foreground">Loading courses...</span>
                  </div>
                ) : courses.length === 0 ? (
                  <div className="p-4 border rounded-md bg-muted/50">
                    <p className="text-sm text-muted-foreground">
                      No courses found. Please create a course first.
                    </p>
                  </div>
                ) : (
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
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
                {sessionType === 'private' && !selectedCourse && (
                  <p className="text-sm text-destructive">Please select a course</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Only students enrolled in this course will be able to join
                </p>
              </div>
            )}

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date Picker */}
              <div className="space-y-2">
                <Label>
                  Date <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Picker */}
              <div className="space-y-2">
                <Label htmlFor="time">
                  Time <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>

            {/* Preview */}
            <div className="bg-muted/50 rounded-lg p-4 border">
              <p className="text-sm font-medium mb-2">Scheduled for:</p>
              <p className="text-lg font-semibold">
                {format(date, 'EEEE, MMMM dd, yyyy')} at {time}
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4 mr-2" />
                    {isEditMode ? 'Update Session' : 'Create Session'}
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
