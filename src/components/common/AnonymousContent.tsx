import React, { useState } from 'react';
import { useAnonymous } from '@/hooks/useAnonymous';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';

interface AnonymousContentProps {
  onSubmit: (content: string, isAnonymous: boolean) => Promise<void>;
  placeholder?: string;
  className?: string;
  title?: string;
  buttonText?: string;
  maxLength?: number;
  minLength?: number;
  additionalFields?: React.ReactNode;
  showDialog?: boolean;
}

export const AnonymousContent: React.FC<AnonymousContentProps> = ({
  onSubmit,
  placeholder = 'Write your content...',
  className = '',
  title = 'Create Post',
  buttonText = 'Post',
  maxLength = 2000,
  minLength = 10,
  additionalFields,
  showDialog = false
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const {
    isAnonymous,
    anonymousName,
    loading,
    error,
    setIsAnonymous
  } = useAnonymous();

  const handleSubmit = async () => {
    if (!content.trim() || content.length < minLength) return;
    
    if (isAnonymous && !showConfirmDialog) {
      setShowConfirmDialog(true);
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(content, isAnonymous);
      setContent('');
      setShowConfirmDialog(false);
    } catch (err) {
      console.error('Error posting content:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const MainContent = () => (
    <div className="space-y-4">
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
        <label htmlFor="anonymous-mode" className="text-sm text-gray-600">
          Post Anonymously {isAnonymous && anonymousName ? `as ${anonymousName}` : ''}
        </label>
      </div>

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={4}
        maxLength={maxLength}
        className="w-full resize-none"
      />

      {additionalFields}

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {content.length}/{maxLength} characters
        </span>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || content.length < minLength}
          className="ml-auto"
        >
          {isSubmitting ? <Spinner /> : buttonText}
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return <div className="flex justify-center p-4"><Spinner /></div>;
  }

  if (showDialog) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>{buttonText}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <MainContent />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className={cn('p-4 border rounded-lg', className)}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <MainContent />
    </div>
  );
};