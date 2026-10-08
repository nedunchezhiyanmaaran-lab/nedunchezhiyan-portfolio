-- Migration: Create checklist_leads table for Free MVP Scoping Checklist lead capture
-- Date: 2026-10-08

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

-- Enable Row Level Security (RLS)
ALTER TABLE checklist_leads ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous insert and full authenticated/admin management
CREATE POLICY "Allow public insert to checklist_leads" ON checklist_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read to checklist_leads" ON checklist_leads FOR SELECT USING (true);
CREATE POLICY "Allow public update to checklist_leads" ON checklist_leads FOR UPDATE USING (true);
CREATE POLICY "Allow public delete to checklist_leads" ON checklist_leads FOR DELETE USING (true);

-- Index for rapid query ordering and ref lookups
CREATE INDEX IF NOT EXISTS idx_checklist_leads_created_at ON checklist_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_checklist_leads_ref ON checklist_leads (ref);
CREATE INDEX IF NOT EXISTS idx_checklist_leads_status ON checklist_leads (status);
