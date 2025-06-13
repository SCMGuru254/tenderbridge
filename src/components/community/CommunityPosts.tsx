import React, { useState, useEffect } from 'react';
import { useCommunityPosts, useCommunityComments } from '../hooks/useCommunity';
import type { PostWithAuthor, CommentWithAuthor } from '../types/community';
import { useAuth } from '../hooks/useAuth';

interface CommunityPostsProps {
  communityId: string;
  isLocked?: boolean;
}

const CommunityPosts: React.FC<CommunityPostsProps> = ({ communityId, isLocked = false }) => {
  const { user } = useAuth();
  const { getPosts, createPost, toggleReaction } = useCommunityPosts();
  const { getComments, createComment } = useCommunityComments();
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    postType: 'discussion' as const,
    mediaUrls: [] as string[]
  });
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, [communityId]);

  useEffect(() => {
    if (selectedPost) {
      loadComments(selectedPost);
    }
  }, [selectedPost]);

  const loadPosts = async () => {
    const data = await getPosts(communityId);
    setPosts(data);
  };

  const loadComments = async (postId: string) => {
    const data = await getComments(postId);
    setComments(data);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const success = await createPost({
      ...newPost,
      communityId,
      authorId: user.id,
      mediaUrls: [],
      isPinned: false,
      isLocked: false
    });

    if (success) {
      setNewPost({
        title: '',
        content: '',
        postType: 'discussion',
        mediaUrls: []
      });
      await loadPosts();
    }
  };

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedPost) return;

    const success = await createComment({
      postId: selectedPost,
      authorId: user.id,
      content: newComment,
      parentCommentId: replyTo
    });

    if (success) {
      setNewComment('');
      setReplyTo(null);
      await loadComments(selectedPost);
    }
  };

  const handleReaction = async (postId: string) => {
    if (!user) return;
    const success = await toggleReaction(postId, user.id, 'like');
    if (success) await loadPosts();
  };

  const renderComment = (comment: CommentWithAuthor, depth = 0) => (
    <div key={comment.id} className={`pl-${depth * 4}`}>
      <div className="flex space-x-3">
        {comment.author.avatarUrl ? (
          <img
            src={comment.author.avatarUrl}
            alt={comment.author.name}
            className="h-8 w-8 rounded-full"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            {comment.author.name.charAt(0)}
          </div>
        )}
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg px-4 py-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">{comment.author.name}</span>
              <span className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-1 text-gray-700">{comment.content}</p>
          </div>
          <div className="mt-2 flex items-center space-x-4">
            <button
              onClick={() => setReplyTo(comment.id)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Reply
            </button>
            <button className="text-sm text-gray-500 hover:text-gray-700">
              {comment.likesCount} likes
            </button>
          </div>
        </div>
      </div>
      {comment.replies && (
        <div className="mt-4 space-y-4">
          {comment.replies.map(reply => renderComment(reply, depth + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {!isLocked && user && (
        <form onSubmit={handleCreatePost} className="bg-white rounded-lg shadow p-6">
          <div>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              placeholder="Post title"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mt-4">
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              placeholder="What's on your mind?"
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mt-4 flex justify-between items-center">
            <select
              value={newPost.postType}
              onChange={(e) => setNewPost({ ...newPost, postType: e.target.value as any })}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="discussion">Discussion</option>
              <option value="question">Question</option>
              <option value="resource">Resource</option>
              <option value="event">Event</option>
              <option value="job">Job</option>
            </select>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Post
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-center space-x-3">
                {post.author.avatarUrl ? (
                  <img
                    src={post.author.avatarUrl}
                    alt={post.author.name}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {post.author.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-medium text-gray-900">{post.author.name}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <h3 className="mt-4 text-lg font-medium text-gray-900">{post.title}</h3>
              <p className="mt-2 text-gray-700">{post.content}</p>

              {post.mediaUrls && post.mediaUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {post.mediaUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Post media ${index + 1}`}
                      className="rounded-lg"
                    />
                  ))}
                </div>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: tag.color ? `${tag.color}20` : '#E5E7EB',
                        color: tag.color || '#374151'
                      }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-center space-x-4">
                <button
                  onClick={() => handleReaction(post.id)}
                  className={`flex items-center space-x-1 text-sm ${
                    post.hasLiked ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg
                    className="h-5 w-5"
                    fill={post.hasLiked ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    />
                  </svg>
                  <span>{post.likesCount}</span>
                </button>
                <button
                  onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                  className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span>{post.commentsCount}</span>
                </button>
              </div>

              {selectedPost === post.id && (
                <div className="mt-6 space-y-4">
                  <div className="border-t pt-4">
                    {comments.map(comment => renderComment(comment))}
                  </div>

                  {!post.isLocked && user && (
                    <form onSubmit={handleCreateComment} className="mt-4">
                      <div className="flex space-x-3">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1">
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder={replyTo ? 'Write a reply...' : 'Write a comment...'}
                            rows={3}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                          <div className="mt-2 flex justify-end">
                            {replyTo && (
                              <button
                                type="button"
                                onClick={() => setReplyTo(null)}
                                className="mr-2 text-sm text-gray-500 hover:text-gray-700"
                              >
                                Cancel Reply
                              </button>
                            )}
                            <button
                              type="submit"
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              {replyTo ? 'Reply' : 'Comment'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPosts;
