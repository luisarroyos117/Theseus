import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Lock, Loader2 } from 'lucide-react';

export default function AdminGuard({ children }) {
  const { user, isAuthenticated, isLoadingAuth, isLoadingPublicSettings, navigateToLogin } = useAuth();

  // Still checking auth state
  if (isLoadingAuth || isLoadingPublicSettings) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not logged in — redirect to home immediately, render nothing
  if (!isAuthenticated || !user) {
    window.location.href = '/';
    return null;
  }

  // Logged in but not admin — redirect to home immediately, render nothing
  if (user.role !== 'admin') {
    window.location.href = '/';
    return null;
  }

  return children;
}