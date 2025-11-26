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

    // ============= HANDLE ADD =============
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

    // ============= HANDLE EDIT =============
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

    // ============= HANDLE DELETE =============
    const handleDeleteComment = async (commentId) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;

        try {
            await deleteComment(post._id, commentId, userToken);
            toast.success("Comment deleted successfully");
        } catch (error) {
            toast.error(error.message);
        }
    };

    // ============= DATE FORMAT =============
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // ============= GET AUTHOR ID (string or object) =============
    const getAuthorId = (comment) => {
        if (!comment.author) return null;

        if (typeof comment.author === "string") return comment.author;

        return comment.author._id || comment.author.id;
    };

    // ============= CHECK OWNER =============
    const isOwner = (comment) => {
        const authorId = getAuthorId(comment);
        const myId = userInfo?._id || userInfo?.id;

        return authorId && myId && authorId === myId;
    };

    // ============= GET AUTHOR NAME =============
    const getAuthorName = (comment) => {
        if (typeof comment.author === "object" && comment.author?.name) {
            return comment.author.name;
        }

        if (isOwner(comment) && userInfo?.name) {
            return userInfo.name;
        }

        return "Anonymous";
    };

    // ============= GET AUTHOR AVATAR =============
    const getAuthorAvatar = (comment) => {
        if (typeof comment.author === "object" && comment.author?.avatar) {
            return comment.author.avatar;
        }

        if (isOwner(comment) && userInfo?.avatar) {
            return userInfo.avatar;
        }

        return null;
    };

    return (
        <div className="space-y-4 mt-4">
            {/* Input */}
            <form onSubmit={handleAddComment} className="flex gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={userInfo?.avatar} />
                    <AvatarFallback>
                        {userInfo?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 flex gap-2">
                    <Textarea
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        disabled={isSubmitting}
                        className="min-h-[60px]"
                    />
                    <Button type="submit" size="icon" disabled={!commentText.trim() || isSubmitting}>
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </form>

            {/* Comments */}
            <div className="space-y-4">
                {post.comments?.map((comment) => {
                    const name = getAuthorName(comment);
                    const avatar = getAuthorAvatar(comment);
                    const owner = isOwner(comment);

                    return (
                        <div key={comment._id} className="flex gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={avatar} />
                                <AvatarFallback>
                                    {name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 space-y-1">
                                <div className="bg-secondary rounded-lg p-3">

                                    {/* NAME + DATE + Edit/Delete */}
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-sm">{name}</p>
                                            <span className="text-xs text-muted-foreground">
                                                {formatDate(comment.createdAt)}
                                            </span>
                                        </div>

                                        {owner && (
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

                                    {/* Edit Mode */}
                                    {editingComment === comment._id ? (
                                        <div className="mt-2 space-y-2">
                                            <Textarea
                                                value={editText}
                                                onChange={(e) => setEditText(e.target.value)}
                                            />

                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={() => handleEditComment(comment._id)}>
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
                                        <p className="text-sm mt-2">{comment.text}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty */}
            {post.comments?.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                    <MessageCircle className="w-10 h-10 mx-auto opacity-50" />
                    <p>No comments yet.</p>
                </div>
            )}
        </div>
    );
}
