"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Heart,
  Share,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
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
import { useTranslation } from "react-i18next";

export function PostCard({ post }) {
  const { t } = useTranslation();

  /* -------------------- local UI state -------------------- */
  const [showComments, setShowComments] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editContent, setEditContent] = useState(post.content || "");
  const [isDeleting, setIsDeleting] = useState(false);

  /* -------------------- stores (BEST PRACTICE) -------------------- */
  const toggleLike = useCommunityStore((s) => s.toggleLike);
  const editPost = useCommunityStore((s) => s.editPost);
  const deletePost = useCommunityStore((s) => s.deletePost);

  const userToken = useAuthStore((s) => s.userToken);
  const userInfo = useAuthStore((s) => s.userInfo);


  /* -------------------- derived values -------------------- */
  const currentUserId = userInfo?._id;

  const isLiked = post.likes?.some((like) => {
    const likedUserId =
      typeof like.user === "object"
        ? String(like.user._id || like.user)
        : String(like.user);

    return likedUserId === currentUserId;
  });

  const likesCount = post.likes?.length || 0;
  const commentsCount = post.comments?.length || 0;

  const isOwner = useMemo(() => {
    if (!userInfo || !post.author) return false;
    const authorId =
      typeof post.author === "string"
        ? post.author
        : post.author._id;
    return authorId?.toString() === currentUserId?.toString();
  }, [userInfo, post.author, currentUserId]);

  const authorName =
    typeof post.author === "object" && post.author?.name
      ? post.author.name
      : t("community.post.anonymous");

  const authorAvatar =
    typeof post.author === "object" ? post.author?.profileImage : null;

  /* -------------------- handlers -------------------- */
  const handleLike = async () => {
    if (!userToken) {
      toast.error(t("community.toast.pleaseLogin"));
      return;
    }
    try {
      await toggleLike(post._id, userToken);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEditPost = async () => {
    if (!editContent.trim()) {
      toast.error(t("community.toast.emptyContent"));
      return;
    }
    try {
      await editPost(post._id, { content: editContent }, userToken);
      setIsEditDialogOpen(false);
      toast.success(t("community.toast.postUpdated"));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm(t("community.post.deleteConfirm"))) return;
    setIsDeleting(true);
    try {
      await deletePost(post._id, userToken);
      toast.success(t("community.toast.postDeleted"));
    } catch (err) {
      toast.error(err.message);
      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    const postUrl = `${window.location.origin}/community/${post._id}`;
    navigator.clipboard.writeText(postUrl);
    toast.success(t("community.toast.linkCopied"));
  };

  /* -------------------- render -------------------- */
  return (
    <>
      <Card className="border-border hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={authorAvatar} />
                <AvatarFallback>
                  {authorName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{authorName}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

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
                    {t("community.post.editPost")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDeletePost}
                    disabled={isDeleting}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t("community.post.deletePost")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="whitespace-pre-wrap">{post.content}</p>

          <div className="flex gap-6 pt-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                "flex items-center gap-2",
                isLiked
                  ? "text-red-500 hover:text-red-600"
                  : "text-muted-foreground hover:text-red-500"
              )}
            >
              <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
              {likesCount}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments((v) => !v)}
              className={cn(showComments && "text-primary")}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {commentsCount}
            </Button>

            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share className="w-4 h-4" />
            </Button>
          </div>

          {showComments && <CommentSection post={post} />}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("community.post.editPost")}</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={6}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              {t("community.post.cancel")}
            </Button>
            <Button onClick={handleEditPost}>
              {t("community.post.saveChanges")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
