import React, { useState, useEffect } from 'react';
import { useCommunityPosts } from '@/hooks/useCommunity';
import type { Post, Reply } from '@/types/community';
import { useAuth } from '@/hooks/useAuth';

interface CommunityPostsProps {
  communityId: string;
}

const CommunityPosts: React.FC<CommunityPostsProps> = ({ communityId }) => {
  const { user } = useAuth();
  const { posts, loading, createPost } = useCommunityPosts(communityId);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [showAttachmentInput, setShowAttachmentInput] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [newAttachment, setNewAttachment] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    console.log('Attachments:', attachments);
  }, [attachments]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const postData = {
      ...newPost,
      author: user.id,
      tags: tags,
      attachments: attachments,
    };

    await createPost(postData);
    setNewPost({ title: '', content: '' });
    setAttachments([]);
    setTags([]);
  };

  const handleAddAttachment = () => {
    if (newAttachment.trim() !== '') {
      setAttachments([...attachments, newAttachment]);
      setNewAttachment('');
      setShowAttachmentInput(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() !== '') {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const renderReplies = (replies: Reply[]) => {
    return replies.map((reply: Reply) => (
      <div key={reply.id} className="ml-8 border-l-2 border-gray-100 pl-4">
        <p className="text-sm text-gray-800">{reply.content}</p>
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <span>{reply.author}</span>
          <span className="mx-1">•</span>
          <span>{reply.createdAt}</span>
          <span className="mx-1">•</span>
          <span>{reply.likes} Likes</span>
        </div>
      </div>
    ));
  };

  const renderAttachments = (attachments: string[]) => {
    return attachments.map((url: string, index: number) => (
      <a
        key={index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline text-sm"
      >
        Attachment {index + 1}
      </a>
    ));
  };

  const renderTags = (tags: string[]) => {
    return tags.map((tag: string) => (
      <span
        key={tag}
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
      >
        {tag}
      </span>
    ));
  };

  if (loading) return <div>Loading posts...</div>;

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={newPost.title}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter post title"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={newPost.content}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter post content"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Attachments:
          </label>
          {attachments.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {renderAttachments(attachments)}
            </div>
          ) : (
            <p className="text-gray-500">No attachments yet.</p>
          )}
          {!showAttachmentInput && (
            <button
              type="button"
              onClick={() => setShowAttachmentInput(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
            >
              Add Attachment
            </button>
          )}
          {showAttachmentInput && (
            <div className="mt-2">
              <input
                type="url"
                placeholder="Enter attachment URL"
                value={newAttachment}
                onChange={(e) => setNewAttachment(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <button
                type="button"
                onClick={handleAddAttachment}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
              >
                Save Attachment
              </button>
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tags:
          </label>
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {renderTags(tags)}
            </div>
          ) : (
            <p className="text-gray-500">No tags yet.</p>
          )}
          <div className="mt-2">
            <input
              type="text"
              placeholder="Enter tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
            >
              Add Tag
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Post
        </button>
      </form>

      <div>
        {posts.map((post) => (
          <div key={post.id} className="bg-white shadow rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
            <p className="text-gray-800">{post.content}</p>
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <span>{post.author}</span>
              <span className="mx-1">•</span>
              <span>{post.createdAt}</span>
              <span className="mx-1">•</span>
              <span>{post.likes} Likes</span>
              <span className="mx-1">•</span>
              <span>{post.comments} Comments</span>
            </div>
            {post.replies && renderReplies(post.replies)}
            {post.attachments && (
              <div className="mt-2 flex flex-wrap gap-2">
                {renderAttachments(post.attachments)}
              </div>
            )}
            {post.tags && (
              <div className="mt-2 flex flex-wrap gap-2">
                {renderTags(post.tags)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPosts;
