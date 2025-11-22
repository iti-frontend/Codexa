"use client";
import { useCommunity } from "@/hooks/useCommunity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, MessageCircle, Heart, Share } from "lucide-react";

export default function Community() {
  const { posts, loading, error, refetch } = useCommunity();

  const getTypeColor = (type) => {
    const colors = {
      text: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      image:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      link: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      poll: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    };
    return (
      colors[type] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <p className="mb-4">Error loading community posts: {error}</p>
              <Button onClick={refetch} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Community
        </h1>
        <Button onClick={refetch} disabled={loading} variant="outline">
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <Card className="border-border text-center py-12">
          <CardContent>
            <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No posts yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Be the first to share something with the community!
            </p>
            <Button>Create Post</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="border-border hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={post.author?.avatar}
                        alt={post.author?.name}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {post.author?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">
                        {post.author?.name || "Anonymous"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(post.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={getTypeColor(post.type)}
                  >
                    {post.type}
                  </Badge>
                </div>
                <CardTitle className="text-xl text-foreground">
                  {post.content}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Image Post */}
                {post.type === "image" && post.image && (
                  <img
                    src={post.image}
                    alt="Post content"
                    className="rounded-lg w-full max-h-96 object-cover"
                  />
                )}

                {/* Link Post */}
                {post.type === "link" && post.linkUrl && (
                  <a
                    href={post.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    <p className="text-primary hover:underline truncate">
                      {post.linkUrl}
                    </p>
                  </a>
                )}

                {/* Poll Post */}
                {post.type === "poll" && post.poll && (
                  <div className="space-y-2 p-4 border border-border rounded-lg">
                    <p className="font-semibold text-foreground">
                      {post.poll.question}
                    </p>
                    <div className="space-y-2">
                      {post.poll.options?.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 p-2 hover:bg-accent rounded"
                        >
                          <div className="w-4 h-4 rounded-full border border-border" />
                          <span className="text-foreground">{option.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attachments */}
                {post.attachments && post.attachments.length > 0 && (
                  <div className="space-y-2">
                    {post.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-2 border border-border rounded-lg"
                      >
                        <Badge variant="outline">{attachment.type}</Badge>
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm truncate"
                        >
                          {attachment.url}
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                {/* Engagement Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center space-x-6 text-muted-foreground">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <Heart className="w-4 h-4" />
                      <span>{post.likes?.length || 0}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments?.length || 0}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <Share className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
