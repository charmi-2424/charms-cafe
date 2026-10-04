import { create } from 'zustand';

interface AdminState {
  isAuthenticated: boolean;
  adminEmail: string | null;
  // Set on successful login
  setAuth: (email: string) => void;
  // Clear on logout or expired session
  clearAuth: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  isAuthenticated: false,
  adminEmail: null,
  setAuth: (email) => set({ isAuthenticated: true, adminEmail: email }),
  clearAuth: () => set({ isAuthenticated: false, adminEmail: null }),
}));
