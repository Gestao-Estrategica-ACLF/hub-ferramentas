import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import {
  Project,
  Sector,
  User,
  UserRole,
  ProjectFilter,
  Toast,
  Metrics,
  ThemeMode,
} from '../types';
import { INITIAL_SECTORS } from '../data/sectors';
import { INITIAL_PROJECTS } from '../data/projects';
import {
  canUserAccessProject,
  getVisibleProjects,
  filterProjectsForCurrentUser,
  getProjectsBySector as getProjectsBySectorAccess,
} from '../utils/accessControl';

interface ProjectContextType {
  sectors: Sector[];
  projects: Project[];
  currentUser: User;
  filters: ProjectFilter;
  expandedSectors: Record<string, boolean>;
  activeTab: 'hub' | 'favorites';
  toasts: Toast[];
  sectorFavorites: Record<string, string[]>;
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  
  // User profile / access control actions
  setUserRole: (role: UserRole) => void;
  setUserSector: (sectorId: string) => void;
  
  // Modals state
  isRoleSelectionModalOpen: boolean;
  isFormModalOpen: boolean;
  editingProject: Project | null;
  preselectedSectorId: string | null;
  isDeleteModalOpen: boolean;
  deletingProject: Project | null;

  // Actions
  createProject: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, data: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteProject: (id: string) => void;
  toggleFavorite: (projectId: string, targetSectorId?: string) => void;
  getSectorFavorites: (sectorId: string) => string[];
  setFilters: (newFilters: Partial<ProjectFilter>) => void;
  resetFilters: () => void;
  resetToInitialData: () => void;
  toggleSectorExpansion: (sectorId: string) => void;
  expandAllSectors: () => void;
  collapseAllSectors: () => void;
  setActiveTab: (tab: 'hub' | 'favorites') => void;
  
  // Modal triggers
  openRoleSelectionModal: () => void;
  closeRoleSelectionModal: () => void;
  openCreateModal: (sectorId?: string) => void;
  openEditModal: (project: Project) => void;
  closeFormModal: () => void;
  openDeleteModal: (project: Project) => void;
  closeDeleteModal: () => void;
  
  // Toast triggers
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
  removeToast: (id: string) => void;

  // Derived selectors
  metrics: Metrics;
  filteredProjects: Project[];
  getProjectsBySector: (sectorId: string) => Project[];
  getSectorById: (sectorId: string) => Sector | undefined;
  isFavorite: (projectId: string, targetSectorId?: string) => boolean;
  canAccess: (project: Project) => boolean;
}

const DEFAULT_FILTERS: ProjectFilter = {
  searchTerm: '',
  sectorId: 'all',
  type: 'all',
  onlyFavorites: false,
  sortBy: 'name-asc',
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const STORAGE_PROJECTS_KEY = 'aclf_hub_projects_v1';
const STORAGE_USER_KEY = 'aclf_hub_user_v1';
const STORAGE_SECTOR_FAVORITES_KEY = 'aclf_hub_sector_favorites_v2';
const STORAGE_THEME_KEY = 'aclf_hub_theme_mode_v1';

const INITIAL_SECTOR_FAVORITES: Record<string, string[]> = {
  'sec-engenharia': ['proj-eng-01', 'proj-sgi-01', 'proj-comercial-01'],
  'sec-comercial': ['proj-comercial-01', 'proj-sgi-01', 'proj-financeiro-01'],
  'sec-suprimentos': ['proj-suprimentos-01', 'proj-sgi-01'],
  'sec-sgi': ['proj-sgi-01', 'proj-rh-01'],
  'sec-financeiro': ['proj-financeiro-01', 'proj-estrategica-01'],
  'sec-pessoas-e-cultura': ['proj-rh-01', 'proj-sgi-01'],
  'sec-ti': ['proj-ti-01', 'proj-estrategica-01'],
  'sec-gestao-estrategica': ['proj-estrategica-01', 'proj-financeiro-01'],
  'sec-corporativo': ['proj-comercial-01', 'proj-financeiro-01', 'proj-estrategica-01', 'proj-eng-01'],
  'sec-planejamento': ['proj-eng-01', 'proj-financeiro-01'],
  'sec-projetos': ['proj-eng-01', 'proj-sgi-01'],
  'sec-legalizacao': ['proj-sgi-01'],
  'sec-pos-obra': ['proj-eng-01'],
  'sec-gerencia-tecnica': ['proj-eng-01', 'proj-sgi-01'],
  'sec-marketing': ['proj-comercial-01'],
  'sec-usina-e-manutencao': ['proj-eng-01'],
  'sec-pnws': ['proj-financeiro-01'],
};

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sectors] = useState<Sector[]>(INITIAL_SECTORS);

  // Load sector favorites map from localStorage or fallback
  const [sectorFavorites, setSectorFavorites] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SECTOR_FAVORITES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Erro ao carregar favoritos por setor:', err);
    }
    return INITIAL_SECTOR_FAVORITES;
  });

  // Load projects from localStorage or fallback to INITIAL_PROJECTS
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROJECTS_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Erro ao ler projetos do localStorage:', err);
    }
    return INITIAL_PROJECTS;
  });
  
  // Load currentUser from localStorage or fallback to defaults
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) {
          return {
            role: 'admin',
            sectorId: 'sec-engenharia',
            sector: 'Engenharia',
            favoriteProjectIds: INITIAL_SECTOR_FAVORITES['sec-engenharia'] || [],
            ...parsed,
          };
        }
      }
    } catch (err) {
      console.error('Erro ao ler usuario do localStorage:', err);
    }
    return {
      id: 'user-01',
      name: 'Arthur Leite',
      role: 'admin',
      sectorId: 'sec-engenharia',
      sector: 'Engenharia',
      favoriteProjectIds: INITIAL_SECTOR_FAVORITES['sec-engenharia'] || [],
    };
  });

  // Theme state ('light' | 'dark')
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_THEME_KEY);
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
      // Check system preference
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (err) {
      console.error('Erro ao ler tema do localStorage:', err);
    }
    return 'light';
  });

  // Sync theme mode with document HTML class and localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_THEME_KEY, themeMode);
    } catch (err) {
      console.error('Erro ao salvar tema no localStorage:', err);
    }

    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  const toggleThemeMode = () => {
    setThemeModeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
  };

  // Sync currentUser.favoriteProjectIds when active sector or sectorFavorites update
  useEffect(() => {
    const activeFavs = sectorFavorites[currentUser.sectorId] || [];
    setCurrentUser((prev) => {
      if (JSON.stringify(prev.favoriteProjectIds) !== JSON.stringify(activeFavs)) {
        return { ...prev, favoriteProjectIds: activeFavs };
      }
      return prev;
    });
  }, [currentUser.sectorId, sectorFavorites]);

  // Persist sectorFavorites changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SECTOR_FAVORITES_KEY, JSON.stringify(sectorFavorites));
    } catch (err) {
      console.error('Erro ao salvar favoritos do setor no localStorage:', err);
    }
  }, [sectorFavorites]);

  // User Role and Sector Setters
  const setUserRole = (role: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role }));
  };

  const setUserSector = (sectorId: string) => {
    const sec = sectors.find((s) => s.id === sectorId);
    const activeFavs = sectorFavorites[sectorId] || [];
    setCurrentUser((prev) => ({
      ...prev,
      sectorId,
      sector: sec ? sec.name : sectorId,
      favoriteProjectIds: activeFavs,
    }));
  };

  // Automatically persist projects changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(projects));
    } catch (err) {
      console.error('Erro ao salvar projetos no localStorage:', err);
    }
  }, [projects]);

  // Automatically persist currentUser changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(currentUser));
    } catch (err) {
      console.error('Erro ao salvar usuario no localStorage:', err);
    }
  }, [currentUser]);

  const [filters, setFiltersState] = useState<ProjectFilter>(DEFAULT_FILTERS);
  const [activeTab, setActiveTab] = useState<'hub' | 'favorites'>('hub');

  // All sectors expanded by default
  const [expandedSectors, setExpandedSectors] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    INITIAL_SECTORS.forEach((s) => {
      initial[s.id] = true;
    });
    return initial;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Modals state
  const [isRoleSelectionModalOpen, setIsRoleSelectionModalOpen] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [preselectedSectorId, setPreselectedSectorId] = useState<string | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  // Helper Toast
  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper to get favorites of any specific sector
  const getSectorFavorites = (sectorId: string): string[] => {
    return sectorFavorites[sectorId] || [];
  };

  // Favorite toggle per sector
  const toggleFavorite = (projectId: string, targetSectorId?: string) => {
    const activeSecId = targetSectorId || currentUser.sectorId || 'sec-engenharia';

    setSectorFavorites((prev) => {
      const currentList = prev[activeSecId] || [];
      const exists = currentList.includes(projectId);
      const updatedList = exists
        ? currentList.filter((id) => id !== projectId)
        : [...currentList, projectId];

      const project = projects.find((p) => p.id === projectId);
      const projName = project ? project.name : 'Projeto';
      const sectorObj = sectors.find((s) => s.id === activeSecId);
      const secName = sectorObj ? sectorObj.name : 'Setor';

      if (exists) {
        addToast('info', `"${projName}" removido dos favoritos de ${secName}`);
      } else {
        addToast('success', `"${projName}" adicionado aos favoritos de ${secName}!`);
      }

      return {
        ...prev,
        [activeSecId]: updatedList,
      };
    });
  };

  const isFavorite = (projectId: string, targetSectorId?: string) => {
    const activeSecId = targetSectorId || currentUser.sectorId;
    const list = sectorFavorites[activeSecId] || [];
    return list.includes(projectId);
  };

  // Filter setters
  const setFilters = (newFilters: Partial<ProjectFilter>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFiltersState(DEFAULT_FILTERS);
  };

  const resetToInitialData = () => {
    setProjects(INITIAL_PROJECTS);
    setCurrentUser({
      id: 'user-01',
      name: 'Arthur Leite',
      role: 'admin',
      sectorId: 'sec-engenharia',
      sector: 'Engenharia',
      favoriteProjectIds: ['proj-comercial-01', 'proj-sgi-01', 'proj-estrategica-01'],
    });
    localStorage.removeItem(STORAGE_PROJECTS_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    addToast('info', 'Dados restaurados para os padrões iniciais!');
  };

  // Sector expansion
  const toggleSectorExpansion = (sectorId: string) => {
    setExpandedSectors((prev) => ({
      ...prev,
      [sectorId]: !prev[sectorId],
    }));
  };

  const expandAllSectors = () => {
    const allExpanded: Record<string, boolean> = {};
    sectors.forEach((s) => {
      allExpanded[s.id] = true;
    });
    setExpandedSectors(allExpanded);
  };

  const collapseAllSectors = () => {
    const allCollapsed: Record<string, boolean> = {};
    sectors.forEach((s) => {
      allCollapsed[s.id] = false;
    });
    setExpandedSectors(allCollapsed);
  };

  // Modal actions
  const openRoleSelectionModal = () => {
    setIsRoleSelectionModalOpen(true);
  };

  const closeRoleSelectionModal = () => {
    setIsRoleSelectionModalOpen(false);
  };

  const openCreateModal = (sectorId?: string) => {
    setEditingProject(null);
    setPreselectedSectorId(sectorId || null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setPreselectedSectorId(null);
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setEditingProject(null);
    setPreselectedSectorId(null);
  };

  const openDeleteModal = (project: Project) => {
    setDeletingProject(project);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingProject(null);
  };

  // CRUD Operations
  const createProject = (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newProject: Project = {
      ...data,
      allowedSectors: data.allowedSectors && data.allowedSectors.length > 0 ? data.allowedSectors : [data.sectorId],
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };

    setProjects((prev) => [newProject, ...prev]);
    // Expand the target sector if collapsed
    setExpandedSectors((prev) => ({ ...prev, [data.sectorId]: true }));
    closeFormModal();
    addToast('success', `Projeto "${newProject.name}" cadastrado com sucesso!`);
  };

  const updateProject = (id: string, data: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const now = new Date().toISOString();
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data, updatedAt: now } : p))
    );
    closeFormModal();
    addToast('success', `Projeto atualizado com sucesso!`);
  };

  const deleteProject = (id: string) => {
    const target = projects.find((p) => p.id === id);
    const name = target ? target.name : 'Projeto';

    setProjects((prev) => prev.filter((p) => p.id !== id));
    
    // Remove from favorites if favorited
    setCurrentUser((prev) => ({
      ...prev,
      favoriteProjectIds: prev.favoriteProjectIds.filter((favId) => favId !== id),
    }));
    setSectorFavorites((prev) => {
      const updated: Record<string, string[]> = {};
      Object.keys(prev).forEach((secKey) => {
        updated[secKey] = prev[secKey].filter((favId) => favId !== id);
      });
      return updated;
    });

    closeDeleteModal();
    addToast('success', `Projeto "${name}" excluído com sucesso.`);
  };

  const getSectorById = (sectorId: string) => {
    return sectors.find((s) => s.id === sectorId);
  };

  // Single-point access check helper for components
  const canAccess = (project: Project) => {
    return canUserAccessProject(currentUser, project, sectors);
  };

  // Filter & Search Logic (Filtered by Access Control)
  const filteredProjects = useMemo(() => {
    return filterProjectsForCurrentUser(projects, currentUser, filters, sectors);
  }, [projects, currentUser, filters, sectors]);

  const getProjectsBySector = (sectorId: string) => {
    return filteredProjects.filter((p) => p.sectorId === sectorId);
  };

  // Calculate Metrics based on accessible projects for current user
  const metrics = useMemo<Metrics>(() => {
    const visibleProjects = getVisibleProjects(projects, currentUser, sectors);
    const totalSectors = sectors.filter((s) => visibleProjects.some((p) => p.sectorId === s.id)).length;
    const totalProjects = visibleProjects.length;
    const totalFavorites = currentUser.favoriteProjectIds.filter((id) =>
      visibleProjects.some((p) => p.id === id)
    ).length;
    
    const totalBiDashboards = visibleProjects.filter((p) => p.type === 'Dashboard BI').length;
    const totalAiAndTools = visibleProjects.filter(
      (p) => p.type === 'Projeto AI Studio' || p.type === 'Ferramenta interna'
    ).length;

    return {
      totalSectors,
      totalProjects,
      totalFavorites,
      totalBiDashboards,
      totalAiAndTools,
    };
  }, [sectors, projects, currentUser, sectors]);

  return (
    <ProjectContext.Provider
      value={{
        sectors,
        projects,
        currentUser,
        filters,
        expandedSectors,
        activeTab,
        toasts,
        sectorFavorites,
        themeMode,
        toggleThemeMode,
        setThemeMode,
        isFormModalOpen,
        editingProject,
        preselectedSectorId,
        isDeleteModalOpen,
        deletingProject,
        isRoleSelectionModalOpen,
        openRoleSelectionModal,
        closeRoleSelectionModal,
        setUserRole,
        setUserSector,
        createProject,
        updateProject,
        deleteProject,
        toggleFavorite,
        getSectorFavorites,
        setFilters,
        resetFilters,
        resetToInitialData,
        toggleSectorExpansion,
        expandAllSectors,
        collapseAllSectors,
        setActiveTab,
        openCreateModal,
        openEditModal,
        closeFormModal,
        openDeleteModal,
        closeDeleteModal,
        addToast,
        removeToast,
        metrics,
        filteredProjects,
        getProjectsBySector,
        getSectorById,
        isFavorite,
        canAccess,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};
