// components/community/CommentSection.js
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCommunityStore } from "@/store/useCommunityStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Send, Edit, Trash2 } from "lucide-react";

export function CommentSection({ post, postId }) {
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const { addComment, editComment, deleteComment } = useCommunityStore();
  const { userToken, user } = useAuthStore();

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!userToken) {
      alert("Please login to comment");
      return;
    }

    if (!newComment.trim()) {
      alert("Please enter a comment");
      return;
    }

    try {
      await addComment(postId, newComment.trim(), userToken);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert(error.message);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;

    try {
      await editComment(postId, commentId, editText.trim(), userToken);
      setEditingComment(null);
      setEditText("");
    } catch (error) {
      console.error("Error editing comment:", error);
      alert(error.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      await deleteComment(postId, commentId, userToken);
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert(error.message);
    }
  };

  const startEditing = (comment) => {
    setEditingComment(comment._id);
    setEditText(comment.content || comment.text);
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setEditText("");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // دالة لاستخراج اسم المستخدم
  const getUserName = (commentUser) => {
    if (!commentUser) return 'Anonymous User';
    
    // إذا كان الاسم موجود مباشرة
    if (commentUser.name && commentUser.name !== 'Anonymous User') {
      return commentUser.name;
    }
    
    // إذا كان الإيميل موجود
    if (commentUser.email) {
      return commentUser.email.split('@')[0];
    }
    
    // إذا كان فيه displayName من Firebase
    if (commentUser.displayName) {
      return commentUser.displayName;
    }
    
    return 'User';
  };

  // التحقق إذا كان الكومنت ملك للمستخدم الحالي
  const isCommentOwner = (comment) => {
    if (!user || !comment.user) return false;
    
    return comment.user.userId === user.uid || 
           comment.userId === user.uid ||
           comment.user._id === user.uid;
  };

  return (
    <div className="space-y-4">
      {/* نموذج إضافة كومنت جديد */}
      <form onSubmit={handleSubmitComment} className="flex gap-2">
        <Textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 resize-none"
          rows={1}
        />
        <Button 
          type="submit" 
          size="sm" 
          disabled={!newComment.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>

      {/* قائمة الكومنتات */}
      <div className="space-y-3">
        {post.comments?.map((comment) => (
          <div key={comment._id} className="flex gap-3 group">
            {/* صورة المستخدم */}
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-medium">
                {getUserName(comment.user)?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            
            {/* محتوى الكومنت */}
            <div className="flex-1">
              <div className="bg-muted/50 rounded-lg p-3">
                {/* معلومات المستخدم والتاريخ */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">
                      {getUserName(comment.user)}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  
                  {/* أزرار التحكم للكومنت */}
                  {isCommentOwner(comment) && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {editingComment === comment._id ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditComment(comment._id)}
                            className="h-6 px-2"
                          >
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={cancelEditing}
                            className="h-6 px-2"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditing(comment)}
                            className="h-6 px-2"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComment(comment._id)}
                            className="h-6 px-2 text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                
                {/* نص الكومنت */}
                {editingComment === comment._id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="resize-none"
                      rows={2}
                    />
                  </div>
                ) : (
                  <p className="text-sm">{comment.content || comment.text}</p>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {(!post.comments || post.comments.length === 0) && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
}