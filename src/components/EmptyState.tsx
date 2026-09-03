import React from 'react';
import { LucideIcon, FolderX, SearchX, Star, Plus } from 'lucide-react';

interface EmptyStateProps {
  type?: 'sector' | 'search' | 'favorites';
  title?: string;
  description?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'sector',
  title,
  description,
  actionButton,
}) => {
  let defaultIcon: LucideIcon = FolderX;
  let defaultTitle = 'Este setor ainda não possui projetos cadastrados.';
  let defaultDescription = 'Cadastre ferramentas ou dashboards para este setor.';

  if (type === 'search') {
    defaultIcon = SearchX;
    defaultTitle = 'Nenhum projeto encontrado para os filtros selecionados.';
    defaultDescription = 'Tente ajustar os termos de pesquisa ou limpar os filtros.';
  } else if (type === 'favorites') {
    defaultIcon = Star;
    defaultTitle = 'Você ainda não favoritou nenhum projeto.';
    defaultDescription = 'Clique na estrela dos cards de projetos para marcá-los como favoritos para acesso rápido.';
  }

  const Icon = defaultIcon;

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50/70 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 my-2 transition-colors">
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
        {title || defaultTitle}
      </h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4 leading-relaxed">
        {description || defaultDescription}
      </p>

      {actionButton && (
        <button
          onClick={actionButton.onClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{actionButton.label}</span>
        </button>
      )}
    </div>
  );
};
