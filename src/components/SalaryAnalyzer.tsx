
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SalaryAnalyzerComplete } from './SalaryAnalyzerComplete';
import { SalarySubmissionForm } from './SalarySubmissionForm';

export const SalaryAnalyzer = () => {
  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="analyzer" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analyzer">Salary Analysis</TabsTrigger>
          <TabsTrigger value="submit">Submit Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analyzer">
          <SalaryAnalyzerComplete />
        </TabsContent>
        
        <TabsContent value="submit">
          <SalarySubmissionForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};
