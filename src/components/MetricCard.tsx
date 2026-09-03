import React from 'react';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  description?: string;
  highlight?: boolean;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  label,
  value,
  description,
  highlight,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 rounded-xl border p-4 transition-all flex items-center gap-3.5 ${
        onClick ? 'cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-sm' : ''
      } ${
        highlight
          ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/20 dark:bg-indigo-950/30 shadow-2xs'
          : 'border-slate-200/90 dark:border-slate-800 shadow-2xs'
      }`}
    >
      <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider leading-none mb-1">
          {label}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {value}
          </span>
          {description && (
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal hidden sm:inline">
              {description}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

