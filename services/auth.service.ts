import { User, UserRole } from '@/types';
import { storageService } from './storage.service';

class AuthService {
  public getUsers(): User[] {
    return storageService.getTable('users');
  }

  public getCurrentUser(): User {
    const users = this.getUsers();
    return users[0] || {
      id: 'u-1',
      name: 'Abdullah Parvaiz',
      email: 'abdullah@acme.studio',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      role: 'owner',
      team: 'Product & Design',
      createdAt: new Date().toISOString(),
    };
  }

  public login(email: string): User {
    const users = this.getUsers();
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      user = {
        id: `u-${Date.now()}`,
        name: email.split('@')[0].replace('.', ' '),
        email: email,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        role: 'owner',
        team: 'Product & Design',
        createdAt: new Date().toISOString(),
      };
      storageService.updateTable('users', (list) => [user!, ...list]);
    }
    return user;
  }

  public updateRole(userId: string, newRole: UserRole): User[] {
    return storageService.updateTable('users', (users) =>
      users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  }

  public inviteMember(name: string, email: string, role: UserRole): User {
    const newMember: User = {
      id: `u-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      name,
      email,
      role,
      team: 'Product',
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?w=150`,
      createdAt: new Date().toISOString(),
    };

    storageService.updateTable('users', (users) => [...users, newMember]);
    return newMember;
  }

  public removeMember(userId: string): User[] {
    return storageService.updateTable('users', (users) =>
      users.filter((u) => u.id !== userId)
    );
  }
}

export const authService = new AuthService();
