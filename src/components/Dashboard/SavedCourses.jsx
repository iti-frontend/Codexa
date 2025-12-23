"use client";
import { useState, useEffect } from "react";
import { useFavouritesStore } from "@/store/useFavouritesStore";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import { Heart, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SavedCourses() {
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

    // Show only first 3 saved courses
    const displayedCourses = favourites.slice(0, 3);

    if (loading || storeLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-primary fill-primary" />
                        {t("saved.title")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary fill-primary" />
                    {t("saved.title")}
                </CardTitle>
                <Badge variant="secondary" className="text-sm">
                    {favourites.length}
                </Badge>
            </CardHeader>

            <CardContent className="space-y-3">
                {favourites.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                            <Heart className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                            {t("saved.noSavedDescription")}
                        </p>
                        <Button asChild size="sm">
                            <Link href={`/${lang}/student/explore`}>
                                <BookOpen className="w-4 h-4 mr-2" />
                                {t("saved.browseCourses")}
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        {displayedCourses.map((fav) => (
                            <Link
                                href={`/${lang}/student/explore/${fav.course?._id}`}
                                key={fav._id}
                                className="group block"
                            >
                                <div className="flex gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-all duration-200">
                                    {/* Course Image */}
                                    <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                                        {fav.course?.coverImage?.url ? (
                                            <img
                                                src={fav.course.coverImage.url}
                                                alt={fav.course?.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                                <BookOpen className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Course Info */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                                                {fav.course?.title}
                                            </h4>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {fav.course?.videos?.length || 0}{" "}
                                                {fav.course?.videos?.length === 1
                                                    ? t("courseDetailsPage.video")
                                                    : t("courseDetailsPage.videos")}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-sm font-bold text-primary">
                                                ${fav.course?.price}
                                            </span>
                                            <Badge variant="outline" className="text-xs capitalize">
                                                {fav.course?.level}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {/* View All Link */}
                        {favourites.length > 0 && (
                            <Link href={`/${lang}/saved`}>
                                <Button
                                    variant="ghost"
                                    className="w-full mt-2 group"
                                    size="sm"
                                >
                                    {favourites.length > 3
                                        ? t("dashboard.following.seeAll")
                                        : "View All Saved"
                                    }
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
