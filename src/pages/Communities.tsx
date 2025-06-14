
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityList from '../components/community/CommunityList';
import { CreateCommunityForm } from '../components/community/CreateCommunityForm';
import type { Community } from '../types/community';

const Communities: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const categories = [
    { id: 'all', name: 'All Communities' },
    { id: 'careers', name: 'Careers' },
    { id: 'technology', name: 'Technology' },
    { id: 'business', name: 'Business' },
    { id: 'professional', name: 'Professional Development' },
    { id: 'networking', name: 'Networking' },
    { id: 'other', name: 'Other' }
  ];

  const handleCreateSuccess = (community: Community) => {
    setShowCreateForm(false);
    navigate(`/communities/${community.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Communities</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {showCreateForm ? 'Cancel' : 'Create Community'}
        </button>
      </div>

      {showCreateForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Create a New Community
          </h2>
          <CreateCommunityForm onSuccess={handleCreateSuccess} />
        </div>
      ) : (
        <>
          <nav className="mb-8">
            <div className="sm:hidden">
              <select
                value={selectedCategory || 'all'}
                onChange={(e) => setSelectedCategory(e.target.value === 'all' ? undefined : e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id === 'all' ? undefined : category.id)}
                      className={`
                        whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                        ${selectedCategory === (category.id === 'all' ? undefined : category.id)
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }
                      `}
                    >
                      {category.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </nav>

          <CommunityList category={selectedCategory} />
        </>
      )}
    </div>
  );
};

export default Communities;
