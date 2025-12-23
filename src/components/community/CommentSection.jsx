"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Send, Edit, Trash2 } from "lucide-react";
import { useCommunityStore } from "@/store/useCommunityStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function CommentSection({ post }) {
  const { t } = useTranslation();

  /* -------------------- local state -------------------- */
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* -------------------- stores -------------------- */
  const { addComment, editComment, deleteComment } = useCommunityStore();
  const { userToken, userInfo } = useAuthStore();

  /* -------------------- helpers -------------------- */
  const getId = (val) => {
    if (!val) return null;
    if (typeof val === "string") return val;
    return val._id || val.id || null;
  };

  const isOwner = (commentUser) => {
    const commentUserId = getId(commentUser);
    const currentUserId = getId(userInfo);
    if (!commentUserId || !currentUserId) return false;
    return commentUserId.toString() === currentUserId.toString();
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  /* -------------------- handlers -------------------- */
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment(post._id, commentText, userToken);
      setCommentText("");
      toast.success(t("community.toast.commentAdded"));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;

    setIsSubmitting(true);
    try {
      await editComment(post._id, commentId, editText, userToken);
      setEditingCommentId(null);
      setEditText("");
      toast.success(t("community.toast.commentUpdated"));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm(t("community.comments.deleteConfirm"))) return;

    try {
      await deleteComment(post._id, commentId, userToken);
      toast.success(t("community.toast.commentDeleted"));
    } catch (err) {
      toast.error(err.message);
    }
  };

  /* -------------------- render -------------------- */
  return (
    <div className="space-y-4 mt-4">
      {/* Add Comment */}
      <form onSubmit={handleAddComment} className="flex gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={userInfo?.profileImage} />
          <AvatarFallback className="text-xs">
            {userInfo?.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 flex gap-2">
          <Textarea
            placeholder={t("community.comments.addComment")}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="min-h-[60px] resize-none"
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!commentText.trim() || isSubmitting}
            className="h-[60px]"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {post.comments?.map((comment) => (
          <div key={comment._id} className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.user?.profileImage} />
              <AvatarFallback className="text-xs">
                {comment.user?.name?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
              <div className="bg-secondary rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="font-semibold text-sm">
                      {comment.user?.name || t("community.post.anonymous")}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>

                  {/* Edit / Delete (OWNER ONLY) */}
                  {isOwner(comment.user) && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => {
                          setEditingCommentId(comment._id);
                          setEditText(comment.text);
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive"
                        onClick={() => handleDeleteComment(comment._id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>

                {editingCommentId === comment._id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="min-h-[60px]"
                      disabled={isSubmitting}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleEditComment(comment._id)}
                        disabled={isSubmitting}
                      >
                        {t("community.comments.save")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditText("");
                        }}
                      >
                        {t("community.comments.cancel")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm">{comment.text}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {post.comments?.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">
            {t("community.comments.noComments")}
          </p>
        </div>
      )}
    </div>
  );
}
