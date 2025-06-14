
import React, { useState } from 'react';
import { useSharing } from '@/hooks/useSharing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface ReferralFormProps {
  jobId?: string;
}

export const ReferralForm: React.FC<ReferralFormProps> = ({ jobId }) => {
  const { createReferral, loading } = useSharing();
  const [formData, setFormData] = useState({
    referee_email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.referee_email.trim()) {
      toast.error('Email is required');
      return;
    }

    const result = await createReferral({
      job_id: jobId || '',
      referee_email: formData.referee_email,
      message: formData.message
    });

    if (result) {
      toast.success('Referral sent successfully!');
      setFormData({ referee_email: '', message: '' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Refer a Friend</CardTitle>
        <CardDescription>
          Know someone who would be perfect for this role? Send them a referral!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Friend's Email
            </label>
            <Input
              id="email"
              type="email"
              value={formData.referee_email}
              onChange={(e) => setFormData({ ...formData, referee_email: e.target.value })}
              placeholder="friend@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Personal Message (Optional)
            </label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Add a personal note..."
              rows={3}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Sending...' : 'Send Referral'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
