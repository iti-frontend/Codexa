"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  BookOpen,
  Users,
  PlayCircle,
  CheckCircle,
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
import { useFavouritesStore } from "@/store/useFavouritesStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { OptimizedImg } from "@/components/ui/optimized-image";

export default function CourseDetailsPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [togglingFavourite, setTogglingFavourite] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  // Get current language from pathname
  const currentLang = pathname.split('/')[1] || 'en';

  const {
    toggleFavourite: toggleFavouriteInStore,
    isCourseFavourite,
    initializeFavourites,
    initialized,
  } = useFavouritesStore();

  const isFavourite = course ? isCourseFavourite(course._id) : false;

  useEffect(() => {
    if (!initialized) {
      initializeFavourites();
    }
  }, [initialized, initializeFavourites]);

  useEffect(() => {
    console.log('Course ID from params:', params?.id);
    if (params?.id) {
      fetchCourseDetails();
    }
  }, [params?.id]);

  const moveToCart = async (courseId) => {
    try {
      setAddingToCart(true);

      await api.post("/cart", { courseId });

      toast.success(t('explore.toast.addedToCart'), {
        description: t('explore.toast.addedDescription'),
        duration: 3000,
      });
    } catch (error) {
      console.error("Error moving to cart:", error);
      toast.error(t('explore.toast.failedToAdd'), {
        description: error.response?.data?.message || t('explore.toast.failedToAdd'),
        duration: 4000,
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching course details for ID:', params.id);
      const res = await api.get(`/courses/${params.id}`);
      console.log('Course data received:', res.data);
      setCourse(res.data);
    } catch (err) {
      console.error("Error fetching course details:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        t('courseDetailsPage.errorTitle')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavourite = async () => {
    if (!course || togglingFavourite) return;

    try {
      setTogglingFavourite(true);
      const result = await toggleFavouriteInStore(course._id);

      if (result.success) {
        const message = result.status === "added"
          ? t('courseDetailsPage.pricing.addToFavourites')
          : t('courseDetailsPage.pricing.removeFromFavourites');
        toast.success(message);
      } else {
        console.error("Failed to toggle favourite:", result.error);
        toast.error("Failed to update favourites");
      }
    } catch (error) {
      console.error("Error toggling favourite:", error);
      toast.error("Failed to update favourites");
    } finally {
      setTogglingFavourite(false);
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
    if (!videos?.length) return `0 ${t('courseDetailsPage.videos')}`;
    return `${videos.length} ${videos.length === 1 ? t('courseDetailsPage.video') : t('courseDetailsPage.videos')}`;
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
          <AlertTitle>{t('courseDetailsPage.errorTitle')}</AlertTitle>
          <AlertDescription className="mt-2">{error}</AlertDescription>
          <div className="flex gap-2 mt-4">
            <Button onClick={fetchCourseDetails} variant="outline">
              {t('courseDetailsPage.tryAgain')}
            </Button>
            <Button onClick={() => router.push(`/${currentLang}/student/explore`)} variant="ghost">
              {t('courseDetailsPage.backToCourses')}
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
          onClick={() => router.push(`/${currentLang}/student/explore`)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('courseDetailsPage.back')}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Image */}
            <div className="relative rounded-lg overflow-hidden bg-muted">
              {course.coverImage ? (
                <OptimizedImg
                  src={course.coverImage?.url || "/auth/login.png"}
                  alt={course.title}
                  fallbackSrc="/auth/login.png"
                  containerClassName="w-full h-96"
                  className="w-full h-full object-cover"
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
                  <Badge variant="secondary">{t('courseDetailsPage.public')}</Badge>
                )}
              </div>

              <div className="absolute top-4 right-4">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleToggleFavourite}
                  disabled={togglingFavourite}
                  className="bg-background/80 backdrop-blur-sm hover:bg-background"
                >
                  <Heart
                    className={`h-5 w-5 ${isFavourite ? "fill-red-500 text-red-500" : ""
                      }`}
                  />
                </Button>
              </div>
            </div>

            {/* Course Title & Category */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{course.category}</Badge>
                {isFavourite && (
                  <Badge variant="default" className="bg-red-500 text-white">
                    <Heart className="h-3 w-3 mr-1 fill-white" />
                    {t('courseDetailsPage.favourited')}
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl font-bold tracking-tight">
                {course.title}
              </h1>

              {/* Course Stats */}
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{course.enrolledStudents?.length || 0} {t('courseDetailsPage.students')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PlayCircle className="h-4 w-4" />
                  <span>{formatDuration(course.videos)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>
                    {t('courseDetailsPage.lastUpdated')}{" "}
                    {new Date(course.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Tabs Content */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="overview">{t('courseDetailsPage.tabs.overview')}</TabsTrigger>
                <TabsTrigger value="content">{t('courseDetailsPage.tabs.content')}</TabsTrigger>
                <TabsTrigger value="instructor">{t('courseDetailsPage.tabs.instructor')}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('courseDetailsPage.overview.about')}</CardTitle>
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
                      <CardTitle>{t('courseDetailsPage.overview.prerequisites')}</CardTitle>
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
                    <CardTitle>{t('courseDetailsPage.overview.whatYouLearn')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {course.videos?.slice(0, 5).map((video, index) => (
                        <li key={video._id} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">
                            {t('courseDetailsPage.overview.masterConcepts')} {video.title}
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
                    <CardTitle>{t('courseDetailsPage.content.title')}</CardTitle>
                    <CardDescription>
                      {course.videos?.length || 0} {t('courseDetailsPage.content.lectures')}
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
                            {t('courseDetailsPage.content.noVideos')}
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
                    <CardTitle>{t('courseDetailsPage.instructor.about')}</CardTitle>
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
                          {course.instructor?.name || t('courseDetailsPage.instructor.unknownInstructor')}
                        </h3>
                        <p className="text-muted-foreground">
                          {t('courseDetailsPage.instructor.expertIn')}{" "}
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
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => moveToCart(course._id)}
                  disabled={addingToCart}
                >
                  {addingToCart ? t('courseDetailsPage.pricing.addingToCart') : t('courseDetailsPage.pricing.addToCart')}
                </Button>

                {/* Favourite Button */}
                <Button
                  className={cn(
                    "w-full",
                    isFavourite && "bg-red-500! text-white!"
                  )}
                  variant={isFavourite ? "default" : "outline"}
                  size="lg"
                  onClick={handleToggleFavourite}
                  disabled={togglingFavourite}
                >
                  {isFavourite ? (
                    <>
                      <Heart className="h-4 w-4 mr-2 fill-white" />
                      {t('courseDetailsPage.pricing.removeFromFavourites')}
                    </>
                  ) : (
                    <>
                      <Heart className="h-4 w-4 mr-2" />
                      {t('courseDetailsPage.pricing.addToFavourites')}
                    </>
                  )}
                </Button>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-semibold">{t('courseDetailsPage.pricing.includes')}</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <PlayCircle className="h-4 w-4" />
                      <span>{formatDuration(course.videos)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Download className="h-4 w-4" />
                      <span>{t('courseDetailsPage.pricing.downloadableResources')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4" />
                      <span>{t('courseDetailsPage.pricing.lifetimeAccess')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Share2 className="h-4 w-4" />
                      <span>{t('courseDetailsPage.pricing.certificate')}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <Button variant="ghost" className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  {t('courseDetailsPage.pricing.share')}
                </Button>
              </CardContent>
            </Card>

            {/* Instructor Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('courseDetailsPage.tabs.instructor')}</CardTitle>
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
                      {course.instructor?.name || t('courseDetailsPage.instructor.unknownInstructor')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('courseDetailsPage.instructor.expertInstructor')}
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