
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface InterviewSession {
  id: string;
  user_id: string;
  session_name: string;
  position: string;
  company: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions_answered: number;
  total_questions: number;
  score: number | null;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
}

interface InterviewResponse {
  id: string;
  session_id: string;
  question: string;
  user_answer: string;
  ai_feedback: string;
  score: number;
  created_at: string;
}

export const useInterviewSessions = () => {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [responses, setResponses] = useState<InterviewResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchSessions = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching sessions:', error);
      } else {
        setSessions(data || []);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (sessionData: {
    session_name: string;
    position: string;
    company: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .insert({
          user_id: user.id,
          ...sessionData,
          questions_answered: 0,
          total_questions: 10, // Default to 10 questions
          status: 'active'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating session:', error);
        return null;
      }

      setCurrentSession(data);
      await fetchSessions();
      return data;
    } catch (error) {
      console.error('Error creating session:', error);
      return null;
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      // First delete all responses for this session
      await supabase
        .from('interview_responses')
        .delete()
        .eq('session_id', sessionId);

      // Then delete the session
      const { error } = await supabase
        .from('interview_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) {
        console.error('Error deleting session:', error);
        return false;
      }

      await fetchSessions();
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
      }
      return true;
    } catch (error) {
      console.error('Error deleting session:', error);
      return false;
    }
  };

  const saveResponse = async (response: {
    question: string;
    user_answer: string;
    ai_feedback: string;
    score: number;
  }) => {
    if (!currentSession) return null;

    try {
      const { data, error } = await supabase
        .from('interview_responses')
        .insert({
          session_id: currentSession.id,
          ...response
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving response:', error);
        return null;
      }

      // Update session progress
      await supabase
        .from('interview_sessions')
        .update({
          questions_answered: currentSession.questions_answered + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentSession.id);

      await fetchSessions();
      return data;
    } catch (error) {
      console.error('Error saving response:', error);
      return null;
    }
  };

  const completeSession = async (sessionId: string, finalScore: number) => {
    try {
      const { error } = await supabase
        .from('interview_sessions')
        .update({
          status: 'completed',
          score: finalScore,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) {
        console.error('Error completing session:', error);
        return false;
      }

      await fetchSessions();
      return true;
    } catch (error) {
      console.error('Error completing session:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  return {
    sessions,
    currentSession,
    responses,
    loading,
    setCurrentSession,
    createSession,
    deleteSession,
    saveResponse,
    completeSession,
    fetchSessions
  };
};
