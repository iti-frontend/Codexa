// components/community/CommentSection.jsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Send, Edit, Trash2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCommunityStore } from "@/store/useCommunityStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

export function CommentSection({ post }) {
    const [commentText, setCommentText] = useState("");
    const [editingComment, setEditingComment] = useState(null);
    const [editText, setEditText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { addComment, editComment, deleteComment } = useCommunityStore();
    const { userToken, user } = useAuthStore();

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

    // دالة التحقق من المالك المظبوطة
    const isCommentOwner = (comment) => {
        if (!user || !comment.user) return false;
        
        return comment.user.userId === user.uid || 
               comment.userId === user.uid ||
               comment.user._id === user.uid;
    };

    // دالة استخراج اسم المستخدم المظبوطة
    const getUserName = (commentUser) => {
        if (!commentUser) return 'Anonymous User';
        
        if (commentUser.name && commentUser.name !== 'Anonymous User' && commentUser.name !== 'User') {
            return commentUser.name;
        }
        
        if (commentUser.email) {
            return commentUser.email.split('@')[0];
        }
        
        if (commentUser.displayName) {
            return commentUser.displayName;
        }
        
        return 'Anonymous User';
    };

    const getUserAvatar = (commentUser) => {
        if (commentUser && commentUser.avatar) {
            return commentUser.avatar;
        }
        
        if (commentUser && commentUser.photoURL) {
            return commentUser.photoURL;
        }
        
        return null;
    };

    return (
        <div className="space-y-4 mt-4">
            {/* نموذج إضافة كومنت جديد */}
            <form onSubmit={handleAddComment} className="flex gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photoURL} alt={user?.displayName} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
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

            {/* قائمة الكومنتات */}
            <div className="space-y-4">
                {post.comments?.map((comment) => {
                    const isMyComment = isCommentOwner(comment);
                    const authorName = getUserName(comment.user);
                    const authorAvatar = getUserAvatar(comment.user);

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
                                        
                                        {/* أزرار التحكم - للمالك فقط */}
                                        {isMyComment && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                                        <MoreHorizontal className="w-3 h-3" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-32">
                                                    <DropdownMenuItem 
                                                        onClick={() => {
                                                            setEditingComment(comment._id);
                                                            setEditText(comment.content || comment.text);
                                                        }}
                                                        className="cursor-pointer"
                                                    >
                                                        <Edit className="w-3 h-3 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        onClick={() => handleDeleteComment(comment._id)}
                                                        className="text-destructive focus:text-destructive cursor-pointer"
                                                    >
                                                        <Trash2 className="w-3 h-3 mr-2" />
                                                        Delete
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
                                        <p className="text-sm">{comment.content || comment.text}</p>
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