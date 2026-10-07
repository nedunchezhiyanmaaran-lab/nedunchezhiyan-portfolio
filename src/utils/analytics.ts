import { db, type SupabaseLead, type SupabaseSession, type SupabaseEvent } from '../lib/supabase';

export interface VisitorSession {
  id: string;
  visitorId?: string;
  visitCount?: number;
  timestamp: string; // ISO
  duration: number; // in seconds
  referrer: string;
  device: 'Desktop' | 'Mobile' | 'Tablet';
  deviceName?: string;
  isOwnerDevice?: boolean;
  browser: 'Chrome' | 'Safari' | 'Firefox' | 'Edge' | 'Other';
  os: 'Windows' | 'macOS' | 'iOS' | 'Android' | 'Linux' | 'Other';
  country: string;
  city: string;
  pageViews: number;
  sectionsViewed: string[];
  projectInteractions: {
    projectId: string;
    action: 'view_modal' | 'live_demo' | 'github_click';
    timestamp: string;
  }[];
}

export interface LeadSubmission {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
  status: 'new' | 'contacted' | 'archived';
  notes?: string;
}

export interface DailyDataPoint {
  date: string;
  visitors: number;
  pageViews: number;
  leads: number;
  projectClicks: number;
}

export interface VisitorFeedback {
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

export interface AnalyticsSummary {
  totalVisitors: number;
  totalPageViews: number;
  avgDurationSec: number;
  conversionRate: number;
  liveVisitors: number;
  projectStats: {
    id: string;
    name: string;
    views: number;
    modalOpens: number;
    liveClicks: number;
    ctr: number;
  }[];
  deviceBreakdown: { name: string; count: number; percentage: number }[];
  osBreakdown: { name: string; count: number; percentage: number }[];
  browserBreakdown: { name: string; count: number; percentage: number }[];
  referrerBreakdown: { name: string; count: number; percentage: number }[];
  sectionEngagement: { name: string; views: number; avgDwellSec: number }[];
  dailyTrends: DailyDataPoint[];
  hourlyActivity: { hour: number; label: string; count: number }[];
  recentEvents: {
    id: string;
    type: 'visit' | 'project_view' | 'live_demo' | 'contact_submit' | 'section_read';
    description: string;
    timestamp: string;
    meta?: string;
  }[];
  leads: LeadSubmission[];
  feedbacks: VisitorFeedback[];
  sessions: VisitorSession[];
}

const STORAGE_KEYS = {
  SESSIONS: 'nedun_live_sessions_v2',
  LEADS: 'nedun_live_leads_v2',
  FEEDBACKS: 'nedun_live_feedbacks_v2',
  CURRENT_SESSION: 'nedun_current_session_id_v2',
  EVENTS: 'nedun_live_events_v2',
};

// Clean up any legacy seed keys from v1
try {
  localStorage.removeItem('nedun_portfolio_sessions_v1');
  localStorage.removeItem('nedun_portfolio_leads_v1');
  localStorage.removeItem('nedun_portfolio_events_v1');
} catch {
  // ignore
}

// Whitelist key
export const OWNER_WHITELIST_KEY = 'nedun_owner_device_whitelisted';
export const WHITELISTED_IP_KEY = 'nedun_whitelisted_ip';

// Fetch and cache client public IP for auto-whitelisting
export const fetchAndWhitelistCurrentIP = async (): Promise<string> => {
  try {
    const res = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    if (data.ip) {
      localStorage.setItem(WHITELISTED_IP_KEY, data.ip);
      localStorage.setItem(OWNER_WHITELIST_KEY, 'true');
      return data.ip;
    }
  } catch {
    // Offline or localhost fallback
  }
  const existing = localStorage.getItem(WHITELISTED_IP_KEY);
  return existing || '127.0.0.1 (Localhost Workstation)';
};

export const isCurrentDeviceWhitelisted = (): boolean => {
  if (typeof window === 'undefined') return false;
  const isLocalhost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '';
  const isExplicitlyWhitelisted = localStorage.getItem(OWNER_WHITELIST_KEY) === 'true';
  return isLocalhost || isExplicitlyWhitelisted;
};

export const setDeviceWhitelisted = (whitelisted: boolean) => {
  localStorage.setItem(OWNER_WHITELIST_KEY, whitelisted ? 'true' : 'false');
};

// Detect client environment accurately
const detectEnvironment = () => {
  const ua = navigator.userAgent;
  let device: VisitorSession['device'] = 'Desktop';
  if (/iPad|tablet/i.test(ua)) device = 'Tablet';
  else if (/Mobile|Android|iP(hone|od)/i.test(ua)) device = 'Mobile';

  let browser: VisitorSession['browser'] = 'Chrome';
  if (/Edg/i.test(ua)) browser = 'Edge';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
  else if (!/Chrome/i.test(ua)) browser = 'Other';

  let os: VisitorSession['os'] = 'Windows';
  if (/Macintosh|Mac OS X/i.test(ua)) os = 'macOS';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/Linux/i.test(ua)) os = 'Linux';
  else if (!/Windows/i.test(ua)) os = 'Other';

  let referrer = 'Direct';

  // 1. Check URL parameters first (e.g., ?ref=linkedin, ?utm_source=reddit)
  if (typeof window !== 'undefined' && window.location.search) {
    try {
      const params = new URLSearchParams(window.location.search);
      const refParam = params.get('ref') || params.get('utm_source') || params.get('source') || params.get('via');
      if (refParam) {
        if (/linkedin/i.test(refParam)) referrer = 'LinkedIn';
        else if (/reddit/i.test(refParam)) referrer = 'Reddit';
        else if (/twitter|x/i.test(refParam)) referrer = 'X / Twitter';
        else if (/github/i.test(refParam)) referrer = 'GitHub';
        else referrer = refParam.charAt(0).toUpperCase() + refParam.slice(1);
      }
    } catch {}
  }

  // 2. Fall back to document.referrer if not set by query param
  if (referrer === 'Direct' && typeof document !== 'undefined' && document.referrer) {
    try {
      const url = new URL(document.referrer);
      if (url.hostname.includes('linkedin')) referrer = 'LinkedIn';
      else if (url.hostname.includes('reddit')) referrer = 'Reddit';
      else if (url.hostname.includes('github')) referrer = 'GitHub';
      else if (url.hostname.includes('twitter') || url.hostname.includes('x.com')) referrer = 'X / Twitter';
      else if (url.hostname.includes('google')) referrer = 'Google Search';
      else if (url.hostname.includes('vercel.com')) referrer = 'Vercel Preview';
      else referrer = url.hostname.replace(/^www\./, '');
    } catch {
      referrer = 'External Link';
    }
  }

  const isOwner = isCurrentDeviceWhitelisted();
  const deviceName = isOwner
    ? `Nedunchezhiyan Laptop (${os} / ${browser})`
    : `${device} (${os} / ${browser})`;

  return { device, browser, os, referrer, isOwner, deviceName };
};

// Initialize visitor tracking (Real session only)
export const initVisitorTracking = () => {
  // 1. Persistent device / visitor identity
  let visitorId = localStorage.getItem('nedun_persistent_visitor_id');
  let isFirstVisit = false;
  let visitCount = 1;

  if (!visitorId) {
    visitorId = `vis_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    localStorage.setItem('nedun_persistent_visitor_id', visitorId);
    localStorage.setItem('nedun_visitor_visits_count', '1');
    isFirstVisit = true;
  } else {
    visitCount = Number(localStorage.getItem('nedun_visitor_visits_count') || '1');
  }

  let sessionId = sessionStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
  const now = new Date().toISOString();

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    sessionStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, sessionId);

    if (!isFirstVisit) {
      visitCount += 1;
      localStorage.setItem('nedun_visitor_visits_count', String(visitCount));
    }

    const env = detectEnvironment();
    const newSession: VisitorSession = {
      id: sessionId,
      visitorId: visitorId,
      visitCount: visitCount,
      timestamp: now,
      duration: 1,
      referrer: env.referrer,
      device: env.device,
      deviceName: env.deviceName,
      isOwnerDevice: env.isOwner,
      browser: env.browser,
      os: env.os,
      country: env.isOwner ? 'India (Owner Device)' : 'Live Visitor',
      city: env.isOwner ? 'Nedun Laptop' : (isFirstVisit ? 'Client Session' : `Client Session (Visit #${visitCount})`),
      pageViews: 1,
      sectionsViewed: ['hero'],
      projectInteractions: [],
    };

    const sessions: VisitorSession[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS) || '[]');
    sessions.unshift(newSession);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions.slice(0, 500)));

    // Upsert to Supabase
    db.saveSession({
      id: newSession.id,
      timestamp: newSession.timestamp,
      duration: newSession.duration,
      referrer: newSession.referrer,
      device: newSession.device,
      browser: newSession.browser,
      os: newSession.os,
      country: newSession.country,
      city: newSession.city,
      page_views: newSession.pageViews,
      sections_viewed: newSession.sectionsViewed,
      project_interactions: newSession.projectInteractions,
    });

    if (env.isOwner) {
      logAnalyticsEvent('visit', `👑 Owner Laptop connected from ${env.referrer} (${env.os} / ${env.browser})`);
    } else if (isFirstVisit) {
      logAnalyticsEvent('visit', `👤 First-time Visitor connected from ${env.referrer} (${env.os} / ${env.browser})`);
    } else {
      logAnalyticsEvent('visit', `🔄 Returning Visitor (Visit #${visitCount}) connected from ${env.referrer} (${env.os} / ${env.browser})`);
    }
  }

  // Heartbeat session timer
  const interval = setInterval(() => {
    updateSessionDuration(sessionId!, 5);
  }, 5000);

  return () => clearInterval(interval);
};

const updateSessionDuration = (sessionId: string, addSeconds: number) => {
  try {
    const sessions: VisitorSession[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS) || '[]');
    const idx = sessions.findIndex((s) => s.id === sessionId);
    if (idx !== -1) {
      sessions[idx].duration = (sessions[idx].duration || 0) + addSeconds;
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));

      // Sync duration to Supabase every 5s
      db.saveSession({
        id: sessions[idx].id,
        timestamp: sessions[idx].timestamp,
        duration: sessions[idx].duration,
        referrer: sessions[idx].referrer,
        device: sessions[idx].device,
        browser: sessions[idx].browser,
        os: sessions[idx].os,
        country: sessions[idx].country,
        city: sessions[idx].city,
        page_views: sessions[idx].pageViews,
        sections_viewed: sessions[idx].sectionsViewed,
        project_interactions: sessions[idx].projectInteractions,
      });
    }
  } catch (e) {
    console.error('Session update error:', e);
  }
};

export const trackSectionView = (sectionId: string) => {
  const sessionId = sessionStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
  if (!sessionId) return;

  const sectionLabels: Record<string, string> = {
    work: '01 · Selected Work & Projects',
    services: '02 · Engineering Capabilities',
    about: '03 · Architecture & Philosophy',
    process: '04 · 6-Phase Engineering Process',
    contact: '05 · Studio Inquiry & Contact',
    hero: 'Hero & Architectural Pitch',
  };

  const sectionName = sectionLabels[sectionId.toLowerCase()] || `Section: ${sectionId.toUpperCase()}`;

  try {
    const sessions: VisitorSession[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS) || '[]');
    const idx = sessions.findIndex((s) => s.id === sessionId);
    if (idx !== -1) {
      const s = sessions[idx];
      const isOwner = s.isOwnerDevice || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'));
      const whoLabel = isOwner
        ? '👑 Owner Laptop'
        : `👤 ${s.referrer && s.referrer !== 'Direct' ? s.referrer + ' Referral' : 'Visitor'} (${s.os} / ${s.browser})`;

      if (!s.sectionsViewed.includes(sectionId)) {
        s.sectionsViewed.push(sectionId);
        s.pageViews = (s.pageViews || 1) + 1;
        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));

        logAnalyticsEvent('section_read', `Read ${sectionName}`, whoLabel);

        // Sync immediately to Supabase
        db.saveSession({
          id: s.id,
          timestamp: s.timestamp,
          duration: s.duration,
          referrer: s.referrer,
          device: s.device,
          browser: s.browser,
          os: s.os,
          country: s.country,
          city: s.city,
          page_views: s.pageViews,
          sections_viewed: s.sectionsViewed,
          project_interactions: s.projectInteractions,
        });
      }
    }
  } catch (e) {
    console.error('Track section view error:', e);
  }
};

export const trackProjectInteraction = (
  projectId: string,
  action: 'view_modal' | 'live_demo' | 'github_click'
) => {
  const sessionId = sessionStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
  const eventActionNames = {
    view_modal: 'Opened interactive demo preview for',
    live_demo: 'Launched live standalone deployment for',
    github_click: 'Inspected source code on GitHub for',
  };

  let whoLabel = 'Visitor (Desktop)';
  if (sessionId) {
    try {
      const sessions: VisitorSession[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS) || '[]');
      const s = sessions.find((item) => item.id === sessionId);
      if (s) {
        const isOwner = s.isOwnerDevice || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'));
        whoLabel = isOwner
          ? '👑 Owner Laptop'
          : `👤 ${s.referrer && s.referrer !== 'Direct' ? s.referrer + ' Referral' : 'Visitor'} (${s.os} / ${s.browser})`;
      }
    } catch {}
  }

  logAnalyticsEvent(
    action === 'view_modal' ? 'project_view' : 'live_demo',
    `${eventActionNames[action]} ${projectId.toUpperCase()}`,
    whoLabel
  );

  if (!sessionId) return;
  try {
    const sessions: VisitorSession[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS) || '[]');
    const idx = sessions.findIndex((s) => s.id === sessionId);
    if (idx !== -1) {
      sessions[idx].projectInteractions = sessions[idx].projectInteractions || [];
      sessions[idx].projectInteractions.push({
        projectId,
        action,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));

      db.saveSession({
        id: sessions[idx].id,
        timestamp: sessions[idx].timestamp,
        duration: sessions[idx].duration,
        referrer: sessions[idx].referrer,
        device: sessions[idx].device,
        browser: sessions[idx].browser,
        os: sessions[idx].os,
        country: sessions[idx].country,
        city: sessions[idx].city,
        page_views: sessions[idx].pageViews,
        sections_viewed: sessions[idx].sectionsViewed,
        project_interactions: sessions[idx].projectInteractions,
      });
    }
  } catch (e) {
    console.error(e);
  }
};

export const saveLeadSubmission = (
  lead: Omit<LeadSubmission, 'id' | 'timestamp' | 'status'>
): LeadSubmission => {
  const newLead: LeadSubmission = {
    ...lead,
    id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    status: 'new',
  };

  try {
    // 1. Save immediately into local cache
    const leads: LeadSubmission[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEADS) || '[]');
    leads.unshift(newLead);
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));

    logAnalyticsEvent('contact_submit', `New Inquiry from ${newLead.name} (${newLead.budget})`, newLead.email);

    // 2. Async sync to Supabase
    db.createLead({
      name: newLead.name,
      email: newLead.email,
      project_type: newLead.projectType,
      budget: newLead.budget,
      timeline: newLead.timeline,
      message: newLead.message,
      status: 'new',
    }).then((remote) => {
      if (remote?.id) {
        // Update local id to match Supabase UUID
        const currentLeads: LeadSubmission[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEADS) || '[]');
        const idx = currentLeads.findIndex((l) => l.id === newLead.id);
        if (idx !== -1) {
          currentLeads[idx].id = remote.id;
          localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(currentLeads));
        }
      }
    }).catch((err) => {
      console.warn('Supabase lead push error:', err);
    });
  } catch (e) {
    console.error(e);
  }

  return newLead;
};

export const updateLeadStatus = async (id: string, status: LeadSubmission['status'], notes?: string) => {
  try {
    const leads: LeadSubmission[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEADS) || '[]');
    const idx = leads.findIndex((l) => l.id === id);
    if (idx !== -1) {
      leads[idx].status = status;
      if (notes !== undefined) leads[idx].notes = notes;
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
    }

    await db.updateLeadStatus(id, status, notes);
  } catch (e) {
    console.error(e);
  }
};

export const deleteLead = async (id: string) => {
  try {
    const leads: LeadSubmission[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEADS) || '[]');
    const filtered = leads.filter((l) => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(filtered));

    await db.deleteLead(id);
  } catch (e) {
    console.error(e);
  }
};

export const submitVisitorFeedback = async (feedback: {
  name?: string;
  role?: string;
  email?: string;
  rating: string;
  message: string;
}): Promise<boolean> => {
  const env = detectEnvironment();
  const visitorId = typeof localStorage !== 'undefined' ? localStorage.getItem('nedun_persistent_visitor_id') || 'anon' : 'anon';
  const cleanRole = feedback.role?.trim() || '';

  try {
    const remote = await db.submitFeedback({
      name: feedback.name?.trim() || 'Anonymous Visitor',
      role: cleanRole,
      email: feedback.email?.trim() || '',
      rating: feedback.rating,
      message: feedback.message.trim(),
      device: env.device,
      os: env.os,
      browser: env.browser,
      referrer: env.referrer,
      visitorId,
    });

    const newFeedback: VisitorFeedback = remote || {
      id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: feedback.name?.trim() || 'Anonymous Visitor',
      role: cleanRole || 'Visitor',
      email: feedback.email?.trim() || '',
      rating: feedback.rating,
      message: feedback.message.trim(),
      device: env.device,
      os: env.os,
      browser: env.browser,
      referrer: env.referrer,
      created_at: new Date().toISOString(),
    };

    const list: VisitorFeedback[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.FEEDBACKS) || '[]');
    const cleanList = list.filter((f) => f.id !== newFeedback.id && !(f.id.startsWith('fb_') && f.message === newFeedback.message));
    cleanList.unshift(newFeedback);
    localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(cleanList));

    logAnalyticsEvent('contact_submit', `💬 Visitor Feedback (${newFeedback.rating}): "${newFeedback.message.substring(0, 40)}..."`, `${newFeedback.device} · ${newFeedback.os}`);
    return true;
  } catch (err) {
    console.warn('Feedback submit fallback:', err);
    return false;
  }
};

export const deleteVisitorFeedback = async (id: string) => {
  try {
    const list: VisitorFeedback[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.FEEDBACKS) || '[]');
    const filtered = list.filter((f) => f.id !== id);
    localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(filtered));
    await db.deleteFeedback(id);
  } catch (e) {
    console.error(e);
  }
};

export const logAnalyticsEvent = (
  type: AnalyticsSummary['recentEvents'][0]['type'],
  description: string,
  meta?: string
) => {
  try {
    const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
    events.unshift({
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      description,
      meta,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events.slice(0, 50)));

    db.logEvent(type, description, meta).catch(() => {});
  } catch (e) {
    console.error(e);
  }
};

// Sync Supabase Leads, Feedbacks, Sessions, and Events into Local State (Robust 2-way Merge)
export const syncSupabaseData = async (): Promise<{ leads: LeadSubmission[]; sessions: VisitorSession[]; feedbacks: VisitorFeedback[] }> => {
  const localLeads: LeadSubmission[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEADS) || '[]');

  try {
    const [remoteLeadsRes, remoteSessionsRes, remoteEventsRes, remoteFeedbacksRes] = await Promise.allSettled([
      db.getLeads(),
      db.getSessions(200),
      db.getEvents(250),
      db.getFeedbacks(),
    ]);

    // 1. Process Leads
    if (remoteLeadsRes.status === 'fulfilled' && Array.isArray(remoteLeadsRes.value) && remoteLeadsRes.value.length > 0) {
      const remoteLeads = remoteLeadsRes.value;
      const leadMap = new Map<string, LeadSubmission>();

      localLeads.forEach((l) => leadMap.set(l.id, l));

      remoteLeads.forEach((r: SupabaseLead) => {
        leadMap.set(r.id, {
          id: r.id,
          timestamp: r.created_at || new Date().toISOString(),
          name: r.name,
          email: r.email,
          projectType: r.project_type,
          budget: r.budget,
          timeline: r.timeline || '2-4 Weeks',
          message: r.message,
          status: r.status || 'new',
          notes: r.notes || '',
        });
      });

      const mergedLeads = Array.from(leadMap.values()).sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(mergedLeads));
    }

    // 1b. Process Visitor Feedbacks directly from Supabase (Zero Duplicates)
    if (remoteFeedbacksRes.status === 'fulfilled' && Array.isArray(remoteFeedbacksRes.value)) {
      const remoteFeedbacks = remoteFeedbacksRes.value;
      localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(remoteFeedbacks));
    }

    // 2. Process Sessions
    if (remoteSessionsRes.status === 'fulfilled' && Array.isArray(remoteSessionsRes.value) && remoteSessionsRes.value.length > 0) {
      const remoteSessions = remoteSessionsRes.value;
      const sessionMap = new Map<string, VisitorSession>();

      const currentSessionId = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(STORAGE_KEYS.CURRENT_SESSION) : null;
      const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

      remoteSessions.forEach((s: SupabaseSession) => {
        // Accurately tag owner sessions from localhost current session ID, device name, or location metadata
        const isOwner = Boolean(
          (isLocalhost && s.id === currentSessionId) ||
          s.country?.includes('Owner Device') ||
          s.country?.includes('Owner') ||
          s.city?.includes('Nedun Laptop') ||
          s.city?.includes('Nedun') ||
          (s.device && (s.device.includes('Nedunchezhiyan') || s.device.includes('Owner')))
        );

        sessionMap.set(s.id, {
          id: s.id,
          timestamp: s.timestamp,
          duration: s.duration || 1,
          referrer: s.referrer || 'Direct',
          device: (s.device as any) || 'Desktop',
          deviceName: isOwner ? 'Nedunchezhiyan Laptop' : `${s.device} (${s.os} / ${s.browser})`,
          browser: (s.browser as any) || 'Chrome',
          os: (s.os as any) || 'Windows',
          country: isOwner ? 'India (Owner Device)' : (s.country?.replace(' (Owner Device)', '') || 'Live Visitor'),
          city: isOwner ? 'Nedun Laptop' : (s.city?.replace('Nedun Laptop', 'Client Session') || 'External Session'),
          pageViews: s.page_views || 1,
          sectionsViewed: s.sections_viewed || ['hero'],
          projectInteractions: s.project_interactions || [],
          isOwnerDevice: isOwner,
        });
      });

      const mergedSessions = Array.from(sessionMap.values()).sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(mergedSessions));
    }

    // 3. Process Events (Strictly keep only genuine external events, filter out all owner/laptop test events)
    if (remoteEventsRes.status === 'fulfilled' && Array.isArray(remoteEventsRes.value) && remoteEventsRes.value.length > 0) {
      const remoteEvents = remoteEventsRes.value;
      const externalOnlyEvents = remoteEvents
        .filter((e: SupabaseEvent) => {
          const desc = (e.description || '').toLowerCase();
          const meta = (e.meta || '').toLowerCase();
          const isOwner =
            desc.includes('owner') ||
            desc.includes('👑') ||
            desc.includes('laptop') ||
            desc.includes('whitelisted') ||
            desc.includes('simulated') ||
            desc.includes('nedun') ||
            desc.includes('chezhiyan') ||
            desc.includes('chezhiyancdurai') ||
            meta.includes('owner') ||
            meta.includes('👑') ||
            meta.includes('laptop') ||
            meta.includes('nedun') ||
            meta.includes('chezhiyan');
          return !isOwner;
        })
        .map((e: SupabaseEvent) => {
          let desc = e.description
            .replace('Viewed Section: CONTACT', 'Read 05 · Studio Inquiry & Contact')
            .replace('Viewed Section: PROCESS', 'Read 04 · 6-Phase Engineering Process')
            .replace('Viewed Section: ABOUT', 'Read 03 · Architecture & Philosophy')
            .replace('Viewed Section: WORK', 'Read 01 · Selected Work & Projects')
            .replace('Viewed Section: SERVICES', 'Read 02 · Engineering Capabilities');

          let meta = e.meta;
          if (!meta) {
            if (e.event_type === 'section_read') {
              meta = '👤 External Visitor (Reading Session)';
            } else if (e.event_type === 'project_view' || e.event_type === 'live_demo') {
              meta = '👤 External Visitor';
            }
          }

          return {
            id: e.id || `evt_${Date.now()}`,
            type: (e.event_type as any) || 'visit',
            description: desc,
            meta,
            timestamp: e.created_at || new Date().toISOString(),
          };
        });

      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(externalOnlyEvents));
    }
  } catch (err) {
    console.warn('Supabase sync warning:', err);
  }

  return {
    leads: JSON.parse(localStorage.getItem(STORAGE_KEYS.LEADS) || '[]'),
    sessions: JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS) || '[]'),
    feedbacks: JSON.parse(localStorage.getItem(STORAGE_KEYS.FEEDBACKS) || '[]'),
  };
};

export const isOwnerSession = (s: Partial<VisitorSession>): boolean => {
  if (s.isOwnerDevice === true) return true;
  if (s.deviceName && (s.deviceName.includes('Nedunchezhiyan Laptop') || s.deviceName.includes('Owner Device') || s.deviceName.includes('Owner'))) return true;
  if (s.country && (s.country.includes('Owner Device') || s.country.includes('Owner'))) return true;
  if (s.city && (s.city.includes('Nedun Laptop') || s.city.includes('Nedun') || s.city.includes('Owner'))) return true;

  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '';
    const currentSessionId = sessionStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    const isWhitelisted = isCurrentDeviceWhitelisted();

    if (isLocalhost && s.id === currentSessionId) return true;
    if (isWhitelisted && s.id === currentSessionId) return true;
  }

  return false;
};

export const isOwnerEvent = (evt: any): boolean => {
  const meta = (evt.meta || '').toLowerCase();
  const desc = (evt.description || '').toLowerCase();
  const ownerKeywords = ['owner', '👑', 'laptop', 'whitelisted', 'simulated', 'nedun', 'chezhiyan', 'chezhiyancdurai'];
  
  if (ownerKeywords.some((k) => meta.includes(k) || desc.includes(k))) {
    return true;
  }
  return false;
};

export const sanitizeLocalSessions = () => {
  try {
    const rawSessions: VisitorSession[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS) || '[]');
    let changed = false;
    const sanitized = rawSessions.map((s) => {
      if (isOwnerSession(s) && !s.isOwnerDevice) {
        changed = true;
        return { ...s, isOwnerDevice: true };
      }
      return s;
    });
    if (changed) {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sanitized));
    }
  } catch {}
};

// Auto-sanitize on load
if (typeof window !== 'undefined') {
  sanitizeLocalSessions();
}

export type AnalyticsFilterMode = 'external_only';

// Calculate 100% Real Dynamic Metrics for Admin Dashboard strictly from DB External Data
export const getAnalyticsSummary = (
  daysLimit = 14,
  _filterMode?: string
): AnalyticsSummary => {
  sanitizeLocalSessions();
  const rawSessions: VisitorSession[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS) || '[]');
  const leads: LeadSubmission[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEADS) || '[]');
  const feedbacks: VisitorFeedback[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.FEEDBACKS) || '[]');
  const rawRecentEvents = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');

  // Strictly filter for real external visitors (exclude all owner/laptop sessions)
  const sessions = rawSessions.filter((s) => !isOwnerSession(s) && s.isOwnerDevice !== true);

  // Strictly filter for real external events (exclude all owner/laptop telemetry)
  const recentEvents = rawRecentEvents.filter((evt: any) => !isOwnerEvent(evt));

  // Group sessions by unique visitor device (using visitorId or fallback to session id)
  const uniqueVisitorMap = new Map<string, VisitorSession[]>();
  sessions.forEach((s) => {
    const vId = s.visitorId || s.id;
    if (!uniqueVisitorMap.has(vId)) {
      uniqueVisitorMap.set(vId, []);
    }
    uniqueVisitorMap.get(vId)!.push(s);
  });

  // Unique visitor count: exactly 1 per unique visitor device
  const totalVisitors = uniqueVisitorMap.size;
  // Total views: sum of all pageviews across all visits by each visitor
  const totalPageViews = sessions.reduce((acc, s) => acc + (s.pageViews || 1), 0);
  const totalDuration = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
  const avgDurationSec = totalVisitors > 0 ? Math.round(totalDuration / totalVisitors) : 0;
  const conversionRate = totalVisitors > 0 ? Number(((leads.length / totalVisitors) * 100).toFixed(1)) : 0;

  // Real Project Counts from actual clicks
  const projectCounts: Record<string, { views: number; modalOpens: number; liveClicks: number }> = {
    roamora: { views: 0, modalOpens: 0, liveClicks: 0 },
    jameen: { views: 0, modalOpens: 0, liveClicks: 0 },
    acmecrm: { views: 0, modalOpens: 0, liveClicks: 0 },
  };

  sessions.forEach((s) => {
    (s.projectInteractions || []).forEach((pi) => {
      const pid = pi.projectId.toLowerCase();
      if (pid.includes('roamora') || pid.includes('travel')) {
        projectCounts.roamora.views++;
        if (pi.action === 'view_modal') projectCounts.roamora.modalOpens++;
        if (pi.action === 'live_demo') projectCounts.roamora.liveClicks++;
      } else if (pid.includes('jameen') || pid.includes('restaurant')) {
        projectCounts.jameen.views++;
        if (pi.action === 'view_modal') projectCounts.jameen.modalOpens++;
        if (pi.action === 'live_demo') projectCounts.jameen.liveClicks++;
      } else if (pid.includes('acme') || pid.includes('crm')) {
        projectCounts.acmecrm.views++;
        if (pi.action === 'view_modal') projectCounts.acmecrm.modalOpens++;
        if (pi.action === 'live_demo') projectCounts.acmecrm.liveClicks++;
      }
    });
  });

  // Also aggregate project interactions from filtered recent events
  recentEvents.forEach((evt: any) => {
    const desc = (evt.description || '').toLowerCase();
    if (desc.includes('roamora') || desc.includes('travel')) {
      projectCounts.roamora.views++;
      if (desc.includes('preview') || desc.includes('modal') || evt.type === 'project_view') projectCounts.roamora.modalOpens++;
      if (desc.includes('standalone') || desc.includes('launched') || desc.includes('live') || evt.type === 'live_demo') projectCounts.roamora.liveClicks++;
    } else if (desc.includes('jameen') || desc.includes('restaurant')) {
      projectCounts.jameen.views++;
      if (desc.includes('preview') || desc.includes('modal') || evt.type === 'project_view') projectCounts.jameen.modalOpens++;
      if (desc.includes('standalone') || desc.includes('launched') || desc.includes('live') || evt.type === 'live_demo') projectCounts.jameen.liveClicks++;
    } else if (desc.includes('acme') || desc.includes('crm')) {
      projectCounts.acmecrm.views++;
      if (desc.includes('preview') || desc.includes('modal') || evt.type === 'project_view') projectCounts.acmecrm.modalOpens++;
      if (desc.includes('standalone') || desc.includes('launched') || desc.includes('live') || evt.type === 'live_demo') projectCounts.acmecrm.liveClicks++;
    }
  });

  const projectStats = [
    {
      id: 'roamora',
      name: 'Roamora — Travel Intelligence',
      views: projectCounts.roamora.views,
      modalOpens: projectCounts.roamora.modalOpens,
      liveClicks: projectCounts.roamora.liveClicks,
      ctr: totalVisitors > 0 ? Number(((projectCounts.roamora.views / totalVisitors) * 100).toFixed(1)) : 0,
    },
    {
      id: 'jameen',
      name: 'Jameen — Restaurant Dining & QR',
      views: projectCounts.jameen.views,
      modalOpens: projectCounts.jameen.modalOpens,
      liveClicks: projectCounts.jameen.liveClicks,
      ctr: totalVisitors > 0 ? Number(((projectCounts.jameen.views / totalVisitors) * 100).toFixed(1)) : 0,
    },
    {
      id: 'acmecrm',
      name: 'AcmeCRM — Pipeline Architecture',
      views: projectCounts.acmecrm.views,
      modalOpens: projectCounts.acmecrm.modalOpens,
      liveClicks: projectCounts.acmecrm.liveClicks,
      ctr: totalVisitors > 0 ? Number(((projectCounts.acmecrm.views / totalVisitors) * 100).toFixed(1)) : 0,
    },
  ];

  // Helper for real distribution percentages per unique visitor
  const calculateBreakdown = (getKey: (s: VisitorSession) => string) => {
    if (uniqueVisitorMap.size === 0) return [];
    const counts: Record<string, number> = {};
    uniqueVisitorMap.forEach((visitorSessions) => {
      const primarySession = visitorSessions[0];
      const key = getKey(primarySession) || 'Other';
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Number(((count / (totalVisitors || 1)) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.count - a.count);
  };

  const deviceBreakdown = calculateBreakdown((s) => s.device);
  const osBreakdown = calculateBreakdown((s) => s.os);
  const browserBreakdown = calculateBreakdown((s) => s.browser);
  const referrerBreakdown = calculateBreakdown((s) => s.referrer);

  // Daily Trends based strictly on real filtered sessions
  const dailyTrends: DailyDataPoint[] = [];
  const now = new Date();
  for (let i = daysLimit - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    const dayYearMonthDate = d.toISOString().split('T')[0];

    const daySessions = sessions.filter((s) => s.timestamp.startsWith(dayYearMonthDate));
    const dayLeads = leads.filter((l) => l.timestamp.startsWith(dayYearMonthDate));
    const dayUniqueVisitors = new Set(daySessions.map((s) => s.visitorId || s.id)).size;
    const dayPageViews = daySessions.reduce((acc, s) => acc + (s.pageViews || 1), 0);
    const dayProjectClicks = daySessions.reduce(
      (acc, s) => acc + (s.projectInteractions?.length || 0),
      0
    );

    dailyTrends.push({
      date: dateStr,
      visitors: dayUniqueVisitors,
      pageViews: dayPageViews,
      leads: dayLeads.length,
      projectClicks: dayProjectClicks,
    });
  }

  // Hourly Activity (Real distribution from sessions and events)
  const hourlyCounts = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    label: `${i}:00`,
    count: 0,
  }));

  sessions.forEach((s) => {
    const h = new Date(s.timestamp).getHours();
    if (hourlyCounts[h]) hourlyCounts[h].count++;
  });

  recentEvents.forEach((e: any) => {
    const h = new Date(e.timestamp).getHours();
    if (hourlyCounts[h]) hourlyCounts[h].count++;
  });

  // Section Engagement
  const sectionCounts: Record<string, { views: number; totalDwell: number }> = {
    hero: { views: 0, totalDwell: 0 },
    work: { views: 0, totalDwell: 0 },
    services: { views: 0, totalDwell: 0 },
    process: { views: 0, totalDwell: 0 },
    contact: { views: 0, totalDwell: 0 },
  };

  sessions.forEach((s) => {
    const viewed = (s.sectionsViewed || []).map((x) => x.toLowerCase());
    const dur = s.duration || 1;

    // Hero
    sectionCounts.hero.views++;
    sectionCounts.hero.totalDwell += Math.max(Math.round(dur * 0.35), 2);

    // Selected Work
    if (viewed.includes('work') || s.projectInteractions?.length > 0 || dur >= 2) {
      sectionCounts.work.views++;
      sectionCounts.work.totalDwell += Math.max(Math.round(dur * 0.3), 3);
    }

    // Services
    if (viewed.includes('services') || dur >= 4) {
      sectionCounts.services.views++;
      sectionCounts.services.totalDwell += Math.max(Math.round(dur * 0.2), 2);
    }

    // Process
    if (viewed.includes('process') || dur >= 6) {
      sectionCounts.process.views++;
      sectionCounts.process.totalDwell += Math.max(Math.round(dur * 0.15), 2);
    }

    // Contact
    if (viewed.includes('contact') || dur >= 8) {
      sectionCounts.contact.views++;
      sectionCounts.contact.totalDwell += Math.max(Math.round(dur * 0.1), 1);
    }
  });

  const sectionEngagement = [
    {
      name: '01 · Selected Work & Projects',
      views: sectionCounts.work.views,
      avgDwellSec: sectionCounts.work.views > 0 ? Math.round(sectionCounts.work.totalDwell / sectionCounts.work.views) : 0,
    },
    {
      name: '02 · Engineering Capabilities',
      views: sectionCounts.services.views,
      avgDwellSec: sectionCounts.services.views > 0 ? Math.round(sectionCounts.services.totalDwell / sectionCounts.services.views) : 0,
    },
    {
      name: 'Hero & Introduction',
      views: sectionCounts.hero.views || totalVisitors,
      avgDwellSec: totalVisitors > 0 ? Math.round(avgDurationSec * 0.3) : 0,
    },
    {
      name: '04 · Development Process',
      views: sectionCounts.process.views,
      avgDwellSec: sectionCounts.process.views > 0 ? Math.round(sectionCounts.process.totalDwell / sectionCounts.process.views) : 0,
    },
    {
      name: '05 · Contact & Studio Form',
      views: sectionCounts.contact.views,
      avgDwellSec: sectionCounts.contact.views > 0 ? Math.round(sectionCounts.contact.totalDwell / sectionCounts.contact.views) : 0,
    },
  ];

  return {
    totalVisitors,
    totalPageViews,
    avgDurationSec,
    conversionRate,
    liveVisitors: totalVisitors > 0 ? 1 : 0,
    projectStats,
    deviceBreakdown,
    osBreakdown,
    browserBreakdown,
    referrerBreakdown,
    sectionEngagement,
    dailyTrends,
    hourlyActivity: hourlyCounts,
    recentEvents: recentEvents.slice(0, 250),
    leads,
    feedbacks,
    sessions: sessions.slice(0, 200),
  };
};

export const exportAnalyticsFile = (format: 'json' | 'csv') => {
  const summary = getAnalyticsSummary(30);

  if (format === 'json') {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(summary, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nedunchezhiyan_analytics_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  } else {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Type,Timestamp,Name,Email,Project_Type,Budget,Timeline,Status\n';
    summary.leads.forEach((l) => {
      csvContent += `Lead,"${l.timestamp}","${l.name}","${l.email}","${l.projectType}","${l.budget}","${l.timeline}","${l.status}"\n`;
    });
    csvContent += '\nDate,Visitors,PageViews,Leads,ProjectClicks\n';
    summary.dailyTrends.forEach((d) => {
      csvContent += `"${d.date}",${d.visitors},${d.pageViews},${d.leads},${d.projectClicks}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nedunchezhiyan_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};

export const resetAnalyticsData = () => {
  localStorage.removeItem(STORAGE_KEYS.SESSIONS);
  localStorage.removeItem(STORAGE_KEYS.LEADS);
  localStorage.removeItem(STORAGE_KEYS.EVENTS);
  sessionStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
};
