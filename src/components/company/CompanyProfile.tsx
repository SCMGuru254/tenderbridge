import React, { useState, useEffect } from 'react';
import { useCompanyProfile, useCompanyFollowers } from '../hooks/useCompany';
import type { CompanyProfileWithStats } from '../types/company';
import { useAuth } from '../hooks/useAuth';

interface CompanyProfileProps {
  companyId: string;
  isEditable?: boolean;
}

const CompanyProfile: React.FC<CompanyProfileProps> = ({ companyId, isEditable = false }) => {
  const { user } = useAuth();
  const { getProfile, updateProfile, loading, error } = useCompanyProfile();
  const { followCompany, unfollowCompany } = useCompanyFollowers();
  const [profile, setProfile] = useState<CompanyProfileWithStats | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<CompanyProfileWithStats>>({});

  useEffect(() => {
    loadProfile();
  }, [companyId]);

  const loadProfile = async () => {
    const data = await getProfile(companyId);
    if (data) {
      setProfile(data);
      setFormData(data);
    }
  };

  const handleFollow = async () => {
    if (!user) return;
    const success = await followCompany(companyId, user.id);
    if (success) loadProfile();
  };

  const handleUnfollow = async () => {
    if (!user) return;
    const success = await unfollowCompany(companyId, user.id);
    if (success) loadProfile();
  };

  const handleSave = async () => {
    if (!formData) return;
    const updated = await updateProfile(companyId, formData);
    if (updated) {
      setProfile({ ...profile, ...updated } as CompanyProfileWithStats);
      setIsEditing(false);
    }
  };

  if (loading && !profile) return <div>Loading...</div>;
  if (error) return <div>Error loading profile</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="relative">
        {profile.featuredImages?.[0] && (
          <img
            src={profile.featuredImages[0]}
            alt="Company cover"
            className="w-full h-48 object-cover rounded-t-lg"
          />
        )}
        <div className="absolute top-4 right-4 space-x-2">
          {isEditable && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-white text-gray-700 rounded-md shadow hover:bg-gray-50"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          )}
          {!isEditable && user && (
            <button
              onClick={profile.isFollowing ? handleUnfollow : handleFollow}
              className={`px-4 py-2 rounded-md shadow ${
                profile.isFollowing
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {profile.isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mission
              </label>
              <textarea
                value={formData.mission || ''}
                onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Culture
              </label>
              <textarea
                value={formData.culture || ''}
                onChange={(e) => setFormData({ ...formData, culture: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">About Us</h3>
              <p className="text-gray-600">{profile.description}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">Our Mission</h3>
              <p className="text-gray-600">{profile.mission}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">Company Culture</h3>
              <p className="text-gray-600">{profile.culture}</p>
            </div>

            <div className="border-t pt-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {profile.followersCount}
                  </div>
                  <div className="text-sm text-gray-500">Followers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {profile.teamMembersCount}
                  </div>
                  <div className="text-sm text-gray-500">Team Members</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {profile.upcomingEventsCount}
                  </div>
                  <div className="text-sm text-gray-500">Upcoming Events</div>
                </div>
              </div>
            </div>

            {profile.benefits && profile.benefits.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Benefits & Perks
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {profile.benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 text-gray-600"
                    >
                      <svg
                        className="h-5 w-5 text-green-500"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Connect With Us
                </h3>
                <div className="flex space-x-4">
                  {Object.entries(profile.socialLinks).map(([platform, url]) => (
                    url && (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">{platform}</span>
                        <i className={`fab fa-${platform.toLowerCase()}`}></i>
                      </a>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;
