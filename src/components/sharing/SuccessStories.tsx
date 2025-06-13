import React, { useState, useEffect } from 'react';
import { useSuccessStories } from '../hooks/useSharing';
import type { SuccessStory } from '../types/sharing';

interface SuccessStoriesProps {
  jobId?: string;
}

export const SuccessStories: React.FC<SuccessStoriesProps> = ({ jobId }) => {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [showForm, setShowForm] = useState(false);
  const { createStory, getPublicStories, loading, error } = useSuccessStories();

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const data = await getPublicStories();
      setStories(data);
    } catch (err) {
      console.error('Error loading success stories:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Success Stories</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Share Your Story'}
        </button>
      </div>

      {showForm && <SuccessStoryForm jobId={jobId} onSubmit={() => { setShowForm(false); loadStories(); }} />}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => (
          <SuccessStoryCard key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
};

interface SuccessStoryFormProps {
  jobId?: string;
  onSubmit: () => void;
}

const SuccessStoryForm: React.FC<SuccessStoryFormProps> = ({ jobId, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [metrics, setMetrics] = useState<SuccessStory['metrics']>({});
  const [isPublic, setIsPublic] = useState(true);
  const { createStory, loading, error } = useSuccessStories();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createStory({
        title,
        content,
        jobId,
        metrics,
        isPublic
      });
      onSubmit();
    } catch (err) {
      console.error('Error creating success story:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Your Story
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="timeToHire" className="block text-sm font-medium text-gray-700">
          Time to Hire (days)
        </label>
        <input
          type="number"
          id="timeToHire"
          value={metrics?.timeToHire || ''}
          onChange={(e) => setMetrics({ ...metrics, timeToHire: Number(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-600">
            Make this story public
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Share Your Story'}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </form>
  );
};

interface SuccessStoryCardProps {
  story: SuccessStory;
}

const SuccessStoryCard: React.FC<SuccessStoryCardProps> = ({ story }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900">{story.title}</h3>
      <p className="mt-2 text-gray-600">{story.content}</p>
      {story.metrics && (
        <div className="mt-4 border-t pt-4">
          {story.metrics.timeToHire && (
            <p className="text-sm text-gray-500">
              Time to Hire: {story.metrics.timeToHire} days
            </p>
          )}
          {story.metrics.salary && (
            <p className="text-sm text-gray-500">
              Salary Range: ${story.metrics.salary.toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SuccessStories;
