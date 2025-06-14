
import React, { useState, useEffect } from 'react';
import { useCommunityPosts } from '@/hooks/useCommunity';
import { useAuth } from '@/hooks/useAuth';
import type { Reply } from '@/types/community';

interface CommunityPostsProps {
  communityId: string;
}

export const CommunityPosts: React.FC<CommunityPostsProps> = ({ communityId }) => {
  const { user } = useAuth();
  const { posts, loading, createPost } = useCommunityPosts(communityId);
  const [showForm, setShowForm] = useState(false);
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    attachments: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await createPost({
      ...postData,
      author: user.email || 'Anonymous'
    });

    setPostData({
      title: '',
      content: '',
      tags: [],
      attachments: []
    });
    setShowForm(false);
  };

  const addTag = () => {
    setPostData(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  const updateTag = (index: number, value: string) => {
    setPostData(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) => i === index ? value : tag)
    }));
  };

  const removeTag = (index: number) => {
    setPostData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div>Loading posts...</div>;

  return (
    <div className="space-y-6">
      {user && (
        <div className="bg-white rounded-lg shadow p-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Create New Post'}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={postData.title}
                  onChange={(e) => setPostData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={postData.content}
                  onChange={(e) => setPostData(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                {postData.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => updateTag(index, e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Tag"
                    />
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Add Tag
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Create Post
              </button>
            </form>
          )}
        </div>
      )}

      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
            <p className="text-gray-600 mb-4">{post.content}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>By {post.author}</span>
              <span>{formatDate(post.createdAt)}</span>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{post.likes} likes</span>
              <span>{post.comments} comments</span>
            </div>

            {post.replies && post.replies.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h4 className="font-medium mb-2">Replies:</h4>
                {post.replies.map((reply: Reply) => (
                  <div key={reply.id} className="ml-4 p-3 bg-gray-50 rounded-lg mb-2">
                    <p className="text-sm">{reply.content}</p>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>By {reply.author}</span>
                      <span>{formatDate(reply.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {post.attachments && post.attachments.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Attachments:</h4>
                <div className="flex flex-wrap gap-2">
                  {post.attachments.map((url: string, index: number) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Attachment {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
