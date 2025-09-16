import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { CreditCard, Calendar, Users } from 'lucide-react';

interface CourseEnrollmentManagerProps {
  courseId: string;
  courseName: string;
  coursePrice: number;
  isEnrolled: boolean;
  onEnrollmentChange: () => void;
}

export function CourseEnrollmentManager({ 
  courseId, 
  courseName, 
  coursePrice, 
  isEnrolled, 
  onEnrollmentChange 
}: CourseEnrollmentManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEnroll = async () => {
    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to enroll');
        return;
      }

      // For now, we'll create a pending enrollment
      // In production, this would integrate with payment processor
      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          course_id: courseId,
          student_id: user.id,
          status: 'enrolled',
          payment_status: coursePrice > 0 ? 'pending' : 'paid'
        });

      if (error) {
        if (error.code === '23505') {
          toast.error('You are already enrolled in this course');
        } else {
          throw error;
        }
      } else {
        toast.success(
          coursePrice > 0 
            ? 'Enrollment submitted! You will receive payment instructions via email.' 
            : 'Successfully enrolled in the course!'
        );
        onEnrollmentChange();
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error('Failed to enroll in course');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isEnrolled) {
    return (
      <Button disabled className="w-full">
        ✓ Enrolled
      </Button>
    );
  }

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)} className="w-full">
        Enroll Now {coursePrice > 0 && `- $${coursePrice}`}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enroll in {courseName}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Course Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Course:</span>
                    <span className="font-medium">{courseName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span className="font-medium">
                      {coursePrice > 0 ? `$${coursePrice}` : 'Free'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {coursePrice > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      After enrollment, you will receive payment instructions via email. 
                      You can pay through M-Pesa, bank transfer, or credit card.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  What Happens Next?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li>• You'll receive a confirmation email</li>
                  {coursePrice > 0 && <li>• Payment instructions will be sent</li>}
                  <li>• Course materials will be accessible once payment is confirmed</li>
                  <li>• You can track your progress in your dashboard</li>
                </ul>
              </CardContent>
            </Card>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleEnroll} 
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? 'Processing...' : 'Confirm Enrollment'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}