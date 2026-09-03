import React from 'react';
import { useProjectContext } from '../context/ProjectContext';
import { AclfLogo } from './AclfLogo';
import { UserRole } from '../types';
import {
  Search,
  Star,
  LayoutGrid,
  X,
  Plus,
  Shield,
  User,
  Sun,
  Moon,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    filters,
    setFilters,
    metrics,
    activeTab,
    setActiveTab,
    openCreateModal,
    currentUser,
    sectors,
    openRoleSelectionModal,
    themeMode,
    toggleThemeMode,
  } = useProjectContext();

  const isFavActive = activeTab === 'favorites';
  const currentSectorObj = sectors.find((s) => s.id === currentUser.sectorId);
  const userProfileLabel =
    currentUser.role === 'admin'
      ? 'Administrador'
      : `Usuário (${currentSectorObj ? currentSectorObj.name : currentUser.sector || 'Geral'})`;

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      {/* Top Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Logo & Title Section */}
          <div className="flex items-center gap-3">
            <AclfLogo className="w-10 h-10 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight transition-colors">
                  Hub de Ferramentas ACLF
                </h1>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap transition-colors">
                Dashboards, projetos e ferramentas em um só lugar
              </p>
            </div>
          </div>

          {/* Quick Header Controls: Search, Tabs, Access Profile, Theme Toggle & Creation */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            
            {/* Button to Change User Profile */}
            <button
              onClick={openRoleSelectionModal}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-bold transition-all shadow-2xs group cursor-pointer"
              title="Clique para alterar seu perfil de usuário ou setor"
            >
              <div className="flex items-center gap-1.5 text-slate-900 dark:text-slate-100 font-bold">
                {currentUser.role === 'admin' ? (
                  <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                ) : (
                  <User className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400 shrink-0" />
                )}
                <span className="truncate max-w-[160px]">{userProfileLabel}</span>
              </div>

              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full border border-slate-200/80 dark:border-slate-700 group-hover:border-indigo-300 dark:group-hover:border-indigo-600 transition-colors">
                Alterar usuário
              </span>
            </button>

            {/* Quick Search */}
            <div className="relative flex-1 sm:w-52 min-w-[170px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={filters.searchTerm}
                onChange={(e) => setFilters({ searchTerm: e.target.value })}
                placeholder="Pesquisar ferramentas..."
                className="w-full pl-10 pr-8 py-2 bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-slate-700/60 rounded-full text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
              {filters.searchTerm && (
                <button
                  onClick={() => setFilters({ searchTerm: '' })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                  title="Limpar busca"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* View Switcher Tabs (Hub / Favoritos) */}
            <div className="inline-flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200/80 dark:border-slate-700/80 text-xs font-medium">
              <button
                onClick={() => setActiveTab('hub')}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
                  !isFavActive
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Todos os Setores</span>
              </button>

              <button
                onClick={() => setActiveTab('favorites')}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
                  isFavActive
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Star
                  className={`w-3.5 h-3.5 ${
                    isFavActive ? 'fill-amber-400 text-amber-500' : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                <span>Favoritos</span>
                {metrics.totalFavorites > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800 rounded-full text-[10px] font-bold">
                    {metrics.totalFavorites}
                  </span>
                )}
              </button>
            </div>

            {/* Theme Toggle Button (Light / Dark Mode) */}
            <button
              onClick={toggleThemeMode}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-600 dark:text-amber-400 border border-slate-200 dark:border-slate-700 transition-all shadow-2xs cursor-pointer flex items-center justify-center"
              title={themeMode === 'dark' ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
              aria-label="Alternar modo claro e escuro"
            >
              {themeMode === 'dark' ? (
                <Sun className="w-4 h-4 animate-in spin-in-90 duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 animate-in spin-in-90 duration-300" />
              )}
            </button>

            {/* Add Project Button - Only for Admins */}
            {currentUser.role === 'admin' && (
              <button
                onClick={() => openCreateModal()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-full shadow-xs transition-colors cursor-pointer"
                title="Cadastrar Novo Projeto"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Projeto</span>
              </button>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};

