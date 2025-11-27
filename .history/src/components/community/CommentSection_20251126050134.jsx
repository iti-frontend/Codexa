// components/community/CommentSection.jsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { useCommunityStore } from "@/store/useCommunityStore";
import { useAuthStore } from "@/store/useAuthStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function CommentSection({ post }) {
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const { addComment, editComment, deleteComment } = useCommunityStore();
  const { userToken, userInfo } = useAuthStore();

  const postId = post._id || post.id;

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!userToken) return toast.error("Please login to comment");
    if (!newComment.trim()) return toast.error("Please enter a comment");

    try {
      await addComment(postId, newComment.trim(), userToken);
      setNewComment("");
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error(error.message);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;

    try {
      await editComment(postId, commentId, editText.trim(), userToken);
      setEditingComment(null);
      setEditText("");
      toast.success("Comment updated successfully");
    } catch (error) {
      console.error("Error editing comment:", error);
      toast.error(error.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      await deleteComment(postId, commentId, userToken);
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error(error.message);
    }
  };

  const startEditing = (comment) => {
    setEditingComment(comment._id);
    setEditText(comment.text || comment.content);
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setEditText("");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getUserName = (author) => {
    if (!author) return "Anonymous";
    if (author.name) return author.name;
    if (author.displayName) return author.displayName;
    if (author.email) return author.email.split("@")[0];
    return "Anonymous";
  };

  const getUserAvatar = (author) => {
    if (!author) return null;
    return author.avatar || null;
  };

  const isCommentOwner = (comment) => {
    if (!userInfo || !comment.author) return false;
    const authorId = typeof comment.author === "string"
      ? comment.author
      : comment.author._id || comment.author.id;
    const userId = userInfo._id || userInfo.id;
    return authorId === userId;
  };

  return (
    <div className="space-y-4">
      {/* إضافة كومنت جديد */}
      <form onSubmit={handleSubmitComment} className="flex gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={userInfo?.avatar} alt={userInfo?.name} />
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            {userInfo?.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 flex gap-2">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[60px] resize-none flex-1"
            disabled={!userToken}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!newComment.trim() || !userToken}
            className="h-[60px]"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>

      {/* قائمة الكومنتات */}
      <div className="space-y-3">
        {post.comments?.map((comment) => (
          <div key={comment._id} className="flex gap-3 group">
            <Avatar className="h-8 w-8">
              <AvatarImage src={getUserAvatar(comment.author)} alt={getUserName(comment.author)} />
              <AvatarFallback className="bg-secondary text-xs">
                {getUserName(comment.author).charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{getUserName(comment.author)}</p>
                    <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                  </div>

                  {isCommentOwner(comment) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem onClick={() => startEditing(comment)}>
                          <Edit className="w-3 h-3 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-3 h-3 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {editingComment === comment._id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="resize-none"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleEditComment(comment._id)}>Save</Button>
                      <Button size="sm" variant="outline" onClick={cancelEditing}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm">{comment.content || comment.text}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {!post.comments || post.comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        ) : null}
      </div>
    </div>
  );
}
