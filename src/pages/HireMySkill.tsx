import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import {
  TrendingUp,
  Calendar,
  Brain,
  Sparkles,
  DollarSign,
  Clock,
  Users,
  BarChart,
} from 'lucide-react';

export default function HireMySkill() {
  const [activeTab, setActiveTab] = useState('marketplace');
  // const { toast } = useToast();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">Hire My Skill</h1>
        <p className="text-muted-foreground text-lg">
          The future of supply chain talent marketplace - where skills meet opportunities in real-time
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid grid-cols-2 w-full max-w-2xl mx-auto">
          <TabsTrigger value="marketplace">Talent Marketplace</TabsTrigger>
          <TabsTrigger value="insights">Market Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="space-y-6">
          {/* Dynamic Skill Pricing Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Dynamic Skill Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-secondary/50">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold mb-2">KSH 75/hr</div>
                    <div className="text-sm text-muted-foreground">Cold Storage Management</div>
                    <Badge className="mt-2">High Demand</Badge>
                  </CardContent>
                </Card>
                <Card className="bg-secondary/50">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold mb-2">KSH 65/hr</div>
                    <div className="text-sm text-muted-foreground">Logistics Optimization</div>
                    <Badge variant="outline" className="mt-2">Stable</Badge>
                  </CardContent>
                </Card>
                <Card className="bg-secondary/50">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold mb-2">KSH 85/hr</div>
                    <div className="text-sm text-muted-foreground">Blockchain Supply Chain</div>
                    <Badge className="mt-2 bg-orange-500">Trending</Badge>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Multi-Gig Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Multi-Gig Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="aspect-square border rounded-lg p-2 text-center">
                    <div className="text-sm font-medium mb-1">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.random() > 0.5 ? '2 Slots' : '3 Slots'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Predictive Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Trending Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { skill: 'Green Supply Chain Management', growth: '+45%', trend: 'up' },
                  { skill: 'Digital Twin Implementation', growth: '+38%', trend: 'up' },
                  { skill: 'Last-Mile Optimization', growth: '+25%', trend: 'up' },
                ].map((item) => (
                  <div key={item.skill} className="flex items-center justify-between p-2 border rounded-lg">
                    <div>
                      <div className="font-medium">{item.skill}</div>
                      <div className="text-sm text-muted-foreground">Projected Demand Q3 2025</div>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {item.growth}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* Market Intelligence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Market Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <DollarSign className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-semibold mb-1">Rate Trends</h3>
                    <p className="text-sm text-muted-foreground">
                      15% increase in logistics tech rates
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <Clock className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-semibold mb-1">Peak Demand</h3>
                    <p className="text-sm text-muted-foreground">
                      Q3 shows highest demand for skills
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <Users className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-semibold mb-1">Talent Pool</h3>
                    <p className="text-sm text-muted-foreground">
                      2,500+ verified professionals
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Skill Value Forecast */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                Skill Value Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-[200px] bg-secondary/50 rounded-lg flex items-center justify-center">
                  [Skill Value Chart - Coming Soon]
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Button variant="outline" className="w-full">Last Month</Button>
                  <Button variant="outline" className="w-full">This Month</Button>
                  <Button variant="outline" className="w-full">Forecast</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Skill Form */}
      <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Add Your Skill</h2>
        <form className="space-y-4">
          <div>
            <Label htmlFor="skill">Skill Name</Label>
            <Input id="skill" name="skill" placeholder="e.g. Supply Chain Analytics" required />
          </div>
          <div>
            <Label htmlFor="rate">Rate (KSH/hr)</Label>
            <Input id="rate" name="rate" type="number" min="0" placeholder="e.g. 500" required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="Describe your skill and experience..." rows={3} />
          </div>
          <Button type="submit" className="w-full">Add Skill</Button>
        </form>
      </div>
    </div>
  );
}
