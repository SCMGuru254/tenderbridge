
import { supabase } from "@/integrations/supabase/client";
import { Profile, ProfileView, HiringDecision } from "@/types/profiles";

interface RecordProfileViewParams {
  profile_id_param: string;
  viewer_id_param: string;
}

interface GetProfileViewsParams {
  profile_id_param: string;
}

interface GetHiringDecisionsParams {
  candidate_id_param: string;
}

interface RecordHiringDecisionParams {
  employer_id_param: string;
  candidate_id_param: string;
  decision_date_param: string;
  notes_param: string;
}

export const fetchProfile = async (id: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
    
  if (error) throw error;
  return data;
};

export const recordProfileView = async (
  params: RecordProfileViewParams
): Promise<void> => {
  const { error } = await supabase.rpc(
    "record_profile_view", 
    {
      profile_id_param: params.profile_id_param,
      viewer_id_param: params.viewer_id_param
    }
  );
  if (error) throw error;
};

export const getProfileViews = async (
  params: GetProfileViewsParams
): Promise<ProfileView[]> => {
  const { data, error } = await supabase.rpc(
    "get_profile_views", 
    {
      profile_id_param: params.profile_id_param
    }
  );
  
  if (error) throw error;
  return data as ProfileView[] || [];
};

export const getHiringDecisions = async (
  params: GetHiringDecisionsParams
): Promise<HiringDecision[]> => {
  const { data, error } = await supabase.rpc(
    "get_hiring_decisions", 
    {
      candidate_id_param: params.candidate_id_param
    }
  );
  
  if (error) throw error;
  return data as HiringDecision[] || [];
};

export const recordHiringDecision = async (
  params: RecordHiringDecisionParams
): Promise<void> => {
  const { error } = await supabase.rpc(
    "record_hiring_decision", 
    {
      employer_id_param: params.employer_id_param,
      candidate_id_param: params.candidate_id_param,
      decision_date_param: params.decision_date_param,
      notes_param: params.notes_param
    }
  );
  if (error) throw error;
};
