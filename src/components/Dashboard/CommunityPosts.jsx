"use client";
import { useCommunity } from "@/hooks/useCommunity";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Heart, ArrowRight, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function CommunityPosts() {
    const { t } = useTranslation();
    const { lang } = useParams();
    const { posts, loading, error, refetch } = useCommunity();

    // Show only first 3 posts
    const displayedPosts = posts.slice(0, 3);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        {t("community.title")}
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

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        {t("community.title")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground mb-3">
                            {t("community.errorLoading")}
                        </p>
                        <Button onClick={refetch} variant="outline" size="sm">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            {t("community.tryAgain")}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    {t("community.title")}
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                {posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                            <MessageSquare className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                            {t("community.emptyState.message")}
                        </p>
                        <Button asChild size="sm">
                            <Link href={`/${lang}/community`}>
                                {t("community.emptyState.button")}
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        {displayedPosts.map((post) => (
                            <div
                                key={post._id}
                                className="p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-all duration-200"
                            >
                                {/* Post Header */}
                                <div className="flex items-start gap-3 mb-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={post.author?.profileImage} />
                                        <AvatarFallback className="text-xs">
                                            {post.author?.name?.charAt(0) || "?"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate">
                                            {post.author?.name || t("community.post.anonymous")}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(post.createdAt).toLocaleDateString(
                                                lang === "ar" ? "ar-EG" : "en-US",
                                                { month: "short", day: "numeric" }
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Post Content */}
                                <p className="text-sm text-foreground line-clamp-2 mb-2 pl-11">
                                    {post.content}
                                </p>

                                {/* Post Stats */}
                                <div className="flex items-center gap-4 text-xs text-muted-foreground pl-11">
                                    <div className="flex items-center gap-1">
                                        <Heart className="w-3.5 h-3.5" />
                                        <span>{post.likes?.length || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        <span>{post.comments?.length || 0}</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* View All Button */}
                        <Link href={`/${lang}/community`}>
                            <Button variant="ghost" className="w-full mt-2 group" size="sm">
                                {t("dashboard.following.seeAll")}
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
