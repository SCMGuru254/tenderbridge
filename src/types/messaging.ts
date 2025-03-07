
export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  content: string;
  created_at: string;
  read: boolean;
  sender?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
  recipient?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}
