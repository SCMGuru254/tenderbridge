import React, { useState, useEffect } from 'react';
import { useCompanyEvents } from '../hooks/useCompany';
import { useAuth } from '../hooks/useAuth';
import type { CompanyEvent } from '../types/company';

interface CompanyEventsProps {
  companyId: string;
  canCreate?: boolean;
}

const CompanyEvents: React.FC<CompanyEventsProps> = ({ companyId, canCreate = false }) => {
  const { user } = useAuth();
  const { getEvents, createEvent, registerForEvent, loading, error } = useCompanyEvents();
  const [events, setEvents] = useState<CompanyEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'webinar' as CompanyEvent['eventType'],
    startTime: '',
    endTime: '',
    location: {
      type: 'online' as const,
      url: ''
    },
    maxAttendees: undefined as number | undefined
  });

  useEffect(() => {
    loadEvents();
  }, [companyId]);

  const loadEvents = async () => {
    const data = await getEvents(companyId);
    setEvents(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createEvent({
      ...formData,
      companyId
    });
    if (success) {
      setFormData({
        title: '',
        description: '',
        eventType: 'webinar',
        startTime: '',
        endTime: '',
        location: {
          type: 'online',
          url: ''
        },
        maxAttendees: undefined
      });
      setShowForm(false);
      loadEvents();
    }
  };

  const handleRegister = async (eventId: string) => {
    if (!user) return;
    await registerForEvent(eventId, user.id);
    loadEvents();
  };

  const isEventFull = (event: CompanyEvent) => {
    return event.maxAttendees !== undefined && event.attendeesCount >= event.maxAttendees;
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  if (loading && !events.length) return <div>Loading...</div>;
  if (error) return <div>Error loading events</div>;

  return (
    <div className="space-y-6">
      {canCreate && (
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {showForm ? 'Cancel' : 'Create Event'}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4 bg-white p-6 rounded-lg shadow">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Event Title
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
                <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">
                  Event Type
                </label>
                <select
                  id="eventType"
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value as CompanyEvent['eventType'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="webinar">Webinar</option>
                  <option value="hiring_event">Hiring Event</option>
                  <option value="open_house">Open House</option>
                  <option value="conference">Conference</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    id="startTime"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    id="endTime"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="locationType" className="block text-sm font-medium text-gray-700">
                  Location Type
                </label>
                <select
                  id="locationType"
                  value={formData.location.type}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { type: e.target.value as 'online' | 'physical' | 'hybrid', url: '' }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="online">Online</option>
                  <option value="physical">Physical</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              {(formData.location.type === 'online' || formData.location.type === 'hybrid') && (
                <div>
                  <label htmlFor="locationUrl" className="block text-sm font-medium text-gray-700">
                    Event URL
                  </label>
                  <input
                    type="url"
                    id="locationUrl"
                    value={formData.location.url}
                    onChange={(e) => setFormData({
                      ...formData,
                      location: { ...formData.location, url: e.target.value }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              )}

              <div>
                <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700">
                  Maximum Attendees (Optional)
                </label>
                <input
                  type="number"
                  id="maxAttendees"
                  value={formData.maxAttendees || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    maxAttendees: e.target.value ? parseInt(e.target.value) : undefined
                  })}
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Event'}
              </button>
            </form>
          )}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-blue-100 text-blue-800">
                  {event.eventType.replace('_', ' ')}
                </span>
              </div>

              <p className="mt-2 text-gray-600">{event.description}</p>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span>{formatDateTime(event.startTime)}</span>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  {event.location.type === 'online' ? (
                    <span>Online Event</span>
                  ) : (
                    <span>{event.location.type === 'hybrid' ? 'Hybrid Event' : 'Physical Event'}</span>
                  )}
                </div>

                {event.maxAttendees && (
                  <div className="flex items-center text-sm text-gray-500">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <span>
                      {event.attendeesCount} / {event.maxAttendees} attendees
                    </span>
                  </div>
                )}
              </div>

              {user && (
                <div className="mt-6">
                  <button
                    onClick={() => handleRegister(event.id)}
                    disabled={isEventFull(event)}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      isEventFull(event)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                    }`}
                  >
                    {isEventFull(event) ? 'Event Full' : 'Register'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyEvents;
