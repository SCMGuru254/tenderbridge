import React, { useState } from 'react';
import { useCommunities } from '../hooks/useCommunity';
import type { Community } from '../types/community';

interface CreateCommunityFormProps {
  onSuccess: (community: Community) => void;
}

const CreateCommunityForm: React.FC<CreateCommunityFormProps> = ({ onSuccess }) => {
  const { createCommunity, loading, error } = useCommunities();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    rules: ['Be respectful', 'No spam', 'Stay on topic'],
    isPrivate: false,
    avatarUrl: '',
    bannerUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const community = await createCommunity(formData);
    if (community) {
      onSuccess(community);
    }
  };

  const addRule = () => {
    setFormData({
      ...formData,
      rules: [...formData.rules, '']
    });
  };

  const updateRule = (index: number, value: string) => {
    const newRules = [...formData.rules];
    newRules[index] = value;
    setFormData({
      ...formData,
      rules: newRules
    });
  };

  const removeRule = (index: number) => {
    setFormData({
      ...formData,
      rules: formData.rules.filter((_, i) => i !== index)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Community Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Select a category</option>
          <option value="careers">Careers</option>
          <option value="technology">Technology</option>
          <option value="business">Business</option>
          <option value="professional">Professional Development</option>
          <option value="networking">Networking</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700">
          Avatar URL (optional)
        </label>
        <input
          type="url"
          id="avatarUrl"
          value={formData.avatarUrl}
          onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="bannerUrl" className="block text-sm font-medium text-gray-700">
          Banner URL (optional)
        </label>
        <input
          type="url"
          id="bannerUrl"
          value={formData.bannerUrl}
          onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Community Rules
        </label>
        <div className="space-y-2">
          {formData.rules.map((rule, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={rule}
                onChange={(e) => updateRule(index, e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder={`Rule ${index + 1}`}
                required
              />
              <button
                type="button"
                onClick={() => removeRule(index)}
                className="text-red-600 hover:text-red-700"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addRule}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Rule
          </button>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isPrivate"
          checked={formData.isPrivate}
          onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-900">
          Make this community private
        </label>
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error.message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Community'}
      </button>
    </form>
  );
};

export default CreateCommunityForm;
