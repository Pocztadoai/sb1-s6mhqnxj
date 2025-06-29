import { ScheduleSettings, Campaign } from '../types';

export class EmailScheduler {
  private static instance: EmailScheduler;
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  
  static getInstance(): EmailScheduler {
    if (!EmailScheduler.instance) {
      EmailScheduler.instance = new EmailScheduler();
    }
    return EmailScheduler.instance;
  }
  
  startCampaign(campaign: Campaign, onSendEmail: (contactId: string) => void): void {
    if (this.intervals.has(campaign.id)) {
      this.stopCampaign(campaign.id);
    }
    
    const { schedule } = campaign;
    let currentContactIndex = 0;
    
    const sendNextEmail = () => {
      if (currentContactIndex >= campaign.contacts.length) {
        this.stopCampaign(campaign.id);
        return;
      }
      
      if (!this.isWorkingTime(schedule)) {
        // Schedule check for next working time
        const nextWorkingTime = this.getNextWorkingTime(schedule);
        const delay = nextWorkingTime.getTime() - Date.now();
        
        setTimeout(() => {
          this.startCampaign(campaign, onSendEmail);
        }, delay);
        
        return;
      }
      
      const contact = campaign.contacts[currentContactIndex];
      onSendEmail(contact.id);
      currentContactIndex++;
      
      // Schedule next email
      const interval = setTimeout(sendNextEmail, schedule.intervalMinutes * 60 * 1000);
      this.intervals.set(campaign.id, interval);
    };
    
    sendNextEmail();
  }
  
  stopCampaign(campaignId: string): void {
    const interval = this.intervals.get(campaignId);
    if (interval) {
      clearTimeout(interval);
      this.intervals.delete(campaignId);
    }
  }
  
  private isWorkingTime(schedule: ScheduleSettings): boolean {
    if (!schedule.respectWorkingHours) return true;
    
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    // Check if it's a working day
    if (!schedule.workingDays.includes(currentDay)) {
      return false;
    }
    
    // Check if it's within working hours
    const [startHour, startMin] = schedule.workingHours.start.split(':').map(Number);
    const [endHour, endMin] = schedule.workingHours.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    
    return currentTime >= startTime && currentTime <= endTime;
  }
  
  private getNextWorkingTime(schedule: ScheduleSettings): Date {
    const now = new Date();
    const nextTime = new Date(now);
    
    // If we're in working hours today, return now
    if (this.isWorkingTime(schedule)) {
      return now;
    }
    
    // Find next working day
    for (let daysAhead = 0; daysAhead < 7; daysAhead++) {
      const checkDate = new Date(now);
      checkDate.setDate(now.getDate() + daysAhead);
      
      if (schedule.workingDays.includes(checkDate.getDay())) {
        const [startHour, startMin] = schedule.workingHours.start.split(':').map(Number);
        checkDate.setHours(startHour, startMin, 0, 0);
        
        if (checkDate > now) {
          return checkDate;
        }
      }
    }
    
    return nextTime;
  }
  
  estimateCompletion(campaign: Campaign): Date | null {
    const { schedule, contacts } = campaign;
    const totalEmails = contacts.length;
    
    if (totalEmails === 0) return null;
    
    const intervalMs = schedule.intervalMinutes * 60 * 1000;
    const totalTimeMs = totalEmails * intervalMs;
    
    if (!schedule.respectWorkingHours) {
      return new Date(Date.now() + totalTimeMs);
    }
    
    // Calculate considering working hours
    const workingMinutesPerDay = this.getWorkingMinutesPerDay(schedule);
    const workingDaysPerWeek = schedule.workingDays.length;
    const emailsPerWorkingDay = Math.floor(workingMinutesPerDay / schedule.intervalMinutes);
    
    const daysNeeded = Math.ceil(totalEmails / emailsPerWorkingDay);
    const weeksNeeded = Math.ceil(daysNeeded / workingDaysPerWeek);
    
    const completion = new Date();
    completion.setDate(completion.getDate() + (weeksNeeded * 7));
    
    return completion;
  }
  
  private getWorkingMinutesPerDay(schedule: ScheduleSettings): number {
    const [startHour, startMin] = schedule.workingHours.start.split(':').map(Number);
    const [endHour, endMin] = schedule.workingHours.end.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    return endMinutes - startMinutes;
  }
}