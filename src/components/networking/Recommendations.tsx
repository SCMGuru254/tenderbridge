import { useUser } from '@/hooks/useUser';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useRecommendations } from '@/hooks/useNetworking';
import { Check, ThumbsUp, Quote } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const recommendationSchema = z.object({
  content: z.string().min(100, { message: "Recommendation must be at least 100 characters" }),
  relationship: z.string().min(2, { message: "Please describe your professional relationship" }),
  duration: z.string().min(2, { message: "Please specify how long you've known the person" }),
});

type RecommendationFormValues = z.infer<typeof recommendationSchema>;

export default function Recommendations() {
  const { user } = useUser();
  const { recommendations, isLoading, writeRecommendation } = useRecommendations(user?.id || '');
  
  const form = useForm<RecommendationFormValues>({
    resolver: zodResolver(recommendationSchema),
    defaultValues: {
      content: '',
      relationship: '',
      duration: '',
    },
  });

  if (!user) return null;

  if (isLoading) {
    return <Skeleton className="h-[600px] w-full" />;
  }

  const onSubmit = async (values: RecommendationFormValues) => {
    if (!form.formState.isValid) return;
    
    await writeRecommendation({
      recommendedId: user.id,
      ...values,
    });
    
    form.reset();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Professional Recommendations</CardTitle>
          <CardDescription>
            Recommendations from your professional network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recommendations.map((recommendation) => (
              <div key={recommendation.id} className="p-6 border rounded-lg">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {recommendation.profiles.full_name
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </AvatarFallback>
                    <AvatarImage src={`https://api.dicebear.com/7.x/personas/svg?seed=${recommendation.recommender_id}`} />
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{recommendation.profiles.full_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {recommendation.relationship} • Known for {recommendation.duration}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4 text-primary" />
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Quote className="h-6 w-6 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">
                        {recommendation.content}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Posted {new Date(recommendation.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {recommendations.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No recommendations yet. Start building your professional profile by getting recommendations from colleagues.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Write a Recommendation</CardTitle>
          <CardDescription>
            Help others grow their professional network by writing a recommendation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Relationship</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Former manager, colleague, business partner" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration Known</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2 years, 6 months" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recommendation</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your recommendation here..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={!form.formState.isValid}>
                Submit Recommendation
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
