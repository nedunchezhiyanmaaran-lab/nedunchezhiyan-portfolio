import type { Project, ServiceItem, ProcessStep } from '../types';

export const PROJECTS: Project[] = [
  {
    id: 'travel-agency',
    number: '01',
    title: 'Roamora Luxury Travel Platform',
    category: 'TRAVEL & HOSPITALITY TECH',
    tagline: 'Immersive destination discovery & bespoke travel concierge',
    description: 'An interactive digital travel platform built for curated excursions and luxury stays. Features dynamic multi-filter destination discovery, interactive packages, direct concierge booking flows, and responsive image optimization.',
    metrics: ['Sub-second Transitions', 'Dynamic Itinerary Engine', 'Responsive Multi-Device UX'],
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
    liveUrl: 'https://travel-agency-kohl-three.vercel.app/',
    role: 'Lead Full-Stack Builder & UI Architect',
    timeline: '4 Weeks',
    startingPoint: {
      providedByClient: [
        'Client requested a high-impact interactive travel demo to visualize luxury tours',
        'Initial concepts for destination showcases, boutique stays, and WhatsApp booking',
        'Granted complete creative & technical freedom to define UI, UX, and stack',
      ],
    },
    myContribution: {
      role: 'End-to-End Autonomous Build',
      responsibilities: [
        'Designed luxury editorial UI/UX and fluid animations from concept to completion',
        'Engineered complete Next.js & TypeScript architecture with instant client-side transitions',
        'Built interactive multi-filter destination search and dynamic pricing tiers',
        'Integrated direct WhatsApp concierge booking flow and persistent client state',
        'Optimized media assets and deployed live interactive web demo on Vercel',
      ],
    },
    delivered: {
      outcome: 'A polished, sub-second interactive travel web demo featuring frictionless mobile booking and refined visual aesthetics.',
      keyDeliverables: [
        'Live interactive travel demo with sub-second page transitions',
        'Instant multi-filter destination catalog & custom itinerary explorer',
        'Direct WhatsApp concierge lead conversion funnel',
      ],
    },
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
    category: 'HOSPITALITY TECH & DINING',
    tagline: 'Contactless QR table ordering & culinary catalog engine',
    description: 'A high-performance digital ordering application enabling patrons to browse rich culinary catalogs across Indian, Biryani, Tandoori, Chinese, and Grill specialties, customize platters, and manage table orders seamlessly.',
    metrics: ['Instant QR Table Booting', 'Zero-Latency Cart Sync', 'Multi-Category Menu Filter'],
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Lucide Icons', 'Vercel'],
    liveUrl: 'https://jameen-xi.vercel.app/customer',
    role: 'Product Engineer & Full-Stack Builder',
    timeline: '3 Weeks',
    startingPoint: {
      providedByClient: [
        'Client requested a modern contactless QR dining demo to showcase instant table ordering',
        'High-level culinary themes (Biryani, Tandoor, Chinese, and Grills)',
        'Full creative autonomy to craft the visual experience, session logic, and cart state',
      ],
    },
    myContribution: {
      role: 'End-to-End Autonomous Build',
      responsibilities: [
        'Designed dark gold luxury dining theme and responsive mobile-first UI',
        'Architected dynamic table-aware QR session routing (`/customer?table=X`)',
        'Built instant culinary catalog filtering and dish add-on customization modal',
        'Engineered reactive cart state with real-time tax calculation and billing summary',
        'Deployed live interactive web demo with zero-latency caching on Vercel',
      ],
    },
    delivered: {
      outcome: 'A frictionless, zero-install digital dining demo that loads instantly upon scanning a table QR code and syncs guest orders in real-time.',
      keyDeliverables: [
        'Zero-install QR table ordering demo with instant loading on mobile browsers',
        'Multi-cuisine interactive menu with spice-level and quantity customizations',
        'Real-time reactive cart and digital table billing workflow',
      ],
    },
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
    role: 'Lead Full-Stack Architect',
    timeline: '5 Weeks',
    startingPoint: {
      providedByClient: [
        'Client requested a high-converting AI CRM demo platform to pitch revenue workflows',
        'Core requirements for opportunity tracking, deal stages, and smart lead scoring',
        'Full freedom to design the information architecture, user experience, and frontend engine',
      ],
    },
    myContribution: {
      role: 'End-to-End Autonomous Build',
      responsibilities: [
        'Designed enterprise-grade SaaS interface with dark industrial aesthetics',
        'Engineered drag-and-drop Kanban pipeline with optimistic UI state updates',
        'Implemented AI lead scoring engine and deal win-probability analytics',
        'Built full-text indexing for instant organization and contact search',
        'Configured CI/CD pipeline and deployed live interactive demo on Vercel',
      ],
    },
    delivered: {
      outcome: 'A responsive, high-speed SaaS demo platform providing revenue teams instant deal stage clarity, AI-assisted lead scoring, and pipeline analytics.',
      keyDeliverables: [
        'Interactive Drag-and-Drop Kanban pipeline with zero UI lag',
        'Predictive deal probability and automated AI lead scoring engine',
        'Real-time search and pipeline velocity analytics dashboard',
      ],
    },
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
    title: 'New App Builds & PRD to MVP',
    shortDesc: 'From zero-to-one validated concepts to production web applications in 3–5 weeks.',
    fullDesc: 'Building a new product from scratch? You have a validated concept, wireframe, or business requirement and need a senior builder who understands product. I draft actionable PRDs, design the data architecture, and engineer responsive, type-safe web applications ready for real users and immediate monetization.',
    deliverables: [
      'PRD & System Blueprint (Data models, API contracts & user flows)',
      'Production Web App (Next.js 14, React 18 & responsive Tailwind UX)',
      'Authentication & Role Controls (Secure user sessions & permissions)',
      'Automated Cloud Pipeline (Zero-downtime Vercel deployment)'
    ],
    stack: ['Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS', 'Vercel']
  },
  {
    id: 'app-revamp-modernization',
    number: '02',
    title: 'App Revamps & System Modernization',
    shortDesc: 'Redesigning, refactoring, and upgrading existing applications to modern standards.',
    fullDesc: 'Already have an existing web app that looks outdated, suffers from legacy code, or needs new features? I revamp existing applications from top to bottom — upgrading UI/UX design, refactoring legacy codebases to strict TypeScript, adding new capabilities, and making sluggish systems lightning fast without breaking active users.',
    deliverables: [
      'Complete UI/UX & Design Revamp (Modern editorial look, fluid responsive interactions)',
      'Legacy Code Refactoring (Transitioning to TypeScript, clean component architecture)',
      'Feature Expansion & API Scaling (Adding critical features & modern integrations)',
      'Zero-Downtime Migration (Seamless transition preserving user data & SEO)'
    ],
    stack: ['React 18', 'Next.js 14', 'TypeScript', 'Tailwind CSS', 'PostgreSQL']
  },
  {
    id: 'fullstack-systems',
    number: '03',
    title: 'Custom Web Platforms & Systems',
    shortDesc: 'Bespoke operational platforms when off-the-shelf tools hit their limits.',
    fullDesc: 'When templates and no-code tools can’t support your business logic, I build custom web software from scratch or scale your existing stack. From multi-role management dashboards to live order-dispatch workflows and high-concurrency client portals.',
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
    number: '04',
    title: 'Performance & Architecture Audits',
    shortDesc: 'Eliminating latency, untangling tech debt, and stabilizing fragile code.',
    fullDesc: 'Slow load times kill retention. If your existing application feels sluggish or fragile, I audit the codebase, eliminate bundle bloat, optimize rendering cycles, decouple monolithic components, and upgrade your stack to strict TypeScript.',
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
    number: '05',
    title: 'AI Pipelines & Intelligent Workflows',
    shortDesc: 'Practical AI tooling and semantic workflows that solve real bottlenecks.',
    fullDesc: 'No AI buzzword fluff. I build deterministic automation pipelines that parse unstructured data, power semantic search, and execute structured AI function calls directly connected into your new or existing product UI.',
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
