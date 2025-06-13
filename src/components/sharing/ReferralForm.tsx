import React, { useState, useEffect } from 'react';
import { useReferrals } from '../hooks/useSharing';
import type { JobReferral } from '../types/sharing';

interface ReferralFormProps {
  jobId: string;
  onSubmit: () => void;
}

const ReferralForm: React.FC<ReferralFormProps> = ({ jobId, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const { createReferral, loading, error } = useReferrals();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReferral(jobId, email, notes);
      setEmail('');
      setNotes('');
      onSubmit();
    } catch (err) {
      console.error('Error creating referral:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Candidate Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send Referral'}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </form>
  );
};

export default ReferralForm;
