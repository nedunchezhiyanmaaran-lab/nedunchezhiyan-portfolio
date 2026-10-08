import React, { useState, useEffect } from 'react';
import {
  Users,
  Eye,
  Clock,
  Send,
  TrendingUp,
  Globe,
  Laptop,
  Download,
  Trash2,
  RefreshCw,
  ExternalLink,
  Mail,
  ArrowLeft,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles,
  Lock,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MessageSquare,
  ClipboardList,
  Target,
  CheckCircle2,
  X,
} from 'lucide-react';
import {
  getAnalyticsSummary,
  updateLeadStatus,
  deleteLead,
  deleteVisitorFeedback,
  updateChecklistLeadStatus,
  deleteChecklistLead,
  deleteSiteEvent,
  clearAllSiteEvents,
  exportAnalyticsFile,
  resetAnalyticsData,
  logAnalyticsEvent,
  syncSupabaseData,
  type AnalyticsSummary,
  type LeadSubmission,
  type VisitorFeedback,
  type ChecklistLead,
} from '../../utils/analytics';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('nedun_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'intent' | 'traffic' | 'projects' | 'leads' | 'tech' | 'stream' | 'feedbacks' | 'checklists'>('overview');
  const [timeframe, setTimeframe] = useState<7 | 14 | 30>(14);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLead, setSelectedLead] = useState<LeadSubmission | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<any | null>(null);
  const [selectedFeedbackDevice, setSelectedFeedbackDevice] = useState<any | null>(null);
  const [leadNoteInput, setLeadNoteInput] = useState<string>('');
  const [sessionSearch, setSessionSearch] = useState<string>('');
  const [activeHoverPoint, setActiveHoverPoint] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSupabaseSynced, setIsSupabaseSynced] = useState<boolean>(true);

  // Intent Intelligence state
  const [intentSearch, setIntentSearch] = useState<string>('');
  const [intentRoleFilter, setIntentRoleFilter] = useState<string>('all');
  const [intentGoalFilter, setIntentGoalFilter] = useState<string>('all');
  const [intentRefFilter, setIntentRefFilter] = useState<string>('all');
  const [intentPage, setIntentPage] = useState<number>(1);
  const [intentPageSize] = useState<number>(15);

  // Checklist Leads management state
  const [selectedChecklistLead, setSelectedChecklistLead] = useState<ChecklistLead | null>(null);
  const [checklistNoteInput, setChecklistNoteInput] = useState<string>('');
  const [checklistSearch, setChecklistSearch] = useState<string>('');
  const [checklistStatusFilter, setChecklistStatusFilter] = useState<string>('all');
  const [checklistRefFilter, setChecklistRefFilter] = useState<string>('all');

  // Visitor Feedbacks filter state
  const [feedbackDeviceFilter, setFeedbackDeviceFilter] = useState<string>('all');
  const [feedbackSearch, setFeedbackSearch] = useState<string>('');

  // Live Event Stream filters & pagination state
  const [eventSearch, setEventSearch] = useState<string>('');
  const [eventSourceFilter, setEventSourceFilter] = useState<string>('all');
  const [eventPage, setEventPage] = useState<number>(1);
  const [eventPageSize, setEventPageSize] = useState<number>(15);

  // Refresh and sync data from Supabase
  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await syncSupabaseData();
      setIsSupabaseSynced(true);
    } catch {
      setIsSupabaseSynced(false);
    }
    const data = getAnalyticsSummary(timeframe);
    setSummary(data);
    setTimeout(() => setIsRefreshing(false), 300);
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 10000); // 10s live polling
    return () => clearInterval(interval);
  }, [timeframe]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '887766') {
      setIsAuthenticated(true);
      sessionStorage.setItem('nedun_admin_auth', 'true');
      setPinError('');
    } else {
      setPinError('Invalid access PIN. Access denied.');
    }
  };

  const handleSimulateVisitor = () => {
    const projects = ['roamora', 'jameen', 'acmecrm'];
    const randomProject = projects[Math.floor(Math.random() * projects.length)];
    logAnalyticsEvent('project_view', `Simulated visitor opened ${randomProject.toUpperCase()} preview`);
    refreshData();
  };

  const handleStatusChange = (id: string, newStatus: LeadSubmission['status']) => {
    updateLeadStatus(id, newStatus);
    refreshData();
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleDeleteLead = (id: string) => {
    if (window.confirm('Delete this inquiry record?')) {
      deleteLead(id);
      if (selectedLead?.id === id) setSelectedLead(null);
      refreshData();
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    if (window.confirm('Delete this visitor feedback record?')) {
      await deleteVisitorFeedback(id);
      refreshData();
    }
  };

  const handleSaveNote = () => {
    if (!selectedLead) return;
    updateLeadStatus(selectedLead.id, selectedLead.status, leadNoteInput);
    setSelectedLead((prev) => (prev ? { ...prev, notes: leadNoteInput } : null));
    refreshData();
  };

  const handleChecklistStatusChange = async (id: string, newStatus: 'new' | 'contacted' | 'closed') => {
    await updateChecklistLeadStatus(id, newStatus);
    refreshData();
    if (selectedChecklistLead && selectedChecklistLead.id === id) {
      setSelectedChecklistLead((prev: ChecklistLead | null) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleSaveChecklistNote = async () => {
    if (!selectedChecklistLead) return;
    await updateChecklistLeadStatus(selectedChecklistLead.id, selectedChecklistLead.status, checklistNoteInput);
    setSelectedChecklistLead((prev: ChecklistLead | null) => (prev ? { ...prev, note: checklistNoteInput } : null));
    refreshData();
  };

  const handleDeleteChecklist = async (id: string) => {
    if (window.confirm('Delete this checklist lead record?')) {
      await deleteChecklistLead(id);
      if (selectedChecklistLead?.id === id) setSelectedChecklistLead(null);
      refreshData();
    }
  };

  const handleExportChecklistsCSV = () => {
    const list = summary?.checklistLeads || [];
    if (list.length === 0) {
      alert('No checklist leads to export.');
      return;
    }

    const headers = ['ID', 'Name', 'Email', 'Project Idea', 'Traffic Ref', 'Status', 'Private Note', 'Created At'];
    const rows = list.map((l) => [
      `"${l.id}"`,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.idea || '').replace(/"/g, '""')}"`,
      `"${(l.ref || 'Direct').replace(/"/g, '""')}"`,
      `"${l.status}"`,
      `"${(l.note || '').replace(/"/g, '""')}"`,
      `"${l.created_at || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `checklist_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportIntentCSV = () => {
    const list = (summary?.siteEvents || []).filter((e) => e.event === 'intent_answered');
    if (list.length === 0) {
      alert('No intent response records to export.');
      return;
    }

    const headers = ['ID', 'Event', 'Role', 'Goal', 'Traffic Source (?ref)', 'Path', 'Created At'];
    const rows = list.map((e) => [
      `"${e.id}"`,
      `"${e.event}"`,
      `"${(e.role || '').replace(/"/g, '""')}"`,
      `"${(e.goal || '').replace(/"/g, '""')}"`,
      `"${(e.ref || 'Direct').replace(/"/g, '""')}"`,
      `"${(e.path || '/').replace(/"/g, '""')}"`,
      `"${e.created_at || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `visitor_intent_telemetry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDeleteSiteEvent = async (id: string) => {
    if (window.confirm('Delete this intent response record?')) {
      await deleteSiteEvent(id);
      refreshData();
    }
  };

  const handleClearAllIntentRecords = async () => {
    if (window.confirm('Are you sure you want to delete all visitor intent records from Supabase and local cache?')) {
      await clearAllSiteEvents();
      refreshData();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#121211] text-white flex items-center justify-center p-6 overflow-y-auto">
        <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-[#1A1A18] border border-white/10 shadow-2xl space-y-6">
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/30 text-accent mx-auto flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold font-display tracking-tight text-white">
              Admin Analytics Gate
            </h2>
            <p className="text-xs font-sans text-white/60">
              Enter your admin access PIN to view real-time visitor telemetry, leads, and performance data.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/50 mb-1.5">
                Admin Security PIN
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••••"
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-center tracking-widest text-lg focus:outline-none focus:border-accent"
              />
              {pinError && <p className="text-xs text-red-400 mt-2 text-center">{pinError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-accent text-white font-semibold text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-200 shadow-md"
            >
              Authenticate &amp; Open Dashboard
            </button>
          </form>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
            <span>Nedunchezhiyan Portfolio v1.0</span>
            <button
              onClick={onClose}
              className="hover:text-white transition-colors flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portfolio</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!summary) return null;

  // Filter leads based on search term
  const filteredLeads = summary.leads.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.projectType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate SVG Chart Dimensions & Coordinates
  const maxVisitors = Math.max(...summary.dailyTrends.map((d) => d.visitors), 10);
  const maxViews = Math.max(...summary.dailyTrends.map((d) => d.pageViews), 25);
  const chartHeight = 180;
  const chartWidth = 700;
  const points = summary.dailyTrends.map((d, i) => {
    const x = (i / (summary.dailyTrends.length - 1)) * chartWidth;
    const yVisitors = chartHeight - (d.visitors / maxVisitors) * (chartHeight - 30) - 15;
    const yViews = chartHeight - (d.pageViews / maxViews) * (chartHeight - 30) - 15;
    return { x, yVisitors, yViews, ...d };
  });

  const visitorPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.yVisitors}`).join(' ');
  const viewsPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.yViews}`).join(' ');
  const visitorArea = `${visitorPath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  return (
    <div className="fixed inset-0 z-[100] bg-[#0E0E0D] text-[#E8E6DF] flex flex-col font-sans overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="shrink-0 h-16 border-b border-white/10 bg-[#141413] px-6 sm:px-8 flex items-center justify-between z-10">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            <h1 className="font-display font-bold text-white text-base tracking-tight">
              NEDUNCHEZHIYAN <span className="font-mono text-white/40 font-normal text-xs">/ analytics center</span>
            </h1>
          </div>
          <span className="hidden md:inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>{isSupabaseSynced ? 'Supabase Cloud Synced' : 'Offline Cache Mode'}</span>
          </span>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-3">
          {/* External Traffic Indicator Badge */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-accent/10 border border-accent/20 text-xs font-mono text-accent">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-semibold">External Visitors Telemetry</span>
          </div>

          {/* Timeframe Selector */}
          <div className="hidden sm:flex items-center p-1 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
            {([7, 14, 30] as const).map((days) => (
              <button
                key={days}
                onClick={() => setTimeframe(days)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  timeframe === days ? 'bg-accent text-white font-bold' : 'text-white/60 hover:text-white'
                }`}
              >
                {days}D
              </button>
            ))}
          </div>

          <button
            onClick={refreshData}
            title="Refresh Data"
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-accent' : ''}`} />
          </button>

          <button
            onClick={() => exportAnalyticsFile('csv')}
            className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-mono text-white/90 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onClose}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-white hover:text-black transition-all duration-200 shadow-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Portfolio</span>
          </button>
        </div>
      </header>

      {/* Main Body with Tab Navigation */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="shrink-0 w-full md:w-60 border-b md:border-b-0 md:border-r border-white/10 bg-[#121211] p-4 flex md:flex-col justify-between overflow-x-auto md:overflow-y-auto">
          <nav className="flex md:flex-col space-x-1 md:space-x-0 md:space-y-1.5 shrink-0">
            {[
              { id: 'overview', label: 'Overview & KPIs', icon: TrendingUp },
              { id: 'intent', label: `🎯 Visitor Intent (${(summary.siteEvents || []).filter((e) => e.event === 'intent_answered').length})`, icon: Target },
              { id: 'traffic', label: 'Traffic & Trends', icon: Activity },
              { id: 'projects', label: 'Project Engagement', icon: Layers },
              { id: 'leads', label: `Lead Inbox (${summary.leads.length})`, icon: Send },
              { id: 'checklists', label: `📋 Checklist Leads (${summary.checklistLeads?.length || 0})`, icon: ClipboardList },
              { id: 'feedbacks', label: `💬 Visitor Feedbacks (${summary.feedbacks?.length || 0})`, icon: MessageSquare },
              { id: 'tech', label: 'Audience & Stack', icon: Globe },
              { id: 'stream', label: 'Live Event Stream', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left whitespace-nowrap ${
                    isActive
                      ? 'bg-accent/15 text-accent font-semibold border border-accent/30'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Actions Panel */}
          <div className="hidden md:block pt-6 border-t border-white/10 space-y-2 text-xs">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40 block px-2">
              Diagnostics
            </span>
            <button
              onClick={handleSimulateVisitor}
              className="w-full text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all text-[11px] flex items-center justify-between"
            >
              <span>Simulate Visitor Event</span>
              <Activity className="w-3.5 h-3.5 text-accent" />
            </button>
            <button
              onClick={() => exportAnalyticsFile('json')}
              className="w-full text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all text-[11px] flex items-center justify-between"
            >
              <span>Backup Telemetry (JSON)</span>
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                if (window.confirm('Reset all telemetry back to default seeds?')) {
                  resetAnalyticsData();
                  refreshData();
                }
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all text-[11px] flex items-center justify-between"
            >
              <span>Reset Telemetry</span>
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>

        {/* Tab Content Body */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8 max-w-7xl">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Top KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#181816] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-white/50">
                      Total Visitors
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold font-display text-white">
                      {summary.totalVisitors.toLocaleString()}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold">
                      External Only
                    </span>
                  </div>
                  <p className="text-[11px] text-white/50">
                    Self/Laptop traffic excluded &bull; Past {timeframe}D
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#181816] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-white/50">
                      Total Pageviews
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold font-display text-white">
                      {summary.totalPageViews.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/50">
                    {summary.totalVisitors > 0
                      ? `~${(summary.totalPageViews / summary.totalVisitors).toFixed(1)} views per session`
                      : 'No external pageviews yet'}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#181816] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-white/50">
                      Avg Dwell Time
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold font-display text-white">
                      {summary.avgDurationSec > 0
                        ? `${Math.floor(summary.avgDurationSec / 60)}m ${summary.avgDurationSec % 60}s`
                        : '0s'}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/50">
                    External visitor engagement length
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#181816] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-white/50">
                      Inquiries &amp; Leads
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-accent/20 text-accent flex items-center justify-center">
                      <Send className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold font-display text-white">
                      {summary.leads.length}
                    </span>
                    {summary.leads.length > 0 && (
                      <span className="text-xs font-mono text-emerald-400 font-semibold">
                        {summary.conversionRate}% CTR
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/50">
                    {summary.leads.filter((l) => l.status === 'new').length} pending review
                  </p>
                </div>
              </div>

              {/* Main SVG Interactive Traffic Chart */}
              <div className="p-6 rounded-3xl bg-[#181816] border border-white/10 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-display text-lg font-bold text-white">
                        Daily Traffic &amp; Interaction Trends
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-mono">
                        Past {timeframe} Days
                      </span>
                    </div>
                    <p className="text-xs text-white/50">
                      Hover over any data point on the chart to inspect daily visitors and pageviews.
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 text-xs font-mono">
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full bg-accent" />
                      <span className="text-white/70">Visitors</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-white/70">Pageviews</span>
                    </div>
                  </div>
                </div>

                {/* SVG Area & Line Chart */}
                <div className="relative w-full overflow-x-auto">
                  <div className="min-w-[650px]">
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-48 overflow-visible">
                      <defs>
                        <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#D84C24" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#D84C24" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Grid Lines */}
                      {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
                        <line
                          key={i}
                          x1="0"
                          y1={chartHeight * r}
                          x2={chartWidth}
                          y2={chartHeight * r}
                          stroke="rgba(255,255,255,0.06)"
                          strokeDasharray="4 4"
                        />
                      ))}

                      {/* Area Fill */}
                      <path d={visitorArea} fill="url(#visitorGradient)" />

                      {/* Pageviews Line */}
                      <path d={viewsPath} fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />

                      {/* Visitors Line */}
                      <path d={visitorPath} fill="none" stroke="#D84C24" strokeWidth="3" strokeLinecap="round" />

                      {/* Data Point Circles */}
                      {points.map((p, idx) => (
                        <g key={idx}>
                          <circle
                            cx={p.x}
                            cy={p.yVisitors}
                            r={activeHoverPoint === idx ? 6 : 4}
                            className={`cursor-pointer transition-all ${
                              activeHoverPoint === idx
                                ? 'fill-white stroke-accent stroke-[3]'
                                : 'fill-accent stroke-[#181816] stroke-2'
                            }`}
                            onMouseEnter={() => setActiveHoverPoint(idx)}
                            onMouseLeave={() => setActiveHoverPoint(null)}
                          />
                        </g>
                      ))}
                    </svg>

                    {/* Chart Bottom Dates */}
                    <div className="flex justify-between pt-3 text-[10px] font-mono text-white/40 border-t border-white/5">
                      {points.map((p, i) => (
                        <span
                          key={i}
                          className={`text-center ${activeHoverPoint === i ? 'text-accent font-bold' : ''}`}
                        >
                          {p.date}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Active Tooltip Popover */}
                  {activeHoverPoint !== null && (
                    <div
                      className="absolute top-2 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-xl bg-black/90 border border-white/20 shadow-2xl backdrop-blur-md flex items-center space-x-6 text-xs font-mono pointer-events-none"
                    >
                      <span className="text-white/50">{points[activeHoverPoint].date}:</span>
                      <span className="text-accent font-bold">
                        {points[activeHoverPoint].visitors} Visitors
                      </span>
                      <span className="text-blue-400 font-bold">
                        {points[activeHoverPoint].pageViews} Pageviews
                      </span>
                      <span className="text-emerald-400 font-bold">
                        {points[activeHoverPoint].leads} Leads
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Two Column Section: Project Leaders & Recent Inquiries */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Project Leaders */}
                <div className="lg:col-span-6 p-6 rounded-3xl bg-[#181816] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-base font-bold text-white">
                      Project Engagement Leaders
                    </h3>
                    <button
                      onClick={() => setActiveTab('projects')}
                      className="text-xs font-mono text-accent hover:underline flex items-center space-x-1"
                    >
                      <span>Full Breakdown</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {summary.projectStats.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{proj.name}</span>
                          <span className="text-xs font-mono text-accent font-semibold">
                            {proj.views} Views ({proj.ctr}% CTR)
                          </span>
                        </div>
                        {/* Progress bar */}
                        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full"
                            style={{ width: `${Math.min(proj.ctr * 2, 100)}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                          <span>{proj.modalOpens} Interactive Modal Previews</span>
                          <span>{proj.liveClicks} External Launches</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Inquiries Quick Preview */}
                <div className="lg:col-span-6 p-6 rounded-3xl bg-[#181816] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-base font-bold text-white">
                      Recent Inquiries &amp; Proposals
                    </h3>
                    <button
                      onClick={() => setActiveTab('leads')}
                      className="text-xs font-mono text-accent hover:underline flex items-center space-x-1"
                    >
                      <span>View All ({summary.leads.length})</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {summary.leads.slice(0, 3).map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => {
                          setSelectedLead(lead);
                          setLeadNoteInput(lead.notes || '');
                          setActiveTab('leads');
                        }}
                        className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 cursor-pointer transition-all space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-white">{lead.name}</span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-mono uppercase font-semibold ${
                                lead.status === 'new'
                                  ? 'bg-amber-500/15 text-amber-400'
                                  : lead.status === 'contacted'
                                  ? 'bg-emerald-500/15 text-emerald-400'
                                  : 'bg-white/10 text-white/50'
                              }`}
                            >
                              {lead.status}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-accent font-medium">{lead.budget}</span>
                        </div>
                        <p className="text-xs text-white/70 truncate">{lead.message}</p>
                        <span className="text-[10px] font-mono text-white/40 block">
                          {new Date(lead.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: VISITOR INTENT & DEVICE TELEMETRY */}
          {activeTab === 'intent' && (() => {
            const siteEvents = summary.siteEvents || [];
            const answeredEvents = siteEvents.filter((e) => e.event === 'intent_answered');
            const skippedEvents = siteEvents.filter((e) => e.event === 'intent_skipped');
            const totalIntentInteractions = answeredEvents.length + skippedEvents.length;
            const answerRate = totalIntentInteractions > 0
              ? ((answeredEvents.length / totalIntentInteractions) * 100).toFixed(1)
              : '0';

            // Calculate Role Frequencies
            const roleFreq: Record<string, number> = {};
            answeredEvents.forEach((e) => {
              const r = e.role || 'Other';
              roleFreq[r] = (roleFreq[r] || 0) + 1;
            });
            const topRoleEntry = Object.entries(roleFreq).sort((a, b) => b[1] - a[1])[0];
            const topRole = topRoleEntry
              ? `${topRoleEntry[0]} (${Math.round((topRoleEntry[1] / (answeredEvents.length || 1)) * 100)}%)`
              : 'None yet';

            // Calculate Goal Frequencies
            const goalFreq: Record<string, number> = {};
            answeredEvents.forEach((e) => {
              const g = e.goal || 'Just exploring';
              goalFreq[g] = (goalFreq[g] || 0) + 1;
            });
            const topGoalEntry = Object.entries(goalFreq).sort((a, b) => b[1] - a[1])[0];
            const topGoal = topGoalEntry
              ? `${topGoalEntry[0]}`
              : 'None yet';

            // Role by Ref Matrix
            const allRefs = Array.from(new Set(answeredEvents.map((e) => (e.ref || 'direct / none').toLowerCase())));
            if (allRefs.length === 0) allRefs.push('direct / none');

            const refRoleCounts: Record<string, Record<string, number>> = {};
            answeredEvents.forEach((evt) => {
              const r = (evt.ref || 'direct / none').toLowerCase();
              const role = evt.role || 'Other';
              if (!refRoleCounts[r]) refRoleCounts[r] = {};
              refRoleCounts[r][role] = (refRoleCounts[r][role] || 0) + 1;
            });

            // Goal by Role Matrix
            const allRoles = ['Founder', 'Co-founder', 'Developer', 'Agency / Team', 'Other'];
            const roleGoalCounts: Record<string, Record<string, number>> = {};
            answeredEvents.forEach((evt) => {
              const role = evt.role || 'Other';
              const goal = evt.goal || 'Just exploring';
              if (!roleGoalCounts[role]) roleGoalCounts[role] = {};
              roleGoalCounts[role][goal] = (roleGoalCounts[role][goal] || 0) + 1;
            });

            // Unique Filter lists
            const distinctRoles = Array.from(new Set(answeredEvents.map((e) => e.role || 'Other'))).filter(Boolean);
            const distinctGoals = Array.from(new Set(answeredEvents.map((e) => e.goal || 'Just exploring'))).filter(Boolean);
            const distinctRefs = Array.from(new Set(answeredEvents.map((e) => e.ref || 'direct'))).filter(Boolean);

            // Filtered Granular Events
            const filteredIntentList = answeredEvents.filter((item) => {
              const matchesSearch =
                !intentSearch ||
                (item.role || '').toLowerCase().includes(intentSearch.toLowerCase()) ||
                (item.goal || '').toLowerCase().includes(intentSearch.toLowerCase()) ||
                (item.ref || '').toLowerCase().includes(intentSearch.toLowerCase()) ||
                (item.path || '').toLowerCase().includes(intentSearch.toLowerCase());

              const matchesRole =
                intentRoleFilter === 'all' || (item.role || '').toLowerCase() === intentRoleFilter.toLowerCase();
              const matchesGoal =
                intentGoalFilter === 'all' || (item.goal || '').toLowerCase() === intentGoalFilter.toLowerCase();
              const matchesRef =
                intentRefFilter === 'all' || (item.ref || 'direct').toLowerCase() === intentRefFilter.toLowerCase();

              return matchesSearch && matchesRole && matchesGoal && matchesRef;
            });

            // Pagination calculations
            const totalPages = Math.max(1, Math.ceil(filteredIntentList.length / intentPageSize));
            const paginatedIntentList = filteredIntentList.slice(
              (intentPage - 1) * intentPageSize,
              intentPage * intentPageSize
            );

            return (
              <div className="space-y-8">
                {/* Intent Intelligence Header */}
                <div className="p-6 sm:p-8 rounded-3xl bg-[#181816] border border-accent/25 space-y-6 shadow-xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-accent/20 border border-accent/30 text-accent flex items-center justify-center">
                          <Target className="w-4 h-4" />
                        </div>
                        <h2 className="font-display text-2xl font-bold text-white tracking-tight">
                          Visitor Intent &amp; Device Telemetry
                        </h2>
                      </div>
                      <p className="text-xs font-sans text-white/60 max-w-2xl">
                        Comprehensive logging of what founders and technical visitors select when landing on your portfolio. Mapped directly to acquisition campaigns (<code className="text-accent font-mono">?ref=</code>) and client devices in Supabase.
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <button
                        onClick={handleClearAllIntentRecords}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-xs font-mono text-red-400 transition-all shadow-xs cursor-pointer"
                        title="Delete all intent records"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        <span>Clear All</span>
                      </button>

                      <button
                        onClick={handleExportIntentCSV}
                        className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-mono text-white transition-all shadow-xs cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-accent" />
                        <span>Export CSV</span>
                      </button>

                      <button
                        onClick={refreshData}
                        className="p-2.5 rounded-xl bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 transition-all cursor-pointer"
                        title="Refresh live data"
                      >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* 4 KPI Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-white/50">
                          Total Answers
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold font-mono text-white">
                          {answeredEvents.length}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          Live DB
                        </span>
                      </div>
                      <p className="text-[11px] text-white/40">
                        {totalIntentInteractions} Total prompts presented
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-white/50">
                          Answer Rate
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                          <Target className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold font-mono text-accent">
                          {answerRate}%
                        </span>
                        <span className="text-[10px] font-mono text-white/50">
                          vs {skippedEvents.length} skips
                        </span>
                      </div>
                      <p className="text-[11px] text-white/40">
                        High engagement on 5s question
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-white/50">
                          Primary Visitor Role
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                          <Users className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="text-xl font-bold font-display text-white truncate">
                        {topRole}
                      </div>
                      <p className="text-[11px] text-white/40">
                        Most active audience segment
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-white/50">
                          Top Project Scope
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                          <Layers className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="text-sm font-bold font-display text-white truncate" title={topGoal}>
                        {topGoal}
                      </div>
                      <p className="text-[11px] text-white/40">
                        Primary demand requirement
                      </p>
                    </div>
                  </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="p-4 sm:p-5 rounded-3xl bg-[#181816] border border-white/10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search intent records by role, goal, ?ref source, or path..."
                      value={intentSearch}
                      onChange={(e) => {
                        setIntentSearch(e.target.value);
                        setIntentPage(1);
                      }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-white/30 font-mono focus:outline-none focus:border-accent"
                    />
                    {intentSearch && (
                      <button
                        onClick={() => setIntentSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <div className="flex items-center space-x-1.5">
                      <Filter className="w-3.5 h-3.5 text-accent" />
                      <select
                        value={intentRoleFilter}
                        onChange={(e) => {
                          setIntentRoleFilter(e.target.value);
                          setIntentPage(1);
                        }}
                        className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white/80 focus:outline-none focus:border-accent"
                      >
                        <option value="all">All Roles ({answeredEvents.length})</option>
                        {distinctRoles.map((r) => (
                          <option key={r} value={r}>
                            {r} ({roleFreq[r] || 0})
                          </option>
                        ))}
                      </select>
                    </div>

                    <select
                      value={intentGoalFilter}
                      onChange={(e) => {
                        setIntentGoalFilter(e.target.value);
                        setIntentPage(1);
                      }}
                      className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white/80 focus:outline-none focus:border-accent max-w-[200px]"
                    >
                      <option value="all">All Project Goals</option>
                      {distinctGoals.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>

                    <select
                      value={intentRefFilter}
                      onChange={(e) => {
                        setIntentRefFilter(e.target.value);
                        setIntentPage(1);
                      }}
                      className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white/80 focus:outline-none focus:border-accent"
                    >
                      <option value="all">All Sources (?ref)</option>
                      {distinctRefs.map((rf) => (
                        <option key={rf} value={rf}>
                          {rf}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Table 1 & Table 2 Cross-Tabulation Breakdown Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Table 1: Visitor Role by Acquisition Ref */}
                  <div className="p-6 rounded-3xl bg-[#181816] border border-white/10 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-accent" />
                        <h3 className="font-display font-bold text-white text-base">
                          Table 1 &middot; Role by Campaign Source (?ref)
                        </h3>
                      </div>
                      <span className="text-[11px] font-mono text-white/40">
                        {allRefs.length} Channel{allRefs.length === 1 ? '' : 's'}
                      </span>
                    </div>

                    <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-black/40">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-white/5 border-b border-white/10 text-white/60">
                          <tr>
                            <th className="p-3">Referral Channel</th>
                            <th className="p-3 text-center">Founder</th>
                            <th className="p-3 text-center">Co-founder</th>
                            <th className="p-3 text-center">Developer</th>
                            <th className="p-3 text-center">Agency</th>
                            <th className="p-3 text-center">Other</th>
                            <th className="p-3 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {allRefs.map((r) => {
                            const counts = refRoleCounts[r] || {};
                            const f = counts['Founder'] || counts['founder'] || 0;
                            const cf = counts['Co-founder'] || counts['cofounder'] || 0;
                            const dev = counts['Developer'] || counts['developer'] || 0;
                            const ag = counts['Agency / Team'] || counts['agency'] || 0;
                            const oth = counts['Other'] || counts['other'] || 0;
                            const total = f + cf + dev + ag + oth;

                            return (
                              <tr key={r} className="hover:bg-white/[0.02] transition-colors">
                                <td className="p-3 font-semibold text-accent">
                                  {r === 'direct / none' ? 'Direct / Organic' : `?ref=${r}`}
                                </td>
                                <td className="p-3 text-center text-white/80">{f}</td>
                                <td className="p-3 text-center text-white/80">{cf}</td>
                                <td className="p-3 text-center text-white/80">{dev}</td>
                                <td className="p-3 text-center text-white/80">{ag}</td>
                                <td className="p-3 text-center text-white/80">{oth}</td>
                                <td className="p-3 text-right font-bold text-white">{total}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Table 2: Goal by Role */}
                  <div className="p-6 rounded-3xl bg-[#181816] border border-white/10 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-accent" />
                        <h3 className="font-display font-bold text-white text-base">
                          Table 2 &middot; Project Goal by Visitor Role
                        </h3>
                      </div>
                      <span className="text-[11px] font-mono text-white/40">
                        Demand Intent Matrix
                      </span>
                    </div>

                    <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-black/40">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-white/5 border-b border-white/10 text-white/60">
                          <tr>
                            <th className="p-3">Visitor Role</th>
                            <th className="p-3 text-center">New App</th>
                            <th className="p-3 text-center">Revamp</th>
                            <th className="p-3 text-center">Features</th>
                            <th className="p-3 text-center">Manual</th>
                            <th className="p-3 text-center">Exploring</th>
                            <th className="p-3 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {allRoles.map((role) => {
                            const counts = roleGoalCounts[role] || roleGoalCounts[role.toLowerCase()] || {};
                            const newApp = counts['Build a new app / MVP'] || counts['new_app'] || 0;
                            const revamp = counts['Revamp or improve an existing app'] || counts['revamp'] || 0;
                            const feat = counts['Add features or integrations'] || counts['add_features'] || 0;
                            const man = counts['Turn a manual process into software'] || counts['manual_process'] || 0;
                            const exp = counts['Just exploring'] || counts['exploring'] || 0;
                            const total = newApp + revamp + feat + man + exp;

                            return (
                              <tr key={role} className="hover:bg-white/[0.02] transition-colors">
                                <td className="p-3 font-semibold text-white">{role}</td>
                                <td className="p-3 text-center text-white/80">{newApp}</td>
                                <td className="p-3 text-center text-white/80">{revamp}</td>
                                <td className="p-3 text-center text-white/80">{feat}</td>
                                <td className="p-3 text-center text-white/80">{man}</td>
                                <td className="p-3 text-center text-white/80">{exp}</td>
                                <td className="p-3 text-right font-bold text-accent">{total}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Granular Intent Logs Ledger */}
                <div className="p-6 rounded-3xl bg-[#181816] border border-white/10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                    <div className="flex items-center space-x-2.5">
                      <Target className="w-4 h-4 text-accent" />
                      <h3 className="font-display font-bold text-white text-lg">
                        Live Intent Log Ledger
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60 font-mono text-xs">
                        {filteredIntentList.length} Entries
                      </span>
                    </div>

                    <div className="text-xs font-mono text-white/40">
                      Page {intentPage} of {totalPages}
                    </div>
                  </div>

                  {filteredIntentList.length === 0 ? (
                    <div className="p-12 text-center rounded-2xl bg-black/40 border border-white/10 text-white/40 text-xs font-mono space-y-2">
                      <p>No intent response logs match your filter criteria.</p>
                      <button
                        onClick={() => {
                          setIntentSearch('');
                          setIntentRoleFilter('all');
                          setIntentGoalFilter('all');
                          setIntentRefFilter('all');
                        }}
                        className="text-accent underline text-xs cursor-pointer"
                      >
                        Reset all filters
                      </button>
                    </div>
                  ) : (
                    <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-black/40">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-white/5 border-b border-white/10 text-white/60">
                          <tr>
                            <th className="p-3.5">Timestamp</th>
                            <th className="p-3.5">Visitor Role</th>
                            <th className="p-3.5">Project Goal</th>
                            <th className="p-3.5">Campaign Source</th>
                            <th className="p-3.5">Path Visited</th>
                            <th className="p-3.5 text-center">Status</th>
                            <th className="p-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {paginatedIntentList.map((evt, idx) => {
                            const d = evt.created_at ? new Date(evt.created_at) : new Date();
                            const dateStr = d.toLocaleDateString('en-US', {
                              month: 'short',
                              day: '2-digit',
                              year: 'numeric',
                            });
                            const timeStr = d.toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: true,
                            });

                            return (
                              <tr key={evt.id || idx} className="hover:bg-white/[0.02] transition-colors">
                                <td className="p-3.5 text-white/60 whitespace-nowrap">
                                  <span className="font-semibold text-white/80 block">{dateStr}</span>
                                  <span className="text-[11px] text-white/40">{timeStr}</span>
                                </td>

                                <td className="p-3.5 whitespace-nowrap">
                                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 font-bold text-xs">
                                    <span>👤</span>
                                    <span>{evt.role || 'Other'}</span>
                                  </span>
                                </td>

                                <td className="p-3.5">
                                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 font-medium text-xs">
                                    <span>🎯</span>
                                    <span>{evt.goal || 'Just exploring'}</span>
                                  </span>
                                </td>

                                <td className="p-3.5 whitespace-nowrap">
                                  <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/10 text-accent font-semibold text-xs">
                                    {evt.ref ? `?ref=${evt.ref}` : 'Direct / Organic'}
                                  </span>
                                </td>

                                <td className="p-3.5 text-white/50 text-xs">
                                  <code>{evt.path || '/'}</code>
                                </td>

                                <td className="p-3.5 text-center whitespace-nowrap">
                                  <span className="inline-flex items-center space-x-1 text-emerald-400 font-semibold text-[11px]">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>DB Persisted</span>
                                  </span>
                                </td>

                                <td className="p-3.5 text-right whitespace-nowrap">
                                  <button
                                    onClick={() => handleDeleteSiteEvent(evt.id)}
                                    title="Delete this record"
                                    className="p-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Pagination Footer */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-3 text-xs font-mono text-white/60">
                      <button
                        disabled={intentPage <= 1}
                        onClick={() => setIntentPage((p) => Math.max(1, p - 1))}
                        className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        &larr; Previous
                      </button>

                      <span>
                        Page {intentPage} of {totalPages}
                      </span>

                      <button
                        disabled={intentPage >= totalPages}
                        onClick={() => setIntentPage((p) => Math.min(totalPages, p + 1))}
                        className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        Next &rarr;
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* TAB 2: TRAFFIC & TRENDS */}
          {activeTab === 'traffic' && (() => {
            const siteEvents = summary.siteEvents || [];
            const answeredEvents = siteEvents.filter((e) => e.event === 'intent_answered');
            const skippedEvents = siteEvents.filter((e) => e.event === 'intent_skipped');
            const totalIntentInteractions = answeredEvents.length + skippedEvents.length;
            const answerRate = totalIntentInteractions > 0
              ? ((answeredEvents.length / totalIntentInteractions) * 100).toFixed(1)
              : '0';

            // Role by Ref Matrix
            const allRefs = Array.from(new Set(answeredEvents.map((e) => (e.ref || 'direct / none').toLowerCase())));
            if (allRefs.length === 0) allRefs.push('direct / none');

            const refRoleCounts: Record<string, Record<string, number>> = {};
            answeredEvents.forEach((evt) => {
              const r = (evt.ref || 'direct / none').toLowerCase();
              const role = evt.role || 'Other';
              if (!refRoleCounts[r]) refRoleCounts[r] = {};
              refRoleCounts[r][role] = (refRoleCounts[r][role] || 0) + 1;
            });

            // Goal by Role Matrix
            const allRoles = ['Founder', 'Co-founder', 'Developer', 'Agency / Team', 'Other'];
            const roleGoalCounts: Record<string, Record<string, number>> = {};
            answeredEvents.forEach((evt) => {
              const role = evt.role || 'Other';
              const goal = evt.goal || 'Just exploring';
              if (!roleGoalCounts[role]) roleGoalCounts[role] = {};
              roleGoalCounts[role][goal] = (roleGoalCounts[role][goal] || 0) + 1;
            });

            return (
            <div className="space-y-8">
              {/* Intent Intelligence & Conversion Analytics */}
              <div className="p-6 rounded-3xl bg-[#181816] border border-accent/25 space-y-6 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-accent" />
                      <h3 className="font-display text-lg font-bold text-white">
                        Founder &amp; Visitor Intent Intelligence
                      </h3>
                    </div>
                    <p className="text-xs text-white/50">
                      Real-time responses to &ldquo;What brings you here?&rdquo; cross-referenced by campaign traffic source (<code className="text-accent font-mono">?ref=</code>).
                    </p>
                  </div>
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent font-mono text-xs font-bold shrink-0">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span>{answeredEvents.length} Total Answers</span>
                  </span>
                </div>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <span className="text-[11px] font-mono text-white/50 uppercase block mb-1">
                      Intent Answered
                    </span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold font-mono text-white">
                        {answeredEvents.length}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">
                        {answerRate}% Answer Rate
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <span className="text-[11px] font-mono text-white/50 uppercase block mb-1">
                      Intent Skipped
                    </span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold font-mono text-white/80">
                        {skippedEvents.length}
                      </span>
                      <span className="text-[10px] font-mono text-white/40">
                        Zero Friction Pass
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <span className="text-[11px] font-mono text-white/50 uppercase block mb-1">
                      Total Prompts Shown
                    </span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold font-mono text-accent">
                        {totalIntentInteractions}
                      </span>
                      <span className="text-[10px] font-mono text-white/50">
                        Modal &amp; Mobile Card
                      </span>
                    </div>
                  </div>
                </div>

                {/* Table 1: Role by Traffic Ref */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-white/70 font-bold">
                      Table 1 · Visitor Role by Campaign Source (?ref)
                    </h4>
                  </div>
                  <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-black/40">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-white/5 border-b border-white/10 text-white/60">
                        <tr>
                          <th className="p-3">Referral Channel (?ref)</th>
                          <th className="p-3">Founder</th>
                          <th className="p-3">Co-founder</th>
                          <th className="p-3">Developer</th>
                          <th className="p-3">Agency / Team</th>
                          <th className="p-3">Other</th>
                          <th className="p-3 text-accent font-bold">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {allRefs.map((refKey) => {
                          const counts = refRoleCounts[refKey] || {};
                          const totalForRef = (counts.Founder || 0) + (counts['Co-founder'] || 0) + (counts.Developer || 0) + (counts['Agency / Team'] || 0) + (counts.Other || 0);
                          return (
                            <tr key={refKey} className="hover:bg-white/[0.02] transition-colors">
                              <td className="p-3 font-bold text-white flex items-center space-x-1.5">
                                <span className="w-2 h-2 rounded-full bg-blue-400" />
                                <span>{refKey}</span>
                              </td>
                              <td className="p-3 text-white/80">{counts.Founder || 0}</td>
                              <td className="p-3 text-white/80">{counts['Co-founder'] || 0}</td>
                              <td className="p-3 text-white/80">{counts.Developer || 0}</td>
                              <td className="p-3 text-white/80">{counts['Agency / Team'] || 0}</td>
                              <td className="p-3 text-white/80">{counts.Other || 0}</td>
                              <td className="p-3 text-accent font-bold">{totalForRef}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Table 2: Goal by Role */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-white/70 font-bold">
                      Table 2 · Primary Goal by Visitor Role
                    </h4>
                  </div>
                  <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-black/40">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-white/5 border-b border-white/10 text-white/60">
                        <tr>
                          <th className="p-3">Visitor Role</th>
                          <th className="p-3">Build MVP</th>
                          <th className="p-3">Revamp App</th>
                          <th className="p-3">Add Features</th>
                          <th className="p-3">Automate Process</th>
                          <th className="p-3">Exploring</th>
                          <th className="p-3 text-accent font-bold">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {allRoles.map((roleKey) => {
                          const counts = roleGoalCounts[roleKey] || {};
                          const totalForRole =
                            (counts['Build a new app / MVP'] || 0) +
                            (counts['Revamp or improve an existing app'] || 0) +
                            (counts['Add features or integrations'] || 0) +
                            (counts['Turn a manual process into software'] || 0) +
                            (counts['Just exploring'] || 0);
                          return (
                            <tr key={roleKey} className="hover:bg-white/[0.02] transition-colors">
                              <td className="p-3 font-bold text-white">{roleKey}</td>
                              <td className="p-3 text-white/80">{counts['Build a new app / MVP'] || 0}</td>
                              <td className="p-3 text-white/80">{counts['Revamp or improve an existing app'] || 0}</td>
                              <td className="p-3 text-white/80">{counts['Add features or integrations'] || 0}</td>
                              <td className="p-3 text-white/80">{counts['Turn a manual process into software'] || 0}</td>
                              <td className="p-3 text-white/80">{counts['Just exploring'] || 0}</td>
                              <td className="p-3 text-accent font-bold">{totalForRole}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-3xl bg-[#181816] border border-white/10 space-y-6">
                <div className="space-y-1">
                  <h3 className="font-display text-lg font-bold text-white">
                    24-Hour Traffic Intensity Distribution
                  </h3>
                  <p className="text-xs text-white/50">
                    Distribution of visitor activity across local hours (00:00 to 23:00 IST).
                  </p>
                </div>

                <div className="w-full overflow-x-auto pb-3 pt-2 custom-scrollbar">
                  <div className="min-w-[680px] h-44 flex items-end justify-between gap-1.5 px-1">
                    {summary.hourlyActivity.map((h, i) => {
                      const maxCount = Math.max(...summary.hourlyActivity.map((a) => a.count), 1);
                      const pct = h.count > 0 ? Math.max((h.count / maxCount) * 100, 16) : 6;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                          {/* Bar Track Box */}
                          <div className="w-full h-32 flex items-end justify-center bg-white/[0.02] rounded-t border-b border-white/10 p-0.5">
                            <div
                              className={`w-full max-w-[20px] rounded-t transition-all duration-300 relative ${
                                h.count > 0
                                  ? 'bg-accent group-hover:bg-[#ff6b42] shadow-[0_0_12px_rgba(216,76,36,0.35)]'
                                  : 'bg-white/10 group-hover:bg-white/20'
                              }`}
                              style={{ height: `${pct}%` }}
                            >
                              {/* Hover Tooltip */}
                              <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-0.5 rounded bg-black/95 border border-white/20 text-[9px] font-mono text-white whitespace-nowrap z-20 pointer-events-none shadow-xl">
                                {h.label} IST · {h.count} {h.count === 1 ? 'visit' : 'visits'}
                              </span>
                            </div>
                          </div>
                          {/* Hour text label */}
                          <span className={`text-[9px] font-mono mt-2 transition-colors ${h.count > 0 ? 'text-accent font-bold' : 'text-white/40'}`}>
                            {h.hour}h
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Section Dwell Time Leaderboard */}
              <div className="p-6 rounded-3xl bg-[#181816] border border-white/10 space-y-4">
                <div className="space-y-1">
                  <h3 className="font-display text-base font-bold text-white">
                    Section Attention &amp; Reading Dwell Time
                  </h3>
                  <p className="text-xs text-white/50">
                    Which areas of your portfolio hold the attention of prospective clients and engineering leaders.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {summary.sectionEngagement.map((sec, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{sec.name}</span>
                        <div className="flex items-center space-x-4 text-xs font-mono">
                          <span className="text-white/60">{sec.views} Reads</span>
                          <span className="text-emerald-400 font-semibold">{sec.avgDwellSec}s Avg Dwell</span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${Math.min((sec.avgDwellSec / 80) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual Visitor Sessions & Pageviews Activity Log */}
              <div className="p-6 rounded-3xl bg-[#181816] border border-white/10 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-display text-base font-bold text-white">
                        Individual Visitor Sessions &amp; Pageview Breakdown
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-[11px] font-bold">
                        {(summary.sessions || []).length} Recorded Sessions
                      </span>
                    </div>
                    <p className="text-xs text-white/50">
                      Granular breakdown showing each visitor device, their return visit number, and total pageviews viewed during their sessions.
                    </p>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Filter by OS, browser, referrer..."
                      value={sessionSearch}
                      onChange={(e) => setSessionSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-accent font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  {(summary.sessions || [])
                    .filter((s) => {
                      if (!sessionSearch.trim()) return true;
                      const q = sessionSearch.toLowerCase();
                      return (
                        (s.os || '').toLowerCase().includes(q) ||
                        (s.browser || '').toLowerCase().includes(q) ||
                        (s.referrer || '').toLowerCase().includes(q) ||
                        (s.device || '').toLowerCase().includes(q) ||
                        (s.id || '').toLowerCase().includes(q)
                      );
                    })
                    .map((s, idx) => {
                      const d = new Date(s.timestamp);
                      const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });

                      return (
                        <div
                          key={s.id || idx}
                          className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-start md:items-center space-x-3">
                            <div className="p-2 rounded-xl bg-accent/10 border border-accent/20 text-accent shrink-0 mt-0.5 md:mt-0 font-mono text-[11px] font-bold">
                              #{idx + 1}
                            </div>

                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-white">
                                  {s.device || 'Desktop'} ({s.os} / {s.browser})
                                </span>

                                {/* Pageviews Badge */}
                                <span
                                  className={`px-2.5 py-0.5 rounded-md font-mono text-[11px] font-bold flex items-center space-x-1 ${
                                    (s.pageViews || 1) > 1
                                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                                      : 'bg-accent/10 border border-accent/20 text-accent'
                                  }`}
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>{s.pageViews || 1} {s.pageViews === 1 ? 'Pageview' : 'Pageviews'}</span>
                                </span>

                                {/* Visit Number Badge */}
                                {s.visitCount && s.visitCount > 1 ? (
                                  <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono text-[10px] font-semibold">
                                    🔄 Visit #{s.visitCount}
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/50 font-mono text-[10px]">
                                    ✨ 1st Visit
                                  </span>
                                )}

                                <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[10px]">
                                  {s.referrer || 'Direct'}
                                </span>
                              </div>

                              {/* Sections viewed */}
                              {s.sectionsViewed && s.sectionsViewed.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                  <span className="text-[10px] font-mono text-white/40">Sections:</span>
                                  {s.sectionsViewed.map((sec, i) => (
                                    <span key={i} className="px-1.5 py-0.2 rounded bg-white/5 text-[10px] font-mono text-white/60">
                                      {sec}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center shrink-0 border-t md:border-t-0 border-white/5 pt-2 md:pt-0 font-mono text-[11px]">
                            <span className="text-white/70">{dateStr} · {timeStr}</span>
                            <span className="text-accent">⏱️ {s.duration || 1}s dwell</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
            );
          })()}

          {/* TAB 3: PROJECTS & CTR */}
          {activeTab === 'projects' && (
            <div className="space-y-8">
              <div className="space-y-1">
                <h3 className="font-display text-xl font-bold text-white">
                  Project Performance &amp; Demo Conversions
                </h3>
                <p className="text-xs text-white/50">
                  Granular click-through metrics, modal iframe engagements, and external app launches.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {summary.projectStats.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-6 rounded-3xl bg-[#181816] border border-white/10 space-y-6 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-xs font-bold uppercase">
                          {proj.id}
                        </span>
                        <span className="text-xs font-mono text-emerald-400 font-bold">
                          {proj.ctr}% CTR
                        </span>
                      </div>
                      <h4 className="font-display text-lg font-bold text-white">{proj.name}</h4>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/50">Total Views:</span>
                        <span className="font-mono font-bold text-white">{proj.views}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/50">Modal In-Depth Views:</span>
                        <span className="font-mono font-bold text-white">{proj.modalOpens}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/50">Live App Launches:</span>
                        <span className="font-mono font-bold text-white">{proj.liveClicks}</span>
                      </div>
                    </div>

                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${Math.min(proj.ctr * 2, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LEADS & CRM INBOX */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-display text-xl font-bold text-white">
                    Client Inquiries &amp; CRM Pipeline
                  </h3>
                  <p className="text-xs text-white/50">
                    Direct leads submitted through your portfolio's studio contact form.
                  </p>
                </div>

                {/* Search box */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search leads by name, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Leads Table / Details Spread */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Leads List */}
                <div className="lg:col-span-7 space-y-3">
                  {filteredLeads.length === 0 ? (
                    <div className="p-12 text-center rounded-3xl bg-[#181816] border border-white/10 text-white/40 text-xs font-mono">
                      No matching inquiries found.
                    </div>
                  ) : (
                    filteredLeads.map((lead) => {
                      const isSelected = selectedLead?.id === lead.id;
                      return (
                        <div
                          key={lead.id}
                          onClick={() => {
                            setSelectedLead(lead);
                            setLeadNoteInput(lead.notes || '');
                          }}
                          className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                            isSelected
                              ? 'bg-[#20201E] border-accent/50 shadow-lg'
                              : 'bg-[#181816] border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2.5">
                              <span className="font-bold text-sm text-white">{lead.name}</span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                                  lead.status === 'new'
                                    ? 'bg-amber-500/15 text-amber-400'
                                    : lead.status === 'contacted'
                                    ? 'bg-emerald-500/15 text-emerald-400'
                                    : 'bg-white/10 text-white/50'
                                }`}
                              >
                                {lead.status}
                              </span>
                            </div>
                            <span className="font-mono text-xs text-accent font-semibold">
                              {lead.budget}
                            </span>
                          </div>

                          <div className="text-xs text-white/60 font-mono flex items-center space-x-4">
                            <span>{lead.email}</span>
                            <span>&bull;</span>
                            <span>{lead.projectType}</span>
                          </div>

                          {(lead.role || lead.goal || lead.ref) && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                              {lead.role && (
                                <span className="px-2 py-0.5 rounded-md bg-accent/15 border border-accent/25 text-accent font-mono text-[10px] font-semibold">
                                  🎯 {lead.role}
                                </span>
                              )}
                              {lead.goal && (
                                <span className="px-2 py-0.5 rounded-md bg-blue-500/15 border border-blue-500/25 text-blue-400 font-mono text-[10px]">
                                  🚀 {lead.goal}
                                </span>
                              )}
                              {lead.ref && (
                                <span className="px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/25 text-purple-300 font-mono text-[10px]">
                                  🔗 {lead.ref}
                                </span>
                              )}
                            </div>
                          )}

                          <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                            {lead.message}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Lead Detail Panel */}
                <div className="lg:col-span-5">
                  {selectedLead ? (
                    <div className="p-6 rounded-3xl bg-[#181816] border border-white/10 space-y-5 sticky top-4">
                      <div className="flex items-center justify-between pb-4 border-b border-white/10">
                        <div>
                          <h4 className="font-display font-bold text-lg text-white">
                            {selectedLead.name}
                          </h4>
                          <a
                            href={`mailto:${selectedLead.email}?subject=Regarding your project inquiry`}
                            className="text-xs font-mono text-accent hover:underline flex items-center space-x-1 mt-0.5"
                          >
                            <Mail className="w-3 h-3" />
                            <span>{selectedLead.email}</span>
                          </a>
                        </div>

                        <button
                          onClick={() => handleDeleteLead(selectedLead.id)}
                          title="Delete Lead"
                          className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Lead Specifications */}
                      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                          <span className="text-white/40 block text-[10px] uppercase">Service</span>
                          <span className="text-white font-medium">{selectedLead.projectType}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                          <span className="text-white/40 block text-[10px] uppercase">Budget</span>
                          <span className="text-accent font-bold">{selectedLead.budget}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                          <span className="text-white/40 block text-[10px] uppercase">Timeline</span>
                          <span className="text-white font-medium">{selectedLead.timeline}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                          <span className="text-white/40 block text-[10px] uppercase">Submitted</span>
                          <span className="text-white/70">
                            {new Date(selectedLead.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        {selectedLead.role && (
                          <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                            <span className="text-accent/70 block text-[10px] uppercase font-semibold">Visitor Role</span>
                            <span className="text-accent font-bold">🎯 {selectedLead.role}</span>
                          </div>
                        )}
                        {selectedLead.goal && (
                          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <span className="text-blue-400/70 block text-[10px] uppercase font-semibold">Primary Goal</span>
                            <span className="text-blue-300 font-bold">🚀 {selectedLead.goal}</span>
                          </div>
                        )}
                        {selectedLead.ref && (
                          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 col-span-2">
                            <span className="text-purple-300/70 block text-[10px] uppercase font-semibold">Campaign Ref</span>
                            <span className="text-purple-200 font-bold">🔗 {selectedLead.ref}</span>
                          </div>
                        )}
                      </div>

                      {/* Message Content */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-white/40 block">
                          Client Message
                        </span>
                        <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-white/90 leading-relaxed font-sans max-h-48 overflow-y-auto whitespace-pre-wrap">
                          {selectedLead.message}
                        </div>
                      </div>

                      {/* Pipeline Status Buttons */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-white/40 block">
                          Pipeline Status
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          {(['new', 'contacted', 'archived'] as const).map((st) => (
                            <button
                              key={st}
                              onClick={() => handleStatusChange(selectedLead.id, st)}
                              className={`py-2 rounded-xl text-xs font-mono uppercase font-semibold transition-all ${
                                selectedLead.status === st
                                  ? 'bg-accent text-white shadow-md'
                                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Notes area */}
                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-white/40">
                            Internal Admin Notes
                          </span>
                          <button
                            onClick={handleSaveNote}
                            className="text-[11px] font-mono text-accent hover:underline font-semibold"
                          >
                            Save Note
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={leadNoteInput}
                          onChange={(e) => setLeadNoteInput(e.target.value)}
                          placeholder="Add call notes, meeting dates, or next action..."
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-12 text-center rounded-3xl bg-[#181816] border border-white/10 text-white/40 text-xs font-mono">
                      Select an inquiry on the left to review proposal details and reply.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AUDIENCE & TECHNOLOGY */}
          {activeTab === 'tech' && (
            <div className="space-y-8">
              <div className="space-y-1">
                <h3 className="font-display text-xl font-bold text-white">
                  Audience, Platforms &amp; Referral Channels
                </h3>
                <p className="text-xs text-white/50">
                  Telemetry breakdown of external visitors' devices, operating systems, browsers, and discovery sources from Supabase.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Devices */}
                <div className="p-6 rounded-3xl bg-[#181816] border border-white/10 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Laptop className="w-4 h-4 text-accent" />
                    <h4 className="font-display font-bold text-base text-white">Device Breakdown</h4>
                  </div>

                  <div className="space-y-3 pt-2">
                    {summary.deviceBreakdown.map((dev) => (
                      <div key={dev.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">{dev.name}</span>
                          <span className="font-mono text-white/60">
                            {dev.count} ({dev.percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full bg-accent rounded-full" style={{ width: `${dev.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Referrers */}
                <div className="p-6 rounded-3xl bg-[#181816] border border-white/10 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <h4 className="font-display font-bold text-base text-white">Traffic Sources / Referrers</h4>
                  </div>

                  <div className="space-y-3 pt-2">
                    {summary.referrerBreakdown.map((ref) => (
                      <div key={ref.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">{ref.name}</span>
                          <span className="font-mono text-white/60">
                            {ref.count} ({ref.percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${ref.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Operating Systems */}
                <div className="p-6 rounded-3xl bg-[#181816] border border-white/10 space-y-4">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <h4 className="font-display font-bold text-base text-white">Operating Systems</h4>
                  </div>

                  <div className="space-y-3 pt-2">
                    {summary.osBreakdown.map((os) => (
                      <div key={os.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">{os.name}</span>
                          <span className="font-mono text-white/60">
                            {os.count} ({os.percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${os.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Browsers */}
                <div className="p-6 rounded-3xl bg-[#181816] border border-white/10 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-display font-bold text-base text-white">Web Browsers</h4>
                  </div>

                  <div className="space-y-3 pt-2">
                    {summary.browserBreakdown.map((b) => (
                      <div key={b.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">{b.name}</span>
                          <span className="font-mono text-white/60">
                            {b.count} ({b.percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${b.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: LIVE EVENT STREAM */}
          {activeTab === 'stream' && (() => {
            const rawSessions = summary.sessions || [];
            const rawEvents = summary.recentEvents || [];

            // Group sessions & events by unique device
            interface DeviceActivity {
              id: string;
              visitorId: string;
              device: string;
              os: string;
              browser: string;
              referrer: string;
              totalViews: number;
              sessionCount: number;
              totalDuration: number;
              firstSeen: string;
              lastSeen: string;
              sections: string[];
              sessions: any[];
              actions: {
                id: string;
                type: string;
                description: string;
                timestamp: string;
                meta?: string;
              }[];
            }

            const deviceMap = new Map<string, DeviceActivity>();

            const getDeviceKey = (device: string, os: string, browser: string, referrer: string, visitorId?: string) => {
              if (visitorId && visitorId.startsWith('vis_')) {
                return visitorId.toLowerCase();
              }
              const d = (device || 'desktop').toLowerCase();
              const o = (os || 'windows').toLowerCase();
              const b = (browser || 'chrome').toLowerCase();
              const r = (referrer || 'direct').toLowerCase();
              return `${d}_${o}_${b}_${r}`;
            };

            // 1. Ingest Sessions
            rawSessions.forEach((s) => {
              const devKey = getDeviceKey(s.device, s.os, s.browser, s.referrer, s.visitorId);
              if (!deviceMap.has(devKey)) {
                deviceMap.set(devKey, {
                  id: s.id,
                  visitorId: s.visitorId || devKey,
                  device: s.device || 'Desktop',
                  os: s.os || 'Windows',
                  browser: s.browser || 'Chrome',
                  referrer: s.referrer || 'Direct',
                  totalViews: s.pageViews || 1,
                  sessionCount: s.visitCount || 1,
                  totalDuration: s.duration || 1,
                  firstSeen: s.timestamp,
                  lastSeen: s.timestamp,
                  sections: [...(s.sectionsViewed || [])],
                  sessions: [s],
                  actions: [],
                });
              } else {
                const item = deviceMap.get(devKey)!;
                item.totalViews += (s.pageViews || 1);
                item.sessionCount = Math.max(item.sessionCount + 1, (s.visitCount || 1));
                item.totalDuration += (s.duration || 1);
                if (new Date(s.timestamp) > new Date(item.lastSeen)) item.lastSeen = s.timestamp;
                if (new Date(s.timestamp) < new Date(item.firstSeen)) item.firstSeen = s.timestamp;
                (s.sectionsViewed || []).forEach((sec) => {
                  if (!item.sections.includes(sec)) item.sections.push(sec);
                });
                if (!item.sessions.some((ex) => ex.id === s.id)) {
                  item.sessions.push(s);
                }
              }
            });

            // 2. Attach Events to Devices (Strictly within active session timeframe)
            rawEvents.forEach((evt) => {
              const desc = evt.description.toLowerCase();
              const meta = (evt.meta || '').toLowerCase();

              // Skip feedback submissions from navigation activity stream (exclusively displayed in Feedbacks tab)
              if (desc.includes('visitor feedback') || evt.type === 'contact_submit') {
                return;
              }

              let matchedDevice: DeviceActivity | null = null;
              const evtTime = new Date(evt.timestamp).getTime();
              let closestDiff = Infinity;

              // Correlate strictly to a device that was active within 10 minutes of the event
              for (const item of deviceMap.values()) {
                const matchesOS =
                  desc.includes(item.os.toLowerCase()) ||
                  meta.includes(item.os.toLowerCase()) ||
                  (!desc.includes('windows') && !desc.includes('macos') && !desc.includes('android') && !desc.includes('linux'));

                if (!matchesOS) continue;

                for (const ses of item.sessions) {
                  const sesTime = new Date(ses.timestamp).getTime();
                  const diff = Math.abs(evtTime - sesTime);
                  // Strict match within 10 minutes of that specific visit session
                  if (diff < 10 * 60 * 1000 && diff < closestDiff) {
                    closestDiff = diff;
                    matchedDevice = item;
                  }
                }
              }

              // Attach to matched device
              if (matchedDevice) {
                const alreadyExists = matchedDevice.actions.some(
                  (a) => a.id === evt.id || (a.description === evt.description && a.timestamp === evt.timestamp)
                );
                if (!alreadyExists) {
                  matchedDevice.actions.push(evt);
                }
                if (new Date(evt.timestamp) > new Date(matchedDevice.lastSeen)) {
                  matchedDevice.lastSeen = evt.timestamp;
                }
              }
            });

            // Sort actions inside each device by date descending
            deviceMap.forEach((dev) => {
              dev.actions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
              dev.sessions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            });

            const allDevices = Array.from(deviceMap.values()).sort(
              (a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()
            );

            // Filter Devices
            const filteredDevices = allDevices.filter((dev) => {
              // Source filter
              if (eventSourceFilter !== 'all') {
                const ref = dev.referrer.toLowerCase();
                const os = dev.os.toLowerCase();
                const br = dev.browser.toLowerCase();
                if (eventSourceFilter === 'linkedin' && !ref.includes('linkedin')) return false;
                if (eventSourceFilter === 'reddit' && !ref.includes('reddit')) return false;
                if (eventSourceFilter === 'safari' && !br.includes('safari') && !os.includes('macos')) return false;
                if (eventSourceFilter === 'android' && !os.includes('android')) return false;
                if (eventSourceFilter === 'direct' && !ref.includes('direct')) return false;
              }

              // Search query
              if (eventSearch.trim()) {
                const q = eventSearch.toLowerCase();
                const matchesDev = dev.device.toLowerCase().includes(q);
                const matchesOS = dev.os.toLowerCase().includes(q);
                const matchesBr = dev.browser.toLowerCase().includes(q);
                const matchesRef = dev.referrer.toLowerCase().includes(q);
                const matchesSec = dev.sections.some((s) => s.toLowerCase().includes(q));
                const matchesAct = dev.actions.some((a) => a.description.toLowerCase().includes(q));
                return matchesDev || matchesOS || matchesBr || matchesRef || matchesSec || matchesAct;
              }

              return true;
            });

            const totalDevicePages = Math.max(Math.ceil(filteredDevices.length / eventPageSize), 1);
            const currentPage = Math.min(eventPage, totalDevicePages);
            const paginatedDevices = filteredDevices.slice((currentPage - 1) * eventPageSize, currentPage * eventPageSize);

            const formatDateTime = (isoString: string) => {
              try {
                const d = new Date(isoString);
                const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
                const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
                return { dateStr, timeStr };
              } catch {
                return { dateStr: 'Recent', timeStr: isoString };
              }
            };

            return (
              <div className="space-y-6">
                {/* Header Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2.5">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <h3 className="font-display text-xl font-bold text-white">
                        Unique Visitor Devices &amp; View Activity Stream
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-[11px] font-mono font-bold">
                        {allDevices.length} Unique Devices Tracked
                      </span>
                    </div>
                    <p className="text-xs text-white/50">
                      Aggregated telemetry ledger grouping repeat sessions per unique device. <strong className="text-white/80">Click any device card</strong> to inspect its full chronological visit timeline, each session date/time, and granular interactions.
                    </p>
                  </div>
                </div>

                {/* Filters & Search Control Bar */}
                <div className="p-5 rounded-3xl bg-[#181816] border border-white/10 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Search Box */}
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search devices by OS, browser, referrer, or project..."
                        value={eventSearch}
                        onChange={(e) => {
                          setEventSearch(e.target.value);
                          setEventPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-accent font-mono"
                      />
                      {eventSearch && (
                        <button
                          onClick={() => setEventSearch('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs font-mono"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Source Channel Dropdown */}
                    <div className="flex items-center space-x-2 shrink-0">
                      <Filter className="w-3.5 h-3.5 text-accent" />
                      <select
                        value={eventSourceFilter}
                        onChange={(e) => {
                          setEventSourceFilter(e.target.value);
                          setEventPage(1);
                        }}
                        className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white/80 focus:outline-none focus:border-accent"
                      >
                        <option value="all">All Traffic Sources ({allDevices.length})</option>
                        <option value="linkedin">LinkedIn Referrals</option>
                        <option value="reddit">Reddit Traffic</option>
                        <option value="safari">Safari / macOS</option>
                        <option value="android">Android / Mobile</option>
                        <option value="direct">Direct Connections</option>
                      </select>
                    </div>

                    {/* Page Size Selector */}
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-[11px] font-mono text-white/40">Per Page:</span>
                      <select
                        value={eventPageSize}
                        onChange={(e) => {
                          setEventPageSize(Number(e.target.value));
                          setEventPage(1);
                        }}
                        className="px-2.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white/80 focus:outline-none focus:border-accent"
                      >
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="30">30</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Device Cards List with View Counts & Timestamps */}
                <div className="space-y-4">
                  {paginatedDevices.length === 0 ? (
                    <div className="p-12 text-center rounded-3xl bg-[#181816] border border-white/10 text-white/40 text-xs font-mono space-y-2">
                      <p>No matching devices found for current filters.</p>
                      <button
                        onClick={() => {
                          setEventSearch('');
                          setEventSourceFilter('all');
                        }}
                        className="text-accent underline text-xs"
                      >
                        Reset filters
                      </button>
                    </div>
                  ) : (
                    paginatedDevices.map((dev, idx) => {
                      const latestTime = formatDateTime(dev.lastSeen);
                      const firstTime = formatDateTime(dev.firstSeen);

                      return (
                        <div
                          key={dev.visitorId || idx}
                          onClick={() => setSelectedDevice(dev)}
                          className="p-5 sm:p-6 rounded-3xl bg-[#181816] border border-white/10 hover:border-accent/40 hover:bg-[#1c1c19] transition-all duration-200 space-y-4 shadow-lg group cursor-pointer relative"
                        >
                          {/* Top Row: Device Header, View Count Badges, Timestamps */}
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/5">
                            <div className="flex items-start sm:items-center space-x-3.5">
                              <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-accent group-hover:border-accent/40 group-hover:scale-105 transition-all shrink-0 flex items-center justify-center">
                                {dev.device === 'Mobile' ? (
                                  <Globe className="w-5 h-5 text-emerald-400" />
                                ) : (
                                  <Laptop className="w-5 h-5 text-accent" />
                                )}
                              </div>

                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="font-display font-bold text-white text-base group-hover:text-accent transition-colors flex items-center space-x-2">
                                    <span>{dev.device} · {dev.os} ({dev.browser})</span>
                                  </h4>

                                  {/* Prominent Views Count Badge */}
                                  <span
                                    className={`px-3 py-1 rounded-xl font-mono text-xs font-bold flex items-center space-x-1.5 shadow-sm ${
                                      dev.totalViews > 1
                                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                                        : 'bg-accent/15 border border-accent/30 text-accent'
                                    }`}
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>{dev.totalViews} {dev.totalViews === 1 ? 'View' : 'Total Views'}</span>
                                  </span>

                                  {/* Visits / Sessions Badge */}
                                  <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono text-[11px] font-semibold">
                                    {dev.sessionCount > 1 ? `🔄 ${dev.sessionCount} Visits` : '✨ 1st Visit'}
                                  </span>

                                  {/* Referrer Source Badge */}
                                  <span className="px-2.5 py-0.5 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 font-mono text-[11px]">
                                    {dev.referrer}
                                  </span>

                                  {/* Click Hint Pill */}
                                  <span className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-white/[0.04] border border-white/10 text-white/50 group-hover:text-white group-hover:border-accent/40 font-mono text-[10px] transition-colors">
                                    <span>Inspect Details</span>
                                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Exact Timestamps & Dwell Time */}
                            <div className="flex flex-row md:flex-col items-start md:items-end justify-between md:justify-center shrink-0 font-mono text-xs pt-2 md:pt-0 border-t md:border-t-0 border-white/5 space-y-1">
                              <div className="text-right">
                                <span className="text-white/40 block text-[10px] uppercase">Latest Active</span>
                                <span className="text-white font-semibold">{latestTime.dateStr} · {latestTime.timeStr}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-white/30 block text-[9px] uppercase">First Visit: {firstTime.dateStr}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-accent text-[11px] font-medium">⏱️ {dev.totalDuration}s total dwell</span>
                              </div>
                            </div>
                          </div>

                          {/* Sections & Interactive Actions Timeline for This Device */}
                          <div className="space-y-2">
                            {dev.sections.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[11px] font-mono uppercase text-white/40 mr-1">
                                  Sections Read:
                                </span>
                                {dev.sections.map((sec: string, i: number) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-white/70 font-mono text-[11px]"
                                  >
                                    {sec}
                                  </span>
                                ))}
                              </div>
                            )}

                            {dev.actions.length > 0 && (
                              <div className="space-y-1.5 pt-2 border-t border-white/5">
                                <span className="text-[11px] font-mono uppercase text-white/40 block">
                                  Granular Activity Log:
                                </span>
                                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                                  {dev.actions.map((act, i) => {
                                    const actTime = formatDateTime(act.timestamp);
                                    return (
                                      <div
                                        key={act.id || i}
                                        className="flex items-center justify-between text-xs font-mono p-2 rounded-xl bg-black/30 border border-white/5"
                                      >
                                        <div className="flex items-center space-x-2 text-white/80 truncate">
                                          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                                          <span className="truncate">{act.description}</span>
                                        </div>
                                        <span className="text-white/40 shrink-0 text-[10px] ml-2">
                                          {actTime.dateStr} · {actTime.timeStr}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Pagination Controls Bar */}
                {totalDevicePages > 1 && (
                  <div className="p-4 rounded-2xl bg-[#181816] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs font-mono text-white/50">
                      Showing {(currentPage - 1) * eventPageSize + 1}–{Math.min(currentPage * eventPageSize, filteredDevices.length)} of {filteredDevices.length} devices (Page {currentPage} of {totalDevicePages})
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        disabled={currentPage <= 1}
                        onClick={() => setEventPage((p) => Math.max(p - 1, 1))}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center space-x-1"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Prev</span>
                      </button>

                      {Array.from({ length: Math.min(totalDevicePages, 5) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setEventPage(pageNum)}
                            className={`w-8 h-8 rounded-xl text-xs font-mono font-bold transition-all ${
                              currentPage === pageNum
                                ? 'bg-accent text-white shadow-md'
                                : 'bg-white/[0.03] text-white/60 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        disabled={currentPage >= totalDevicePages}
                        onClick={() => setEventPage((p) => Math.min(p + 1, totalDevicePages))}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center space-x-1"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB 7: VISITOR FEEDBACKS (GROUPED BY DEVICE) */}
          {activeTab === 'feedbacks' && (() => {
            const feedbacks: VisitorFeedback[] = summary.feedbacks || [];

            // Group all feedbacks strictly by Unique Device profile
            interface DeviceFeedbackGroup {
              id: string;
              device: string;
              os: string;
              browser: string;
              referrer: string;
              deviceSignature: string;
              comments: VisitorFeedback[];
              totalComments: number;
              latestComment: VisitorFeedback;
              firstComment: VisitorFeedback;
            }

            const deviceGroupsMap = new Map<string, DeviceFeedbackGroup>();
            feedbacks.forEach((fb) => {
              const devSig = `${fb.device} · ${fb.os} (${fb.browser})`;
              const key = `${devSig}_${fb.referrer || 'Direct'}`;

              if (!deviceGroupsMap.has(key)) {
                deviceGroupsMap.set(key, {
                  id: key,
                  device: fb.device,
                  os: fb.os,
                  browser: fb.browser,
                  referrer: fb.referrer || 'Direct',
                  deviceSignature: devSig,
                  comments: [fb],
                  totalComments: 1,
                  latestComment: fb,
                  firstComment: fb,
                });
              } else {
                const group = deviceGroupsMap.get(key)!;
                group.comments.push(fb);
                group.totalComments = group.comments.length;
                // comments are sorted latest first
                if (new Date(fb.created_at) > new Date(group.latestComment.created_at)) {
                  group.latestComment = fb;
                }
                if (new Date(fb.created_at) < new Date(group.firstComment.created_at)) {
                  group.firstComment = fb;
                }
              }
            });

            const deviceGroups = Array.from(deviceGroupsMap.values());

            // Filter device groups based on search and device category
            const filteredGroups = deviceGroups.filter((group) => {
              const matchesCategory =
                feedbackDeviceFilter === 'all' ||
                group.deviceSignature.toLowerCase().includes(feedbackDeviceFilter.toLowerCase()) ||
                group.device.toLowerCase() === feedbackDeviceFilter.toLowerCase() ||
                group.os.toLowerCase() === feedbackDeviceFilter.toLowerCase();

              const search = feedbackSearch.toLowerCase();
              const matchesSearch =
                !search ||
                group.deviceSignature.toLowerCase().includes(search) ||
                group.referrer.toLowerCase().includes(search) ||
                group.comments.some(
                  (c) =>
                    c.name.toLowerCase().includes(search) ||
                    c.message.toLowerCase().includes(search) ||
                    c.rating.toLowerCase().includes(search) ||
                    (c.email && c.email.toLowerCase().includes(search))
                );

              return matchesCategory && matchesSearch;
            });

            const formatFbDate = (iso: string) => {
              try {
                const d = new Date(iso);
                const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
                const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
                return { dateStr, timeStr };
              } catch {
                return { dateStr: 'Recent', timeStr: iso };
              }
            };

            return (
              <div className="space-y-6">
                {/* Header & Overview */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#141413] border border-white/10 shadow-xl">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-2xl bg-accent/20 border border-accent/30 text-accent">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                        Visitor Feedbacks by Device
                      </h2>
                    </div>
                    <p className="text-xs font-sans text-white/60">
                      All feedback submitted by external visitors, grouped by each device profile. Click any device to see all comments from that device.
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/10 text-center font-mono">
                      <span className="block text-[10px] uppercase tracking-wider text-white/40">Total Comments</span>
                      <span className="text-lg font-bold text-accent font-display">{feedbacks.length}</span>
                    </div>
                    <div className="px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/10 text-center font-mono">
                      <span className="block text-[10px] uppercase tracking-wider text-white/40">Unique Devices</span>
                      <span className="text-lg font-bold text-emerald-400 font-display">{deviceGroups.length}</span>
                    </div>
                  </div>
                </div>

                {/* Device Filter Bar */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Device Category Pills */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setFeedbackDeviceFilter('all')}
                        className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-semibold transition-all ${
                          feedbackDeviceFilter === 'all'
                            ? 'bg-accent text-white shadow-md'
                            : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/10 border border-white/5'
                        }`}
                      >
                        All Devices ({deviceGroups.length})
                      </button>

                      {['Desktop', 'Mobile', 'Windows', 'Android', 'macOS', 'Linux'].map((cat) => {
                        const count = deviceGroups.filter((g) =>
                          g.deviceSignature.toLowerCase().includes(cat.toLowerCase())
                        ).length;
                        if (count === 0) return null;

                        return (
                          <button
                            key={cat}
                            onClick={() => setFeedbackDeviceFilter(cat)}
                            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs transition-all flex items-center space-x-1.5 ${
                              feedbackDeviceFilter.toLowerCase() === cat.toLowerCase()
                                ? 'bg-accent text-white font-semibold shadow-md'
                                : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/10 border border-white/5'
                            }`}
                          >
                            {cat === 'Mobile' || cat === 'Android' ? (
                              <Globe className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Laptop className="w-3.5 h-3.5 text-accent" />
                            )}
                            <span>{cat}</span>
                            <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px]">
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Search Field */}
                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={feedbackSearch}
                        onChange={(e) => setFeedbackSearch(e.target.value)}
                        placeholder="Search feedback / device / text..."
                        className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 focus:border-accent focus:outline-none text-xs font-mono text-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Device Cards Grid */}
                {filteredGroups.length === 0 ? (
                  <div className="p-12 rounded-3xl bg-[#141413] border border-white/10 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-white/40 mx-auto flex items-center justify-center">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-bold text-white text-lg">No visitor feedback found</h3>
                    <p className="text-xs text-white/50 max-w-md mx-auto">
                      {feedbackSearch || feedbackDeviceFilter !== 'all'
                        ? 'No devices match your search query or filter.'
                        : 'No visitor feedback has been submitted yet.'}
                    </p>
                    {(feedbackSearch || feedbackDeviceFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setFeedbackSearch('');
                          setFeedbackDeviceFilter('all');
                        }}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-mono text-white transition-colors"
                      >
                        Reset Filters
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredGroups.map((group) => {
                      const latest = group.latestComment;
                      const dt = formatFbDate(latest.created_at);
                      const isMobile = group.device.toLowerCase().includes('mobile');

                      return (
                        <div
                          key={group.id}
                          onClick={() => setSelectedFeedbackDevice(group)}
                          className="p-5 sm:p-6 rounded-3xl bg-[#141413] border border-white/10 hover:border-accent/40 hover:bg-[#181816] transition-all duration-200 flex flex-col justify-between space-y-4 shadow-lg group cursor-pointer"
                        >
                          {/* Top Row: Device Signature & Comments Count Badge */}
                          <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/5">
                            <div className="flex items-center space-x-3">
                              <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-accent group-hover:border-accent/40 group-hover:scale-105 transition-all shrink-0">
                                {isMobile ? (
                                  <Globe className="w-5 h-5 text-emerald-400" />
                                ) : (
                                  <Laptop className="w-5 h-5 text-accent" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-display font-bold text-white text-base group-hover:text-accent transition-colors">
                                    {group.device} · {group.os}
                                  </h4>
                                  <span className="px-2 py-0.5 rounded-md bg-white/[0.04] text-white/60 font-mono text-[11px]">
                                    {group.browser}
                                  </span>
                                </div>
                                <span className="text-[11px] font-mono text-white/40 block mt-0.5">
                                  Via {group.referrer}
                                </span>
                              </div>
                            </div>

                            {/* Comments Count Badge */}
                            <div className="flex flex-col items-end">
                              <span className="px-3 py-1 rounded-xl bg-accent/15 border border-accent/30 text-accent font-mono text-xs font-bold shadow-sm">
                                💬 {group.totalComments} {group.totalComments === 1 ? 'Comment' : 'Comments'}
                              </span>
                              <span className="text-[10px] font-mono text-white/40 mt-1">
                                Latest: {dt.dateStr}
                              </span>
                            </div>
                          </div>

                          {/* Middle: Latest Comment Excerpt */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center space-x-2">
                                <span className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
                                  <span>{latest.rating}</span>
                                </span>
                                <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-[11px] font-semibold">
                                  💼 {latest.role || 'Visitor'}
                                </span>
                              </div>

                              <span className="font-mono text-xs text-white/80">
                                👤 {latest.name}
                              </span>
                            </div>

                            {/* Message Quote Box */}
                            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 text-xs text-white/90 leading-relaxed font-sans italic line-clamp-2">
                              &ldquo;{latest.message}&rdquo;
                            </div>
                          </div>

                          {/* Bottom Row: Drilldown Prompt */}
                          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs font-mono">
                            <span className="text-accent group-hover:underline flex items-center space-x-1 font-semibold">
                              <span>View All {group.totalComments} Comments from this Device</span>
                              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <span className="text-white/40 text-[10px]">
                              {dt.timeStr}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB 8: CHECKLIST LEADS INBOX */}
          {activeTab === 'checklists' && (() => {
            const rawChecklists: ChecklistLead[] = summary.checklistLeads || [];

            // Distinct ref sources for dropdown filter
            const refSources = Array.from(
              new Set(rawChecklists.map((c) => c.ref || 'Direct').filter(Boolean))
            );

            // Ref counts
            const refCounts: Record<string, number> = {};
            rawChecklists.forEach((c) => {
              const src = c.ref || 'Direct';
              refCounts[src] = (refCounts[src] || 0) + 1;
            });

            // Filter leads
            const filteredChecklists = rawChecklists.filter((item) => {
              // Status filter
              if (checklistStatusFilter !== 'all' && item.status !== checklistStatusFilter) {
                return false;
              }
              // Ref filter
              if (checklistRefFilter !== 'all') {
                const itemRef = item.ref || 'Direct';
                if (itemRef.toLowerCase() !== checklistRefFilter.toLowerCase()) {
                  return false;
                }
              }
              // Search query
              if (checklistSearch.trim()) {
                const q = checklistSearch.toLowerCase();
                const matchesName = item.name.toLowerCase().includes(q);
                const matchesEmail = item.email.toLowerCase().includes(q);
                const matchesIdea = item.idea.toLowerCase().includes(q);
                const matchesNote = (item.note || '').toLowerCase().includes(q);
                const matchesRef = (item.ref || 'Direct').toLowerCase().includes(q);
                return matchesName || matchesEmail || matchesIdea || matchesNote || matchesRef;
              }
              return true;
            });

            const newCount = rawChecklists.filter((c) => c.status === 'new').length;
            const contactedCount = rawChecklists.filter((c) => c.status === 'contacted').length;
            const closedCount = rawChecklists.filter((c) => c.status === 'closed').length;

            return (
              <div className="space-y-6">
                {/* Header & KPI Summary Cards */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2.5">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
                      </span>
                      <h3 className="font-display text-xl font-bold text-white">
                        Free MVP Scoping Checklist Leads
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-[11px] font-mono font-bold">
                        {rawChecklists.length} Total Captured
                      </span>
                    </div>
                    <p className="text-xs text-white/50">
                      Founder lead captures from the <code className="text-white/80">/checklist</code> page with project descriptions, referral tags, and notes.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleExportChecklistsCSV}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-mono text-white transition-all shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5 text-accent" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                {/* KPI Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-3xl bg-[#181816] border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-wider text-white/50">Total Leads</span>
                      <ClipboardList className="w-4 h-4 text-accent" />
                    </div>
                    <div className="text-2xl font-bold font-display text-white">{rawChecklists.length}</div>
                    <div className="text-[11px] font-mono text-white/40">
                      {contactedCount} contacted · {closedCount} closed
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-[#181816] border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-wider text-amber-400">New / Uncontacted</span>
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    </div>
                    <div className="text-2xl font-bold font-display text-amber-400">{newCount}</div>
                    <div className="text-[11px] font-mono text-white/40">
                      Requires scoping outreach & review
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-[#181816] border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-wider text-white/50">Source Breakdown</span>
                      <Globe className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {Object.keys(refCounts).length === 0 ? (
                        <span className="text-xs font-mono text-white/30">No sources yet</span>
                      ) : (
                        Object.entries(refCounts).map(([src, count]) => (
                          <span
                            key={src}
                            className="px-2 py-0.5 rounded-lg bg-white/[0.04] border border-white/10 text-white/80 font-mono text-[10px]"
                          >
                            {src}: <strong>{count}</strong>
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="p-4 sm:p-5 rounded-3xl bg-[#181816] border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search checklist leads by name, email, idea, or note..."
                      value={checklistSearch}
                      onChange={(e) => setChecklistSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-white/30 font-mono focus:outline-none focus:border-accent"
                    />
                    {checklistSearch && (
                      <button
                        onClick={() => setChecklistSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-2.5 shrink-0">
                    <div className="flex items-center space-x-1.5">
                      <Filter className="w-3.5 h-3.5 text-accent" />
                      <select
                        value={checklistStatusFilter}
                        onChange={(e) => setChecklistStatusFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white/80 focus:outline-none focus:border-accent"
                      >
                        <option value="all">All Statuses ({rawChecklists.length})</option>
                        <option value="new">New ({newCount})</option>
                        <option value="contacted">Contacted ({contactedCount})</option>
                        <option value="closed">Closed ({closedCount})</option>
                      </select>
                    </div>

                    <select
                      value={checklistRefFilter}
                      onChange={(e) => setChecklistRefFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white/80 focus:outline-none focus:border-accent"
                    >
                      <option value="all">All Traffic Sources</option>
                      {refSources.map((s) => (
                        <option key={s} value={s}>
                          {s} ({refCounts[s] || 0})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Table / Details Split Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Leads List */}
                  <div className="lg:col-span-7 space-y-3">
                    {filteredChecklists.length === 0 ? (
                      <div className="p-12 text-center rounded-3xl bg-[#181816] border border-white/10 text-white/40 text-xs font-mono space-y-2">
                        <p>No matching checklist leads found.</p>
                        <button
                          onClick={() => {
                            setChecklistSearch('');
                            setChecklistStatusFilter('all');
                            setChecklistRefFilter('all');
                          }}
                          className="text-accent underline text-xs"
                        >
                          Reset filters
                        </button>
                      </div>
                    ) : (
                      filteredChecklists.map((lead) => {
                        const isSelected = selectedChecklistLead?.id === lead.id;
                        const dateFormatted = lead.created_at
                          ? new Date(lead.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Recent';

                        return (
                          <div
                            key={lead.id}
                            onClick={() => {
                              setSelectedChecklistLead(lead);
                              setChecklistNoteInput(lead.note || '');
                            }}
                            className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-3 shadow-md ${
                              isSelected
                                ? 'bg-[#20201E] border-accent/60 shadow-lg'
                                : 'bg-[#181816] border-white/10 hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-0.5">
                                <div className="flex items-center space-x-2.5">
                                  <span className="font-display font-bold text-white text-base">
                                    {lead.name}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded-lg text-[10px] font-mono uppercase font-bold ${
                                      lead.status === 'new'
                                        ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
                                        : lead.status === 'contacted'
                                        ? 'bg-blue-500/15 border border-blue-500/30 text-blue-300'
                                        : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                                    }`}
                                  >
                                    {lead.status}
                                  </span>
                                  {lead.ref && (
                                    <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-white/60 font-mono text-[10px]">
                                      via {lead.ref}
                                    </span>
                                  )}
                                </div>
                                <span className="font-mono text-xs text-white/60 block">
                                  {lead.email}
                                </span>
                              </div>

                              <span className="font-mono text-[11px] text-white/40 shrink-0">
                                {dateFormatted}
                              </span>
                            </div>

                            {/* Project Idea Quote */}
                            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 text-xs text-white/90 leading-relaxed font-sans italic line-clamp-2">
                              &ldquo;{lead.idea}&rdquo;
                            </div>

                            {/* Note preview if present */}
                            {lead.note && (
                              <div className="text-[11px] font-mono text-accent/80 flex items-center space-x-1.5 pt-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                                <span className="truncate">Note: {lead.note}</span>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Selected Lead Detail & Note Editor Panel */}
                  <div className="lg:col-span-5">
                    {selectedChecklistLead ? (
                      <div className="p-6 rounded-3xl bg-[#181816] border border-white/10 space-y-5 sticky top-4 shadow-xl">
                        {/* Header */}
                        <div className="flex items-start justify-between pb-4 border-b border-white/10">
                          <div>
                            <h4 className="font-display font-bold text-xl text-white">
                              {selectedChecklistLead.name}
                            </h4>
                            <a
                              href={`mailto:${selectedChecklistLead.email}?subject=Your MVP Scoping Checklist & Technical Review`}
                              className="text-xs font-mono text-accent hover:underline flex items-center space-x-1.5 mt-1"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>{selectedChecklistLead.email}</span>
                            </a>
                          </div>

                          <button
                            onClick={() => handleDeleteChecklist(selectedChecklistLead.id)}
                            title="Delete Lead Record"
                            className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                            <span className="text-white/40 block text-[10px] uppercase">Traffic Source</span>
                            <span className="text-white font-medium">{selectedChecklistLead.ref || 'Direct'}</span>
                          </div>
                          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                            <span className="text-white/40 block text-[10px] uppercase">Date Captured</span>
                            <span className="text-white font-medium">
                              {selectedChecklistLead.created_at
                                ? new Date(selectedChecklistLead.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: '2-digit',
                                  })
                                : 'Recent'}
                            </span>
                          </div>
                        </div>

                        {/* Full Project Description */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-white/50 block">
                            What they are building:
                          </label>
                          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-sm text-white/90 leading-relaxed font-sans">
                            {selectedChecklistLead.idea}
                          </div>
                        </div>

                        {/* Status Selector */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-white/50 block">
                            Outreach &amp; Lead Status:
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {(['new', 'contacted', 'closed'] as const).map((st) => (
                              <button
                                key={st}
                                onClick={() => handleChecklistStatusChange(selectedChecklistLead.id, st)}
                                className={`py-2 px-3 rounded-xl text-xs font-mono font-semibold uppercase transition-all ${
                                  selectedChecklistLead.status === st
                                    ? st === 'new'
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                                      : st === 'contacted'
                                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                                    : 'bg-white/5 text-white/50 hover:text-white border border-white/5'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Private Note Editor */}
                        <div className="space-y-2 pt-2 border-t border-white/10">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-white/50 block">
                            Private Founder Note:
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Add private note about this lead (e.g. Sent scoping proposal, follower on LinkedIn...)"
                            value={checklistNoteInput}
                            onChange={(e) => setChecklistNoteInput(e.target.value)}
                            className="w-full p-3 rounded-2xl bg-black/40 border border-white/10 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-accent"
                          />
                          <button
                            onClick={handleSaveChecklistNote}
                            className="w-full py-2.5 rounded-xl bg-accent text-white font-semibold text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-12 text-center rounded-3xl bg-[#181816] border border-white/10 text-white/40 text-xs font-mono">
                        Select a checklist lead from the left to view full details, update status, and add private notes.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </main>

        {/* COMPREHENSIVE DEVICE DETAIL ANALYTICS MODAL */}
        {selectedDevice && (() => {
          const dev = selectedDevice;
          const formatModalDate = (iso: string) => {
            try {
              const d = new Date(iso);
              const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
              const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
              return { dateStr, timeStr };
            } catch {
              return { dateStr: 'Recent', timeStr: iso };
            }
          };

          const firstVisit = formatModalDate(dev.firstSeen);
          const lastVisit = formatModalDate(dev.lastSeen);
          const sessionsList = dev.sessions && dev.sessions.length > 0 ? dev.sessions : [];

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
              <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#141413] border border-white/15 shadow-2xl overflow-hidden text-white">
                {/* Modal Header */}
                <div className="p-6 sm:p-7 border-b border-white/10 flex items-start sm:items-center justify-between gap-4 bg-[#181816]">
                  <div className="flex items-center space-x-3.5">
                    <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10 text-accent shrink-0">
                      {dev.device === 'Mobile' ? (
                        <Globe className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <Laptop className="w-6 h-6 text-accent" />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                          {dev.device} · {dev.os} ({dev.browser})
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 font-mono text-xs">
                          {dev.referrer} Source
                        </span>
                      </div>
                      <p className="text-xs font-mono text-white/50 mt-1">
                        Visitor Device Signature: <span className="text-white/80">{dev.visitorId}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedDevice(null)}
                    className="w-9 h-9 rounded-2xl bg-white/[0.05] hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors shrink-0"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Content Scroll Area */}
                <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
                  {/* 1. Key Metrics Strip (4 Hero KPI Cards) */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                      <div className="flex items-center space-x-1.5 text-accent font-mono text-xs font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>First Visit (Origin)</span>
                      </div>
                      <div className="text-white font-bold text-sm sm:text-base font-display">
                        {firstVisit.dateStr}
                      </div>
                      <div className="text-white/50 text-xs font-mono">
                        {firstVisit.timeStr}
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                      <div className="flex items-center space-x-1.5 text-emerald-400 font-mono text-xs font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Last Active Visit</span>
                      </div>
                      <div className="text-white font-bold text-sm sm:text-base font-display">
                        {lastVisit.dateStr}
                      </div>
                      <div className="text-white/50 text-xs font-mono">
                        {lastVisit.timeStr}
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                      <div className="flex items-center space-x-1.5 text-purple-400 font-mono text-xs font-bold">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Total Pageviews</span>
                      </div>
                      <div className="text-white font-bold text-xl font-display">
                        {dev.totalViews} <span className="text-xs font-normal text-white/50">views</span>
                      </div>
                      <div className="text-white/50 text-xs font-mono">
                        Across {dev.sessionCount} session{dev.sessionCount === 1 ? '' : 's'}
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                      <div className="flex items-center space-x-1.5 text-amber-400 font-mono text-xs font-bold">
                        <Activity className="w-3.5 h-3.5" />
                        <span>Total Dwell Time</span>
                      </div>
                      <div className="text-white font-bold text-xl font-display">
                        {dev.totalDuration}s
                      </div>
                      <div className="text-white/50 text-xs font-mono">
                        ~{Math.round(dev.totalDuration / Math.max(dev.sessionCount, 1))}s avg / visit
                      </div>
                    </div>
                  </div>

                  {/* 2. Chronological Breakdown of Each Individual Visit */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <h4 className="font-display font-bold text-white text-lg flex items-center space-x-2">
                        <span>🗓️ Chronological Visit History (Each Visit Date &amp; Time)</span>
                      </h4>
                      <span className="text-xs font-mono text-white/50">
                        {sessionsList.length > 0 ? `${sessionsList.length} Recorded Sessions` : 'Aggregated Telemetry Session'}
                      </span>
                    </div>

                    {sessionsList.length === 0 ? (
                      <div className="p-4 rounded-2xl bg-black/30 border border-white/5 text-xs font-mono text-white/60 space-y-2">
                        <p><strong>Primary Visit Session:</strong> {firstVisit.dateStr} at {firstVisit.timeStr}</p>
                        <p><strong>Latest Activity:</strong> {lastVisit.dateStr} at {lastVisit.timeStr}</p>
                        <p><strong>Total Views:</strong> {dev.totalViews} Pageviews &middot; <strong>Dwell:</strong> {dev.totalDuration}s</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {sessionsList.map((ses: any, sIdx: number) => {
                          const sTime = formatModalDate(ses.timestamp);
                          const visitNumber = sessionsList.length - sIdx;

                          return (
                            <div
                              key={ses.id || sIdx}
                              className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all space-y-3"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/5">
                                <div className="flex items-center space-x-2.5">
                                  <span className={`px-2.5 py-0.5 rounded-lg font-mono text-xs font-bold ${
                                    visitNumber === 1
                                      ? 'bg-accent/20 border border-accent/40 text-accent'
                                      : 'bg-purple-500/20 border border-purple-500/40 text-purple-300'
                                  }`}>
                                    {visitNumber === 1 ? '✨ Visit #1 (Origin)' : `🔄 Visit #${visitNumber}`}
                                  </span>
                                  <span className="font-mono text-xs text-white font-semibold">
                                    {sTime.dateStr} · {sTime.timeStr}
                                  </span>
                                </div>

                                <div className="flex items-center space-x-3 font-mono text-xs text-white/60">
                                  <span>👁️ {ses.pageViews || 1} Views</span>
                                  <span>⏱️ {ses.duration || 1}s Dwell</span>
                                  <span className="px-2 py-0.5 rounded bg-white/[0.04] text-white/50">{ses.referrer || dev.referrer}</span>
                                </div>
                              </div>

                              {/* Sections in this visit */}
                              {ses.sectionsViewed && ses.sectionsViewed.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                                  <span className="text-white/40 text-[11px] uppercase mr-1">Sections Explored:</span>
                                  {ses.sectionsViewed.map((sc: string, sci: number) => (
                                    <span
                                      key={sci}
                                      className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-white/80 text-[11px]"
                                    >
                                      {sc}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Project interactions in this visit */}
                              {ses.projectInteractions && ses.projectInteractions.length > 0 && (
                                <div className="space-y-1 text-xs font-mono pt-1">
                                  <span className="text-accent text-[11px] uppercase block">Project Actions:</span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {ses.projectInteractions.map((pi: any, pii: number) => (
                                      <span
                                        key={pii}
                                        className="px-2 py-0.5 rounded bg-accent/10 border border-accent/30 text-accent text-[11px]"
                                      >
                                        {pi.action === 'view_modal' ? '🔍 Demo Preview' : pi.action === 'live_demo' ? '🚀 Live Launch' : '🐙 GitHub'}: {pi.projectId}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* 3. All Sections Explored Across Lifetime */}
                  {dev.sections.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-display font-bold text-white text-base">
                        🧭 All Sections Explored Across All Visits
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {dev.sections.map((sec: string, i: number) => (
                          <div
                            key={i}
                            className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs flex items-center space-x-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                            <span>{sec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4. Complete Chronological Granular Activity Ledger */}
                  {dev.actions.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-display font-bold text-white text-base">
                        ⚡ Granular Event Log &amp; Interactions Stream
                      </h4>
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
                        {dev.actions.map((act: any, i: number) => {
                          const actTime = formatModalDate(act.timestamp);
                          return (
                            <div
                              key={act.id || i}
                              className="flex items-center justify-between text-xs font-mono p-2.5 rounded-xl bg-black/40 border border-white/5 hover:border-white/10 transition-colors"
                            >
                              <div className="flex items-center space-x-2 text-white/90">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                <span>{act.description}</span>
                              </div>
                              <span className="text-white/40 shrink-0 text-[11px] ml-3">
                                {actTime.dateStr} · {actTime.timeStr}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="p-4 sm:p-5 border-t border-white/10 bg-[#181816] flex items-center justify-between">
                  <span className="text-xs font-mono text-white/50">
                    Live Supabase Telemetry &middot; Dynamic External Device Analytics
                  </span>
                  <button
                    onClick={() => setSelectedDevice(null)}
                    className="px-5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/15 text-xs font-mono font-semibold text-white transition-colors"
                  >
                    Close Analytics
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* COMPREHENSIVE DEVICE FEEDBACK & COMMENTS MODAL */}
        {selectedFeedbackDevice && (() => {
          const dev = selectedFeedbackDevice;
          const comments: VisitorFeedback[] = (summary.feedbacks || []).filter(
            (f) =>
              `${f.device} · ${f.os} (${f.browser})_${f.referrer || 'Direct'}` === dev.id ||
              (`${f.device} · ${f.os}` === `${dev.device} · ${dev.os}` && f.browser === dev.browser)
          );

          const formatFbModalDate = (iso: string) => {
            try {
              const d = new Date(iso);
              const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
              const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
              return { dateStr, timeStr };
            } catch {
              return { dateStr: 'Recent', timeStr: iso };
            }
          };

          const isMobile = dev.device.toLowerCase().includes('mobile');

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
              <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-[#141413] border border-white/15 shadow-2xl overflow-hidden text-white">
                {/* Modal Header */}
                <div className="p-6 sm:p-7 border-b border-white/10 flex items-start sm:items-center justify-between gap-4 bg-[#181816]">
                  <div className="flex items-center space-x-3.5">
                    <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10 text-accent shrink-0">
                      {isMobile ? (
                        <Globe className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <Laptop className="w-6 h-6 text-accent" />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                          {dev.device} · {dev.os} ({dev.browser})
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 font-mono text-xs">
                          {dev.referrer} Source
                        </span>
                      </div>
                      <p className="text-xs font-mono text-white/50 mt-1">
                        Device Comments History &middot; <span className="text-accent font-semibold">{comments.length} Total Comments</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedFeedbackDevice(null)}
                    className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body: All Comments from this Device */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-4">
                  {comments.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center text-white/50 font-mono text-xs">
                      All feedback records from this device have been deleted.
                    </div>
                  ) : (
                    comments.map((c, cIdx) => {
                      const dt = formatFbModalDate(c.created_at);
                      const commentNumber = comments.length - cIdx;

                      return (
                        <div
                          key={c.id}
                          className="p-5 sm:p-6 rounded-2xl bg-[#181816] border border-white/10 hover:border-white/20 transition-all space-y-3"
                        >
                          {/* Top Row: Feedback # & Rating & Timestamp */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-lg bg-accent/20 border border-accent/40 text-accent font-mono text-xs font-bold">
                                Comment #{commentNumber}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
                                {c.rating}
                              </span>
                              <span className="font-mono text-xs text-white/80 font-medium">
                                👤 {c.name}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-xs font-semibold">
                                💼 {c.role || 'Visitor'}
                              </span>
                            </div>

                            <div className="text-right font-mono text-xs text-white/60">
                              <span>{dt.dateStr} · {dt.timeStr}</span>
                            </div>
                          </div>

                          {/* Message Box */}
                          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-sm text-white/90 leading-relaxed font-sans italic">
                            &ldquo;{c.message}&rdquo;
                          </div>

                          {/* Bottom Row: Actions */}
                          <div className="flex items-center justify-between pt-1 text-xs font-mono text-white/40">
                            <span className="text-[11px]">
                              Supabase UUID: {c.id}
                            </span>

                            <button
                              onClick={async () => {
                                await handleDeleteFeedback(c.id);
                                const rem = comments.filter((item) => item.id !== c.id);
                                if (rem.length === 0) setSelectedFeedbackDevice(null);
                              }}
                              className="px-3 py-1.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center space-x-1"
                              title="Delete this comment record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="text-xs">Delete</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Modal Footer */}
                <div className="p-4 sm:p-5 border-t border-white/10 bg-[#181816] flex items-center justify-between">
                  <span className="text-xs font-mono text-white/50">
                    Live Supabase Telemetry &middot; Dynamic Device Comments Ledger
                  </span>
                  <button
                    onClick={() => setSelectedFeedbackDevice(null)}
                    className="px-5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/15 text-xs font-mono font-semibold text-white transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
