// components/community/CommentSection.jsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Send, Edit, Trash2 } from "lucide-react";
import { useCommunityStore } from "@/store/useCommunityStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

export function CommentSection({ post }) {
    const [commentText, setCommentText] = useState("");
    const [editingComment, setEditingComment] = useState(null);
    const [editText, setEditText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { addComment, editComment, deleteComment } = useCommunityStore();
    const { userToken, userInfo } = useAuthStore();

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setIsSubmitting(true);
        try {
            await addComment(post._id, commentText, userToken);
            setCommentText("");
            toast.success("Comment added successfully");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditComment = async (commentId) => {
        if (!editText.trim()) return;

        setIsSubmitting(true);
        try {
            await editComment(post._id, commentId, editText, userToken);
            setEditingComment(null);
            setEditText("");
            toast.success("Comment updated successfully");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;

        try {
            await deleteComment(post._id, commentId, userToken);
            toast.success("Comment deleted successfully");
        } catch (error) {
            toast.error(error.message);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Check if current user is comment owner
    const isCommentOwner = (comment) => {
        if (!userInfo || !comment.author) return false;
        
        const commentAuthorId = typeof comment.author === 'string' 
            ? comment.author 
            : (comment.author._id || comment.author.id);
        
        const userId = userInfo._id || userInfo.id;
        
        return commentAuthorId === userId;
    };

    // Get author name
    const getAuthorName = (comment) => {
        // Priority 1: If author is populated object with name
        if (comment.author && typeof comment.author === 'object' && comment.author.name) {
            return comment.author.name;
        }

        // Priority 2: If it's current user's comment
        if (isCommentOwner(comment) && userInfo?.name) {
            return userInfo.name;
        }

        // Priority 3: Fallback
        return "Anonymous";
    };

    // Get author avatar
    const getAuthorAvatar = (comment) => {
        // If author is populated with avatar
        if (comment.author && typeof comment.author === 'object' && comment.author.avatar) {
            return comment.author.avatar;
        }

        // If it's current user's comment
        if (isCommentOwner(comment) && userInfo?.avatar) {
            return userInfo.avatar;
        }

        return null;
    };

    return (
        <div className="space-y-4 mt-4">
            {/* Comment Input */}
            <form onSubmit={handleAddComment} className="flex gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={userInfo?.avatar} alt={userInfo?.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {userInfo?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                    <Textarea
                        placeholder="Write a comment..."
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
                {post.comments?.map((comment) => {
                    const authorName = getAuthorName(comment);
                    const authorAvatar = getAuthorAvatar(comment);
                    const isMyComment = isCommentOwner(comment);

                    return (
                        <div key={comment._id} className="flex gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={authorAvatar} alt={authorName} />
                                <AvatarFallback className="bg-secondary text-xs">
                                    {authorName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <div className="bg-secondary rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <div>
                                            <p className="font-semibold text-sm">
                                                {authorName}
                                            </p>
                                            <span className="text-xs text-muted-foreground">
                                                {formatDate(comment.createdAt)}
                                            </span>
                                        </div>
                                        {/* Edit/Delete buttons - Only for comment owner */}
                                        {isMyComment && (
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() => {
                                                        setEditingComment(comment._id);
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
                                    {editingComment === comment._id ? (
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
                                                    Save
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setEditingComment(null);
                                                        setEditText("");
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm">{comment.text}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {post.comments?.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No comments yet. Be the first to comment!</p>
                </div>
            )}
        </div>
    );
}