import { AuthSession, User, UserRole } from '@/types';
import { userRepository } from '@/repositories';

const SESSION_KEY = 'noel_session';

class AuthService {
  // Get current session
  getSession(): AuthSession | null {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      if (!data) return null;

      const session: AuthSession = JSON.parse(data);

      // Check if session expired
      if (new Date(session.expiresAt) < new Date()) {
        this.logout();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error reading session:', error);
      return null;
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    const session = this.getSession();
    if (!session) return null;
    return userRepository.getById(session.userId);
  }

  // Check if user is logged in
  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  // Check if current user is admin
  isAdmin(): boolean {
    const session = this.getSession();
    return session?.role === 'admin';
  }

  // Check if current user has specific role
  hasRole(role: UserRole): boolean {
    const session = this.getSession();
    return session?.role === role;
  }

  // Login
  login(emailOrPhone: string, password: string): { success: boolean; error?: string; user?: User } {
    // Find user by email or phone
    let user = userRepository.getByEmail(emailOrPhone);
    if (!user) {
      user = userRepository.getByPhone(emailOrPhone);
    }

    if (!user) {
      return { success: false, error: 'Tài khoản không tồn tại' };
    }

    // Check password (plain text for MVP)
    if (user.password !== password) {
      return { success: false, error: 'Mật khẩu không chính xác' };
    }

    // Create session (24 hours)
    const session: AuthSession = {
      userId: user.id,
      role: user.role,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    return { success: true, user };
  }

  // Register
  register(data: {
    email: string;
    phone: string;
    fullName: string;
    password: string;
  }): { success: boolean; error?: string; user?: User } {
    // Check if email exists
    if (userRepository.emailExists(data.email)) {
      return { success: false, error: 'Email đã được sử dụng' };
    }

    // Check if phone exists
    if (userRepository.phoneExists(data.phone)) {
      return { success: false, error: 'Số điện thoại đã được sử dụng' };
    }

    // Create user
    const user: User = {
      id: crypto.randomUUID(),
      email: data.email,
      phone: data.phone,
      fullName: data.fullName,
      password: data.password, // Plain text for MVP
      role: 'customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    userRepository.create(user);

    // Auto login after register
    const session: AuthSession = {
      userId: user.id,
      role: user.role,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    return { success: true, user };
  }

  // Logout
  logout(): void {
    localStorage.removeItem(SESSION_KEY);
  }

  // Update user profile
  updateProfile(updates: Partial<User>): { success: boolean; error?: string; user?: User } {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Chưa đăng nhập' };
    }

    // Check email uniqueness if updating
    if (updates.email && updates.email !== currentUser.email) {
      if (userRepository.emailExists(updates.email, currentUser.id)) {
        return { success: false, error: 'Email đã được sử dụng' };
      }
    }

    // Check phone uniqueness if updating
    if (updates.phone && updates.phone !== currentUser.phone) {
      if (userRepository.phoneExists(updates.phone, currentUser.id)) {
        return { success: false, error: 'Số điện thoại đã được sử dụng' };
      }
    }

    // Don't allow changing role or password through this method
    delete updates.role;
    delete updates.password;

    const updatedUser = userRepository.update(currentUser.id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });

    if (!updatedUser) {
      return { success: false, error: 'Không thể cập nhật thông tin' };
    }

    return { success: true, user: updatedUser };
  }

  // Change password
  changePassword(currentPassword: string, newPassword: string): { success: boolean; error?: string } {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Chưa đăng nhập' };
    }

    if (currentUser.password !== currentPassword) {
      return { success: false, error: 'Mật khẩu hiện tại không chính xác' };
    }

    userRepository.update(currentUser.id, {
      password: newPassword, // Plain text for MVP
      updatedAt: new Date().toISOString()
    });

    return { success: true };
  }
}

export const authService = new AuthService();
