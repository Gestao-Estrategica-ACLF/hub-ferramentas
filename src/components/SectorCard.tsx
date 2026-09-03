import React from 'react';
import { Sector } from '../types';
import { useProjectContext } from '../context/ProjectContext';
import { ProjectCard } from './ProjectCard';
import { EmptyState } from './EmptyState';
import { IconRenderer } from './IconRenderer';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';

interface SectorCardProps {
  sector: Sector;
}

export const SectorCard: React.FC<SectorCardProps> = ({ sector }) => {
  const {
    getProjectsBySector,
    expandedSectors,
    toggleSectorExpansion,
    openCreateModal,
    currentUser,
  } = useProjectContext();

  const isRecepcao = sector.id === 'sec-recepcao';
  const isExpanded = expandedSectors[sector.id] ?? true;
  const sectorProjects = getProjectsBySector(sector.id);
  const projectCount = sectorProjects.length;

  return (
    <div
      className={`rounded-xl border shadow-2xs overflow-hidden transition-all mb-4 ${
        isRecepcao
          ? 'bg-gradient-to-r from-amber-50/60 via-indigo-50/20 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 border-amber-200/90 dark:border-slate-800'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
      }`}
    >
      {/* Sector Card Header Bar */}
      <div
        className={`flex items-center justify-between gap-3 border-b transition-colors ${
          isRecepcao
            ? 'px-4 py-2.5 bg-amber-50/80 dark:bg-slate-800/90 border-amber-200/60 dark:border-slate-700/80'
            : 'px-5 py-3.5 bg-slate-50/90 dark:bg-slate-800/90 border-slate-200/80 dark:border-slate-700/80'
        }`}
      >
        {/* Sector Icon, Title & Project Count */}
        <button
          onClick={() => toggleSectorExpansion(sector.id)}
          className="flex items-center gap-2.5 text-left flex-1 min-w-0 group cursor-pointer"
        >
          <div
            className={`rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              isRecepcao
                ? 'w-8 h-8 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/80 group-hover:bg-amber-200/80 dark:group-hover:bg-amber-900/60'
                : 'w-9 h-9 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-100/70 dark:group-hover:bg-indigo-900/70'
            }`}
          >
            <IconRenderer name={sector.iconName} className={isRecepcao ? 'w-4 h-4' : 'w-4 h-4'} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2
                className={`font-bold text-slate-900 dark:text-slate-100 truncate transition-colors ${
                  isRecepcao
                    ? 'text-sm group-hover:text-amber-800 dark:group-hover:text-amber-400'
                    : 'text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                }`}
              >
                {sector.name}
              </h2>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                  isRecepcao
                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80'
                    : 'bg-slate-200/70 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300'
                }`}
              >
                {projectCount}
              </span>
            </div>
            {sector.description && (
              <p className={`text-slate-500 dark:text-slate-400 truncate font-normal ${isRecepcao ? 'text-[11px]' : 'text-xs'}`}>
                {sector.description}
              </p>
            )}
          </div>
        </button>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* "Novo projeto" Button - Visible to Admins */}
          {currentUser.role === 'admin' && (
            <button
              onClick={() => openCreateModal(sector.id)}
              className={`inline-flex items-center gap-1 bg-white dark:bg-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg font-bold shadow-2xs transition-colors cursor-pointer ${
                isRecepcao
                  ? 'px-2.5 py-1 text-[11px] text-amber-800 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-200'
                  : 'px-3 py-1 text-xs text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-200'
              }`}
              title={`Adicionar novo projeto ao setor ${sector.name}`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Novo projeto</span>
            </button>
          )}

          {/* Expand/Collapse Toggle Button */}
          <button
            onClick={() => toggleSectorExpansion(sector.id)}
            className="p-1.5 text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700/60 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer"
            title={isExpanded ? 'Recolher setor' : 'Expandir setor'}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>


      {/* Sector Projects Content Area */}
      {isExpanded && (
        <div className={isRecepcao ? 'p-3 sm:p-4' : 'p-4 sm:p-5'}>
          {projectCount === 0 ? (
            <EmptyState
              type="sector"
              title="Nenhuma ferramenta disponível"
              description="Nenhuma ferramenta disponível para seu perfil."
              actionButton={
                currentUser.role === 'admin'
                  ? {
                      label: 'Adicionar projeto neste setor',
                      onClick: () => openCreateModal(sector.id),
                    }
                  : undefined
              }
            />
          ) : (
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2.5 pt-1 scroll-smooth snap-x">
              {sectorProjects.map((project) => (
                <div
                  key={project.id}
                  className={`shrink-0 snap-start flex flex-col ${
                    isRecepcao ? 'w-[240px] sm:w-[270px]' : 'w-[280px] sm:w-[320px]'
                  }`}
                >
                  <ProjectCard project={project} compact={isRecepcao} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
