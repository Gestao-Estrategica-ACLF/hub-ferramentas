import React from 'react';
import * as Icons from 'lucide-react';
import { ProjectType } from '../types';

interface IconRendererProps {
  name: string;
  className?: string;
  size?: number;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, className = 'w-5 h-5', size }) => {
  // @ts-ignore dynamic icon lookup
  const IconComponent = Icons[name] || Icons.Folder;
  return <IconComponent className={className} size={size} />;
};

export const ProjectTypeBadge: React.FC<{ type: ProjectType; className?: string }> = ({ type, className = '' }) => {
  let iconName = 'Globe';
  let badgeStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';

  switch (type) {
    case 'Dashboard BI':
      iconName = 'BarChart3';
      badgeStyle = 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/80';
      break;
    case 'Projeto AI Studio':
      iconName = 'Sparkles';
      badgeStyle = 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800/80';
      break;
    case 'Ferramenta interna':
      iconName = 'Wrench';
      badgeStyle = 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/80';
      break;
    case 'Plataforma externa':
      iconName = 'ExternalLink';
      badgeStyle = 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/80';
      break;
    case 'Outro':
      iconName = 'Folder';
      badgeStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyle} ${className}`}
    >
      <IconRenderer name={iconName} className="w-3.5 h-3.5 shrink-0" />
      <span>{type}</span>
    </span>
  );
};
