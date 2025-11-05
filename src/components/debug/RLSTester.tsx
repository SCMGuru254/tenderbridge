import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, PlayCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { RLSTester, RLSTestResult } from '@/utils/rlsTester';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const RLSTesterComponent = () => {
  const { user } = useAuth();
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<RLSTestResult[]>([]);

  const runTests = async () => {
    if (!user) {
      toast.error('Please sign in to run RLS tests');
      return;
    }

    setTesting(true);
    setResults([]);

    try {
      const testResults = await RLSTester.runComprehensiveTests();
      setResults(testResults);
      
      const passed = testResults.filter(r => r.success).length;
      const failed = testResults.filter(r => !r.success).length;
      
      toast.success(`Tests complete: ${passed} passed, ${failed} failed`);
    } catch (error) {
      console.error('Error running tests:', error);
      toast.error('Failed to run RLS tests');
    } finally {
      setTesting(false);
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (success: boolean) => {
    return success ? (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        PASS
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
        FAIL
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>RLS Policy Tester</CardTitle>
              <CardDescription>
                Test Row Level Security policies to verify data access controls are working correctly
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!user ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Please sign in to test RLS policies
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <Button
                  onClick={runTests}
                  disabled={testing}
                  className="gap-2"
                >
                  {testing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Running Tests...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-4 w-4" />
                      Run Comprehensive RLS Tests
                    </>
                  )}
                </Button>

                {results.length > 0 && (
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{results.filter(r => r.success).length} Passed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span>{results.filter(r => !r.success).length} Failed</span>
                    </div>
                  </div>
                )}
              </div>

              {results.length > 0 && (
                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                  <div className="space-y-3">
                    {results.map((result, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        {getStatusIcon(result.success)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{result.table}</span>
                            <Badge variant="secondary" className="text-xs">
                              {result.operation}
                            </Badge>
                            {getStatusBadge(result.success)}
                          </div>
                          {result.error && (
                            <p className="text-sm text-red-600 mt-1">
                              {result.error}
                            </p>
                          )}
                          {result.rowCount !== undefined && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Rows accessible: {result.rowCount}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">About RLS Testing</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Tests verify that users can only access data they're authorized to see</li>
                  <li>• Failed tests may indicate missing or incorrect RLS policies</li>
                  <li>• Each test checks SELECT permissions on key tables</li>
                  <li>• Results show if data is properly secured at the database level</li>
                </ul>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
