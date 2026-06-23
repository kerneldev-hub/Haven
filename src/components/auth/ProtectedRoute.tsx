import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute guards core engines and workflows, checks session verification 
 * state, and handles context redirects using an optimistic cache pattern.
 */
export default function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('haven_user_role') === 'admin' || localStorage.getItem('haven_user_tier') === 'ENTERPRISE';
  });
  const [isAuthed, setIsAuthed] = useState(() => {
    return localStorage.getItem('haven_session') === 'active';
  });
  const location = useLocation();

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    fetch('/api/auth/me', { signal })
      .then(res => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then(data => {
        setIsAuthed(true);
        localStorage.setItem('haven_session', 'active');
        if (data.tier === 'ENTERPRISE' || data.isAdmin) {
          setIsAdmin(true);
          localStorage.setItem('haven_user_role', 'admin');
          localStorage.setItem('haven_user_tier', 'ENTERPRISE');
        } else {
          setIsAdmin(false);
          localStorage.removeItem('haven_user_role');
          localStorage.removeItem('haven_user_tier');
        }
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        setIsAuthed(false);
        setIsAdmin(false);
        localStorage.removeItem('haven_session');
        localStorage.removeItem('haven_user_role');
        localStorage.removeItem('haven_user_tier');
      });

    return () => {
      controller.abort();
    };
  }, []);

  if (!isAuthed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

