export interface PersonSpace {
  id: string;
  name: string;
  desc: string;
  files: Record<string, string>;
  notes: string;
  tasks: { id: string; title: string; completed: boolean }[];
  connectedApps: string[];
}

export interface CustomAgent {
  id: string;
  name: string;
  purpose: string;
  personality: string;
  model: string;
  tools: string[];
}

export interface CommunityPost {
  id: string;
  author: string;
  title: string;
  body: string;
  likes: number;
  commentsCount: number;
  tag: string;
  channelId?: string;
  timestamp?: string;
}

export interface AppMarketCard {
  id: string;
  name: string;
  category: 'development' | 'productivity' | 'ai' | 'design' | 'automation' | 'storage';
  desc: string;
  connected: boolean;
  apiKeyName?: string;
  apiKeyValue?: string;
}

export interface HavenExtension {
  id: string;
  name: string;
  desc: string;
  category: 'workspace' | 'assistant' | 'community' | 'general' | 'developer';
  author: string;
  active: boolean;
  permissions: string[]; // e.g. ["Read Files", "Write Files", "Read Memories", "Inject CSS", "Mock Hooks"]
  grantedPermissions: string[]; // permissions currently approved by user sandbox
  customSettings?: Record<string, string>;
}

export interface SandboxExecutionLog {
  timestamp: string;
  source: string;
  permission: string;
  status: 'GRANTED' | 'DENIED' | 'SIMULATED';
  message: string;
}

export interface CustomArtifact {
  id: string;
  name: string;
  type: 'focus-timer' | 'habit-tracker' | 'api-checker' | 'margin-calculator' | 'markdown-notes';
  accentColor: 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'violet';
  blueprintName: string;
  state: Record<string, any>;
  createdAt: string;
}

