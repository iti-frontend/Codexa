"use client";
import { useState, useEffect } from "react";
import { useFavouritesStore } from "@/store/useFavouritesStore";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import { Heart, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Saved() {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { lang } = useParams();

  const {
    favourites,
    loading: storeLoading,
    initialized,
    initializeFavourites,
  } = useFavouritesStore();

  useEffect(() => {
    if (!initialized) {
      initializeFavourites();
    }
    setLoading(false);
  }, [initialized, initializeFavourites]);

  if (loading || storeLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-muted-foreground mt-3">
          {t("saved.loading")}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Heart className="w-7 h-7 text-primary fill-primary" />
          {t("saved.title")}
        </h1>
        <Badge variant="secondary" className="text-base px-3 py-1">
          {favourites.length}{" "}
          {favourites.length === 1
            ? t("explore.stats.courses").slice(0, -1)
            : t("explore.stats.courses")}
        </Badge>
      </div>

      {favourites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Heart className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">{t("saved.noSaved")}</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            {t("saved.noSavedDescription")}
          </p>
          <Button asChild>
            <Link href={`/${lang}/student/explore`}>
              <BookOpen className="w-4 h-4 mr-2" />
              {t("saved.browseCourses")}
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {favourites.map((fav) => (
            <Link
              href={`/${lang}/student/explore/${fav.course?._id}`}
              key={fav._id}
              className="group"
            >
              <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-border">
                {/* Course Image */}
                <CardHeader className="p-0 relative">
                  <div className="relative w-full h-48 bg-muted overflow-hidden">
                    {fav.course?.coverImage?.url ? (
                      <img
                        src={fav.course.coverImage.url}
                        alt={fav.course?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant="secondary"
                        className="bg-background/80 backdrop-blur-sm"
                      >
                        <Heart className="w-3 h-3 mr-1 fill-red-500 text-red-500" />
                        {t("saved.savedOn")}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-3">
                  {/* Title */}
                  <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {fav.course?.title}
                  </h3>

                  {/* Course Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t("saved.price")}:
                      </span>
                      <span className="font-semibold text-primary">
                        ${fav.course?.price}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t("saved.level")}:
                      </span>
                      <Badge variant="outline" className="capitalize">
                        {fav.course?.level}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t("saved.status")}:
                      </span>
                      <Badge
                        variant={
                          fav.course?.status === "public"
                            ? "default"
                            : "secondary"
                        }
                        className="capitalize"
                      >
                        {fav.course?.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t("saved.videos")}:
                      </span>
                      <span className="font-medium">
                        {fav.course?.videos?.length || 0}{" "}
                        {fav.course?.videos?.length === 1
                          ? t("courseDetailsPage.video")
                          : t("courseDetailsPage.videos")}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 border-t mt-2">
                  <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                    <span>{t("saved.savedOn")}:</span>
                    <span className="font-medium">
                      {new Date(fav.createdAt).toLocaleDateString(
                        lang === "ar" ? "ar-EG" : "en-US"
                      )}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
