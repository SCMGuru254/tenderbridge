
import { supabase } from "@/integrations/supabase/client";
import { CareerApplication, Vote } from "@/types/careers";

export const fetchCareerApplications = async (): Promise<CareerApplication[]> => {
  const { data, error } = await supabase
    .from("career_applications")
    .select("*, votes(count)")
    .order("votes_count", { ascending: false });

  if (error) {
    console.error("Error fetching career applications:", error);
    throw error;
  }
  
  return data || [];
};

export const submitCareerApplication = async (
  applicant_name: string,
  applicant_email: string,
  proposal_text: string,
  user_id?: string
): Promise<CareerApplication> => {
  const { data, error } = await supabase
    .from("career_applications")
    .insert({
      applicant_name,
      applicant_email,
      proposal_text,
      user_id,
      votes_count: 0
    })
    .select()
    .single();

  if (error) {
    console.error("Error submitting career application:", error);
    throw error;
  }

  return data;
};

export const voteForApplication = async (
  application_id: string,
  voter_id: string
): Promise<void> => {
  // Check if user has already voted for this application
  const { data: existingVote, error: checkError } = await supabase
    .from("career_votes")
    .select("*")
    .eq("application_id", application_id)
    .eq("voter_id", voter_id)
    .maybeSingle();

  if (checkError) {
    console.error("Error checking existing vote:", checkError);
    throw checkError;
  }

  if (existingVote) {
    throw new Error("You have already voted for this application");
  }

  // Create a new vote
  const { error: voteError } = await supabase
    .from("career_votes")
    .insert({
      application_id,
      voter_id
    });

  if (voteError) {
    console.error("Error voting for application:", voteError);
    throw voteError;
  }

  // Update the votes_count for the application
  const { error: updateError } = await supabase.rpc("increment_votes_count", {
    app_id: application_id
  });

  if (updateError) {
    console.error("Error incrementing votes count:", updateError);
    throw updateError;
  }
};

export const getUserVotes = async (userId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from("career_votes")
    .select("application_id")
    .eq("voter_id", userId);

  if (error) {
    console.error("Error fetching user votes:", error);
    throw error;
  }

  return data ? data.map(vote => vote.application_id) : [];
};

export const isVotingOpen = async (): Promise<boolean> => {
  const { data, error } = await supabase
    .from("career_settings")
    .select("*")
    .eq("key", "voting_open")
    .single();

  if (error) {
    console.error("Error checking if voting is open:", error);
    return false;
  }

  return data?.value === "true";
};

export const isDueDate = async (): Promise<boolean> => {
  const { data, error } = await supabase
    .from("career_settings")
    .select("*")
    .eq("key", "due_date")
    .single();

  if (error) {
    console.error("Error checking due date:", error);
    return false;
  }

  if (!data?.value) return false;
  
  const dueDate = new Date(data.value);
  const now = new Date();
  
  return now >= dueDate;
};

export const getDueDate = async (): Promise<string | null> => {
  const { data, error } = await supabase
    .from("career_settings")
    .select("*")
    .eq("key", "due_date")
    .single();

  if (error || !data) {
    console.error("Error getting due date:", error);
    return null;
  }

  return data.value;
};
