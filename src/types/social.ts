export interface SocialCredentialsRow {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  platform: string;
  credentials: {
    twitter?: {
      appKey: string;
      appSecret: string;
      accessToken: string;
      accessSecret: string;
    };
    linkedin?: {
      clientId: string;
      clientSecret: string;
      accessToken: string;
    };
    facebook?: {
      accessToken: string;
      pageId: string;
    };
    instagram?: {
      accessToken: string;
      businessAccountId: string;
    };
  };
}