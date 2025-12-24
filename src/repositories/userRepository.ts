import { BaseRepository } from './baseRepository';
import { User, UserRole } from '@/types';

class UserRepository extends BaseRepository<User> {
  constructor() {
    super('noel_users');
  }

  // Get by email
  getByEmail(email: string): User | null {
    const users = this.getAll();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  // Get by phone
  getByPhone(phone: string): User | null {
    const users = this.getAll();
    return users.find(u => u.phone === phone) || null;
  }

  // Get by role
  getByRole(role: UserRole): User[] {
    const users = this.getAll();
    return users.filter(u => u.role === role);
  }

  // Check if email exists
  emailExists(email: string, excludeId?: string): boolean {
    const user = this.getByEmail(email);
    if (!user) return false;
    if (excludeId && user.id === excludeId) return false;
    return true;
  }

  // Check if phone exists
  phoneExists(phone: string, excludeId?: string): boolean {
    const user = this.getByPhone(phone);
    if (!user) return false;
    if (excludeId && user.id === excludeId) return false;
    return true;
  }
}

export const userRepository = new UserRepository();
