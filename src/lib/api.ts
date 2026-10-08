import { db, type SupabaseChecklistLead } from './supabase';

export interface SubmitChecklistInput {
  name: string;
  email: string;
  idea: string;
  ref?: string | null;
  honeypot?: string;
}

export interface SubmitChecklistResult {
  success: boolean;
  lead?: SupabaseChecklistLead | null;
  error?: string;
}

const CLIENT_RATE_LIMIT_KEY = 'nedun_checklist_submit_timestamps_v1';

export const submitChecklistForm = async (
  input: SubmitChecklistInput
): Promise<SubmitChecklistResult> => {
  // 1. Honeypot check
  if (input.honeypot && input.honeypot.trim().length > 0) {
    return { success: false, error: 'Spam validation triggered.' };
  }

  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const idea = input.idea.trim();
  const ref = input.ref?.trim() || null;

  // 2. Format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name) return { success: false, error: 'Please enter your name.' };
  if (!email || !emailRegex.test(email)) return { success: false, error: 'Please enter a valid email address.' };
  if (!idea) return { success: false, error: 'Please enter what you are building.' };

  // 3. Client-side Rate Limit Check (5 per hour)
  try {
    const raw = localStorage.getItem(CLIENT_RATE_LIMIT_KEY);
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    const timestamps: number[] = raw ? JSON.parse(raw).filter((t: number) => t > oneHourAgo) : [];

    if (timestamps.length >= 5) {
      return { success: false, error: 'Rate limit reached. Maximum 5 submissions per hour.' };
    }

    timestamps.push(now);
    localStorage.setItem(CLIENT_RATE_LIMIT_KEY, JSON.stringify(timestamps));
  } catch {
    // Continue even if localStorage is restricted
  }

  // 4. Try POST /api/checklist first (server endpoint)
  try {
    const response = await fetch('/api/checklist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        idea,
        ref,
        honeypot: input.honeypot || '',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, lead: data.lead };
    }

    if (response.status === 400 || response.status === 429) {
      const errData = await response.json().catch(() => ({}));
      return { success: false, error: errData.error || 'Submission failed. Please check your details.' };
    }
  } catch {
    // If running in environment without /api/checklist server middleware (e.g. pure static preview),
    // proceed to direct Supabase client fallback.
  }

  // 5. Direct Supabase Client fallback
  try {
    const lead = await db.createChecklistLead({
      name,
      email,
      idea,
      ref,
      status: 'new',
    });

    if (lead) {
      return { success: true, lead };
    }
  } catch (err: any) {
    console.error('Checklist fallback error:', err);
  }

  return { success: false, error: 'Unable to save your submission. Please try again.' };
};
