import React from 'react';
import { Card } from '@/components/ui';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { SocialAnalytics, AnalyticsSummary } from '../../types/analytics';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsChartProps {
  data: AnalyticsSummary[] | SocialAnalytics[];
  title: string;
  type: 'line' | 'bar';
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data, title, type }) => {
  const chartData = {
    labels: data.map(d => {
      if ('day' in d) {
        return new Date(d.day).toLocaleDateString();
      } else {
        return new Date(d.created_at).toLocaleDateString();
      }
    }),
    datasets: [
      {
        label: title,        data: data.map(d => {
          if ('unique_users' in d && 'day' in d) {
            return d.unique_users;
          } else if ('engagement_count' in d && 'created_at' in d) {
            return d.engagement_count;
          }
          return 0; // Fallback value
        }),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1
      }
    ]
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {type === 'line' ? (
        <Line data={chartData} options={{ responsive: true }} />
      ) : (
        <Bar data={chartData} options={{ responsive: true }} />
      )}
    </Card>
  );
};
