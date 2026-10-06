import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://cmzfnieekeckwkigyoew.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtemZuaWVla2Vja3draWd5b2V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNzU3MTksImV4cCI6MjEwMTk1MTcxOX0.cXdLwuoL8qeQGFCuFQKCvKJH91h0AZaHGw18zCb9mH8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SupabaseLead {
  id: string;
  name: string;
  email: string;
  project_type: string;
  budget: string;
  timeline?: string;
  message: string;
  status: 'new' | 'contacted' | 'archived';
  notes?: string;
  created_at?: string;
}

export interface SupabaseSession {
  id: string;
  timestamp: string;
  duration: number;
  referrer: string;
  device: string;
  browser: string;
  os: string;
  country: string;
  city: string;
  page_views: number;
  sections_viewed: string[];
  project_interactions: any[];
}

export interface SupabaseEvent {
  id?: string;
  event_type: string;
  description: string;
  meta?: string;
  created_at?: string;
}

// Database Operations with Resilience & Error Handling
export const db = {
  // Leads
  async getLeads(): Promise<SupabaseLead[]> {
    try {
      const { data, error } = await supabase
        .from('contact_leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('Supabase getLeads fallback:', err);
      return [];
    }
  },

  async createLead(lead: Omit<SupabaseLead, 'id' | 'created_at'>): Promise<SupabaseLead | null> {
    try {
      const { data, error } = await supabase
        .from('contact_leads')
        .insert([
          {
            name: lead.name,
            email: lead.email,
            project_type: lead.project_type,
            budget: lead.budget,
            timeline: lead.timeline || '2-4 Weeks',
            message: lead.message,
            status: lead.status || 'new',
            notes: lead.notes || '',
          },
        ])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase createLead fallback:', err);
      return null;
    }
  },

  async updateLeadStatus(id: string, status: SupabaseLead['status'], notes?: string): Promise<boolean> {
    try {
      const updates: any = { status };
      if (notes !== undefined) updates.notes = notes;
      const { error } = await supabase.from('contact_leads').update(updates).eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase updateLeadStatus fallback:', err);
      return false;
    }
  },

  async deleteLead(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('contact_leads').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase deleteLead fallback:', err);
      return false;
    }
  },

  // Sessions & Telemetry
  async saveSession(session: SupabaseSession): Promise<boolean> {
    try {
      const { error } = await supabase.from('visitor_sessions').upsert([
        {
          id: session.id,
          timestamp: session.timestamp,
          duration: session.duration,
          referrer: session.referrer,
          device: session.device,
          browser: session.browser,
          os: session.os,
          country: session.country,
          city: session.city,
          page_views: session.page_views,
          sections_viewed: session.sections_viewed,
          project_interactions: session.project_interactions,
        },
      ]);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase saveSession fallback:', err);
      return false;
    }
  },

  async getSessions(limit = 100): Promise<SupabaseSession[]> {
    try {
      const { data, error } = await supabase
        .from('visitor_sessions')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('Supabase getSessions fallback:', err);
      return [];
    }
  },

  // Events Log
  async logEvent(type: string, description: string, meta?: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('analytics_events').insert([
        {
          event_type: type,
          description,
          meta: meta || '',
        },
      ]);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase logEvent fallback:', err);
      return false;
    }
  },

  async getEvents(limit = 50): Promise<SupabaseEvent[]> {
    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('Supabase getEvents fallback:', err);
      return [];
    }
  },
};
