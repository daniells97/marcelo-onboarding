import React, { createContext, useContext, useState } from 'react';
import { IconCheck } from './icons';

interface ToastItem {
  id: string;
  kind?: 'ok' | 'warn';
  title: string;
  desc?: string;
}

type ToastFn = (t: Omit<ToastItem, 'id'>) => void;

const ToastCtx = createContext<ToastFn | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push: ToastFn = (t) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(ts => [...ts, { id, ...t }]);
    setTimeout(() => setToasts(ts => ts.filter(x => x.id !== id)), 3400);
  };

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map(t => (
          <div key={t.id} className="toast-in bg-navy-900 text-paper-50 rounded-lg shadow-cardHover px-4 py-3 flex items-start gap-3">
            <div className="mt-0.5 w-5 h-5 rounded-full grid place-items-center bg-gold-400 text-navy-900">
              <IconCheck size={12} stroke={2.5} />
            </div>
            <div>
              <div className="text-sm font-medium">{t.title}</div>
              {t.desc && <div className="text-xs text-paper-300 mt-0.5">{t.desc}</div>}
            </div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast(): ToastFn {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
