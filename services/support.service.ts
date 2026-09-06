import { SupportTicket } from '@/types';
import { storageService } from './storage.service';

class SupportService {
  public getTickets(userId?: string): SupportTicket[] {
    const tickets = storageService.getTable('supportTickets');
    if (userId) {
      return tickets.filter((t) => t.userId === userId);
    }
    return tickets;
  }

  public createTicket(
    userId: string,
    userName: string,
    userEmail: string,
    subject: string,
    category: string,
    message: string
  ): SupportTicket {
    const newTicket: SupportTicket = {
      id: `sup-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      userId,
      userName,
      userEmail,
      subject,
      category,
      message,
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    storageService.updateTable('supportTickets', (list) => [newTicket, ...list]);
    return newTicket;
  }
}

export const supportService = new SupportService();
