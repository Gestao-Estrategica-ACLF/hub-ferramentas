import { Project, Sector, User, ProjectFilter } from '../types';

/**
 * Verifica se o usuário atual possui privilégios de administrador.
 */
export function isAdmin(user: User): boolean {
  return user.role === 'admin';
}

/**
 * Verificação centralizada se um usuário tem permissão para acessar/visualizar um projeto.
 */
export function canUserAccessProject(user: User, project: Project, sectors: Sector[] = []): boolean {
  // Administradores possuem acesso irrestrito a todas as ferramentas
  if (isAdmin(user)) {
    return true;
  }

  // Projetos do setor Recepção ou com 'all'/'todos' são públicos/comunicativos para todos os setores
  if (
    project.sectorId === 'sec-recepcao' ||
    (project.allowedSectors &&
      project.allowedSectors.some(
        (allowed) => allowed && (allowed.toLowerCase() === 'all' || allowed.toLowerCase() === 'todos')
      ))
  ) {
    return true;
  }

  // Se o projeto não possui lista de setores autorizados ou está vazia, o usuário comum não acessa
  if (!project.allowedSectors || project.allowedSectors.length === 0) {
    return false;
  }

  const userSectorId = user.sectorId || user.sector;
  if (!userSectorId) {
    return false;
  }

  // Encontrar objeto do setor do usuário se a lista de setores foi fornecida
  const userSectorObj = sectors.find(
    (s) => s.id === userSectorId || s.name.toLowerCase() === userSectorId.toLowerCase()
  );

  const userSectorName = userSectorObj ? userSectorObj.name : user.sector || userSectorId;
  const actualUserSectorId = userSectorObj ? userSectorObj.id : userSectorId;

  // Checa se o setor do usuário está contido em allowedSectors (por ID ou por Nome)
  return project.allowedSectors.some((allowed) => {
    if (!allowed) return false;
    const allowedLower = allowed.toLowerCase();
    
    // Correspondência direta por ID
    if (allowed === actualUserSectorId || allowed === userSectorId) {
      return true;
    }
    
    // Correspondência por Nome
    if (allowedLower === userSectorName.toLowerCase()) {
      return true;
    }

    // Se allowed for o ID de um setor, buscar seu nome
    const allowedSectorObj = sectors.find((s) => s.id === allowed);
    if (allowedSectorObj && allowedSectorObj.name.toLowerCase() === userSectorName.toLowerCase()) {
      return true;
    }

    return false;
  });
}

/**
 * Retorna somente as ferramentas/projetos que o usuário possui permissão de visualizar.
 */
export function getVisibleProjects(projects: Project[], user: User, sectors: Sector[] = []): Project[] {
  return projects.filter((project) => canUserAccessProject(user, project, sectors));
}

/**
 * Retorna os projetos visíveis de um determinado setor.
 */
export function getProjectsBySector(
  projects: Project[],
  sectorId: string,
  user: User,
  sectors: Sector[] = []
): Project[] {
  return projects.filter(
    (project) => project.sectorId === sectorId && canUserAccessProject(user, project, sectors)
  );
}

/**
 * Filtra e ordena as ferramentas visíveis para o usuário atual conforme os critérios de busca e filtros.
 */
export function filterProjectsForCurrentUser(
  projects: Project[],
  user: User,
  filters: ProjectFilter,
  sectors: Sector[] = []
): Project[] {
  // 1. Filtrar primeiramente apenas ferramentas que o usuário pode acessar
  const visibleProjects = getVisibleProjects(projects, user, sectors);

  // 2. Aplicar busca, filtro por setor, tipo e favoritos
  return visibleProjects
    .filter((project) => {
      // Busca por termo
      if (filters.searchTerm.trim() !== '') {
        const term = filters.searchTerm.toLowerCase().trim();
        const sector = sectors.find((s) => s.id === project.sectorId);
        const sectorName = sector ? sector.name.toLowerCase() : '';

        const matchName = project.name.toLowerCase().includes(term);
        const matchDesc = project.description.toLowerCase().includes(term);
        const matchType = project.type.toLowerCase().includes(term);
        const matchSector = sectorName.includes(term);
        const matchTags = project.tags.some((tag) => tag.toLowerCase().includes(term));
        const matchResp = project.responsible ? project.responsible.toLowerCase().includes(term) : false;
        const matchNotes = project.notes ? project.notes.toLowerCase().includes(term) : false;

        if (!(matchName || matchDesc || matchType || matchSector || matchTags || matchResp || matchNotes)) {
          return false;
        }
      }

      // Filtro por setor
      if (filters.sectorId !== 'all' && project.sectorId !== filters.sectorId) {
        return false;
      }

      // Filtro por tipo
      if (filters.type !== 'all' && project.type !== filters.type) {
        return false;
      }

      // Filtro apenas favoritos
      if (filters.onlyFavorites && !user.favoriteProjectIds.includes(project.id)) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      const aFav = user.favoriteProjectIds.includes(a.id);
      const bFav = user.favoriteProjectIds.includes(b.id);

      switch (filters.sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name, 'pt-BR');
        case 'name-desc':
          return b.name.localeCompare(a.name, 'pt-BR');
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'favorites-first':
          if (aFav && !bFav) return -1;
          if (!aFav && bFav) return 1;
          return a.name.localeCompare(b.name, 'pt-BR');
        default:
          return 0;
      }
    });
}
