export type ProjectType =
  | 'Dashboard BI'
  | 'Projeto AI Studio'
  | 'Ferramenta interna'
  | 'Plataforma externa'
  | 'Outro';

export type ThemeMode = 'light' | 'dark';

export type UserRole = 'admin' | 'user';

export interface Sector {
  id: string;
  name: string;
  iconName: string;
  description?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  type: ProjectType;
  sectorId: string; // Setor primário do projeto
  allowedSectors: string[]; // Lista de setores autorizados a visualizar esta ferramenta (IDs ou Nomes)
  tags: string[];
  responsible?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  sectorId: string; // ID do setor do usuário (ex: 'sec-engenharia')
  sector?: string; // Nome do setor do usuário (ex: 'Engenharia')
  favoriteProjectIds: string[];
}

export type SortOption = 'name-asc' | 'name-desc' | 'recent' | 'oldest' | 'favorites-first';

export interface ProjectFilter {
  searchTerm: string;
  sectorId: string; // 'all' or sectorId
  type: ProjectType | 'all';
  onlyFavorites: boolean;
  sortBy: SortOption;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface Metrics {
  totalSectors: number;
  totalProjects: number;
  totalFavorites: number;
  totalBiDashboards: number;
  totalAiAndTools: number;
}
