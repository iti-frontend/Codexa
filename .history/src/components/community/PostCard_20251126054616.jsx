// components/community/PostCard.jsx
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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

  const { toggleLike, editPost, deletePost } = useCommunityStore();
  const { userToken, userInfo } = useAuthStore();

  const isOwner = () => {
    if (!userInfo || !post.user) return false;
    return post.user.userId === userInfo?.uid;
  };

  const handleLike = async () => {
    if (!userToken) {
      toast.error("Please login to like posts");
      return;
    }
    try {
      await toggleLike(post._id, userToken);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const authorName = post.user?.name || "Anonymous";
  const authorAvatar = post.user?.avatar || null;

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
            {isOwner() && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                    <Edit className="w-4 h-4 mr-2" /> Edit Post
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => deletePost(post._id, userToken)} className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
          {post.image && <img src={post.image} alt="Post image" className="rounded-lg w-full object-cover max-h-96" />}

          <div className="flex items-center space-x-4 pt-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn("flex items-center space-x-2 text-muted-foreground")}
            >
              <Heart className="w-4 h-4" />
              <span>{post.likes?.length || 0}</span>
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
            <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-muted-foreground">
              <Share className="w-4 h-4" />
            </Button>
          </div>

          {showComments && <CommentSection post={post} />}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={6} className="resize-none" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => editPost(post._id, { content: editContent }, userToken)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
