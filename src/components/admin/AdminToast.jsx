import React, { useState, useCallback, useRef, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';

// Simple toast hook — auto-dismiss after 3s, X closes immediately, only one at a time
export function useAdminToast() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const show = useCallback((message, type = 'success') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, type });
    timerRef.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const dismiss = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return { toast, show, dismiss };
}

// Toast renderer — place once inside the component that calls useAdminToast
export function AdminToast({ toast, onDismiss }) {
  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm font-body
        ${isError
          ? 'bg-destructive/10 border-destructive/30 text-destructive'
          : 'bg-card border-primary/30 text-foreground'
        }`}
      >
        {isError
          ? <AlertCircle className="w-4 h-4 flex-shrink-0 text-destructive" />
          : <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-primary" />
        }
        <span>{toast.message}</span>
        <button
          onClick={onDismiss}
          className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}