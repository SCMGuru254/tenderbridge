
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, MapPin, Briefcase, DollarSign, BarChart3, Users, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface SalaryData {
  position: string;
  location: string;
  experience: string;
  min_salary: number;
  max_salary: number;
  avg_salary: number;
  company_size: string;
  industry: string;
}

interface MarketInsight {
  trend: 'up' | 'down' | 'stable';
  percentage: number;
  comparison: string;
  factors: string[];
}

export const SalaryAnalyzerComplete = () => {
  const [formData, setFormData] = useState({
    position: '',
    location: 'Nairobi',
    experience: 'mid',
    skills: [] as string[],
    education: 'bachelor',
    industry: 'supply-chain'
  });

  const [salaryEstimate, setSalaryEstimate] = useState<{
    min: number;
    max: number;
    avg: number;
    confidence: number;
  } | null>(null);

  const [marketData, setMarketData] = useState<SalaryData[]>([]);
  const [insights, setInsights] = useState<MarketInsight | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock salary database - in production, this would come from real data
  const salaryDatabase: SalaryData[] = [
    {
      position: 'Supply Chain Manager',
      location: 'Nairobi',
      experience: 'senior',
      min_salary: 180000,
      max_salary: 350000,
      avg_salary: 265000,
      company_size: 'large',
      industry: 'supply-chain'
    },
    {
      position: 'Logistics Coordinator',
      location: 'Nairobi',
      experience: 'mid',
      min_salary: 80000,
      max_salary: 150000,
      avg_salary: 115000,
      company_size: 'medium',
      industry: 'supply-chain'
    },
    {
      position: 'Procurement Officer',
      location: 'Nairobi',
      experience: 'mid',
      min_salary: 90000,
      max_salary: 180000,
      avg_salary: 135000,
      company_size: 'medium',
      industry: 'supply-chain'
    },
    {
      position: 'Warehouse Manager',
      location: 'Nairobi',
      experience: 'senior',
      min_salary: 120000,
      max_salary: 250000,
      avg_salary: 185000,
      company_size: 'large',
      industry: 'supply-chain'
    },
    {
      position: 'Supply Chain Analyst',
      location: 'Nairobi',
      experience: 'entry',
      min_salary: 60000,
      max_salary: 120000,
      avg_salary: 90000,
      company_size: 'medium',
      industry: 'supply-chain'
    },
    // Add Mombasa data
    {
      position: 'Supply Chain Manager',
      location: 'Mombasa',
      experience: 'senior',
      min_salary: 160000,
      max_salary: 300000,
      avg_salary: 230000,
      company_size: 'large',
      industry: 'supply-chain'
    },
    {
      position: 'Logistics Coordinator',
      location: 'Mombasa',
      experience: 'mid',
      min_salary: 70000,
      max_salary: 130000,
      avg_salary: 100000,
      company_size: 'medium',
      industry: 'supply-chain'
    }
  ];

  const skillOptions = [
    'SAP', 'Oracle WMS', 'Lean Six Sigma', 'Project Management',
    'Data Analysis', 'Excel Advanced', 'Power BI', 'SQL',
    'Inventory Management', 'Vendor Management', 'Cost Analysis',
    'Quality Management', 'ERP Systems', 'Forecasting'
  ];

  const positions = [
    'Supply Chain Manager', 'Logistics Coordinator', 'Procurement Officer',
    'Warehouse Manager', 'Supply Chain Analyst', 'Operations Manager',
    'Distribution Manager', 'Inventory Planner', 'Demand Planner',
    'Transportation Manager', 'Vendor Manager', 'Supply Chain Director'
  ];

  const locations = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika'
  ];

  useEffect(() => {
    // Generate trending salary data for charts
    const trendData = generateTrendData();
    setMarketData(trendData);
  }, []);

  const generateTrendData = (): SalaryData[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      position: month,
      location: 'Kenya',
      experience: 'all',
      min_salary: 80000 + (index * 5000),
      max_salary: 200000 + (index * 8000),
      avg_salary: 140000 + (index * 6500),
      company_size: 'all',
      industry: 'supply-chain'
    }));
  };

  const analyzeSalary = () => {
    setLoading(true);
    
    // Simulate ML analysis with realistic delays
    setTimeout(() => {
      const baseData = salaryDatabase.filter(item => 
        item.position.toLowerCase().includes(formData.position.toLowerCase()) ||
        formData.position.toLowerCase().includes(item.position.toLowerCase())
      );

      let estimate = {
        min: 80000,
        max: 200000,
        avg: 140000,
        confidence: 75
      };

      if (baseData.length > 0) {
        const relevantData = baseData.filter(item => 
          item.location === formData.location &&
          item.experience === formData.experience
        );

        if (relevantData.length > 0) {
          const avgMin = relevantData.reduce((sum, item) => sum + item.min_salary, 0) / relevantData.length;
          const avgMax = relevantData.reduce((sum, item) => sum + item.max_salary, 0) / relevantData.length;
          const avgSalary = relevantData.reduce((sum, item) => sum + item.avg_salary, 0) / relevantData.length;
          
          estimate = {
            min: Math.round(avgMin),
            max: Math.round(avgMax),
            avg: Math.round(avgSalary),
            confidence: 85
          };
        } else {
          // Use similar positions
          const avgMin = baseData.reduce((sum, item) => sum + item.min_salary, 0) / baseData.length;
          const avgMax = baseData.reduce((sum, item) => sum + item.max_salary, 0) / baseData.length;
          const avgSalary = baseData.reduce((sum, item) => sum + item.avg_salary, 0) / baseData.length;
          
          estimate = {
            min: Math.round(avgMin * 0.9),
            max: Math.round(avgMax * 0.9),
            avg: Math.round(avgSalary * 0.9),
            confidence: 70
          };
        }
      }

      // Adjust for skills
      if (formData.skills.length > 3) {
        estimate.min = Math.round(estimate.min * 1.1);
        estimate.max = Math.round(estimate.max * 1.15);
        estimate.avg = Math.round(estimate.avg * 1.12);
        estimate.confidence = Math.min(estimate.confidence + 10, 95);
      }

      setSalaryEstimate(estimate);
      
      // Generate insights
      setInsights({
        trend: 'up',
        percentage: 8.5,
        comparison: 'market average',
        factors: [
          'High demand for supply chain professionals',
          'Digital transformation in logistics',
          'Post-pandemic supply chain focus',
          'Skills shortage in the market'
        ]
      });

      setLoading(false);
    }, 2000);
  };

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">AI-Powered Salary Analyzer</h1>
        <p className="text-muted-foreground">
          Get data-driven salary insights powered by machine learning and market analysis
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Position/Job Title</Label>
              <Select
                value={formData.position}
                onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map(position => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Location</Label>
              <Select
                value={formData.location}
                onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Experience Level</Label>
              <Select
                value={formData.experience}
                onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                  <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                  <SelectItem value="senior">Senior Level (5+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Key Skills</Label>
              <Select
                onValueChange={(value) => {
                  if (!formData.skills.includes(value)) {
                    setFormData(prev => ({
                      ...prev,
                      skills: [...prev.skills, value]
                    }));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Add skills" />
                </SelectTrigger>
                <SelectContent>
                  {skillOptions.map(skill => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map(skill => (
                  <Badge 
                    key={skill}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        skills: prev.skills.filter(s => s !== skill)
                      }));
                    }}
                  >
                    {skill} ×
                  </Badge>
                ))}
              </div>
            </div>

            <Button 
              onClick={analyzeSalary} 
              className="w-full"
              disabled={loading || !formData.position}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analyze Salary
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {salaryEstimate && (
            <>
              {/* Salary Estimate Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Salary Estimate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Minimum</p>
                      <p className="text-2xl font-bold text-red-600">
                        {formatSalary(salaryEstimate.min)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Average</p>
                      <p className="text-3xl font-bold text-green-600">
                        {formatSalary(salaryEstimate.avg)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Maximum</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatSalary(salaryEstimate.max)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">
                      Confidence: {salaryEstimate.confidence}%
                    </Badge>
                    <Badge variant="secondary">
                      Based on {formData.location} market data
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Market Insights */}
              {insights && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Market Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="font-semibold">
                            Trending {insights.trend} by {insights.percentage}%
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Compared to {insights.comparison}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Key Factors:</h4>
                        <ul className="text-sm space-y-1">
                          {insights.factors.map((factor, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-green-500 mt-1">•</span>
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Salary Trends Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>6-Month Salary Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={marketData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="position" />
                      <YAxis tickFormatter={(value) => `${value/1000}K`} />
                      <Tooltip 
                        formatter={(value: number) => [formatSalary(value), 'Salary']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="avg_salary" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        dot={{ fill: '#8884d8' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}

          {!salaryEstimate && (
            <Card>
              <CardContent className="text-center py-12">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Ready to Analyze</h3>
                <p className="text-muted-foreground">
                  Fill in your profile details and click "Analyze Salary" to get personalized insights
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
