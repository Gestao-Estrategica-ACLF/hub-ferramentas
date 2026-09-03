import React, { useState } from 'react';
import { Project } from '../types';
import { useProjectContext } from '../context/ProjectContext';
import { IconRenderer, ProjectTypeBadge } from './IconRenderer';
import {
  ExternalLink,
  Star,
  MoreVertical,
  Edit2,
  Trash2,
  Calendar,
  User,
  Info,
  Shield,
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  compact?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, compact = false }) => {
  const {
    toggleFavorite,
    isFavorite,
    openEditModal,
    openDeleteModal,
    getSectorById,
    addToast,
    currentUser,
    sectors,
  } = useProjectContext();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const favorited = isFavorite(project.id);
  const sector = getSectorById(project.sectorId);

  // Map allowedSectors to human-readable names for Admin view
  const allowedSectorNames = (project.allowedSectors || []).map((sec) => {
    const s = sectors.find((item) => item.id === sec || item.name.toLowerCase() === sec.toLowerCase());
    return s ? s.name : sec;
  });

  const handleAccessLink = (e: React.MouseEvent) => {
    if (!project.url || project.url.trim() === '' || project.url === '#') {
      e.preventDefault();
      addToast('info', `O link de acesso para "${project.name}" ainda não foi cadastrado.`);
      return;
    }

    // Ensure link starts with http or https
    let validUrl = project.url.trim();
    if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
      validUrl = `https://${validUrl}`;
    }

    window.open(validUrl, '_blank', 'noopener,noreferrer');
  };

  const formattedDate = new Date(project.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div
      className={`group relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between h-full ${
        compact ? 'p-3' : 'p-4'
      }`}
    >
      <div>
        {/* Card Header: Type Badge & Action Controls */}
        <div className={`flex items-start justify-between gap-2 ${compact ? 'mb-2' : 'mb-2.5'}`}>
          <ProjectTypeBadge type={project.type} />

          <div className="flex items-center gap-1">
            {/* Favorite Star Button */}
            <button
              onClick={() => toggleFavorite(project.id)}
              className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                favorited
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-500 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              title={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              aria-label="Favoritar projeto"
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  favorited ? 'fill-amber-400 text-amber-500' : ''
                }`}
              />
            </button>

            {/* Options Menu (Edit / Delete) */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1.5 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title="Opções do projeto"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>

              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-20 text-xs">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        openEditModal(project);
                      }}
                      className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        openDeleteModal(project);
                      }}
                      className="w-full text-left px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                      <span>Excluir</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Project Title & Description */}
        <h3
          className={`font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug ${
            compact ? 'text-sm mb-1' : 'text-base mb-1.5'
          }`}
        >
          {project.name}
        </h3>

        <p
          className={`text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 ${
            compact ? 'text-[11px] mb-2' : 'text-xs mb-3'
          }`}
        >
          {project.description || 'Sem descrição cadastrada.'}
        </p>

        {/* Responsible & Date Metadata */}
        <div
          className={`flex flex-wrap items-center gap-x-2.5 gap-y-1 text-slate-500 dark:text-slate-400 ${
            compact ? 'text-[10px] mb-2' : 'text-[11px] mb-3'
          }`}
        >
          {sector && (
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {sector.name}
            </span>
          )}

          {project.responsible && (
            <span className="inline-flex items-center gap-1">
              <User className="w-3 h-3 text-slate-400 dark:text-slate-500" />
              <span>{project.responsible}</span>
            </span>
          )}

          <span className="inline-flex items-center gap-1 text-slate-400 dark:text-slate-500">
            <Calendar className="w-3 h-3" />
            <span>{formattedDate}</span>
          </span>
        </div>

        {/* Optional Notes */}
        {project.notes && (
          <div
            className={`bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-start gap-1.5 ${
              compact ? 'mb-2 p-1.5 text-[10px]' : 'mb-3 p-2 text-[11px]'
            }`}
          >
            <Info className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{project.notes}</span>
          </div>
        )}

        {/* Admin Access Control Summary Badge - Only visible for Admin role */}
        {currentUser.role === 'admin' && (
          <div
            className={`bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 rounded-lg text-amber-900 dark:text-amber-300 flex items-start gap-1.5 font-medium ${
              compact ? 'mb-2 p-1.5 text-[10px]' : 'mb-3 p-2 text-[11px]'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2">
              <strong className="font-semibold text-amber-950 dark:text-amber-200">Acesso:</strong>{' '}
              {allowedSectorNames.length > 0 ? allowedSectorNames.join(' • ') : 'Nenhum setor autorizado'}
            </span>
          </div>
        )}

        {/* Tags Chips */}
        {project.tags && project.tags.length > 0 && (
          <div className={`flex flex-wrap gap-1 ${compact ? 'mb-2' : 'mb-4'}`}>
            {project.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold tracking-wide border border-slate-200/60 dark:border-slate-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Access Button */}
      <div className={`border-t border-slate-100 dark:border-slate-800 mt-auto ${compact ? 'pt-2' : 'pt-3'}`}>
        <button
          onClick={handleAccessLink}
          className={`w-full inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-xs transition-colors cursor-pointer ${
            compact ? 'px-2.5 py-1.5 text-[11px]' : 'px-3 py-2 text-xs'
          }`}
        >
          <span>Acessar projeto</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
