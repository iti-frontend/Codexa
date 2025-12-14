'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Loader2, ListPlus } from 'lucide-react';
import liveSessionService from '@/services/liveSessionService';
import { toast } from 'sonner';

export default function CreatePollComponent({ sessionId, onPollCreated }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    if (options.length <= 2) {
      toast.error('Poll must have at least 2 options');
      return;
    }
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      toast.error('Question is required');
      return;
    }
    if (options.some(opt => !opt.trim())) {
      toast.error('All options must be filled');
      return;
    }

    try {
      setLoading(true);
      await liveSessionService.createPoll(sessionId, {
        question,
        options
      });
      
      toast.success('Poll created successfully');
      setQuestion('');
      setOptions(['', '']);
      setIsOpen(false);
      if (onPollCreated) onPollCreated();
    } catch (error) {
      console.error('Error creating poll:', error);
      toast.error('Failed to create poll');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="w-full gap-2 mb-4">
        <ListPlus className="w-4 h-4" />
        Create New Poll
      </Button>
    );
  }

  return (
    <Card className="mb-4 bg-muted/30">
      <CardHeader className="py-3">
        <CardTitle className="text-base flex items-center justify-between">
          Create Poll
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>Cancel</Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Question</Label>
            <Input 
              placeholder="Ask a question..." 
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Options</Label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveOption(index)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddOption}
              className="w-full gap-1"
            >
              <Plus className="w-3 h-3" /> Add Option
            </Button>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Launch Poll'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
