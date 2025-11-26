"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Heart, Share, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useCommunityStore } from "@/store/useCommunityStore";
import { useAuthStore } from "@/store/useAuthStore";
import { CommentSection } from "./CommentSection";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function PostCard({ post }) {
  const [showComments, setShowComments] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editContent, setEditContent] = useState(post.content || "");
  const [isDeleting, setIsDeleting] = useState(false);
  const { toggleLike, editPost, deletePost } = useCommunityStore();
  const { userToken, userInfo } = useAuthStore();

  // --------- UseEffect لتحديد اذا المستخدم عامل لايك من قبل ---------


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isPostOwner = () => {
    if (!userInfo || !post.author) return false;
    const authorId = typeof post.author === 'string' ? post.author : (post.author._id || post.author.id);
    const userId = userInfo._id || userInfo.id;
    return authorId === userId;
  };

  const getAuthorName = () => {
    if (!post.author) return "Anonymous";
    if (typeof post.author === 'object' && post.author.name) return post.author.name;
    if (isPostOwner() && userInfo?.name) return userInfo.name;
    return "Anonymous";
  };

  const getAuthorAvatar = () => {
    if (post.author && typeof post.author === 'object' && post.author.avatar) return post.author.avatar;
    if (isPostOwner() && userInfo?.avatar) return userInfo.avatar;
    return null;
  };



  const handleEditPost = async () => {
    if (!editContent.trim()) {
      toast.error("Post content cannot be empty");
      return;
    }
    try {
      await editPost(post._id, { content: editContent }, userToken);
      setIsEditDialogOpen(false);
      toast.success("Post updated successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    setIsDeleting(true);
    try {
      await deletePost(post._id, userToken);
      toast.success("Post deleted successfully");
    } catch (error) {
      toast.error(error.message);
      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    const postUrl = `${window.location.origin}/community/${post._id}`;
    navigator.clipboard.writeText(postUrl);
    toast.success("Link copied to clipboard!");
  };

  const authorName = getAuthorName();
  const authorAvatar = getAuthorAvatar();
  const isOwner = isPostOwner();

  return (
    <>
      <Card className="border-border hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={authorAvatar} alt={authorName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {authorName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">{authorName}</p>
                <p className="text-sm text-muted-foreground">{formatDate(post.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
              >
                {post.type}
              </Badge>
              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Post
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleDeletePost}
                      className="text-destructive focus:text-destructive"
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-foreground whitespace-pre-wrap">{post.content}</p>

          {post.image && (
            <img src={post.image} alt="Post image" className="rounded-lg w-full object-cover max-h-96" />
          )}

          {post.linkUrl && (
            <a
              href={post.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 border border-border rounded-lg hover:bg-secondary transition-colors"
            >
              <p className="text-sm text-primary hover:underline break-all">{post.linkUrl}</p>
            </a>
          )}

          {post.poll && (
            <div className="space-y-2 p-3 border border-border rounded-lg">
              <p className="font-semibold">{post.poll.question}</p>
              {post.poll.options?.map((option, index) => (
                <div key={index} className="p-2 border border-border rounded hover:bg-secondary cursor-pointer transition-colors">
                  {option.text}
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-6 text-muted-foreground">
              {/* --------- زر اللايك --------- */}
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex items-center space-x-2 transition-all duration-300",
                  liked ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-red-500"
                )}
                onClick={handleLike}
                disabled={isLiking}
              >
                <Heart
                  className={cn(
                    "w-4 h-4 transition-all duration-300",
                    liked && "fill-red-500 text-red-500"
                  )}
                />
                <span className={cn("transition-colors duration-300", liked && "text-red-500")}>
                  {localLikes.length}
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={cn("flex items-center space-x-2 text-muted-foreground", showComments && "text-primary")}
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments?.length || 0}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-muted-foreground"
                onClick={handleShare}
              >
                <Share className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {showComments && <CommentSection post={post} />}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={6}
            placeholder="What's on your mind?"
            className="resize-none"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditPost}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
