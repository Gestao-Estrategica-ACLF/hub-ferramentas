import React from 'react';
import { useProjectContext } from '../context/ProjectContext';
import { SectorCard } from './SectorCard';
import { EmptyState } from './EmptyState';

export const SectorGrid: React.FC = () => {
  const { sectors, filters, filteredProjects, resetFilters, getProjectsBySector, currentUser, openCreateModal } = useProjectContext();

  // Determine which sectors to display:
  // Always include 'sec-recepcao' as the communicative sector, plus any sectors with registered tools.
  const sectorsWithProjects = sectors.filter((s) => s.id === 'sec-recepcao' || getProjectsBySector(s.id).length > 0);

  const rawTargetSectors =
    filters.sectorId === 'all'
      ? sectorsWithProjects
      : sectors.filter((s) => s.id === filters.sectorId);

  // Guarantee 'sec-recepcao' appears as the first sector card
  const targetSectors = [...rawTargetSectors].sort((a, b) => {
    if (a.id === 'sec-recepcao') return -1;
    if (b.id === 'sec-recepcao') return 1;
    return 0;
  });

  // Check if there are zero projects found when filters are active
  const totalFound = filteredProjects.length;

  if (totalFound === 0 && (filters.searchTerm || filters.type !== 'all' || filters.onlyFavorites)) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-2xs">
        <EmptyState
          type="search"
          title="Nenhum projeto encontrado para os filtros selecionados."
          description="Tente alterar os termos da busca, selecionar outro setor ou limpar os filtros."
          actionButton={{
            label: 'Limpar todos os filtros',
            onClick: resetFilters,
          }}
        />
      </div>
    );
  }

  if (targetSectors.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-2xs">
        <EmptyState
          type="sector"
          title="Nenhum setor possui ferramentas cadastradas no momento."
          description="Assim que uma nova ferramenta for adicionada a um setor, ele aparecerá automaticamente aqui."
          actionButton={
            currentUser.role === 'admin'
              ? {
                  label: 'Cadastrar Novo Projeto',
                  onClick: () => openCreateModal(),
                }
              : undefined
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {targetSectors.map((sector) => (
        <SectorCard key={sector.id} sector={sector} />
      ))}
    </div>
  );
};
