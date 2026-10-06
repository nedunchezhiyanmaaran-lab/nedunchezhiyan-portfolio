export interface Project {
  id: string;
  number: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  metrics: string[];
  techStack: string[];
  liveUrl: string;
  githubUrl?: string;
  role: string;
  timeline: string;
  architectureHighlights: string[];
  features: string[];
  themeColor: string;
  previewBg: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  deliverables: string[];
  stack: string[];
}

export interface ProcessStep {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  outputs: string[];
}
