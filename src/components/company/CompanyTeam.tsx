
import React, { useState, useEffect } from 'react';
import { useCompanyTeam } from '@/hooks/useCompany';
import type { CompanyMember } from '@/types/company';

interface CompanyTeamProps {
  companyId: string;
  canEdit?: boolean;
}

const CompanyTeam: React.FC<CompanyTeamProps> = ({ companyId, canEdit = false }) => {
  const { members, loading, addTeamMember, error } = useCompanyTeam(companyId);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    role: '',
    department: '',
    isFeatured: false,
    testimonial: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await addTeamMember({
        ...formData,
        companyId,
        joinedAt: new Date().toISOString()
      });
      if (success) {
        setFormData({
          userId: '',
          role: '',
          department: '',
          isFeatured: false,
          testimonial: ''
        });
        setShowForm(false);
      }
    } catch (err) {
      console.error('Error adding team member:', err);
    }
  };

  const groupByDepartment = (members: CompanyMember[]) => {
    const grouped = members.reduce((acc, member) => {
      const dept = member.department || 'Other';
      if (!acc[dept]) acc[dept] = [];
      acc[dept].push(member);
      return acc;
    }, {} as Record<string, CompanyMember[]>);

    return Object.entries(grouped).sort(([a], [b]) => 
      a === 'Other' ? 1 : b === 'Other' ? -1 : a.localeCompare(b)
    );
  };

  if (loading && !members.length) return <div>Loading...</div>;
  if (error) return <div>Error loading team members</div>;

  return (
    <div className="space-y-6">
      {canEdit && (
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {showForm ? 'Cancel' : 'Add Team Member'}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4 bg-white p-6 rounded-lg shadow">
              <div>
                <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                  User ID
                </label>
                <input
                  type="text"
                  id="userId"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <input
                  type="text"
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <input
                  type="text"
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="testimonial" className="block text-sm font-medium text-gray-700">
                  Testimonial
                </label>
                <textarea
                  id="testimonial"
                  value={formData.testimonial}
                  onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
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
                  Feature this team member
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Team Member'}
              </button>
            </form>
          )}
        </div>
      )}

      <div>
        {/* Featured Team Members */}
        {members.some((m: CompanyMember) => m.isFeatured) && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Leadership Team</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {members
                .filter((member: CompanyMember) => member.isFeatured)
                .map((member: CompanyMember) => (
                  <div key={member.id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        {member.userId.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">
                          {member.role}
                        </h4>
                        {member.department && (
                          <p className="text-sm text-gray-500">{member.department}</p>
                        )}
                      </div>
                    </div>
                    {member.testimonial && (
                      <p className="mt-4 text-gray-600 italic">"{member.testimonial}"</p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Team Members by Department */}
        {groupByDepartment(members.filter((m: CompanyMember) => !m.isFeatured)).map(([department, departmentMembers]) => (
          <div key={department} className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{department}</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {departmentMembers.map((member: CompanyMember) => (
                <div
                  key={member.id}
                  className="bg-white rounded-lg shadow-sm p-4 flex items-center"
                >
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    {member.userId.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {member.role}
                    </div>
                    {member.testimonial && (
                      <p className="text-sm text-gray-500 line-clamp-2">
                        "{member.testimonial}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyTeam;
