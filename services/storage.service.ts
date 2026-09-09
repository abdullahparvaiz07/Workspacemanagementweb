import { DatabaseSchema } from '@/types';
import { initialDatabase } from '@/data/initialData';

const DB_KEY = 'workroom_database_v2';

class StorageService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  public getDatabase(): DatabaseSchema {
    if (!this.isBrowser()) return initialDatabase;

    try {
      const data = localStorage.getItem(DB_KEY);
      if (!data) {
        this.saveDatabase(initialDatabase);
        return initialDatabase;
      }
      const parsed = JSON.parse(data) as DatabaseSchema;
      if (parsed.notifications) {
        parsed.notifications = parsed.notifications.filter(
          (n) => n.id !== 'notif-1' && n.id !== 'notif-2' && n.id !== 'notif-3'
        );
      }
      return parsed;
    } catch (error) {
      console.error('Failed to read database from LocalStorage:', error);
      return initialDatabase;
    }
  }

  public saveDatabase(db: DatabaseSchema): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch (error) {
      console.error('Failed to write database to LocalStorage:', error);
    }
  }

  public getTable<K extends keyof DatabaseSchema>(table: K): DatabaseSchema[K] {
    const db = this.getDatabase();
    return db[table];
  }

  public updateTable<K extends keyof DatabaseSchema>(
    table: K,
    updater: (data: DatabaseSchema[K]) => DatabaseSchema[K]
  ): DatabaseSchema[K] {
    const db = this.getDatabase();
    db[table] = updater(db[table]);
    this.saveDatabase(db);
    return db[table];
  }

  public resetToDefaults(): DatabaseSchema {
    if (this.isBrowser()) {
      localStorage.removeItem(DB_KEY);
    }
    this.saveDatabase(initialDatabase);
    return initialDatabase;
  }
}

export const storageService = new StorageService();
