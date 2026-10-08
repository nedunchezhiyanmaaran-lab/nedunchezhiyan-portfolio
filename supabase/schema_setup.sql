-- ================================================================
-- NEDUNCHEZHIYAN PORTFOLIO — COMPLETE SUPABASE DATABASE SETUP
-- Safe, Idempotent, and Error-Free
-- ================================================================

-- 1. Create site_events table (Traffic, CTA & Intent Tracking)
CREATE TABLE IF NOT EXISTS site_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event TEXT NOT NULL,
  ref TEXT,
  path TEXT DEFAULT '/',
  role TEXT,
  goal TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure all columns exist on site_events
ALTER TABLE site_events ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE site_events ADD COLUMN IF NOT EXISTS goal TEXT;
ALTER TABLE site_events ADD COLUMN IF NOT EXISTS path TEXT DEFAULT '/';
ALTER TABLE site_events ADD COLUMN IF NOT EXISTS ref TEXT;

-- 2. Create checklist_leads table (Free MVP Scoping Checklist)
CREATE TABLE IF NOT EXISTS checklist_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  idea TEXT NOT NULL,
  ref TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Ensure contact_leads table has intent & campaign columns
ALTER TABLE contact_leads ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE contact_leads ADD COLUMN IF NOT EXISTS goal TEXT;
ALTER TABLE contact_leads ADD COLUMN IF NOT EXISTS ref TEXT;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE site_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;

-- 5. Set up RLS Policies (Drop and recreate safely to avoid duplicate errors)
DO $$
BEGIN
  -- site_events policies
  DROP POLICY IF EXISTS "Allow public insert to site_events" ON site_events;
  DROP POLICY IF EXISTS "Allow public read to site_events" ON site_events;
  DROP POLICY IF EXISTS "Allow public delete to site_events" ON site_events;
  CREATE POLICY "Allow public insert to site_events" ON site_events FOR INSERT WITH CHECK (true);
  CREATE POLICY "Allow public read to site_events" ON site_events FOR SELECT USING (true);
  CREATE POLICY "Allow public delete to site_events" ON site_events FOR DELETE USING (true);

  -- checklist_leads policies
  DROP POLICY IF EXISTS "Allow public insert to checklist_leads" ON checklist_leads;
  DROP POLICY IF EXISTS "Allow public read to checklist_leads" ON checklist_leads;
  DROP POLICY IF EXISTS "Allow public update to checklist_leads" ON checklist_leads;
  DROP POLICY IF EXISTS "Allow public delete to checklist_leads" ON checklist_leads;
  CREATE POLICY "Allow public insert to checklist_leads" ON checklist_leads FOR INSERT WITH CHECK (true);
  CREATE POLICY "Allow public read to checklist_leads" ON checklist_leads FOR SELECT USING (true);
  CREATE POLICY "Allow public update to checklist_leads" ON checklist_leads FOR UPDATE USING (true);
  CREATE POLICY "Allow public delete to checklist_leads" ON checklist_leads FOR DELETE USING (true);
END $$;
