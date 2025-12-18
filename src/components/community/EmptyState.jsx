// components/community/EmptyState.js
"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export function EmptyState({ onCreatePost }) {
  const { t } = useTranslation();

  return (
    <Card className="border-border text-center py-12">
      <CardContent>
        <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          {t('community.emptyState.title')}
        </h3>
        <p className="text-muted-foreground mb-4">
          {t('community.emptyState.message')}
        </p>
        <Button onClick={onCreatePost}>{t('community.emptyState.button')}</Button>
      </CardContent>
    </Card>
  );
}
