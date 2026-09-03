import React, { useState } from 'react';
import { useProjectContext } from '../context/ProjectContext';
import { ProjectCard } from './ProjectCard';
import { EmptyState } from './EmptyState';
import { IconRenderer } from './IconRenderer';
import { Star, ArrowLeft, Building2, Layers, UserCheck } from 'lucide-react';

export const FavoritesView: React.FC = () => {
  const {
    sectors,
    projects,
    currentUser,
    setActiveTab,
    filteredProjects,
    getSectorFavorites,
    canAccess,
    setFilters,
  } = useProjectContext();

  // Selected tab: 'my-sector', 'all', or a specific sectorId
  const [selectedSectorId, setSelectedSectorId] = useState<string>('my-sector');

  const currentSectorObj = sectors.find((s) => s.id === currentUser.sectorId);
  const activeSectorIdResolved = selectedSectorId === 'my-sector' ? currentUser.sectorId : selectedSectorId;

  // Calculate favorites for all sectors
  const sectorDataList = sectors.map((sec) => {
    const favIds = getSectorFavorites(sec.id);
    const secProjects = projects.filter((p) => favIds.includes(p.id) && canAccess(p));
    const secFilteredProjects = filteredProjects.filter((p) => favIds.includes(p.id) && canAccess(p));
    return {
      sector: sec,
      favIds,
      projects: secProjects,
      filteredProjects: secFilteredProjects,
      count: secProjects.length,
      filteredCount: secFilteredProjects.length,
    };
  });

  // Total unique favorites across all sectors
  const totalFavoritesCount = sectorDataList.reduce((acc, curr) => acc + curr.count, 0);

  // Selected sector data (if not 'all')
  const activeSectorData = sectorDataList.find((s) => s.sector.id === activeSectorIdResolved);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5 sm:p-6 mb-6 transition-all">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/80 dark:from-amber-950/40 dark:to-amber-900/40 border border-amber-200/90 dark:border-amber-800/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-2xs">
            <Star className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Favoritos por Setor
              </h2>
              {currentSectorObj && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80">
                  <UserCheck className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                  <span>Seu Setor: {currentSectorObj.name}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
              Acesse e gerencie os atalhos e ferramentas preferidos do seu setor e de toda a empresa
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('hub')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all border border-slate-200 dark:border-slate-700 self-start sm:self-auto cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar ao Hub de Setores</span>
        </button>
      </div>

      {/* Sector Navigation Filter Tabs */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 px-1">
          <span>Selecione o Setor para visualizar os Favoritos:</span>
          <span className="text-slate-400 dark:text-slate-400 font-normal">
            Total geral: <strong className="text-slate-800 dark:text-slate-200">{totalFavoritesCount}</strong> favorito(s)
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scroll-smooth no-scrollbar">
          {/* Tab 1: Meu Setor */}
          <button
            onClick={() => setSelectedSectorId('my-sector')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 cursor-pointer ${
              selectedSectorId === 'my-sector'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/80 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/60'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${selectedSectorId === 'my-sector' ? 'fill-white' : 'fill-indigo-400 text-indigo-600'}`} />
            <span>Meu Setor ({currentSectorObj?.name || 'Atual'})</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                selectedSectorId === 'my-sector' ? 'bg-white/20 text-white' : 'bg-indigo-200/80 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-200'
              }`}
            >
              {getSectorFavorites(currentUser.sectorId).length}
            </span>
          </button>

          {/* Tab 2: Todos os Setores */}
          <button
            onClick={() => setSelectedSectorId('all')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 cursor-pointer ${
              selectedSectorId === 'all'
                ? 'bg-slate-900 dark:bg-indigo-600 text-white border-slate-900 dark:border-indigo-600 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Todos os Setores</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                selectedSectorId === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
              }`}
            >
              {totalFavoritesCount}
            </span>
          </button>

          <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 shrink-0 mx-1" />

          {/* Dynamic Sector Tabs */}
          {sectorDataList.map(({ sector, count }) => {
            const isSelected = selectedSectorId === sector.id;
            const isUserSector = sector.id === currentUser.sectorId;

            return (
              <button
                key={sector.id}
                onClick={() => setSelectedSectorId(sector.id)}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all border shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : isUserSector
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100/60 dark:hover:bg-indigo-900/50'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <IconRenderer
                  name={sector.iconName}
                  className={`w-3.5 h-3.5 ${
                    isSelected ? 'text-white' : isUserSector ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
                  }`}
                />
                <span>{sector.name}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : count > 0
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Render */}
      {selectedSectorId === 'all' ? (
        /* MODE: ALL SECTORS */
        <div className="space-y-8">
          {totalFavoritesCount === 0 ? (
            <EmptyState
              type="favorites"
              title="Nenhum setor possui favoritos salvos ainda."
              description="Navegue pelos projetos nos setores e clique na estrela para adicionar aos favoritos do setor."
              actionButton={{
                label: 'Explorar Todos os Setores',
                onClick: () => setActiveTab('hub'),
              }}
            />
          ) : (
            sectorDataList
              .filter((item) => item.count > 0)
              .map(({ sector, filteredProjects: secFilteredProjects, count }) => (
                <div key={sector.id} className="border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 sm:p-5 bg-slate-50/40 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg border border-indigo-200/60 dark:border-indigo-800">
                        <IconRenderer name={sector.iconName} className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                            Setor {sector.name}
                          </h3>
                          {sector.id === currentUser.sectorId && (
                            <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                              Seu Setor
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {sector.description || `${count} ferramenta(s) favorita(s)`}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedSectorId(sector.id)}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline cursor-pointer"
                    >
                      Ver apenas {sector.name} ({count}) &rarr;
                    </button>
                  </div>

                  {secFilteredProjects.length === 0 ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic py-2">
                      Nenhum projeto favorito deste setor corresponde aos filtros/busca atuais.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {secFilteredProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))}
                    </div>
                  )}
                </div>
              ))
          )}
        </div>
      ) : (
        /* MODE: SINGLE SECTOR (Selected Sector or 'my-sector') */
        <div>
          {activeSectorData && (
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-indigo-50/80 via-slate-50 to-amber-50/50 dark:from-indigo-950/30 dark:via-slate-900 dark:to-amber-950/20 border border-indigo-100 dark:border-indigo-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-700 flex items-center justify-center shrink-0 shadow-xs">
                  <IconRenderer name={activeSectorData.sector.iconName} className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      Favoritos de {activeSectorData.sector.name}
                    </h3>
                    {activeSectorData.sector.id === currentUser.sectorId && (
                      <span className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800">
                        Seu Setor Ativo
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {activeSectorData.sector.description || 'Projetos e ferramentas selecionados para este setor.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
                  Total: <strong className="text-slate-900 dark:text-slate-100">{activeSectorData.count}</strong> favorito(s)
                </span>
              </div>
            </div>
          )}

          {!activeSectorData || activeSectorData.count === 0 ? (
            <EmptyState
              type="favorites"
              title={`O setor ${activeSectorData?.sector.name || ''} ainda não possui favoritos.`}
              description="Você pode navegar pelos projetos e clicar no ícone de estrela para favoritar ferramentas para este setor."
              actionButton={{
                label: `Explorar Projetos de ${activeSectorData?.sector.name || 'Setores'}`,
                onClick: () => {
                  if (activeSectorData) {
                    setFilters({ sectorId: activeSectorData.sector.id });
                  }
                  setActiveTab('hub');
                },
              }}
            />
          ) : activeSectorData.filteredCount === 0 ? (
            <EmptyState
              type="search"
              title="Nenhum favorito encontrado para os filtros atuais neste setor."
              description="Tente limpar a busca ou mudar o tipo de projeto selecionado nos filtros."
            />
          ) : (
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium flex items-center justify-between">
                <span>
                  Exibindo <strong className="text-slate-900 dark:text-slate-100">{activeSectorData.filteredCount}</strong> de {activeSectorData.count} favorito(s) em{' '}
                  <strong className="text-slate-900 dark:text-slate-100">{activeSectorData.sector.name}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {activeSectorData.filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
