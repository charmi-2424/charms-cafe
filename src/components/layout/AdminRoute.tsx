import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard that verifies the admin session by calling GET /api/auth/me.
 * Redirects to /admin/login if not authenticated.
 */
export function AdminRoute({ children }: AdminRouteProps) {
  const isAuthenticated = useAdminStore(s => s.isAuthenticated);
  const setAuth = useAdminStore(s => s.setAuth);
  const clearAuth = useAdminStore(s => s.clearAuth);
  const location = useLocation();

  useEffect(() => {
    // Verify cookie-based JWT session on every mount
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => {
        if (!r.ok) throw new Error('Unauthenticated');
        return r.json() as Promise<{ email: string; role: string }>;
      })
      .then(data => setAuth(data.email))
      .catch(() => clearAuth());
  }, [setAuth, clearAuth]);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
