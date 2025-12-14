'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import liveSessionService from '@/services/liveSessionService';
import SessionForm from '@/components/live-sessions/SessionForm';
import { toast } from 'sonner';

export default function EditSessionPage() {
  const router = useRouter();
  const params = useParams();
  const editId = params.id;
  const isEditMode = true;

  const [loadingSession, setLoadingSession] = useState(false);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (!editId) return;

    const fetchSession = async () => {
      try {
        setLoadingSession(true);
        const session = await liveSessionService.getSession(editId);
        setInitialData(session);
      } catch (error) {
        console.error('Error fetching session:', error);
        toast.error('Failed to load session data');
        router.push('/live-sessions');
      } finally {
        setLoadingSession(false);
      }
    };

    fetchSession();
  }, [editId, router]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button asChild variant="ghost" className="mb-6">
        <Link href={`/live-sessions/${editId}`}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Session
        </Link>
      </Button>

      {loadingSession ? (
        <Card className="border-2">
          <CardContent className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary mr-3" />
            <span className="text-lg">Loading session data...</span>
          </CardContent>
        </Card>
      ) : (
        <SessionForm initialData={initialData} isEditMode={isEditMode} />
      )}
    </div>
  );
}
