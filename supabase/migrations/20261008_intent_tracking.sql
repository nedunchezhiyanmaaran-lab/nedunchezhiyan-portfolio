-- Migration: Intent Tracking & Personalization Schema Updates
-- Adds role & goal columns to site_events and contact_leads

-- 1. Ensure site_events table exists
CREATE TABLE IF NOT EXISTS site_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event TEXT NOT NULL,
  ref TEXT,
  path TEXT DEFAULT '/',
  role TEXT,
  goal TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Add columns if not existing
ALTER TABLE site_events ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE site_events ADD COLUMN IF NOT EXISTS goal TEXT;
ALTER TABLE site_events ADD COLUMN IF NOT EXISTS path TEXT DEFAULT '/';
ALTER TABLE site_events ADD COLUMN IF NOT EXISTS ref TEXT;

-- 3. Add columns to contact_leads
ALTER TABLE contact_leads ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE contact_leads ADD COLUMN IF NOT EXISTS goal TEXT;
ALTER TABLE contact_leads ADD COLUMN IF NOT EXISTS ref TEXT;

-- 4. Enable RLS and public policies
ALTER TABLE site_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert to site_events" ON site_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read to site_events" ON site_events FOR SELECT USING (true);
