'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Reply, Edit2, Trash2, X, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import liveSessionService from '@/services/liveSessionService';
import { toast } from 'sonner';
import { format } from 'date-fns';

import { useHMSActions, useHMSNotifications, HMSNotificationTypes } from "@100mslive/react-sdk";

export default function ChatComponent({ sessionId, initialComments = [], currentUser }) {
  const [comments, setComments] = useState(initialComments);
  const [newMessage, setNewMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState(null); // commentId
  const [editingComment, setEditingComment] = useState(null); // { id, text, isReply, parentId }
  const scrollRef = useRef(null);

  const hmsActions = useHMSActions();
  const notification = useHMSNotifications();

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments]);

  // Listen for Real-time Messages (100ms Broadcast)
  useEffect(() => {
    if (!notification) return;

    if (notification.type === HMSNotificationTypes.NEW_MESSAGE) {
      // notification.data.message contains the string we sent
      try {
        const data = JSON.parse(notification.data.message);
        
        if (data.type === 'NEW_COMMENT' && data.payload) {
             setComments(prev => {
                 // Avoid duplicates
                 if (prev.find(c => c._id === data.payload._id)) return prev;
                 return [...prev, data.payload];
             });
        } else if (data.type === 'NEW_REPLY' && data.payload && data.parentId) {
             setComments(prev => prev.map(c => {
                 if (c._id === data.parentId) {
                     // Avoid duplicates in replies
                     if (c.replies.find(r => r._id === data.payload._id)) return c;
                     return { ...c, replies: [...c.replies, data.payload] };
                 }
                 return c;
             }));
        }
      } catch (err) {
        // Ignore non-JSON messages or other formats
        console.log("Received non-JSON broadcast:", notification.data.message);
      }
    }
  }, [notification]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      if (replyingTo) {
        // Send Reply
        const reply = await liveSessionService.replyToComment(sessionId, replyingTo, newMessage);
        setComments((prev) =>
          prev.map((c) =>
            c._id === replyingTo ? { ...c, replies: [...c.replies, reply] } : c
          )
        );
        
        // Broadcast Reply
        await hmsActions.sendBroadcastMessage(JSON.stringify({
            type: 'NEW_REPLY',
            parentId: replyingTo,
            payload: reply
        }));

        setReplyingTo(null);
      } else if (editingComment) {
         // Edit Comment Logic (Skipping broadcast for edit for simplicity as discussed, can be added if needed)
         await liveSessionService.editComment(sessionId, editingComment.id, newMessage);
         
         if (editingComment.isReply) {
             setComments(prev => prev.map(c => {
                 if (c._id === editingComment.parentId) {
                     return {
                         ...c,
                         replies: c.replies.map(r => r._id === editingComment.id ? { ...r, text: newMessage } : r)
                     };
                 }
                 return c;
             }));
         } else {
             setComments(prev => prev.map(c => c._id === editingComment.id ? { ...c, text: newMessage } : c));
         }
         setEditingComment(null);

      } else {
        // Send New Comment
        const comment = await liveSessionService.addComment(sessionId, newMessage);
        setComments((prev) => [...prev, comment]);
        
        // Broadcast New Comment
        await hmsActions.sendBroadcastMessage(JSON.stringify({
            type: 'NEW_COMMENT',
            payload: comment
        }));
      }
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
      console.error(error);
    }
  };

  const handleDelete = async (commentId, isReply = false, parentId = null) => {
      if(!confirm("Are you sure you want to delete this message?")) return;

      try {
          await liveSessionService.deleteComment(sessionId, commentId);
          // Optimistic update locally
          if (isReply) {
              setComments(prev => prev.map(c => {
                  if (c._id === parentId) {
                      return {
                          ...c,
                          replies: c.replies.filter(r => r._id !== commentId)
                      };
                  }
                  return c;
              }));
          } else {
              setComments(prev => prev.filter(c => c._id !== commentId));
          }
          toast.success("Message deleted");
      } catch (error) {
          toast.error("Failed to delete message");
      }
  };

  const startReply = (comment) => {
      setReplyingTo(comment._id);
      setEditingComment(null);
      setNewMessage(`@${comment.userName} `);
      // Focus input
      document.getElementById('chat-input')?.focus();
  };

  const startEdit = (item, isReply = false, parentId = null) => {
      setEditingComment({ id: item._id, text: item.text, isReply, parentId });
      setReplyingTo(null);
      setNewMessage(item.text);
      document.getElementById('chat-input')?.focus();
  };

  const cancelAction = () => {
      setReplyingTo(null);
      setEditingComment(null);
      setNewMessage('');
  };

  const renderMessage = (item, isReply = false, parentId = null) => {
      const isMe = currentUser?._id === item.user || currentUser?._id === item.user?._id; 
      const isAdmin = currentUser?.role === 'admin';
      const canDelete = isMe || isAdmin;

      return (
        <div key={item._id} className={`flex gap-3 mb-4 ${isReply ? 'ml-8 mt-2' : ''}`}>
          <Avatar className="w-8 h-8">
            <AvatarImage src={item.userImage} />
            <AvatarFallback>{item.userName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{item.userName}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(item.createdAt), 'hh:mm a')}
                </span>
                {item.userType === 'Instructor' && (
                    <span className="bg-primary/10 text-primary text-[10px] px-1 rounded">Instructor</span>
                )}
              </div>
              
              {/* Actions Dropdown */}
              {(canDelete || !isReply) && ( 
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!isReply && (
                          <DropdownMenuItem onClick={() => startReply(item)}>
                            <Reply className="w-3 h-3 mr-2" /> Reply
                          </DropdownMenuItem>
                      )}
                      {isMe && (
                          <DropdownMenuItem onClick={() => startEdit(item, isReply, parentId)}>
                            <Edit2 className="w-3 h-3 mr-2" /> Edit
                          </DropdownMenuItem>
                      )}
                      {canDelete && (
                          <DropdownMenuItem onClick={() => handleDelete(item._id, isReply, parentId)} className="text-destructive">
                            <Trash2 className="w-3 h-3 mr-2" /> Delete
                          </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
              )}
            </div>
            
            <p className="text-sm mt-1 break-words">{item.text}</p>
          </div>
        </div>
      );
  };

  return (
    <div className="flex flex-col h-full bg-card border rounded-lg overflow-hidden">
      <div className="p-3 border-b bg-muted/50 font-semibold">
        Live Chat
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {comments.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm py-10">
                  No messages yet. Start the conversation!
              </div>
          ) : (
              comments.map((comment) => (
                  <div key={comment._id}>
                      {renderMessage(comment)}
                      {comment.replies?.map((reply) => renderMessage(reply, true, comment._id))}
                  </div>
              ))
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-3 border-t bg-background">
        {replyingTo && (
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2 bg-muted p-2 rounded">
                <span>Replying to message...</span>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={cancelAction}>
                    <X className="w-3 h-3" />
                </Button>
            </div>
        )}
        {editingComment && (
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2 bg-muted p-2 rounded">
                <span>Editing message...</span>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={cancelAction}>
                    <X className="w-3 h-3" />
                </Button>
            </div>
        )}
        
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            id="chat-input"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={replyingTo ? "Type your reply..." : "Type a message..."}
            className="flex-1"
            autoComplete="off"
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
