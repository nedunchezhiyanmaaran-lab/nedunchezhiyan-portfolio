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

export interface SupabaseFeedback {
  id: string;
  name: string;
  role?: string;
  email?: string;
  rating: string;
  message: string;
  device: string;
  os: string;
  browser: string;
  referrer: string;
  created_at: string;
}

// Database Operations with Resilience & Error Handling
export const db = {
  // Leads
  async getLeads(): Promise<SupabaseLead[]> {
    try {
      const { data, error } = await supabase
        .from('contact_leads')
        .select('*')
        .neq('project_type', 'Visitor Feedback')
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

  // Visitor Feedbacks
  async submitFeedback(feedback: {
    name: string;
    role?: string;
    email?: string;
    rating: string;
    message: string;
    device: string;
    os: string;
    browser: string;
    referrer: string;
    visitorId?: string;
  }): Promise<SupabaseFeedback | null> {
    try {
      const vId = feedback.visitorId || 'anon';
      const cleanRole = feedback.role?.trim() || '';
      const { data, error } = await supabase
        .from('contact_leads')
        .insert([
          {
            name: feedback.name || 'Anonymous Visitor',
            email: feedback.email || (cleanRole ? cleanRole : 'visitor@feedback.dev'),
            project_type: 'Visitor Feedback',
            budget: feedback.rating,
            timeline: `${feedback.device} · ${feedback.os} (${feedback.browser})`,
            message: feedback.message,
            status: 'new',
            notes: `role:${cleanRole}|vis:${vId}|dev:${feedback.device}_${feedback.os}_${feedback.browser}_${feedback.referrer}`,
          },
        ])
        .select()
        .single();
      if (error) throw error;
      if (data) {
        return {
          id: data.id,
          name: data.name,
          role: cleanRole || 'Visitor',
          email: data.email,
          rating: data.budget,
          message: data.message,
          device: feedback.device,
          os: feedback.os,
          browser: feedback.browser,
          referrer: feedback.referrer,
          created_at: data.created_at || new Date().toISOString(),
        };
      }
      return null;
    } catch (err) {
      console.warn('Supabase submitFeedback fallback:', err);
      return null;
    }
  },

  async getFeedbacks(): Promise<SupabaseFeedback[]> {
    try {
      const { data, error } = await supabase
        .from('contact_leads')
        .select('*')
        .eq('project_type', 'Visitor Feedback')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map((row: any) => {
        const devInfo = row.timeline || 'Desktop · Windows (Chrome)';
        const parts = devInfo.split('·');
        const dev = parts[0]?.trim() || 'Desktop';
        const rest = parts[1]?.trim() || 'Windows (Chrome)';
        const osMatch = rest.match(/^(.*?)\s*\((.*?)\)$/);
        const os = osMatch ? osMatch[1] : rest;
        const browser = osMatch ? osMatch[2] : 'Chrome';

        const notes = row.notes || '';
        let referrer = 'Direct';
        if (notes.includes('dev:')) {
          const noteParts = notes.split('dev:')[1]?.split('_') || [];
          referrer = noteParts[3] || 'Direct';
        } else if (notes.includes('device:')) {
          const noteParts = notes.replace('device:', '').split('_');
          referrer = noteParts[3] || 'Direct';
        }

        // Extract role from notes or email or name pattern
        let role = '';
        if (notes.includes('role:')) {
          const roleMatch = notes.match(/role:([^|]*)/);
          if (roleMatch && roleMatch[1]?.trim()) {
            role = roleMatch[1].trim();
          }
        }

        let displayName = row.name || 'Anonymous Visitor';
        if (!role) {
          if (displayName.includes('/')) {
            const split = displayName.split('/');
            displayName = split[0].trim();
            role = split[1].trim();
          } else if (displayName.includes('·')) {
            const split = displayName.split('·');
            displayName = split[0].trim();
            role = split[1].trim();
          } else if (displayName.includes('(') && displayName.includes(')')) {
            const m = displayName.match(/^(.*?)\s*\((.*?)\)$/);
            if (m) {
              displayName = m[1].trim();
              role = m[2].trim();
            }
          } else if (row.email && row.email !== 'visitor@feedback.dev' && !row.email.includes('@')) {
            role = row.email;
          }
        }

        return {
          id: row.id,
          name: displayName,
          role: role || 'Visitor',
          email: row.email,
          rating: row.budget || '5/5 ⭐',
          message: row.message,
          device: dev,
          os: os,
          browser: browser,
          referrer: referrer,
          created_at: row.created_at || new Date().toISOString(),
        };
      });
    } catch (err) {
      console.warn('Supabase getFeedbacks fallback:', err);
      return [];
    }
  },

  async deleteFeedback(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('contact_leads').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch {
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

  async getSessions(limit = 1000): Promise<SupabaseSession[]> {
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

  async getEvents(limit = 1000): Promise<SupabaseEvent[]> {
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
