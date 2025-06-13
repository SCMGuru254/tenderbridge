import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCommunities, useCommunityMembership } from '../hooks/useCommunity';
import type { CommunityWithMembership } from '../types/community';
import { useAuth } from '../hooks/useAuth';

interface CommunityListProps {
  category?: string;
}

const CommunityList: React.FC<CommunityListProps> = ({ category }) => {
  const { user } = useAuth();
  const { getCommunities, loading, error } = useCommunities();
  const { joinCommunity, leaveCommunity } = useCommunityMembership();
  const [communities, setCommunities] = useState<CommunityWithMembership[]>([]);
  const [joinLoading, setJoinLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadCommunities();
  }, [category]);

  const loadCommunities = async () => {
    const data = await getCommunities(category);
    setCommunities(data);
  };

  const handleJoinCommunity = async (communityId: string) => {
    if (!user) return;
    setJoinLoading(prev => ({ ...prev, [communityId]: true }));
    const success = await joinCommunity(communityId, user.id);
    if (success) await loadCommunities();
    setJoinLoading(prev => ({ ...prev, [communityId]: false }));
  };

  const handleLeaveCommunity = async (communityId: string) => {
    if (!user) return;
    setJoinLoading(prev => ({ ...prev, [communityId]: true }));
    const success = await leaveCommunity(communityId, user.id);
    if (success) await loadCommunities();
    setJoinLoading(prev => ({ ...prev, [communityId]: false }));
  };

  if (loading && !communities.length) return <div>Loading communities...</div>;
  if (error) return <div>Error loading communities</div>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {communities.map(community => (
        <div
          key={community.id}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div className="relative h-32">
            {community.bannerUrl ? (
              <img
                src={community.bannerUrl}
                alt={`${community.name} banner`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500" />
            )}
            {community.avatarUrl && (
              <div className="absolute -bottom-10 left-4">
                <img
                  src={community.avatarUrl}
                  alt={`${community.name} avatar`}
                  className="w-20 h-20 rounded-full border-4 border-white"
                />
              </div>
            )}
          </div>

          <div className="p-4 pt-12">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  <Link to={`/communities/${community.id}`} className="hover:text-blue-600">
                    {community.name}
                  </Link>
                </h3>
                <p className="text-sm text-gray-500">{community.memberCount} members</p>
              </div>

              {user && (
                <button
                  onClick={() => community.currentUserRole
                    ? handleLeaveCommunity(community.id)
                    : handleJoinCommunity(community.id)
                  }
                  disabled={joinLoading[community.id]}
                  className={`px-4 py-1 rounded-full text-sm font-medium ${
                    community.currentUserRole
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {joinLoading[community.id]
                    ? 'Loading...'
                    : community.currentUserRole
                    ? 'Leave'
                    : 'Join'
                  }
                </button>
              )}
            </div>

            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {community.description}
            </p>

            <div className="mt-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {community.category}
              </span>
              {community.isPrivate && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Private
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommunityList;
