import { create } from 'zustand';
import { SupportTicket } from '@/types';
import { supportService } from '@/services/support.service';

interface SupportStore {
  tickets: SupportTicket[];
  createTicket: (
    userId: string,
    userName: string,
    userEmail: string,
    subject: string,
    category: string,
    message: string
  ) => SupportTicket;
  refresh: () => void;
}

export const useSupportStore = create<SupportStore>((set) => ({
  tickets: supportService.getTickets(),

  createTicket: (userId, userName, userEmail, subject, category, message) => {
    const newTicket = supportService.createTicket(
      userId,
      userName,
      userEmail,
      subject,
      category,
      message
    );
    set({ tickets: supportService.getTickets() });
    return newTicket;
  },

  refresh: () => {
    set({ tickets: supportService.getTickets() });
  },
}));
