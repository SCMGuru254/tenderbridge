import { useState } from 'react';
import { JobCard } from '../components/JobCard';
import { JobType } from '../types/jobs';

const SavedJobsDashboard = () => {
  const [savedJobs] = useState<JobType[]>([]); // Remove unused setSavedJobs

  return (
    <div>
      <h1>Saved Jobs Dashboard</h1>
      {savedJobs.length === 0 ? (
        <p>No saved jobs yet.</p>
      ) : (
        savedJobs.map((job) => <JobCard key={job.id} job={job} />)
      )}
    </div>
  );
};

export default SavedJobsDashboard;
