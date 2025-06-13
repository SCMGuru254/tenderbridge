import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import CompanyProfile from '../components/company/CompanyProfile';
import CompanyUpdates from '../components/company/CompanyUpdates';
import CompanyEvents from '../components/company/CompanyEvents';
import CompanyTeam from '../components/company/CompanyTeam';
import { useAuth } from '../hooks/useAuth';

const CompanySocial: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'updates' | 'events' | 'team'>('profile');

  // In a real app, you would check if the user has admin rights for this company
  const isCompanyAdmin = user && user.id === companyId; // This is a simplified check

  const renderTab = () => {
    switch (activeTab) {
      case 'profile':
        return <CompanyProfile companyId={companyId} isEditable={isCompanyAdmin} />;
      case 'updates':
        return <CompanyUpdates companyId={companyId} canCreate={isCompanyAdmin} />;
      case 'events':
        return <CompanyEvents companyId={companyId} canCreate={isCompanyAdmin} />;
      case 'team':
        return <CompanyTeam companyId={companyId} canEdit={isCompanyAdmin} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="mb-8">
        <ul className="flex space-x-8 border-b">
          {(['profile', 'updates', 'events', 'team'] as const).map((tab) => (
            <li key={tab}>
              <button
                onClick={() => setActiveTab(tab)}
                className={`px-1 py-4 text-sm font-medium border-b-2 ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {renderTab()}
    </div>
  );
};

export default CompanySocial;
