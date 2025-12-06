
"use client";
import { useCommunity } from "@/hooks/useCommunity";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { CreatePostDialog } from "@/components/community/CreatePostDialog";
import { PostCard } from "@/components/community/PostCard";
import { PostSkeleton } from "@/components/community/PostSkeleton";
import { EmptyState } from "@/components/community/EmptyState";
import { useTranslation } from "react-i18next";

export default function Community() {
  const { t } = useTranslation();
  const { posts, loading, error, refetch, likePost } = useCommunity();

  const handlePostCreated = () => {
    refetch();
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="border border-destructive rounded-lg p-6 text-center">
          <p className="text-destructive mb-4">
            {t('community.errorLoading')}: {error}
          </p>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('community.tryAgain')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {t('community.title')}
        </h1>
        <div className="flex items-center gap-2">
          <Button onClick={refetch} disabled={loading} variant="outline">
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            {t('community.refresh')}
          </Button>
          <CreatePostDialog onPostCreated={handlePostCreated} />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          onCreatePost={() =>
            document.querySelector('[data-testid="create-post"]')?.click()
          }
        />
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onLike={likePost}
            />
          ))}
        </div>
      )}
    </div>
  );
}