import { Job, InsertJob, Profile, InsertProfile } from "@shared/schema";

export interface IStorage {
  // Jobs
  getJobs(): Promise<Job[]>;
  getJob(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  
  // Profiles
  getProfileByUserId(userId: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
}

export class MemStorage implements IStorage {
  private jobs: Map<number, Job>;
  private profiles: Map<number, Profile>;
  private jobId: number;
  private profileId: number;

  constructor() {
    this.jobs = new Map();
    this.profiles = new Map();
    this.jobId = 1;
    this.profileId = 1;
  }

  async getJobs(): Promise<Job[]> {
    return Array.from(this.jobs.values());
  }

  async getJob(id: number): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = this.jobId++;
    const job: Job = { ...insertJob, id, posted_at: new Date() };
    this.jobs.set(id, job);
    return job;
  }

  async getProfileByUserId(userId: string): Promise<Profile | undefined> {
    return Array.from(this.profiles.values()).find((p) => p.user_id === userId);
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = this.profileId++;
    const profile: Profile = { ...insertProfile, id, created_at: new Date() };
    this.profiles.set(id, profile);
    return profile;
  }
}

export const storage = new MemStorage();
