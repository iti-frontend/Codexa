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
import { useCommunity } from "@/hooks/useCommunity";
import { useAuthStore } from "@/store/useAuthStore";

export function CreatePostDialog({ onPostCreated }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { createPost } = useCommunity();
  const { userToken } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userToken) {
      alert("Please login to create a post");
      return;
    }

    if (!content.trim()) {
      alert("Please enter some content");
      return;
    }

    try {
      setLoading(true);
      await createPost(content.trim());
      setContent("");
      setOpen(false);
      onPostCreated();
    } catch (error) {
      console.error("Error creating post:", error);
      alert(error.message);
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
