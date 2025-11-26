"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useCommunityStore } from "@/store/useCommunityStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

export function CreatePostDialog({ onPostCreated }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const { createPost } = useCommunityStore();
  const { userToken } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userToken) {
      toast.error("Please login to create a post");
      return;
    }

    if (!content.trim()) {
      toast.error("Please enter some content");
      return;
    }

    setLoading(true);
    try {
      const postData = { content: content.trim() };
      await createPost(postData, userToken);
      setContent("");
      setOpen(false);
      toast.success("Post created successfully!");
      if (onPostCreated) onPostCreated(); // لو في حاجة خارجية عايزة تعمل تحديث
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(error.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !content.trim()}>
              {loading ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
