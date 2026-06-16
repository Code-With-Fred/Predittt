export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          avatar_url: string | null;
          is_vip: boolean;
          saved_fixture_ids: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name: string;
          avatar_url?: string | null;
          is_vip?: boolean;
          saved_fixture_ids?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string;
          avatar_url?: string | null;
          is_vip?: boolean;
          saved_fixture_ids?: string[] | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      leagues: {
        Row: {
          id: string;
          name: string;
          logo_url: string;
          api_football_id: number | null;
          country: string | null;
          season: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          logo_url: string;
          api_football_id?: number | null;
          country?: string | null;
          season?: number | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          logo_url?: string;
          api_football_id?: number | null;
          country?: string | null;
          season?: number | null;
        };
        Relationships: [];
      };

      teams: {
        Row: {
          id: string;
          name: string;
          logo_url: string;
          api_football_id: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          logo_url: string;
          api_football_id?: number | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          logo_url?: string;
          api_football_id?: number | null;
        };
        Relationships: [];
      };

      fixtures: {
        Row: {
          id: string;
          league_id: string;
          home_team_id: string;
          away_team_id: string;
          kickoff_at: string;
          status: 'scheduled' | 'live' | 'finished';
          home_score: number | null;
          away_score: number | null;
          stats: Json | null;
          api_football_id: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          league_id: string;
          home_team_id: string;
          away_team_id: string;
          kickoff_at: string;
          status?: 'scheduled' | 'live' | 'finished';
          home_score?: number | null;
          away_score?: number | null;
          stats?: Json | null;
          api_football_id?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          league_id?: string;
          home_team_id?: string;
          away_team_id?: string;
          kickoff_at?: string;
          status?: 'scheduled' | 'live' | 'finished';
          home_score?: number | null;
          away_score?: number | null;
          stats?: Json | null;
          api_football_id?: number | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'fixtures_league_id_fkey';
            columns: ['league_id'];
            isOneToOne: false;
            referencedRelation: 'leagues';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'fixtures_home_team_id_fkey';
            columns: ['home_team_id'];
            isOneToOne: false;
            referencedRelation: 'teams';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'fixtures_away_team_id_fkey';
            columns: ['away_team_id'];
            isOneToOne: false;
            referencedRelation: 'teams';
            referencedColumns: ['id'];
          },
        ];
      };

      tipsters: {
        Row: {
          id: string;
          display_name: string;
          is_ai: boolean;
          avatar_url: string;
          user_id: string | null;
          win_rate: number;
          roi_units: number;
          settled: number;
          avg_odds: number;
          avg_confidence: number;
          markets: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          display_name: string;
          is_ai?: boolean;
          avatar_url: string;
          user_id?: string | null;
          win_rate?: number;
          roi_units?: number;
          settled?: number;
          avg_odds?: number;
          avg_confidence?: number;
          markets?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          display_name?: string;
          is_ai?: boolean;
          avatar_url?: string;
          user_id?: string | null;
          win_rate?: number;
          roi_units?: number;
          settled?: number;
          avg_odds?: number;
          avg_confidence?: number;
          markets?: Json | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tipsters_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };

      predictions: {
        Row: {
          id: string;
          fixture_id: string;
          tipster_id: string;
          source: 'ai' | 'manual' | 'hybrid';
          market: string;
          pick: string;
          odds: number;
          confidence: number;
          reasoning: string;
          visibility: 'free' | 'vip' | 'premium';
          price_ngn: number | null;
          status: 'pending' | 'won' | 'lost' | 'void';
          published_at: string;
          settled_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          fixture_id: string;
          tipster_id: string;
          source: 'ai' | 'manual' | 'hybrid';
          market: string;
          pick: string;
          odds: number;
          confidence: number;
          reasoning: string;
          visibility?: 'free' | 'vip' | 'premium';
          price_ngn?: number | null;
          status?: 'pending' | 'won' | 'lost' | 'void';
          published_at?: string;
          settled_at?: string | null;
          created_at?: string;
        };
        Update: {
          fixture_id?: string;
          tipster_id?: string;
          source?: 'ai' | 'manual' | 'hybrid';
          market?: string;
          pick?: string;
          odds?: number;
          confidence?: number;
          reasoning?: string;
          visibility?: 'free' | 'vip' | 'premium';
          price_ngn?: number | null;
          status?: 'pending' | 'won' | 'lost' | 'void';
          published_at?: string;
          settled_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'predictions_fixture_id_fkey';
            columns: ['fixture_id'];
            isOneToOne: false;
            referencedRelation: 'fixtures';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'predictions_tipster_id_fkey';
            columns: ['tipster_id'];
            isOneToOne: false;
            referencedRelation: 'tipsters';
            referencedColumns: ['id'];
          },
        ];
      };

      subscription_plans: {
        Row: {
          id: string;
          name: string;
          currency: 'NGN' | 'USD';
          amount_kobo: number;
          plan_interval: 'monthly' | 'yearly';
          features: string[];
          is_popular: boolean;
          paystack_plan_code: string | null;
          stripe_price_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          currency: 'NGN' | 'USD';
          amount_kobo: number;
          plan_interval: 'monthly' | 'yearly';
          features?: string[];
          is_popular?: boolean;
          paystack_plan_code?: string | null;
          stripe_price_id?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          currency?: 'NGN' | 'USD';
          amount_kobo?: number;
          plan_interval?: 'monthly' | 'yearly';
          features?: string[];
          is_popular?: boolean;
          paystack_plan_code?: string | null;
          stripe_price_id?: string | null;
        };
        Relationships: [];
      };

      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          status: 'active' | 'cancelled' | 'expired' | 'trialing';
          paystack_subscription_code: string | null;
          paystack_customer_code: string | null;
          stripe_subscription_id: string | null;
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id: string;
          status?: 'active' | 'cancelled' | 'expired' | 'trialing';
          paystack_subscription_code?: string | null;
          paystack_customer_code?: string | null;
          stripe_subscription_id?: string | null;
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          plan_id?: string;
          status?: 'active' | 'cancelled' | 'expired' | 'trialing';
          paystack_subscription_code?: string | null;
          paystack_customer_code?: string | null;
          stripe_subscription_id?: string | null;
          current_period_start?: string;
          current_period_end?: string;
          cancel_at_period_end?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'subscriptions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'subscriptions_plan_id_fkey';
            columns: ['plan_id'];
            isOneToOne: false;
            referencedRelation: 'subscription_plans';
            referencedColumns: ['id'];
          },
        ];
      };

      tip_purchases: {
        Row: {
          id: string;
          user_id: string;
          prediction_id: string;
          amount_kobo: number;
          currency: string;
          status: 'pending' | 'success' | 'failed';
          paystack_reference: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          prediction_id: string;
          amount_kobo: number;
          currency?: string;
          status?: 'pending' | 'success' | 'failed';
          paystack_reference?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: 'pending' | 'success' | 'failed';
          paystack_reference?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tip_purchases_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tip_purchases_prediction_id_fkey';
            columns: ['prediction_id'];
            isOneToOne: false;
            referencedRelation: 'predictions';
            referencedColumns: ['id'];
          },
        ];
      };

      payment_events: {
        Row: {
          id: string;
          provider: 'paystack' | 'stripe';
          event_id: string;
          event_type: string;
          payload: Json;
          processed_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          provider: 'paystack' | 'stripe';
          event_id: string;
          event_type: string;
          payload: Json;
          processed_at?: string;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };

      bookmakers: {
        Row: {
          id: string;
          name: string;
          logo_url: string;
          affiliate_url: string;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          logo_url: string;
          affiliate_url: string;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          logo_url?: string;
          affiliate_url?: string;
          is_active?: boolean;
          sort_order?: number;
        };
        Relationships: [];
      };
    };

    Views: {
      [_ in never]: never;
    };

    Functions: {
      is_vip: {
        Args: { user_id: string };
        Returns: boolean;
      };
      tipster_accuracy: {
        Args: { p_tipster_id: string };
        Returns: undefined;
      };
    };

    Enums: {
      prediction_source: 'ai' | 'manual' | 'hybrid';
      prediction_status: 'pending' | 'won' | 'lost' | 'void';
      visibility: 'free' | 'vip' | 'premium';
      fixture_status: 'scheduled' | 'live' | 'finished';
      subscription_status: 'active' | 'cancelled' | 'expired' | 'trialing';
      tip_purchase_status: 'pending' | 'success' | 'failed';
      payment_provider: 'paystack' | 'stripe';
    };

    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
