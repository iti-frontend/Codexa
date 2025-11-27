// components/community/PostCard.js
"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { CommentSection } from "./CommentSection";

export function PostCard({ post, onLike }) {
  const [showComments, setShowComments] = useState(false);
  const { user } = useAuthStore();
  
  // التحقق إذا كان المستخدم الحالي معجب بالمنشور
  const isLiked = post.likes?.some(like => like.userId === user?.uid);
  const likesCount = post.likes?.length || 0;
  const commentsCount = post.comments?.length || 0;

  const handleLike = () => {
    if (onLike) {
      onLike(post._id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium">
                {post.user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <p className="font-medium text-sm">
                {post.user?.name || 'Anonymous User'}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm whitespace-pre-wrap">{post.content}</p>
        
        {/* إحصائيات التفاعل */}
        <div className="flex items-center text-xs text-muted-foreground space-x-4">
          {likesCount > 0 && (
            <span>{likesCount} like{likesCount !== 1 ? 's' : ''}</span>
          )}
          {commentsCount > 0 && (
            <span>{commentsCount} comment{commentsCount !== 1 ? 's' : ''}</span>
          )}
        </div>
        
        {/* أزرار التفاعل */}
        <div className="flex items-center justify-between border-t border-b py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`flex-1 flex items-center gap-2 ${
              isLiked ? "text-red-500" : "text-muted-foreground"
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            Like
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex-1 flex items-center gap-2 text-muted-foreground"
          >
            <MessageCircle className="w-4 h-4" />
            Comment
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 flex items-center gap-2 text-muted-foreground"
          >
            <Share className="w-4 h-4" />
            Share
          </Button>
        </div>

        {/* قسم الكومنتات */}
        {showComments && (
          <CommentSection 
            post={post} 
            postId={post._id}
          />
        )}
      </CardContent>
    </Card>
  );
}