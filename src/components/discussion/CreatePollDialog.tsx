
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

interface CreatePollDialogProps {
  onCreatePoll: (pollData: {
    question: string;
    options: string[];
    expiresInDays?: number;
  }) => void;
}

export const CreatePollDialog = ({ onCreatePoll }: CreatePollDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [expiresInDays, setExpiresInDays] = useState(7);

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      toast.error('Please provide at least 2 options');
      return;
    }

    onCreatePoll({
      question: question.trim(),
      options: validOptions,
      expiresInDays
    });

    // Reset form
    setQuestion('');
    setOptions(['', '']);
    setExpiresInDays(7);
    setIsOpen(false);
    toast.success('Poll created successfully!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Create Poll
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a Poll</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What would you like to ask?"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Options</Label>
            <div className="space-y-2 mt-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeOption(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {options.length < 6 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Option
              </Button>
            )}
          </div>

          <div>
            <Label htmlFor="expires">Expires in (days)</Label>
            <Input
              id="expires"
              type="number"
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(Number(e.target.value))}
              min="1"
              max="30"
              className="mt-1"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSubmit} className="flex-1">
              Create Poll
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
