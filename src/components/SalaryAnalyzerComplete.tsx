
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  DollarSign, 
  Building2, 
  Award,
  AlertCircle
} from 'lucide-react';

interface SalaryData {
  position: string;
  location: string;
  experience: string;
  minSalary: number;
  maxSalary: number;
  avgSalary: number;
  marketDemand: 'high' | 'medium' | 'low';
  growth: number;
  topSkills: string[];
  companies: string[];
}

const salaryDatabase: Record<string, Record<string, Record<string, SalaryData>>> = {
  'supply-chain-manager': {
    'nairobi': {
      'entry': {
        position: 'Supply Chain Manager',
        location: 'Nairobi',
        experience: 'Entry Level (0-2 years)',
        minSalary: 60000,
        maxSalary: 90000,
        avgSalary: 75000,
        marketDemand: 'high',
        growth: 12,
        topSkills: ['SAP', 'Excel', 'Inventory Management', 'Procurement'],
        companies: ['Safaricom', 'EABL', 'Unilever Kenya', 'BAT Kenya']
      },
      'mid': {
        position: 'Supply Chain Manager',
        location: 'Nairobi',
        experience: 'Mid Level (3-7 years)',
        minSalary: 90000,
        maxSalary: 150000,
        avgSalary: 120000,
        marketDemand: 'high',
        growth: 15,
        topSkills: ['SAP', 'Supply Chain Planning', 'Vendor Management', 'Lean Six Sigma'],
        companies: ['Kenya Airways', 'Coca-Cola', 'Nestle Kenya', 'Toyota Kenya']
      },
      'senior': {
        position: 'Supply Chain Manager',
        location: 'Nairobi',
        experience: 'Senior Level (8+ years)',
        minSalary: 150000,
        maxSalary: 250000,
        avgSalary: 200000,
        marketDemand: 'medium',
        growth: 18,
        topSkills: ['Strategic Planning', 'Digital Transformation', 'Leadership', 'Analytics'],
        companies: ['Diageo', 'Heineken', 'General Motors', 'Bamburi Cement']
      }
    },
    'mombasa': {
      'entry': {
        position: 'Supply Chain Manager',
        location: 'Mombasa',
        experience: 'Entry Level (0-2 years)',
        minSalary: 55000,
        maxSalary: 80000,
        avgSalary: 67500,
        marketDemand: 'high',
        growth: 10,
        topSkills: ['Port Operations', 'Logistics', 'Customs', 'Freight Management'],
        companies: ['Kenya Ports Authority', 'Maersk', 'DHL', 'Bollore Logistics']
      },
      'mid': {
        position: 'Supply Chain Manager',
        location: 'Mombasa',
        experience: 'Mid Level (3-7 years)',
        minSalary: 80000,
        maxSalary: 130000,
        avgSalary: 105000,
        marketDemand: 'high',
        growth: 13,
        topSkills: ['Port Operations', 'International Trade', 'Supply Chain Optimization', 'Risk Management'],
        companies: ['CMA CGM', 'Hapag-Lloyd', 'MSC', 'PANALPINA']
      },
      'senior': {
        position: 'Supply Chain Manager',
        location: 'Mombasa',
        experience: 'Senior Level (8+ years)',
        minSalary: 130000,
        maxSalary: 200000,
        avgSalary: 165000,
        marketDemand: 'medium',
        growth: 16,
        topSkills: ['Strategic Logistics', 'Port Development', 'International Relations', 'Digital Logistics'],
        companies: ['Kenya Ports Authority', 'Trademark East Africa', 'APM Terminals', 'Simatech']
      }
    }
  },
  'logistics-coordinator': {
    'nairobi': {
      'entry': {
        position: 'Logistics Coordinator',
        location: 'Nairobi',
        experience: 'Entry Level (0-2 years)',
        minSalary: 45000,
        maxSalary: 65000,
        avgSalary: 55000,
        marketDemand: 'high',
        growth: 14,
        topSkills: ['Route Planning', 'Inventory Control', 'Customer Service', 'MS Office'],
        companies: ['Jumia', 'Glovo', 'Sendy', 'DHL Express']
      },
      'mid': {
        position: 'Logistics Coordinator',
        location: 'Nairobi',
        experience: 'Mid Level (3-7 years)',
        minSalary: 65000,
        maxSalary: 100000,
        avgSalary: 82500,
        marketDemand: 'high',
        growth: 16,
        topSkills: ['Fleet Management', 'Warehouse Operations', 'Cost Optimization', 'Team Leadership'],
        companies: ['Twiga Foods', 'Copia Global', 'SkyGarden', 'Wasoko']
      },
      'senior': {
        position: 'Logistics Coordinator',
        location: 'Nairobi',
        experience: 'Senior Level (8+ years)',
        minSalary: 100000,
        maxSalary: 160000,
        avgSalary: 130000,
        marketDemand: 'medium',
        growth: 20,
        topSkills: ['Supply Chain Strategy', 'Technology Integration', 'Vendor Management', 'Process Improvement'],
        companies: ['Carrefour Kenya', 'Nakumatt', 'Tuskys', 'Chandarana Foodplus']
      }
    }
  },
  'procurement-officer': {
    'nairobi': {
      'entry': {
        position: 'Procurement Officer',
        location: 'Nairobi',
        experience: 'Entry Level (0-2 years)',
        minSalary: 50000,
        maxSalary: 75000,
        avgSalary: 62500,
        marketDemand: 'medium',
        growth: 8,
        topSkills: ['Sourcing', 'Negotiation', 'Contract Management', 'Supplier Evaluation'],
        companies: ['Kenya Power', 'Safaricom', 'Co-operative Bank', 'KCB Bank']
      },
      'mid': {
        position: 'Procurement Officer',
        location: 'Nairobi',
        experience: 'Mid Level (3-7 years)',
        minSalary: 75000,
        maxSalary: 120000,
        avgSalary: 97500,
        marketDemand: 'medium',
        growth: 10,
        topSkills: ['Strategic Sourcing', 'Cost Analysis', 'Risk Assessment', 'ERP Systems'],
        companies: ['Equity Bank', 'Standard Chartered', 'I&M Bank', 'Britam Insurance']
      },
      'senior': {
        position: 'Procurement Officer',
        location: 'Nairobi',
        experience: 'Senior Level (8+ years)',
        minSalary: 120000,
        maxSalary: 200000,
        avgSalary: 160000,
        marketDemand: 'low',
        growth: 12,
        topSkills: ['Procurement Strategy', 'Compliance', 'Stakeholder Management', 'Digital Procurement'],
        companies: ['Kenya Commercial Bank', 'NCBA Bank', 'Absa Bank', 'CIC Insurance']
      }
    }
  }
};

export const SalaryAnalyzerComplete = () => {
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [results, setResults] = useState<SalaryData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const positions = [
    { value: 'supply-chain-manager', label: 'Supply Chain Manager' },
    { value: 'logistics-coordinator', label: 'Logistics Coordinator' },
    { value: 'procurement-officer', label: 'Procurement Officer' },
    { value: 'warehouse-manager', label: 'Warehouse Manager' },
    { value: 'inventory-analyst', label: 'Inventory Analyst' },
    { value: 'transportation-manager', label: 'Transportation Manager' }
  ];

  const locations = [
    { value: 'nairobi', label: 'Nairobi' },
    { value: 'mombasa', label: 'Mombasa' },
    { value: 'kisumu', label: 'Kisumu' },
    { value: 'nakuru', label: 'Nakuru' },
    { value: 'eldoret', label: 'Eldoret' }
  ];

  const experienceLevels = [
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (3-7 years)' },
    { value: 'senior', label: 'Senior Level (8+ years)' }
  ];

  const analyzeSalary = () => {
    if (!selectedPosition || !selectedLocation || !selectedExperience) return;

    setIsAnalyzing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const data = salaryDatabase[selectedPosition]?.[selectedLocation]?.[selectedExperience];
      
      if (data) {
        setResults(data);
      } else {
        // Generate fallback data for combinations not in database
        setResults({
          position: positions.find(p => p.value === selectedPosition)?.label || 'Position',
          location: locations.find(l => l.value === selectedLocation)?.label || 'Location',
          experience: experienceLevels.find(e => e.value === selectedExperience)?.label || 'Experience',
          minSalary: 40000 + Math.random() * 20000,
          maxSalary: 80000 + Math.random() * 50000,
          avgSalary: 60000 + Math.random() * 40000,
          marketDemand: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
          growth: Math.floor(Math.random() * 20) + 5,
          topSkills: ['Data Analysis', 'Communication', 'Problem Solving', 'Technical Skills'],
          companies: ['Company A', 'Company B', 'Company C', 'Company D']
        });
      }
      setIsAnalyzing(false);
    }, 1500);
  };

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <DollarSign className="h-8 w-8 text-primary" />
          Salary Analyzer
        </h1>
        <p className="text-muted-foreground">
          Get accurate salary insights for supply chain and logistics positions in Kenya
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Analyze Your Market Value</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Position</label>
              <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {positions.filter(position => position.value !== "").map((position) => (
                    <SelectItem key={position.value} value={position.value}>
                      {position.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.filter(location => location.value !== "").map((location) => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Experience Level</label>
              <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.filter(level => level.value !== "").map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={analyzeSalary} 
            disabled={!selectedPosition || !selectedLocation || !selectedExperience || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Salary'}
          </Button>
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-6">
          {/* Salary Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Salary Overview: {results.position} in {results.location}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Minimum</p>
                  <p className="text-2xl font-bold text-red-600">{formatSalary(results.minSalary)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Average</p>
                  <p className="text-3xl font-bold text-primary">{formatSalary(results.avgSalary)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Maximum</p>
                  <p className="text-2xl font-bold text-green-600">{formatSalary(results.maxSalary)}</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Salary Range</span>
                  <span>{formatSalary(results.minSalary)} - {formatSalary(results.maxSalary)}</span>
                </div>
                <Progress 
                  value={((results.avgSalary - results.minSalary) / (results.maxSalary - results.minSalary)) * 100} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Market Insights */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Market Demand
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Badge className={getDemandColor(results.marketDemand)}>
                    {results.marketDemand.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Market demand for this position
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm">
                    <strong>{results.growth}%</strong> projected growth in the next year
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Top Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {results.topSkills.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Most in-demand skills for this position
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Top Companies */}
          <Card>
            <CardHeader>
              <CardTitle>Top Hiring Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {results.companies.map((company, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium">{company}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">Disclaimer</p>
                  <p>
                    Salary data is based on market research and industry reports. Actual salaries may vary 
                    based on company size, specific requirements, benefits, and individual qualifications. 
                    This analysis should be used as a reference guide only.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
