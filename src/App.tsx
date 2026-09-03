import React from 'react';
import { ProjectProvider, useProjectContext } from './context/ProjectContext';
import { Header } from './components/Header';
import { DashboardSummary } from './components/DashboardSummary';
import { SearchAndFilters } from './components/SearchAndFilters';
import { SectorGrid } from './components/SectorGrid';
import { FavoritesView } from './components/FavoritesView';
import { ProjectFormModal } from './components/ProjectFormModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { UserRoleSelectionModal } from './components/UserRoleSelectionModal';
import { ToastNotification } from './components/ToastNotification';
import { AclfLogo } from './components/AclfLogo';

const MainApp: React.FC = () => {
  const { activeTab, resetToInitialData } = useProjectContext();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased flex flex-col selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100 transition-colors">
      {/* Header */}
      <Header />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Dashboard Indicators */}
        <DashboardSummary />

        {/* Filters & Search */}
        <SearchAndFilters />

        {/* Tab View Content */}
        {activeTab === 'favorites' ? <FavoritesView /> : <SectorGrid />}
      </main>

      {/* Corporate Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 mt-auto py-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AclfLogo className="w-6 h-6 shrink-0" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">Hub de Ferramentas ACLF</span>
            <span>— Central Corporativa de Soluções</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500">
            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Dados salvos no navegador (LocalStorage)
            </span>
            <span>•</span>
            <button
              onClick={() => {
                if (window.confirm('Tem certeza que deseja restaurar os projetos padrão originais? Suas alterações salvas serão resetadas.')) {
                  resetToInitialData();
                }
              }}
              className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 underline font-medium transition-colors cursor-pointer"
              title="Restaurar lista de projetos original"
            >
              Restaurar dados padrão
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Toasts */}
      <UserRoleSelectionModal />
      <ProjectFormModal />
      <DeleteConfirmationModal />
      <ToastNotification />
    </div>
  );
};

export default function App() {
  return (
    <ProjectProvider>
      <MainApp />
    </ProjectProvider>
  );
}
