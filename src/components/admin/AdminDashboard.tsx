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
  CheckCircle2,
} from 'lucide-react';
import {
  getAnalyticsSummary,
  updateLeadStatus,
  deleteLead,
  exportAnalyticsFile,
  resetAnalyticsData,
  logAnalyticsEvent,
  syncSupabaseData,
  isCurrentDeviceWhitelisted,
  setDeviceWhitelisted,
  fetchAndWhitelistCurrentIP,
  type AnalyticsFilterMode,
  type AnalyticsSummary,
  type LeadSubmission,
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
  const [activeTab, setActiveTab] = useState<'overview' | 'traffic' | 'projects' | 'leads' | 'tech' | 'stream'>('overview');
  const [timeframe, setTimeframe] = useState<7 | 14 | 30>(14);
  const [filterMode, setFilterMode] = useState<AnalyticsFilterMode>('external_only');
  const [isWhitelisted, setIsWhitelisted] = useState<boolean>(() => isCurrentDeviceWhitelisted());
  const [currentIP, setCurrentIP] = useState<string>('Detecting IP...');
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLead, setSelectedLead] = useState<LeadSubmission | null>(null);
  const [leadNoteInput, setLeadNoteInput] = useState<string>('');
  const [activeHoverPoint, setActiveHoverPoint] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSupabaseSynced, setIsSupabaseSynced] = useState<boolean>(true);

  // Fetch IP and auto-whitelist on mount
  useEffect(() => {
    fetchAndWhitelistCurrentIP().then((ip) => {
      setCurrentIP(ip);
      setIsWhitelisted(true);
    });
  }, []);

  // Refresh and sync data from Supabase with filter mode
  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await syncSupabaseData();
      setIsSupabaseSynced(true);
    } catch {
      setIsSupabaseSynced(false);
    }
    const data = getAnalyticsSummary(timeframe, filterMode);
    setSummary(data);
    setTimeout(() => setIsRefreshing(false), 300);
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 10000); // 10s live polling
    return () => clearInterval(interval);
  }, [timeframe, filterMode]);

  const handleToggleWhitelist = () => {
    const nextState = !isWhitelisted;
    setIsWhitelisted(nextState);
    setDeviceWhitelisted(nextState);
    logAnalyticsEvent('visit', nextState ? '💻 Current Laptop tagged as Whitelisted Owner Device' : 'Device un-whitelisted');
    refreshData();
  };

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

  const handleSaveNote = () => {
    if (!selectedLead) return;
    updateLeadStatus(selectedLead.id, selectedLead.status, leadNoteInput);
    setSelectedLead((prev) => (prev ? { ...prev, notes: leadNoteInput } : null));
    refreshData();
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
          {/* Traffic Filter Selector */}
          <div className="hidden lg:flex items-center p-1 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filterMode === 'all' ? 'bg-accent text-white font-bold' : 'text-white/60 hover:text-white'
              }`}
            >
              All Traffic
            </button>
            <button
              onClick={() => setFilterMode('owner_only')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1 ${
                filterMode === 'owner_only' ? 'bg-accent text-white font-bold' : 'text-white/60 hover:text-white'
              }`}
            >
              <span>💻 My Laptop</span>
            </button>
            <button
              onClick={() => setFilterMode('external_only')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filterMode === 'external_only' ? 'bg-accent text-white font-bold' : 'text-white/60 hover:text-white'
              }`}
            >
              👥 External
            </button>
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
              { id: 'traffic', label: 'Traffic & Trends', icon: Activity },
              { id: 'projects', label: 'Project Engagement', icon: Layers },
              { id: 'leads', label: `Lead Inbox (${summary.leads.length})`, icon: Send },
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
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">
                      {filterMode === 'external_only'
                        ? 'External Only'
                        : filterMode === 'owner_only'
                        ? 'My Laptop'
                        : 'All Traffic'}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/50">
                    {filterMode === 'external_only'
                      ? 'Self/Laptop traffic automatically excluded'
                      : `Past ${timeframe} days activity`}
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
                    {filterMode === 'owner_only' ? 'Your local testing dwell time' : 'Visitor engagement length'}
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

          {/* TAB 2: TRAFFIC & TRENDS */}
          {activeTab === 'traffic' && (
            <div className="space-y-8">
              <div className="p-6 rounded-3xl bg-[#181816] border border-white/10 space-y-6">
                <div className="space-y-1">
                  <h3 className="font-display text-lg font-bold text-white">
                    24-Hour Traffic Intensity Distribution
                  </h3>
                  <p className="text-xs text-white/50">
                    Distribution of visitor activity across local hours (00:00 to 23:00 IST).
                  </p>
                </div>

                <div className="grid grid-cols-12 sm:grid-cols-24 gap-1 sm:gap-1.5 items-end h-40 pt-6">
                  {summary.hourlyActivity.map((h, i) => {
                    const maxCount = Math.max(...summary.hourlyActivity.map((a) => a.count), 5);
                    const pct = Math.max((h.count / maxCount) * 100, 8);
                    return (
                      <div key={i} className="flex flex-col items-center space-y-2 group">
                        <div
                          className="w-full rounded-t-md bg-accent/40 group-hover:bg-accent transition-all relative"
                          style={{ height: `${pct}%` }}
                        >
                          <span className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity px-1.5 py-0.5 rounded bg-black text-[9px] font-mono text-white whitespace-nowrap z-10">
                            {h.count} visits
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-white/40">{h.hour}h</span>
                      </div>
                    );
                  })}
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
            </div>
          )}

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
                  Telemetry breakdown of devices, operating systems, browsers, and discovery sources.
                </p>
              </div>

              {/* Developer Laptop Whitelist Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1E1E1C] via-[#24221D] to-[#1A1A18] border border-accent/30 shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
                      <Laptop className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-display font-bold text-base text-white">
                          Nedunchezhiyan&apos;s Development Laptop
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Whitelisted</span>
                        </span>
                      </div>
                      <p className="text-xs text-white/60">
                        This device is tagged as the primary owner workstation. Actions here are logged and can be filtered.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleToggleWhitelist}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                      isWhitelisted
                        ? 'bg-accent text-white hover:bg-white hover:text-black'
                        : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {isWhitelisted ? '✓ Whitelist Active' : '+ Whitelist This Device'}
                  </button>
                </div>

                {/* Live Hardware Telemetry Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-white/10 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-white/40 block text-[10px] uppercase">Whitelisted IP</span>
                    <span className="text-emerald-400 font-bold truncate block">{currentIP}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-white/40 block text-[10px] uppercase">OS &amp; Host</span>
                    <span className="text-white font-semibold">Windows PC (Dell)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-white/40 block text-[10px] uppercase">Browser &amp; Engine</span>
                    <span className="text-white font-semibold">Chrome / V8</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-white/40 block text-[10px] uppercase">Screen Viewport</span>
                    <span className="text-accent font-semibold">
                      {typeof window !== 'undefined' ? `${window.innerWidth} × ${window.innerHeight}` : 'Desktop'}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-white/40 block text-[10px] uppercase">Timezone</span>
                    <span className="text-white font-semibold">IST (Asia/Kolkata)</span>
                  </div>
                </div>
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
          {activeTab === 'stream' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-display text-xl font-bold text-white">
                    Real-Time Telemetry Event Stream
                  </h3>
                  <p className="text-xs text-white/50">
                    Live raw chronological stream of interactions and visitors.
                  </p>
                </div>
                <button
                  onClick={handleSimulateVisitor}
                  className="px-3 py-1.5 rounded-xl bg-accent text-white font-semibold text-xs hover:bg-white hover:text-black transition-all"
                >
                  + Trigger Live Event
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-[#181816] border border-white/10 space-y-3">
                {summary.recentEvents.length === 0 ? (
                  <div className="p-8 text-center text-white/40 text-xs font-mono">
                    No recent events logged yet.
                  </div>
                ) : (
                  summary.recentEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            evt.type === 'contact_submit'
                              ? 'bg-accent animate-ping'
                              : evt.type === 'project_view'
                              ? 'bg-blue-400'
                              : 'bg-emerald-400'
                          }`}
                        />
                        <span className="font-bold text-white">{evt.description}</span>
                        {evt.meta && (
                          <span className="font-mono text-white/40 text-[11px] hidden sm:inline">
                            ({evt.meta})
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-white/40 text-[10px] shrink-0">
                        {new Date(evt.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
