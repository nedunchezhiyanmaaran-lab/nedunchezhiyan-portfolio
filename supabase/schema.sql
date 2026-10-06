-- Supabase SQL Schema for Nedunchezhiyan Portfolio & Admin Intelligence

-- 1. Table: contact_leads (Studio inquiries & CRM)
CREATE TABLE IF NOT EXISTS contact_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  project_type TEXT NOT NULL,
  budget TEXT NOT NULL,
  timeline TEXT DEFAULT '2-4 Weeks',
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'archived')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Table: visitor_sessions (Visitor telemetry & dwell analytics)
CREATE TABLE IF NOT EXISTS visitor_sessions (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT now(),
  duration INTEGER DEFAULT 1,
  referrer TEXT DEFAULT 'Direct',
  device TEXT DEFAULT 'Desktop',
  browser TEXT DEFAULT 'Chrome',
  os TEXT DEFAULT 'Windows',
  country TEXT DEFAULT 'India',
  city TEXT DEFAULT 'Live Visitor',
  page_views INTEGER DEFAULT 1,
  sections_viewed JSONB DEFAULT '[]'::jsonb,
  project_interactions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Table: analytics_events (Granular interaction logs)
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  description TEXT NOT NULL,
  meta TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable Row Level Security (RLS) with Public Anonymous Insert & Read Policies
ALTER TABLE contact_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow anonymous visitors to insert inquiries & telemetry
CREATE POLICY "Allow public insert to contact_leads" ON contact_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read to contact_leads" ON contact_leads FOR SELECT USING (true);
CREATE POLICY "Allow public update to contact_leads" ON contact_leads FOR UPDATE USING (true);
CREATE POLICY "Allow public delete to contact_leads" ON contact_leads FOR DELETE USING (true);

CREATE POLICY "Allow public insert to visitor_sessions" ON visitor_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to visitor_sessions" ON visitor_sessions FOR UPDATE USING (true);
CREATE POLICY "Allow public read to visitor_sessions" ON visitor_sessions FOR SELECT USING (true);

CREATE POLICY "Allow public insert to analytics_events" ON analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read to analytics_events" ON analytics_events FOR SELECT USING (true);
