export interface Database {
  public: {
    Tables: {
      links: {
        Row: {
          id: string;
          user_id: string;
          code: string;
          original_url: string;
          title: string | null;
          clicks_count: number;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          code: string;
          original_url: string;
          title?: string | null;
          clicks_count?: number;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["links"]["Insert"]>;
        Relationships: [];
      };
      clicks: {
        Row: {
          id: string;
          link_id: string;
          country: string | null;
          device_type: string | null;
          ip_hash: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          link_id: string;
          country?: string | null;
          device_type?: string | null;
          ip_hash?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["clicks"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type LinkRow = Database["public"]["Tables"]["links"]["Row"];
export type ClickRow = Database["public"]["Tables"]["clicks"]["Row"];

export type DeviceType = "mobile" | "tablet" | "desktop";

export interface LinkWithStats extends LinkRow {
  short_url: string;
  clicks_by_country: { country: string; count: number }[];
  clicks_by_device: { device: DeviceType | "unknown"; count: number }[];
}
