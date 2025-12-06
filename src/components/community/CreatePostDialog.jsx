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
import { useTranslation } from "react-i18next";

export function CreatePostDialog({ onPostCreated }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { createPost } = useCommunity();
  const { userToken } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userToken) {
      alert(t('community.toast.pleaseLogin', { action: t('community.createPost').toLowerCase() }));
      return;
    }

    if (!content.trim()) {
      alert(t('community.toast.emptyContent'));
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
        <Button>{t('community.createPost')}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('community.createDialog.title')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder={t('community.createDialog.placeholder')}
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
              {t('community.createDialog.cancel')}
            </Button>
            <Button type="submit" disabled={loading || !content.trim()}>
              {loading ? t('community.createDialog.posting') : t('community.createDialog.post')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
