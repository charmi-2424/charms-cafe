import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, AlertCircle } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const setAuth = useAdminStore(s => s.setAuth);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/admin/dashboard';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          const retryAfter = data.retryAfterSeconds ?? 60;
          setError(`Too many login attempts. Try again in ${Math.ceil(retryAfter / 60)} minute(s).`);
        } else {
          setError(data.error ?? 'Login failed');
        }
        return;
      }

      setAuth(data.email);
      navigate(from, { replace: true });
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-espresso flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        className="bg-cream rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        {/* Logo / Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 size-16 rounded-full bg-terracotta/15 flex items-center justify-center">
            <Lock className="text-terracotta" size={28} />
          </div>
          <h1 className="font-playfair text-3xl font-bold text-espresso">Staff Login</h1>
          <p className="text-sm text-espresso/60 mt-1">Charms Café Kitchen Dashboard</p>
        </div>

        {/* Error alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2"
          >
            <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={16} />
            <p className="text-sm text-red-800">{error}</p>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-espresso mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="input-field w-full"
              placeholder="admin@charmscafe.in"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-espresso mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="input-field w-full"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-xs text-espresso/50 text-center mt-6">
          Authorized personnel only. Brute-force protection enabled.
        </p>
      </motion.div>
    </div>
  );
}
