import { useState, useEffect, useCallback } from 'react';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  role: 'user' | 'admin' | 'moderator';
  tier: 'FREE' | 'PRO' | 'TEAM';
  isVerified: boolean;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  login: (provider?: 'google' | 'github' | 'gitlab' | 'microsoft') => void;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const logout = async () => {
    const res = await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    const data = await res.json();
    setUser(null);
    if (data.logtoLogout) {
      window.location.href = data.logtoLogout;
    } else {
      window.location.href = '/';
    }
  };

  const login = (provider?: string) => {
    const url = provider ? `/api/auth/login?provider=${provider}` : '/api/auth/login';
    window.location.href = url;
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    refresh: fetchMe,
    logout,
    login,
  };
}
