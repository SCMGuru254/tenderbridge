
import React, { useState } from 'react';
import { useCommunityPosts } from '@/hooks/useCommunity';
import { useAuth } from '@/hooks/useAuth';

interface CommunityPostsProps {
  communityId: string;
}

export const CommunityPosts: React.FC<CommunityPostsProps> = ({ communityId }) => {
  const { user } = useAuth();
  const { posts, loading, createPost } = useCommunityPosts(communityId);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await createPost({
      ...formData,
      author: user.id
    });
    
    setFormData({ title: '', content: '', tags: [] });
    setShowForm(false);
  };

  if (loading) {
    return <div className="animate-pulse">Loading posts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Community Posts</h2>
        {user && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Create Post'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
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

          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Create Post
          </button>
        </form>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">{post.title}</h3>
            <p className="mt-2 text-gray-600">{post.content}</p>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <span>By {post.author}</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <span>{post.likes} likes</span>
              <span>{post.comments} comments</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPosts;
