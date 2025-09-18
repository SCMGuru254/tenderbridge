import React, { useState } from 'react';
import { useAnonymous } from '@/hooks/useAnonymous';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '@/components/ui/alert';

interface AnonymousPostProps {
  type: 'review' | 'comment' | 'discussion';
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
  className?: string;
}

export const AnonymousPost: React.FC<AnonymousPostProps> = ({
  type,
  onSubmit,
  placeholder = 'Write your content...',
  className = ''
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    isAnonymous,
    anonymousName,
    loading,
    error,
    setIsAnonymous,
    postAnonymously
  } = useAnonymous();

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      await postAnonymously(content, type);
      setContent('');
      onSubmit(content);
    } catch (err) {
      console.error('Error posting content:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}
      
      <div className="flex items-center space-x-2">
        <Switch
          checked={isAnonymous}
          onCheckedChange={setIsAnonymous}
          id="anonymous-mode"
        />
        <label htmlFor="anonymous-mode">
          Post Anonymously {isAnonymous && anonymousName ? `as ${anonymousName}` : ''}
        </label>
      </div>

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full"
      />

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || !content.trim()}
      >
        {isSubmitting ? 'Posting...' : 'Post'}
      </Button>
    </div>
  );
};