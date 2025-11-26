// components/community/PostCard.js
"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCommunityStore } from "@/store/useCommunityStore";
import { CommentSection } from "./CommentSection";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function PostCard({ post, onLike }) {
  const [showComments, setShowComments] = useState(false);
  const { user } = useAuthStore();
  const { deletePost } = useCommunityStore();
  
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

  // دالة لاستخراج اسم المستخدم
  const getUserName = (postUser) => {
    if (!postUser) return 'Anonymous User';
    
    if (postUser.name && postUser.name !== 'Anonymous User' && postUser.name !== 'User') {
      return postUser.name;
    }
    
    if (postUser.email) {
      return postUser.email.split('@')[0];
    }
    
    if (postUser.displayName) {
      return postUser.displayName;
    }
    
    return 'Anonymous User';
  };

  // التحقق إذا كان المنشور ملك للمستخدم الحالي
  const isPostOwner = () => {
    if (!user || !post.user) return false;
    
    return post.user.userId === user.uid || 
           post.userId === user.uid ||
           post.user._id === user.uid;
  };

  const handleDeletePost = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    try {
      const { userToken } = useAuthStore.getState();
      await deletePost(post._id, userToken);
    } catch (error) {
      console.error("Error deleting post:", error);
      alert(error.message);
    }
  };

  const handleEditPost = () => {
    // هنا هتضيف منطق التعديل على البوست
    alert("Edit post functionality will be added here");
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium">
                {getUserName(post.user)?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div>
              <p className="font-medium text-sm">
                {getUserName(post.user)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
          
          {/* القائمة المنسدلة للتحكم في البوست */}
          {isPostOwner() && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEditPost}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Post
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDeletePost}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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