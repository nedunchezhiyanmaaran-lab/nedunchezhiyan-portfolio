import {
  trackEvent,
  ROLE_DISPLAY_MAP,
  GOAL_DISPLAY_MAP,
  type TrackedRole,
  type TrackedGoal,
} from './sourceTracking';

export const ALLOWED_ROLES = [
  'Founder',
  'Co-founder',
  'Developer',
  'Agency / Team',
  'Other',
] as const;

export type UserRole = (typeof ALLOWED_ROLES)[number];

export const ALLOWED_GOALS = [
  'Build a new app / MVP',
  'Revamp or improve an existing app',
  'Add features or integrations',
  'Turn a manual process into software',
  'Just exploring',
] as const;

export type UserGoal = (typeof ALLOWED_GOALS)[number];

export interface UserIntent {
  role?: UserRole;
  goal?: UserGoal;
  canonicalRole?: TrackedRole;
  canonicalGoal?: TrackedGoal;
  answered?: boolean;
  skipped?: boolean;
  timestamp: number;
}

const INTENT_STORAGE_KEY = 'intent';

export const getStoredIntent = (): UserIntent | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(INTENT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const hasUserCompletedIntent = (): boolean => {
  const intent = getStoredIntent();
  return Boolean(intent && (intent.answered || intent.skipped));
};

export const saveUserIntent = async (role?: UserRole, goal?: UserGoal): Promise<void> => {
  if (typeof window === 'undefined') return;

  const canonicalRole = role ? ROLE_DISPLAY_MAP[role] : undefined;
  const canonicalGoal = goal ? GOAL_DISPLAY_MAP[goal] : undefined;

  const intentData: UserIntent = {
    role,
    goal,
    canonicalRole,
    canonicalGoal,
    answered: true,
    skipped: false,
    timestamp: Date.now(),
  };

  localStorage.setItem(INTENT_STORAGE_KEY, JSON.stringify(intentData));
  window.dispatchEvent(new CustomEvent('intent_updated', { detail: intentData }));

  await trackEvent({
    event: 'intent_answered',
    role: canonicalRole || null,
    goal: canonicalGoal || null,
  });
};

export const skipUserIntent = async (): Promise<void> => {
  if (typeof window === 'undefined') return;

  const intentData: UserIntent = {
    answered: false,
    skipped: true,
    timestamp: Date.now(),
  };

  localStorage.setItem(INTENT_STORAGE_KEY, JSON.stringify(intentData));
  window.dispatchEvent(new CustomEvent('intent_updated', { detail: intentData }));

  await trackEvent({
    event: 'intent_skipped',
  });
};

export const getPersonalizedCtaLabel = (intent: UserIntent | null): string => {
  if (!intent || !intent.goal || intent.role === 'Developer' || intent.canonicalRole === 'developer') {
    return 'Start a Project';
  }

  const goalKey = intent.canonicalGoal || (intent.goal ? GOAL_DISPLAY_MAP[intent.goal] : undefined);

  switch (goalKey) {
    case 'new_app':
      return "Let's scope your MVP";
    case 'revamp':
      return "Let's improve your app";
    case 'add_features':
      return "Let's add that feature";
    case 'manual_process':
      return "Let's automate it";
    case 'exploring':
    default:
      return 'Start a Project';
  }
};

export const getPreFilledContactMessage = (intent: UserIntent | null): string => {
  if (!intent || !intent.role) return '';

  const roleLabel = intent.role.toLowerCase();

  if (intent.role === 'Developer' || intent.canonicalRole === 'developer') {
    return "Hey Nedun, I'm a developer looking to connect/collaborate on: ";
  }

  const goalKey = intent.canonicalGoal || (intent.goal ? GOAL_DISPLAY_MAP[intent.goal] : undefined);

  if (goalKey) {
    switch (goalKey) {
      case 'new_app':
        return `I'm a ${roleLabel} looking to build a new app / MVP. Here's what I'm working on: `;
      case 'revamp':
        return `I'm a ${roleLabel} looking to revamp or improve an existing app. Bottlenecks: `;
      case 'add_features':
        return `I'm a ${roleLabel} looking to add features and integrations: `;
      case 'manual_process':
        return `I'm a ${roleLabel} looking to turn a manual process into software. The process: `;
      case 'exploring':
        return `I'm a ${roleLabel} exploring technical collaboration: `;
    }
  }

  return `I'm a ${roleLabel} looking to discuss a potential project: `;
};
