import React from 'react';
import { useProjectContext } from '../context/ProjectContext';
import { MetricCard } from './MetricCard';
import {
  Building2,
  FolderKanban,
  Star,
  BarChart3,
  Sparkles,
} from 'lucide-react';

export const DashboardSummary: React.FC = () => {
  const { metrics, setFilters, setActiveTab } = useProjectContext();

  return (
    <section className="mb-6">
      <div className="flex gap-3.5 sm:gap-4 overflow-x-auto pb-2 scroll-smooth">
        {/* Setores */}
        <div className="min-w-[160px] sm:min-w-[180px] flex-1 shrink-0">
          <MetricCard
            icon={<Building2 className="w-4 h-4 text-slate-700" />}
            label="Setores"
            value={metrics.totalSectors}
            description="cadastrados"
            onClick={() => {
              setActiveTab('hub');
              setFilters({ sectorId: 'all' });
            }}
          />
        </div>

        {/* Projetos */}
        <div className="min-w-[160px] sm:min-w-[180px] flex-1 shrink-0">
          <MetricCard
            icon={<FolderKanban className="w-4 h-4 text-blue-600" />}
            label="Projetos"
            value={metrics.totalProjects}
            description="ferramentas & BI"
            highlight
            onClick={() => {
              setActiveTab('hub');
              setFilters({ type: 'all', sectorId: 'all' });
            }}
          />
        </div>

        {/* Favoritos */}
        <div className="min-w-[160px] sm:min-w-[180px] flex-1 shrink-0">
          <MetricCard
            icon={<Star className="w-4 h-4 text-amber-500 fill-amber-400" />}
            label="Favoritos"
            value={metrics.totalFavorites}
            description="meus atalhos"
            onClick={() => {
              setActiveTab('favorites');
            }}
          />
        </div>

        {/* Dashboards BI */}
        <div className="min-w-[160px] sm:min-w-[180px] flex-1 shrink-0">
          <MetricCard
            icon={<BarChart3 className="w-4 h-4 text-indigo-600" />}
            label="Dashboards BI"
            value={metrics.totalBiDashboards}
            description="painéis de dados"
            onClick={() => {
              setActiveTab('hub');
              setFilters({ type: 'Dashboard BI' });
            }}
          />
        </div>

        {/* AI & Ferramentas */}
        <div className="min-w-[160px] sm:min-w-[180px] flex-1 shrink-0">
          <MetricCard
            icon={<Sparkles className="w-4 h-4 text-emerald-600" />}
            label="AI & Ferramentas"
            value={metrics.totalAiAndTools}
            description="AI Studio & internas"
            onClick={() => {
              setActiveTab('hub');
              setFilters({ type: 'all' });
            }}
          />
        </div>
      </div>
    </section>
  );
};
