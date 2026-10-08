import { db } from '../lib/supabase';

export const ALLOWED_EVENTS = [
  'page_view',
  'cta_start_project_click',
  'cta_view_work_click',
  'intent_answered',
  'intent_skipped',
  'playbook_opened',
  'playbook_download',
  'playbook_cta_click',
  'contact_form_submit',
] as const;

export type TrackedEventType = (typeof ALLOWED_EVENTS)[number];

export const ALLOWED_ROLES = [
  'founder',
  'cofounder',
  'developer',
  'agency',
  'other',
] as const;

export type TrackedRole = (typeof ALLOWED_ROLES)[number];

export const ALLOWED_GOALS = [
  'new_app',
  'revamp',
  'add_features',
  'manual_process',
  'exploring',
] as const;

export type TrackedGoal = (typeof ALLOWED_GOALS)[number];

export const ROLE_DISPLAY_MAP: Record<string, TrackedRole> = {
  'Founder': 'founder',
  'Co-founder': 'cofounder',
  'Developer': 'developer',
  'Agency / Team': 'agency',
  'Other': 'other',
  'founder': 'founder',
  'cofounder': 'cofounder',
  'developer': 'developer',
  'agency': 'agency',
  'other': 'other',
};

export const GOAL_DISPLAY_MAP: Record<string, TrackedGoal> = {
  'Build a new app / MVP': 'new_app',
  'Revamp or improve an existing app': 'revamp',
  'Add features or integrations': 'add_features',
  'Turn a manual process into software': 'manual_process',
  'Just exploring': 'exploring',
  'new_app': 'new_app',
  'revamp': 'revamp',
  'add_features': 'add_features',
  'manual_process': 'manual_process',
  'exploring': 'exploring',
};

export const initRefTracking = (): string | null => {
  if (typeof window === 'undefined') return null;

  try {
    const params = new URLSearchParams(window.location.search);
    const rawRef = params.get('ref');

    if (rawRef) {
      const sanitized = rawRef.trim().toLowerCase();
      // Accept lowercase alphanumeric up to 30 chars; ignore anything else
      if (/^[a-z0-9]{1,30}$/.test(sanitized)) {
        sessionStorage.setItem('ref', sanitized);
        return sanitized;
      }
    }

    return sessionStorage.getItem('ref');
  } catch {
    return null;
  }
};

export const getStoredRef = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = sessionStorage.getItem('ref');
    if (stored && /^[a-z0-9]{1,30}$/.test(stored)) {
      return stored;
    }
  } catch {
    // Ignore
  }
  return null;
};

export interface TrackEventPayload {
  event: TrackedEventType;
  role?: TrackedRole | string | null;
  goal?: TrackedGoal | string | null;
  path?: string;
}

export const trackEvent = async (payload: TrackEventPayload): Promise<void> => {
  if (typeof window === 'undefined') return;

  const eventName = payload.event;
  if (!ALLOWED_EVENTS.includes(eventName)) {
    console.warn(`[Tracking] Disallowed event: ${eventName}`);
    return;
  }

  // Ensure page_view only fires once per session
  if (eventName === 'page_view') {
    try {
      const alreadyTracked = sessionStorage.getItem('tracked_page_view');
      if (alreadyTracked) return;
      sessionStorage.setItem('tracked_page_view', 'true');
    } catch {
      // Ignore
    }
  }

  const ref = getStoredRef();
  const path = (payload.path || window.location.pathname || '/').substring(0, 100);

  let role: TrackedRole | null = null;
  if (payload.role) {
    role = ROLE_DISPLAY_MAP[payload.role] || null;
  }

  let goal: TrackedGoal | null = null;
  if (payload.goal) {
    goal = GOAL_DISPLAY_MAP[payload.goal] || null;
  }

  const requestBody = {
    event: eventName,
    ref,
    path,
    role,
    goal,
  };

  try {
    const res = await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      await db.logSiteEvent(eventName, ref, path, role, goal);
    }
  } catch {
    await db.logSiteEvent(eventName, ref, path, role, goal);
  }
};
