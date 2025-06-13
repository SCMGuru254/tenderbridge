import React, { useState, useEffect } from 'react';
import { useCompanyUpdates } from '../hooks/useCompany';
import type { CompanyUpdate } from '../types/company';

interface CompanyUpdatesProps {
  companyId: string;
  canCreate?: boolean;
}

const CompanyUpdates: React.FC<CompanyUpdatesProps> = ({ companyId, canCreate = false }) => {
  const { getUpdates, createUpdate, loading, error } = useCompanyUpdates();
  const [updates, setUpdates] = useState<CompanyUpdate[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    updateType: 'news' as CompanyUpdate['updateType'],
    mediaUrls: [] as string[],
    isFeatured: false
  });

  useEffect(() => {
    loadUpdates();
  }, [companyId]);

  const loadUpdates = async () => {
    const data = await getUpdates(companyId);
    setUpdates(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createUpdate({
      ...formData,
      companyId
    });
    if (success) {
      setFormData({
        title: '',
        content: '',
        updateType: 'news',
        mediaUrls: [],
        isFeatured: false
      });
      setShowForm(false);
      loadUpdates();
    }
  };

  const addMediaUrl = () => {
    setFormData({
      ...formData,
      mediaUrls: [...formData.mediaUrls, '']
    });
  };

  const updateMediaUrl = (index: number, url: string) => {
    const newUrls = [...formData.mediaUrls];
    newUrls[index] = url;
    setFormData({
      ...formData,
      mediaUrls: newUrls
    });
  };

  const getUpdateTypeIcon = (type: CompanyUpdate['updateType']) => {
    switch (type) {
      case 'news':
        return '📰';
      case 'announcement':
        return '📢';
      case 'milestone':
        return '🏆';
      case 'hiring':
        return '👥';
      default:
        return '📝';
    }
  };

  if (loading && !updates.length) return <div>Loading...</div>;
  if (error) return <div>Error loading updates</div>;

  return (
    <div className="space-y-6">
      {canCreate && (
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {showForm ? 'Cancel' : 'Create Update'}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4 bg-white p-6 rounded-lg shadow">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Update Type
                </label>
                <select
                  id="type"
                  value={formData.updateType}
                  onChange={(e) => setFormData({ ...formData, updateType: e.target.value as CompanyUpdate['updateType'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="news">News</option>
                  <option value="announcement">Announcement</option>
                  <option value="milestone">Milestone</option>
                  <option value="hiring">Hiring Update</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Media URLs
                </label>
                {formData.mediaUrls.map((url, index) => (
                  <input
                    key={index}
                    type="url"
                    value={url}
                    onChange={(e) => updateMediaUrl(index, e.target.value)}
                    placeholder="Image or video URL"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ))}
                <button
                  type="button"
                  onClick={addMediaUrl}
                  className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Media URL
                </button>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                  Feature this update
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Update'}
              </button>
            </form>
          )}
        </div>
      )}

      <div className="space-y-6">
        {updates.map((update) => (
          <div
            key={update.id}
            className={`bg-white rounded-lg shadow p-6 ${
              update.isFeatured ? 'border-2 border-blue-500' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{getUpdateTypeIcon(update.updateType)}</div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {update.title}
                </h3>
                <p className="mt-2 text-gray-600">{update.content}</p>

                {update.mediaUrls && update.mediaUrls.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {update.mediaUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Update media ${index + 1}`}
                        className="rounded-lg w-full h-48 object-cover"
                      />
                    ))}
                  </div>
                )}

                <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-1"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                    </svg>
                    <span>{update.likesCount}</span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-1"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    <span>{update.commentsCount}</span>
                  </div>
                  <span>
                    {new Date(update.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyUpdates;
