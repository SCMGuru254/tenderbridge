// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import * as tf from "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.11.0/dist/tf.min.js";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JobFeatures {
  skills: number[];
  experience: number;
  location: number[];
  jobType: number[];
}

interface UserFeatures {
  skills: number[];
  experience: number;
  preferredLocations: number[];
  preferredJobTypes: number[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobs, userProfile } = await req.json();

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Load the pre-trained model from Supabase storage
    const modelPath = 'models/job-matcher/model.json';
    const { data: modelData } = await supabaseClient
      .storage
      .from('ml-models')
      .download(modelPath);

    const model = await tf.loadLayersModel(modelData);

    // Process each job
    const results = await Promise.all(jobs.map(async (job: any) => {
      // Extract features
      const jobFeatures = extractJobFeatures(job);
      const userFeatures = extractUserFeatures(userProfile);

      // Combine features
      const features = tf.tensor2d([
        ...jobFeatures.skills,
        jobFeatures.experience,
        ...jobFeatures.location,
        ...jobFeatures.jobType,
        ...userFeatures.skills,
        userFeatures.experience,
        ...userFeatures.preferredLocations,
        ...userFeatures.preferredJobTypes
      ], [1, -1]);

      // Get prediction
      const prediction = model.predict(features);
      const score = await prediction.data();

      // Calculate matching factors
      const matchingFactors = calculateMatchingFactors(job, userProfile);

      return {
        job,
        score: score[0],
        matchingFactors
      };
    }));

    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in job-match function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function extractJobFeatures(job: any): JobFeatures {
  // Convert job data to numerical features
  // This is a simplified version - expand based on your needs
  return {
    skills: job.skills.map((skill: string) => convertSkillToVector(skill)),
    experience: normalizeExperience(job.requiredExperience),
    location: convertLocationToVector(job.location),
    jobType: convertJobTypeToVector(job.jobType)
  };
}

function extractUserFeatures(userProfile: any): UserFeatures {
  return {
    skills: userProfile.skills.map((skill: string) => convertSkillToVector(skill)),
    experience: normalizeExperience(userProfile.yearsOfExperience),
    preferredLocations: userProfile.preferredLocations.map((loc: string) => convertLocationToVector(loc)),
    preferredJobTypes: userProfile.preferredJobTypes.map((type: string) => convertJobTypeToVector(type))
  };
}

function calculateMatchingFactors(job: any, userProfile: any): string[] {
  const factors: string[] = [];

  // Skills match
  const matchingSkills = job.skills.filter((skill: string) => 
    userProfile.skills.includes(skill)
  );
  if (matchingSkills.length > 0) {
    factors.push(`Matching skills: ${matchingSkills.join(', ')}`);
  }

  // Experience match
  if (userProfile.yearsOfExperience >= job.requiredExperience) {
    factors.push('Required experience met');
  }

  // Location match
  if (userProfile.preferredLocations.includes(job.location)) {
    factors.push('Location preference matched');
  }

  // Job type match
  if (userProfile.preferredJobTypes.includes(job.jobType)) {
    factors.push('Job type preference matched');
  }

  return factors;
}

// Helper functions for feature conversion
function convertSkillToVector(skill: string): number {
  // Implement skill embedding logic
  return 0;
}

function normalizeExperience(years: number): number {
  return Math.min(years / 10, 1); // Normalize to 0-1
}

function convertLocationToVector(location: string): number[] {
  // Implement location embedding logic
  return [0];
}

function convertJobTypeToVector(jobType: string): number[] {
  // Implement job type embedding logic
  return [0];
}
