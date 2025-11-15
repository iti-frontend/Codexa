"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Users,
  PlayCircle,
  CheckCircle,
  Star,
  Share2,
  Heart,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/lib/axios";

export default function CourseDetails() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params?.id) {
      fetchCourseDetails();
    }
  }, [params?.id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`/courses/${params.id}`);
      setCourse(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch course details"
      );
      console.error("Error fetching course:", err);
    } finally {
      setLoading(false);
    }
  };

  const getLevelVariant = (level) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return "default";
      case "intermediate":
        return "secondary";
      case "advanced":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatDuration = (videos) => {
    if (!videos?.length) return "0 videos";
    return `${videos.length} video${videos.length !== 1 ? "s" : ""}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Skeleton className="h-10 w-32 mb-8" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-96 w-full rounded-lg" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-24 w-full" />
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-full" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Error Loading Course</AlertTitle>
          <AlertDescription className="mt-2">{error}</AlertDescription>
          <div className="flex gap-2 mt-4">
            <Button onClick={fetchCourseDetails} variant="outline">
              Try Again
            </Button>
            <Button onClick={() => router.push("/explore")} variant="ghost">
              Back to Courses
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Image */}
            <div className="relative rounded-lg overflow-hidden bg-muted">
              {course.coverImage ? (
                <img
                  src={course.coverImage?.url || "/auth/login.png"}
                  alt={course.title}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <BookOpen className="h-24 w-24 text-muted-foreground" />
                </div>
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge variant={getLevelVariant(course.level)}>
                  {course.level}
                </Badge>
                {course.status === "public" && (
                  <Badge variant="secondary">Public</Badge>
                )}
              </div>
            </div>

            {/* Course Title & Category */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{course.category}</Badge>
              </div>

              <h1 className="text-4xl font-bold tracking-tight">
                {course.title}
              </h1>

              {/* Course Stats */}
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{course.enrolledStudents?.length || 0} Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <PlayCircle className="h-4 w-4" />
                  <span>{formatDuration(course.videos)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    Last updated{" "}
                    {new Date(course.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Tabs Content */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Course</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {course.description}
                    </p>
                  </CardContent>
                </Card>

                {course.prerequisites && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Prerequisites</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {course.prerequisites}
                      </p>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>What You'll Learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {course.videos?.slice(0, 5).map((video, index) => (
                        <li key={video._id} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">
                            Master the concepts covered in {video.title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Content</CardTitle>
                    <CardDescription>
                      {course.videos?.length || 0} lectures
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="space-y-2">
                        {course.videos?.length > 0 ? (
                          course.videos.map((video, index) => (
                            <div
                              key={video._id}
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                {index + 1}
                              </div>
                              <PlayCircle className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">
                                  {video.title}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-center py-8">
                            No videos available yet
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="instructor" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About the Instructor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={course.instructor?.profileImage} />
                        <AvatarFallback className="text-lg">
                          {course.instructor?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">
                          {course.instructor?.name || "Unknown Instructor"}
                        </h3>
                        <p className="text-muted-foreground">
                          Professional instructor with expertise in{" "}
                          {course.category}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card className="sticky top-4 z-20">
              <CardHeader>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">${course.price}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" size="lg">
                  Enroll Now
                </Button>
                <Button className="w-full" variant="outline" size="lg">
                  Add to Wishlist
                  <Heart className="h-4 w-4 ml-2" />
                </Button>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-semibold">This course includes:</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <PlayCircle className="h-4 w-4" />
                      <span>{formatDuration(course.videos)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Download className="h-4 w-4" />
                      <span>Downloadable resources</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4" />
                      <span>Full lifetime access</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Share2 className="h-4 w-4" />
                      <span>Certificate of completion</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <Button variant="ghost" className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share this course
                </Button>
              </CardContent>
            </Card>

            {/* Instructor Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={course.instructor?.profileImage} />
                    <AvatarFallback>
                      {course.instructor?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {course.instructor?.name || "Unknown Instructor"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expert Instructor
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
