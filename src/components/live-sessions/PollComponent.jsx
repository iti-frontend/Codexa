'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, BarChart3, Lock } from 'lucide-react';
import liveSessionService from '@/services/liveSessionService';
import { toast } from 'sonner';

export default function PollComponent({ sessionId, poll, isInstructor, onUpdate }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voting, setVoting] = useState(false);
  const [pollData, setPollData] = useState(poll);

  useEffect(() => {
    setPollData(poll);
  }, [poll]);

  const handleVote = async (optionIndex) => {
    if (!pollData.isActive || hasVoted) return;

    try {
      setVoting(true);
      await liveSessionService.votePoll(sessionId, pollData._id, optionIndex);
      
      setSelectedOption(optionIndex);
      setHasVoted(true);
      toast.success('Vote recorded!');

      // Refresh poll results
      const results = await liveSessionService.getPollResults(sessionId, pollData._id);
      setPollData(results.poll);
      
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to vote');
    } finally {
      setVoting(false);
    }
  };

  const handleClosePoll = async () => {
    try {
      await liveSessionService.closePoll(sessionId, pollData._id);
      setPollData({ ...pollData, isActive: false });
      toast.success('Poll closed');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error closing poll:', error);
      toast.error('Failed to close poll');
    }
  };

  const totalVotes = pollData.options?.reduce((sum, opt) => sum + (opt.count || 0), 0) || 0;

  const getPercentage = (count) => {
    if (totalVotes === 0) return 0;
    return Math.round((count / totalVotes) * 100);
  };

  return (
    <Card className={`${!pollData.isActive ? 'opacity-75' : ''} border-2`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={pollData.isActive ? 'default' : 'secondary'}>
                {pollData.isActive ? '🟢 Active' : '🔴 Closed'}
              </Badge>
              {totalVotes > 0 && (
                <Badge variant="outline" className="gap-1">
                  <BarChart3 className="w-3 h-3" />
                  {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg">{pollData.question}</CardTitle>
          </div>
          {isInstructor && pollData.isActive && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleClosePoll}
              className="gap-1"
            >
              <Lock className="w-3 h-3" />
              Close
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {pollData.options?.map((option, index) => {
          const percentage = getPercentage(option.count || 0);
          const isSelected = selectedOption === index;
          const canVote = pollData.isActive && !hasVoted;

          return (
            <div key={index} className="space-y-2">
              <Button
                variant={isSelected ? 'default' : 'outline'}
                className={`w-full justify-between h-auto py-3 px-4 ${
                  canVote ? 'hover:border-primary' : 'cursor-default'
                }`}
                onClick={() => canVote && handleVote(index)}
                disabled={!canVote || voting}
              >
                <span className="flex items-center gap-2">
                  {isSelected && <CheckCircle2 className="w-4 h-4" />}
                  <span className="font-medium">{option.text}</span>
                </span>
                {(hasVoted || !pollData.isActive) && (
                  <span className="text-sm font-semibold">{percentage}%</span>
                )}
              </Button>

              {/* Progress Bar (shown after voting or if poll is closed) */}
              {(hasVoted || !pollData.isActive) && (
                <div className="space-y-1">
                  <Progress value={percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground text-right">
                    {option.count || 0} {option.count === 1 ? 'vote' : 'votes'}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {/* Status Messages */}
        {!pollData.isActive && (
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-sm text-muted-foreground">This poll has been closed</p>
          </div>
        )}
        {pollData.isActive && !hasVoted && (
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <p className="text-sm font-medium text-primary">Select an option to vote</p>
          </div>
        )}
        {hasVoted && pollData.isActive && (
          <div className="bg-green-500/10 rounded-lg p-3 text-center">
            <p className="text-sm font-medium text-green-600 dark:text-green-400">
              ✓ Your vote has been recorded
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
