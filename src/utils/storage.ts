import { Contact, EmailTemplate, Campaign, AppState } from '../types';

const STORAGE_KEYS = {
  contacts: 'email-app-contacts',
  templates: 'email-app-templates',
  campaigns: 'email-app-campaigns',
  settings: 'email-app-settings'
};

export class StorageManager {
  static saveContacts(contacts: Contact[]): void {
    localStorage.setItem(STORAGE_KEYS.contacts, JSON.stringify(contacts));
  }
  
  static loadContacts(): Contact[] {
    const data = localStorage.getItem(STORAGE_KEYS.contacts);
    if (!data) return [];
    
    try {
      const contacts = JSON.parse(data);
      return contacts.map((contact: any) => ({
        ...contact,
        createdAt: new Date(contact.createdAt),
        lastEmailSent: contact.lastEmailSent ? new Date(contact.lastEmailSent) : undefined
      }));
    } catch {
      return [];
    }
  }
  
  static saveTemplates(templates: EmailTemplate[]): void {
    localStorage.setItem(STORAGE_KEYS.templates, JSON.stringify(templates));
  }
  
  static loadTemplates(): EmailTemplate[] {
    const data = localStorage.getItem(STORAGE_KEYS.templates);
    if (!data) return [];
    
    try {
      const templates = JSON.parse(data);
      return templates.map((template: any) => ({
        ...template,
        createdAt: new Date(template.createdAt),
        lastUsed: template.lastUsed ? new Date(template.lastUsed) : undefined
      }));
    } catch {
      return [];
    }
  }
  
  static saveCampaigns(campaigns: Campaign[]): void {
    localStorage.setItem(STORAGE_KEYS.campaigns, JSON.stringify(campaigns));
  }
  
  static loadCampaigns(): Campaign[] {
    const data = localStorage.getItem(STORAGE_KEYS.campaigns);
    if (!data) return [];
    
    try {
      const campaigns = JSON.parse(data);
      return campaigns.map((campaign: any) => ({
        ...campaign,
        createdAt: new Date(campaign.createdAt),
        startedAt: campaign.startedAt ? new Date(campaign.startedAt) : undefined,
        completedAt: campaign.completedAt ? new Date(campaign.completedAt) : undefined,
        template: {
          ...campaign.template,
          createdAt: new Date(campaign.template.createdAt),
          lastUsed: campaign.template.lastUsed ? new Date(campaign.template.lastUsed) : undefined
        },
        contacts: campaign.contacts.map((contact: any) => ({
          ...contact,
          createdAt: new Date(contact.createdAt),
          lastEmailSent: contact.lastEmailSent ? new Date(contact.lastEmailSent) : undefined
        })),
        schedule: {
          ...campaign.schedule,
          startDate: new Date(campaign.schedule.startDate),
          endDate: campaign.schedule.endDate ? new Date(campaign.schedule.endDate) : undefined
        }
      }));
    } catch {
      return [];
    }
  }
}