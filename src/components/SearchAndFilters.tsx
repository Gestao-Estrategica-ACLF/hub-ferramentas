import React, { useState } from 'react';
import { useProjectContext } from '../context/ProjectContext';
import { ProjectType, SortOption } from '../types';
import {
  Search,
  Filter,
  RotateCcw,
  Star,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  X,
  SlidersHorizontal,
} from 'lucide-react';

export const SearchAndFilters: React.FC = () => {
  const {
    sectors,
    filters,
    setFilters,
    resetFilters,
    expandAllSectors,
    collapseAllSectors,
    filteredProjects,
  } = useProjectContext();

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const projectTypes: { label: string; value: ProjectType | 'all' }[] = [
    { label: 'Todos os tipos', value: 'all' },
    { label: 'Dashboard BI', value: 'Dashboard BI' },
    { label: 'Projeto AI Studio', value: 'Projeto AI Studio' },
    { label: 'Ferramenta interna', value: 'Ferramenta interna' },
    { label: 'Plataforma externa', value: 'Plataforma externa' },
    { label: 'Outro', value: 'Outro' },
  ];

  const sortOptions: { label: string; value: SortOption }[] = [
    { label: 'Nome (A-Z)', value: 'name-asc' },
    { label: 'Nome (Z-A)', value: 'name-desc' },
    { label: 'Mais recentes', value: 'recent' },
    { label: 'Mais antigos', value: 'oldest' },
    { label: 'Favoritos primeiro', value: 'favorites-first' },
  ];

  const hasActiveFilters =
    filters.searchTerm !== '' ||
    filters.sectorId !== 'all' ||
    filters.type !== 'all' ||
    filters.onlyFavorites ||
    filters.sortBy !== 'name-asc';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-4 mb-6 transition-colors">
      
      {/* Top Bar for Mobile Filter Toggle & Quick Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Main Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={filters.searchTerm}
            onChange={(e) => setFilters({ searchTerm: e.target.value })}
            placeholder="Buscar por nome, setor, tipo, descrição ou palavras-chave..."
            className="w-full pl-10 pr-9 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
          />
          {filters.searchTerm && (
            <button
              onClick={() => setFilters({ searchTerm: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              title="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filtros {hasActiveFilters && '●'}</span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
              title="Limpar todos os filtros"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Options (Desktop Always / Mobile Toggle) */}
      <div
        className={`mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 ${
          isMobileFiltersOpen ? 'block' : 'hidden md:grid'
        }`}
      >
        {/* Sector Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Filtrar por Setor
          </label>
          <select
            value={filters.sectorId}
            onChange={(e) => setFilters({ sectorId: e.target.value })}
            className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">Todos os setores ({sectors.length})</option>
            {sectors.map((sector) => (
              <option key={sector.id} value={sector.id}>
                {sector.name}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Tipo de Projeto
          </label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ type: e.target.value as ProjectType | 'all' })}
            className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
          >
            {projectTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Ordenar por
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ sortBy: e.target.value as SortOption })}
            className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
          >
            {sortOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Favorites Toggle & Reset */}
        <div className="flex items-end gap-2">
          <button
            onClick={() => setFilters({ onlyFavorites: !filters.onlyFavorites })}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
              filters.onlyFavorites
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 shadow-2xs font-semibold'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Star
              className={`w-3.5 h-3.5 ${
                filters.onlyFavorites ? 'fill-amber-400 text-amber-500' : 'text-slate-400 dark:text-slate-500'
              }`}
            />
            <span>Apenas Favoritos</span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 py-1.5 px-3 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title="Limpar todos os filtros"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Limpar</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count & Bulk Sector Expand/Collapse Bar */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
        <div>
          Mostrando <strong className="text-slate-900 dark:text-slate-100">{filteredProjects.length}</strong> projeto(s)
          {hasActiveFilters && ' com filtros aplicados'}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={expandAllSectors}
            className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline inline-flex items-center gap-1 font-medium cursor-pointer"
          >
            <ChevronDown className="w-3.5 h-3.5" />
            Expandir todos os setores
          </button>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <button
            onClick={collapseAllSectors}
            className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline inline-flex items-center gap-1 font-medium cursor-pointer"
          >
            <ChevronUp className="w-3.5 h-3.5" />
            Recolher todos
          </button>
        </div>
      </div>
    </div>
  );
};
