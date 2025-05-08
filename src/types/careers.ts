
export interface CareerApplication {
  id: string;
  applicant_name: string;
  applicant_email: string;
  proposal_text: string;
  proposal_file_url?: string;
  submitted_at: string;
  votes_count: number;
  user_id?: string;
}

export interface Vote {
  id: string;
  application_id: string;
  voter_id: string;
  created_at: string;
}
