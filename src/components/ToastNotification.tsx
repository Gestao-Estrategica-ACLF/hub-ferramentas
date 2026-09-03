import React from 'react';
import { useProjectContext } from '../context/ProjectContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toasts, removeToast } = useProjectContext();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let bgStyle = 'bg-slate-900 text-white border-slate-800';
        let icon = <Info className="w-4 h-4 text-blue-400 shrink-0" />;

        if (toast.type === 'success') {
          bgStyle = 'bg-slate-900 text-white border-slate-800';
          icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
        } else if (toast.type === 'error') {
          bgStyle = 'bg-rose-900 text-white border-rose-800';
          icon = <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-lg text-xs font-medium animate-in slide-in-from-bottom-5 duration-200 ${bgStyle}`}
          >
            <div className="flex items-center gap-2.5">
              {icon}
              <span className="leading-snug">{toast.message}</span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-white/10 rounded-md transition-colors"
              title="Fechar notificação"
            >
              <X className="w-3.5 h-3.5 text-slate-300" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
