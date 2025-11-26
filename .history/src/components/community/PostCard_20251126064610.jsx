"use client";
import { useState } from "react";
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

  const isPostOwner = () => {
    if (!userInfo || !post.author) return false;
    const authorId = typeof post.author === 'string' ? post.author : (post.author._id || post.author.id);
    const userId = userInfo._id || userInfo.id;
    return authorId === userId;
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

  const authorName = post.author?.name || "Anonymous";
  const authorAvatar = post.author?.avatar || null;
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
                <p className="text-sm text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{post.type}</Badge>
              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
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
          <div className="flex items-center space-x-4 text-muted-foreground">
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <Heart className="w-4 h-4" /> <span>{post.likes?.length || 0}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center space-x-2" onClick={() => setShowComments(!showComments)}>
              <MessageCircle className="w-4 h-4" /> <span>{post.comments?.length || 0}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center space-x-2" onClick={handleShare}>
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
          <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={6} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditPost}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
