
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { errorHandler } from '@/utils/errorHandling';

const JobAlertForm = () => {
  const [email, setEmail] = useState('');
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Mock job alert creation
      console.log('Creating job alert:', { email, keywords, location });
      
      toast({
        title: "Job Alert Created",
        description: "You'll receive notifications for matching jobs.",
      });
      
      // Reset form
      setEmail('');
      setKeywords('');
      setLocation('');
    } catch (error) {
      const handledError = errorHandler.handleError(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: handledError.message,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Job Alert</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="supply chain, logistics"
            />
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Nairobi, Kenya"
            />
          </div>
          
          <Button type="submit" className="w-full">
            Create Alert
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobAlertForm;
