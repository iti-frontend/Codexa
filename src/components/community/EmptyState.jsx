// components/community/EmptyState.js
"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export function EmptyState({ onCreatePost }) {
  return (
    <Card className="border-border text-center py-12">
      <CardContent>
        <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          No posts yet
        </h3>
        <p className="text-muted-foreground mb-4">
          Be the first to share something with the community!
        </p>
        <Button onClick={onCreatePost}>Create Post</Button>
      </CardContent>
    </Card>
  );
}
