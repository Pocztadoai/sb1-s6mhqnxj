export interface Contact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  position?: string;
  phone?: string;
  tags?: string[];
  status: 'active' | 'unsubscribed' | 'bounced';
  createdAt: Date;
  lastEmailSent?: Date;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  createdAt: Date;
  lastUsed?: Date;
}

export interface Campaign {
  id: string;
  name: string;
  template: EmailTemplate;
  contacts: Contact[];
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'paused';
  schedule: ScheduleSettings;
  stats: CampaignStats;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface ScheduleSettings {
  startDate: Date;
  endDate?: Date;
  workingHours: {
    start: string; // HH:MM format
    end: string;   // HH:MM format
  };
  workingDays: number[]; // 0-6, Sunday = 0
  intervalMinutes: number;
  timezone: string;
  respectWorkingHours: boolean;
}

export interface CampaignStats {
  totalContacts: number;
  emailsSent: number;
  emailsRemaining: number;
  lastSentAt?: Date;
  estimatedCompletion?: Date;
}

export interface AppState {
  currentTab: 'dashboard' | 'contacts' | 'campaigns' | 'templates' | 'settings';
  contacts: Contact[];
  templates: EmailTemplate[];
  campaigns: Campaign[];
}