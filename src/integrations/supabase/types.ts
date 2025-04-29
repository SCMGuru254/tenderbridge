import { Database as DatabaseGenerated } from './types.generated';

export interface Database extends DatabaseGenerated {
  public: DatabaseGenerated['public'] & {
    Tables: DatabaseGenerated['public']['Tables'] & {
      social_credentials: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          platform: string;
          credentials: Record<string, any>;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          platform: string;
          credentials: Record<string, any>;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          platform?: string;
          credentials?: Record<string, any>;
        };
        Relationships: [
          {
            foreignKeyName: "social_credentials_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
  };
}
