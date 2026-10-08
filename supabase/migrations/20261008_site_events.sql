-- Migration: Create site_events table for privacy-friendly ref & conversion analytics
-- Date: 2026-10-08

CREATE TABLE IF NOT EXISTS site_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event TEXT NOT NULL,
  ref TEXT,
  path TEXT DEFAULT '/',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add nullable ref column to contact_leads if not present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_leads' AND column_name = 'ref'
  ) THEN
    ALTER TABLE contact_leads ADD COLUMN ref TEXT;
  END IF;
END $$;

-- Enable Row Level Security (RLS)
ALTER TABLE site_events ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous insert and select
CREATE POLICY "Allow public insert to site_events" ON site_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read to site_events" ON site_events FOR SELECT USING (true);
CREATE POLICY "Allow public delete to site_events" ON site_events FOR DELETE USING (true);

-- Indexes for lightning-fast aggregation by event, ref, and date
CREATE INDEX IF NOT EXISTS idx_site_events_event ON site_events (event);
CREATE INDEX IF NOT EXISTS idx_site_events_ref ON site_events (ref);
CREATE INDEX IF NOT EXISTS idx_site_events_created_at ON site_events (created_at DESC);
