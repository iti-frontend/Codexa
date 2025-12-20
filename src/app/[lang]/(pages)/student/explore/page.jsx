"use client";
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import {
  Search,
  Filter,
  BookOpen,
  Users,
  ChevronRight,
  X,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import api from "@/lib/axios";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { OptimizedImg } from "@/components/ui/optimized-image";

export default function Explore() {
  const { t, i18n } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [addingToCart, setAddingToCart] = useState({});
  const router = useRouter();
  const pathname = usePathname();

  // Get current language from pathname
  const currentLang = pathname.split('/')[1] || 'en';

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/courses");
      setCourses(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || t('explore.errorTitle')
      );
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (courseId, event) => {
    event.stopPropagation();

    try {
      setAddingToCart(prev => ({ ...prev, [courseId]: true }));

      await api.post("/cart", { courseId });

      toast.success(t('explore.toast.addedToCart'), {
        description: t('explore.toast.addedDescription'),
        duration: 3000,
      });

    } catch (error) {
      console.error("Error adding to cart:", error);
      const errorMessage = error.response?.data?.message || t('explore.toast.failedToAdd');

      toast.error(t('explore.toast.failedToAdd'), {
        description: errorMessage,
        duration: 4000,
      });
    } finally {
      setAddingToCart(prev => ({ ...prev, [courseId]: false }));
    }
  };

  const handleCourseClick = (courseId) => {
    // Make sure we're using the correct path with student prefix
    const coursePath = `/${currentLang}/student/explore/${courseId}`;
    console.log('Navigating to:', coursePath); // For debugging
    router.push(coursePath);
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

  const categories = [
    "all",
    ...new Set(courses.map((course) => course.category).filter(Boolean)),
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "all";

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="space-y-4 mb-12">
            <Skeleton className="h-12 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          <div className="mb-8">
            <Skeleton className="h-10 w-full max-w-md mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-6 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>{t('explore.errorTitle')}</AlertTitle>
          <AlertDescription className="mt-2">{error}</AlertDescription>
          <Button onClick={fetchCourses} variant="outline" className="mt-4">
            {t('explore.tryAgain')}
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t('explore.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('explore.subtitle')}
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder={t('explore.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  {t('explore.category')}
                  {selectedCategory !== "all" && (
                    <Badge
                      variant="secondary"
                      className="h-5 w-5 p-0 flex items-center justify-center"
                    >
                      !
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => setSelectedCategory("all")}
                  className={selectedCategory === "all" ? "bg-accent" : ""}
                >
                  {t('explore.allCategories')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {categories
                  .filter((cat) => cat !== "all")
                  .map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={
                        selectedCategory === category ? "bg-accent" : ""
                      }
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                {t('explore.clear')}
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mb-6 flex flex-wrap gap-2 justify-center">
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {t('explore.filters.search')}: "{searchQuery}"
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSearchQuery("")}
                />
              </Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {t('explore.filters.category')}: {selectedCategory}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedCategory("all")}
                />
              </Badge>
            )}
          </div>
        )}

        {/* Stats Bar */}
        <div className="mb-8 flex justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>{filteredCourses.length} {t('explore.stats.courses')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>
              {new Set(courses.map((c) => c.instructor?._id)).size} {t('explore.stats.instructors')}
            </span>
          </div>
          {selectedCategory !== "all" && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">{selectedCategory}</Badge>
            </div>
          )}
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>{t('explore.noCourses.title')}</CardTitle>
                <CardDescription>
                  {hasActiveFilters
                    ? t('explore.noCourses.withFilters')
                    : t('explore.noCourses.withoutFilters')}
                </CardDescription>
              </CardHeader>
              {hasActiveFilters && (
                <CardFooter>
                  <Button onClick={clearFilters} variant="outline">
                    {t('explore.clearFilters')}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card
                key={course._id}
                className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 border-border pt-0"
                onClick={() => handleCourseClick(course._id)}
              >
                {/* Course Image */}
                <div className="relative overflow-hidden bg-muted">
                  {course.coverImage ? (
                    <OptimizedImg
                      src={course.coverImage?.url || "/auth/login.png"}
                      alt={course.title}
                      fallbackSrc="/auth/login.png"
                      containerClassName="w-full h-48"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  {course.status === "public" && (
                    <Badge
                      className="absolute top-3 right-3"
                      variant="secondary"
                    >
                      {t('explore.public')}
                    </Badge>
                  )}
                </div>

                <CardHeader className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-xs">
                      {course.category}
                    </Badge>
                    <Badge
                      variant={getLevelVariant(course.level)}
                      className="text-xs"
                    >
                      {course.level}
                    </Badge>
                  </div>

                  <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
                    {course.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>

                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={course.instructor?.profileImage} />
                      <AvatarFallback className="text-xs">
                        {course.instructor?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {course.instructor?.name || t('explore.unknownInstructor')}
                      </p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between items-center pt-6 border-t">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">${course.price}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2 hover:bg-primary hover:text-white transition-colors"
                      onClick={(e) => addToCart(course._id, e)}
                      disabled={addingToCart[course._id]}
                    >
                      {addingToCart[course._id] ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="hidden sm:inline">{t('explore.adding')}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4" />
                          <span className="hidden sm:inline">{t('explore.addToCart')}</span>
                        </>
                      )}
                    </Button>

                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Footer Info */}
        {!loading && filteredCourses.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground">
              {t(courses.length === 1 ? 'explore.showing' : 'explore.showing_plural', {
                filtered: filteredCourses.length,
                total: courses.length
              })}
              {hasActiveFilters && ` ${t('explore.filtered')}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}