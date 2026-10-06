import type { Project, ServiceItem, ProcessStep } from '../types';

export const PROJECTS: Project[] = [
  {
    id: 'travel-agency',
    number: '01',
    title: 'Roamora Luxury Travel Platform',
    category: 'TRAVEL & HOSPITALITY TECH',
    tagline: 'Immersive destination discovery & bespoke travel concierge',
    description: 'An interactive digital travel platform built for curated excursions and luxury stays. Features dynamic multi-filter destination discovery, interactive packages, direct concierge booking flows, and responsive image optimization.',
    metrics: ['Sub-second Page Loads', 'Dynamic Itinerary Engine', 'Responsive Multi-Device UX'],
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
    liveUrl: 'https://travel-agency-kohl-three.vercel.app/',
    role: 'Lead Frontend Developer & UI Architect',
    timeline: '4 Weeks',
    architectureHighlights: [
      'Engineered client-side caching & instant page transitions for fluid travel browsing',
      'Designed responsive destination card grids with lazy-loaded asset pipelines',
      'Implemented interactive booking inquiry workflows with persistent local state'
    ],
    features: [
      'Interactive Destination Explorer with category filtering',
      'Custom Itinerary Detail & Inclusions Breakdown',
      'Direct WhatsApp & Web Booking Inquiry Flow',
      'Adaptive Mobile-First Navigation'
    ],
    themeColor: '#D84C24',
    previewBg: '#181A1B'
  },
  {
    id: 'jameen-restaurant',
    number: '02',
    title: 'Jameen Restaurant & Dining',
    category: 'REAL ESTATE & HOSPITALITY TECH',
    tagline: 'Contactless QR table ordering & culinary catalog engine',
    description: 'A high-performance digital ordering application enabling patrons to browse rich culinary catalogs across Indian, Biryani, Tandoori, Chinese, and Grill specialties, customize platters, and manage table orders seamlessly.',
    metrics: ['Instant QR Table Booting', 'Zero-Latency Cart Sync', 'Multi-Category Menu Filter'],
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Lucide Icons', 'Vercel'],
    liveUrl: 'https://jameen-xi.vercel.app/customer',
    role: 'Product Engineer & UI Architect',
    timeline: '3 Weeks',
    architectureHighlights: [
      'Crafted Next.js client hydration and table-aware session state management',
      'Built reactive cart state with real-time tax, add-on variations, and special notes handling',
      'Optimized asset payloads and gold-accent dark luxury UI hierarchy'
    ],
    features: [
      'Dynamic Table-Aware QR Session Routing',
      'Multi-cuisine classification (Biryani, Tandoor, Chinese, Grills)',
      'Custom dish customization & spice-level selectors',
      'Interactive order status tracking and digital billing flow'
    ],
    themeColor: '#C49B37',
    previewBg: '#090C15'
  },
  {
    id: 'acme-crm',
    number: '03',
    title: 'AcmeCRM — AI-Powered Sales Platform',
    category: 'ENTERPRISE SAAS & AI CRM',
    tagline: 'Interactive sales pipeline platform & deal management engine',
    description: 'A comprehensive CRM platform built for modern revenue and sales teams. Features end-to-end lead tracking, interactive pipeline stages, contact management, and deal analytics.',
    metrics: ['AI Lead Scoring Engine', 'Kanban Stage Synchronization', 'Sub-second Full-Text Search'],
    techStack: ['Next.js 14', 'React', 'TypeScript', 'Tailwind CSS', 'Lucide Icons', 'Vercel'],
    liveUrl: 'https://acme-crm-frontend.vercel.app/',
    role: 'Sole Architect & Product Engineer',
    timeline: '5 Weeks',
    architectureHighlights: [
      'Engineered responsive kanban deal pipeline with optimistic drag-and-drop state updates',
      'Built custom AI lead scoring indicators and deal probability calculations',
      'Architected persistent local state workflows with granular filtering and full-text search'
    ],
    features: [
      'Dynamic Drag-and-Drop Deal Pipeline',
      'AI-Powered Lead Insights & Scoring',
      'Full-Text Contact & Organization Indexing',
      'Revenue Velocity & Activity Analytics Dashboard'
    ],
    themeColor: '#1A56DB',
    previewBg: '#0D1117'
  }
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'prd-to-mvp',
    number: '01',
    title: 'PRD to Production MVP',
    shortDesc: 'From validated concept to production web app in 3–5 weeks.',
    fullDesc: 'You have a validated concept, wireframe, or business requirement and need a senior builder who understands product. I draft actionable PRDs, design the data architecture, and build responsive, type-safe web applications ready for real users.',
    deliverables: [
      'PRD & System Blueprint (Data models, API contracts & user flows)',
      'Production Web App (Next.js 14, React 18 & responsive Tailwind UX)',
      'Authentication & Role Controls (Secure user sessions & permissions)',
      'Automated Cloud Pipeline (Zero-downtime Vercel deployment)'
    ],
    stack: ['Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS', 'Vercel']
  },
  {
    id: 'fullstack-systems',
    number: '02',
    title: 'Custom Web Applications & Systems',
    shortDesc: 'Bespoke operational platforms when off-the-shelf tools hit their limits.',
    fullDesc: 'When templates and no-code tools can’t support your business logic, I build custom web software from scratch. From multi-role management dashboards to live order-dispatch workflows and high-concurrency client portals.',
    deliverables: [
      'Architecture & API Contracts (Structured data flows & schema design)',
      'Reactive State & Data Sync (Client state management & persistent storage)',
      'Complex User Workflows (Dynamic multi-step forms & operational funnels)',
      'Third-Party Integrations (Payment checkout, webhooks & notifications)'
    ],
    stack: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js']
  },
  {
    id: 'perf-refactoring',
    number: '03',
    title: 'Performance & Architecture Audits',
    shortDesc: 'Eliminating latency, untangling tech debt, and stabilizing fragile code.',
    fullDesc: 'Slow load times kill retention. If your application feels sluggish or fragile, I audit the codebase, eliminate bundle bloat, optimize rendering cycles, decouple monolithic components, and upgrade your stack to strict TypeScript.',
    deliverables: [
      'Core Web Vitals 95+ (Sub-second FCP, zero CLS & asset optimization)',
      'State & Query Optimization (Efficient caching & minimal re-renders)',
      'Type-Safe Modernization (Legacy JS to TypeScript & clean component architecture)',
      'Security & Dependency Hardening (Package vulnerability patches & tree-shaking)'
    ],
    stack: ['Next.js', 'Vite', 'TypeScript', 'Lighthouse', 'Bundle Analyzer']
  },
  {
    id: 'ai-automation',
    number: '04',
    title: 'AI Pipelines & Intelligent Workflows',
    shortDesc: 'Practical AI tooling and semantic workflows that solve real bottlenecks.',
    fullDesc: 'No AI buzzword fluff. I build deterministic automation pipelines that parse unstructured data, power semantic search, and execute structured AI function calls directly connected to your product UI.',
    deliverables: [
      'Structured LLM Function Calling (Deterministic JSON outputs & tool calling)',
      'Vector & Semantic Search (Contextual document embeddings & indexing)',
      'Async Workflow Queues (Reliable job execution for complex tasks)',
      'Validation & Fallback Guardrails (Zero hallucinations on critical user actions)'
    ],
    stack: ['TypeScript', 'Python', 'OpenAI APIs', 'React', 'Tailwind CSS']
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'DISCOVER & PRD',
    subtitle: 'Product Discovery & PRD Formulation',
    description: 'We align directly on your core business objectives, user personas, functional boundaries, and technical constraints to draft a clear, actionable PRD.',
    outputs: ['Product Requirements Document (PRD)', 'Technical Scope & Feasibility', 'Milestone Roadmap']
  },
  {
    step: '02',
    title: 'DEFINE & ARCHITECT',
    subtitle: 'System Architecture & Schema Design',
    description: 'I design data schemas, API contracts, and high-fidelity interface wireframes. Every user flow and state transition is mapped out before heavy coding begins.',
    outputs: ['Database Schema & API Specs', 'Interactive UI Prototypes', 'Architecture Blueprint']
  },
  {
    step: '03',
    title: 'BUILD & INTEGRATE',
    subtitle: 'Type-Safe Full-Stack Engineering',
    description: 'Rapid sprint cycles delivering tested frontend components, backend endpoints, and third-party integrations with continuous live staging previews.',
    outputs: ['Type-Safe Clean Codebase', 'Weekly Live Staging Builds', 'Automated CI/CD Pipeline']
  },
  {
    step: '04',
    title: 'LAUNCH & OPTIMIZE',
    subtitle: 'Optimization & Zero-Downtime Deployment',
    description: 'Comprehensive performance auditing, security hardening, SEO metadata setup, and deployment to production-grade cloud infrastructure.',
    outputs: ['Production Cloud Deployment', 'Lighthouse 95+ Audit Report', 'Documentation & Handover']
  }
];

export const TECH_MARQUEE = [
  'React 18',
  'Next.js 14',
  'TypeScript',
  'Node.js',
  'FastAPI',
  'Supabase',
  'PostgreSQL',
  'Tailwind CSS',
  'Framer Motion',
  'MongoDB',
  'Docker',
  'REST & GraphQL',
  'OpenAI APIs',
  'Vercel Cloud'
];
