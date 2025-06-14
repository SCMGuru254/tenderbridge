
import React from 'react';

interface CompanyProfileProps {
  companyId: string;
  isEditable?: boolean;
}

const CompanyProfile: React.FC<CompanyProfileProps> = ({ companyId, isEditable = false }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Company Profile</h2>
      <p className="text-gray-600">Company ID: {companyId}</p>
      {isEditable && (
        <p className="text-sm text-gray-500 mt-2">You can edit this profile</p>
      )}
    </div>
  );
};

export default CompanyProfile;
