// components/community/PostCard.js
"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Heart, Share } from "lucide-react";
import { useCommunityStore } from "@/store/useCommunityStore";
import { useAuthStore } from "@/store/useAuthStore";
import { CommentSection } from "./CommentSection";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function PostCard({ post }) {
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [localLikes, setLocalLikes] = useState(post.likes || []);

  const { toggleLike } = useCommunityStore();
  const { userToken, userInfo } = useAuthStore();

  // Update local likes when post changes
  useEffect(() => {
    setLocalLikes(post.likes || []);
  }, [post.likes]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check if current user liked the post
  const isLiked = () => {
    if (!userInfo || !localLikes || !Array.isArray(localLikes)) {
      return false;
    }

    const userId = userInfo._id || userInfo.id;
    if (!userId) return false;

    return localLikes.some((like) => {
      if (typeof like === 'string') {
        return like === userId;
      }
      if (like && typeof like === 'object') {
        return like._id === userId || like.id === userId;
      }
      return false;
    });
  };

  const handleLike = async () => {
    if (!userToken) {
      toast.error("Please login to like posts");
      return;
    }

    const userId = userInfo._id || userInfo.id;
    const wasLiked = isLiked();

    // Optimistic update
    const newLikes = wasLiked
      ? localLikes.filter(like => {
          if (typeof like === 'string') return like !== userId;
          return (like?._id !== userId && like?.id !== userId);
        })
      : [...localLikes, userId];

    setLocalLikes(newLikes);

    setIsLiking(true);
    try {
      await toggleLike(post._id, userToken);
    } catch (error) {
      // Revert on error
      setLocalLikes(localLikes);
      toast.error(error.message);
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = () => {
    const postUrl = `${window.location.origin}/community/${post._id}`;
    navigator.clipboard.writeText(postUrl);
    toast.success("Link copied to clipboard!");
  };

  return (
    <Card className="border-border hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author?.avatar} alt={post.author?.name} />
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
            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
          >
            {post.type}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Post Content */}
        <p className="text-foreground whitespace-pre-wrap">{post.content}</p>

        {/* Image if exists */}
        {post.image && (
          <img
            src={post.image}
            alt="Post image"
            className="rounded-lg w-full object-cover max-h-96"
          />
        )}

        {/* Link if exists */}
        {post.linkUrl && (
          <a
            href={post.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 border border-border rounded-lg hover:bg-secondary transition-colors"
          >
            <p className="text-sm text-primary hover:underline break-all">
              {post.linkUrl}
            </p>
          </a>
        )}

        {/* Poll if exists */}
        {post.poll && (
          <div className="space-y-2 p-3 border border-border rounded-lg">
            <p className="font-semibold">{post.poll.question}</p>
            {post.poll.options?.map((option, index) => (
              <div
                key={index}
                className="p-2 border border-border rounded hover:bg-secondary cursor-pointer transition-colors"
              >
                {option.text}
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
              className={cn(
                "flex items-center space-x-2 transition-all duration-300",
                isLiked()
                  ? "text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-950/20"
                  : "hover:text-red-500"
              )}
              onClick={handleLike}
              disabled={isLiking}
            >
              <Heart
                className={cn(
                  "w-4 h-4 transition-all duration-300",
                  isLiked() && "fill-red-500 text-red-500 scale-110"
                )}
              />
              <span className={cn(
                "transition-colors duration-300",
                isLiked() && "text-red-500 font-semibold"
              )}>
                {localLikes.length}
              </span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex items-center space-x-2",
                showComments && "text-primary"
              )}
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="w-4 h-4" />
              <span>{post.comments?.length || 0}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2"
              onClick={handleShare}
            >
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && <CommentSection post={post} />}
      </CardContent>
    </Card>
  );
}