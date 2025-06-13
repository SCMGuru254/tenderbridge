import React from 'react';
import { Card } from '@/components/ui';
import { ABTest } from '../../types/analytics';

interface ABTestingPanelProps {
  tests: ABTest[];
}

export const ABTestingPanel: React.FC<ABTestingPanelProps> = ({ tests }) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">A/B Test Results</h3>
      <div className="space-y-4">
        {tests.map(test => (
          <div key={test.id} className="border-b pb-4 last:border-b-0">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">{test.test_name}</h4>
              <span className={`px-2 py-1 rounded text-sm ${
                test.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {test.is_active ? 'Active' : 'Completed'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Variant</p>
                <p className="font-medium">{test.variant}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-medium">
                  {new Date(test.start_date).toLocaleDateString()}
                </p>
              </div>
              {test.results && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 mb-1">Results</p>
                  <pre className="bg-gray-50 p-2 rounded text-sm">
                    {JSON.stringify(test.results, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
