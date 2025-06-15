
import { supabase } from "@/integrations/supabase/client";
import { Poll, PollOption, PollVote } from "@/types/profiles";

export const createPoll = async (discussionId: string, question: string, options: string[], expiresInDays?: number): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const expiresAt = expiresInDays ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000) : null;

  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .insert({
      discussion_id: discussionId,
      question,
      expires_at: expiresAt?.toISOString(),
      created_by: user.id
    })
    .select()
    .single();

  if (pollError) throw pollError;

  const optionInserts = options.map(option => ({
    poll_id: poll.id,
    option_text: option
  }));

  const { error: optionsError } = await supabase
    .from('poll_options')
    .insert(optionInserts);

  if (optionsError) throw optionsError;
};

export const votePoll = async (pollId: string, optionId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Check if user already voted
  const { data: existingVote } = await supabase
    .from('poll_votes')
    .select('id')
    .eq('poll_id', pollId)
    .eq('user_id', user.id)
    .single();

  if (existingVote) {
    // Update existing vote
    const { error } = await supabase
      .from('poll_votes')
      .update({ option_id: optionId })
      .eq('poll_id', pollId)
      .eq('user_id', user.id);

    if (error) throw error;
  } else {
    // Create new vote
    const { error } = await supabase
      .from('poll_votes')
      .insert({
        poll_id: pollId,
        option_id: optionId,
        user_id: user.id
      });

    if (error) throw error;
  }
};

export const getPollsByDiscussion = async (discussionId: string): Promise<(Poll & { options: PollOption[] })[]> => {
  const { data: polls, error: pollsError } = await supabase
    .from('polls')
    .select('*')
    .eq('discussion_id', discussionId);

  if (pollsError) throw pollsError;

  const pollsWithOptions = await Promise.all(
    (polls || []).map(async (poll) => {
      const { data: options, error: optionsError } = await supabase
        .from('poll_options')
        .select('*')
        .eq('poll_id', poll.id)
        .order('created_at');

      if (optionsError) throw optionsError;

      return {
        ...poll,
        options: options || []
      };
    })
  );

  return pollsWithOptions;
};

export const getUserPollVote = async (pollId: string, userId: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('poll_votes')
    .select('option_id')
    .eq('poll_id', pollId)
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data?.option_id || null;
};
