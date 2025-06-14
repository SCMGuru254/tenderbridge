
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { notificationService } from '@/services/notificationService';
import { useAuth } from '@/hooks/useAuth';

export const JobAlertForm: React.FC = () => {
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !keywords.trim()) return;

    setIsSubmitting(true);
    try {
      await notificationService.createNotification(
        user.id,
        'Job Alert Created',
        `You will receive notifications for jobs matching: ${keywords}`,
        'job_alert',
        { keywords, location }
      );
      
      setKeywords('');
      setLocation('');
      console.log('Job alert created successfully');
    } catch (error) {
      console.error('Error creating job alert:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Create Job Alert</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Keywords</label>
          <Input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g., supply chain, logistics"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <Input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Nairobi, Kenya"
          />
        </div>
        <Button type="submit" disabled={isSubmitting || !user}>
          {isSubmitting ? 'Creating...' : 'Create Alert'}
        </Button>
      </form>
    </div>
  );
};
