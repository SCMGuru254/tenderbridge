import React, { useState } from 'react';
import ReferralForm from '../components/sharing/ReferralForm';
import ShareTemplateManager from '../components/sharing/ShareTemplateManager';
import SuccessStories from '../components/sharing/SuccessStories';
import { useSharingAnalytics } from '../hooks/useSharing';
import type { SharingAnalytics } from '../types/sharing';

const SharingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'referrals' | 'templates' | 'stories' | 'analytics'>('referrals');
  const { getAnalytics } = useSharingAnalytics();
  const [analytics, setAnalytics] = useState<SharingAnalytics[]>([]);

  const loadAnalytics = async () => {
    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Error loading analytics:', err);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'referrals':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Job Referrals</h2>
            <ReferralForm jobId="" onSubmit={() => {}} />
          </div>
        );
      case 'templates':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Share Templates</h2>
            <ShareTemplateManager />
          </div>
        );
      case 'stories':
        return (
          <div className="bg-white rounded-lg shadow">
            <SuccessStories />
          </div>
        );
      case 'analytics':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Sharing Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 capitalize">
                    {item.contentType} Share
                  </h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600">
                      Platform: {item.platform}
                    </p>
                    <p className="text-sm text-gray-600">
                      Clicks: {item.clicks}
                    </p>
                    <p className="text-sm text-gray-600">
                      Impressions: {item.impressions}
                    </p>
                    <p className="text-sm text-gray-600">
                      Conversions: {item.conversions}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Sharing & Analytics</h1>
      
      <div className="mb-6">
        <nav className="flex space-x-4">
          {['referrals', 'templates', 'stories', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab as any);
                if (tab === 'analytics') loadAnalytics();
              }}
              className={`px-4 py-2 rounded-md ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {renderActiveTab()}
    </div>
  );
};

export default SharingDashboard;
