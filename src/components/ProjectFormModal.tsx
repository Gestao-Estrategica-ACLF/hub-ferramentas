import React, { useState, useEffect } from 'react';
import { useProjectContext } from '../context/ProjectContext';
import { ProjectType } from '../types';
import { X, Plus, Save, AlertCircle } from 'lucide-react';

export const ProjectFormModal: React.FC = () => {
  const {
    isFormModalOpen,
    editingProject,
    preselectedSectorId,
    closeFormModal,
    createProject,
    updateProject,
    sectors,
  } = useProjectContext();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<ProjectType>('Dashboard BI');
  const [sectorId, setSectorId] = useState('');
  const [allowedSectors, setAllowedSectors] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState('');
  const [responsible, setResponsible] = useState('');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill fields on open
  useEffect(() => {
    if (isFormModalOpen) {
      document.body.style.overflow = 'hidden';

      if (editingProject) {
        setName(editingProject.name);
        setDescription(editingProject.description);
        setUrl(editingProject.url);
        setType(editingProject.type);
        setSectorId(editingProject.sectorId);
        setAllowedSectors(
          editingProject.allowedSectors && editingProject.allowedSectors.length > 0
            ? editingProject.allowedSectors
            : [editingProject.sectorId]
        );
        setTagsInput(editingProject.tags ? editingProject.tags.join(', ') : '');
        setResponsible(editingProject.responsible || '');
        setNotes(editingProject.notes || '');
      } else {
        const initialSector = preselectedSectorId || sectors[0]?.id || '';
        setName('');
        setDescription('');
        setUrl('');
        setType('Dashboard BI');
        setSectorId(initialSector);
        setAllowedSectors(initialSector ? [initialSector] : []);
        setTagsInput('');
        setResponsible('');
        setNotes('');
      }
      setErrors({});
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFormModalOpen, editingProject, preselectedSectorId, sectors]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFormModalOpen) {
        closeFormModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFormModalOpen, closeFormModal]);

  if (!isFormModalOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'O nome do projeto é obrigatório.';
    }

    if (!url.trim()) {
      newErrors.url = 'O link de acesso é obrigatório.';
    } else {
      const cleanUrl = url.trim().toLowerCase();
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        newErrors.url = 'O link deve começar com "http://" ou "https://".';
      }
    }

    if (!sectorId) {
      newErrors.sectorId = 'Selecione o setor responsável.';
    }

    if (!allowedSectors || allowedSectors.length === 0) {
      newErrors.allowedSectors = 'Selecione pelo menos um setor autorizado.';
    }

    if (!type) {
      newErrors.type = 'Selecione o tipo do projeto.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    setTimeout(() => {
      if (editingProject) {
        updateProject(editingProject.id, {
          name: name.trim(),
          description: description.trim(),
          url: url.trim(),
          type,
          sectorId,
          allowedSectors,
          tags: tagsArray,
          responsible: responsible.trim() || undefined,
          notes: notes.trim() || undefined,
        });
      } else {
        createProject({
          name: name.trim(),
          description: description.trim(),
          url: url.trim(),
          type,
          sectorId,
          allowedSectors,
          tags: tagsArray,
          responsible: responsible.trim() || undefined,
          notes: notes.trim() || undefined,
        });
      }
      setIsSubmitting(false);
    }, 200);
  };

  const projectTypesList: ProjectType[] = [
    'Dashboard BI',
    'Projeto AI Studio',
    'Ferramenta interna',
    'Plataforma externa',
    'Outro',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center font-bold">
              {editingProject ? '✏️' : '➕'}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">
                {editingProject ? 'Editar Projeto' : 'Cadastrar Novo Projeto'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {editingProject
                  ? 'Atualize os dados e links do projeto.'
                  : 'Preencha as informações para disponibilizar no Hub.'}
              </p>
            </div>
          </div>

          <button
            onClick={closeFormModal}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            title="Fechar modal (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Project Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Nome do Projeto <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
              placeholder="Ex: Dashboard de Vendas, Portal de Chamados..."
              className={`w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? 'border-rose-400 focus:ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Descrição Curta
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Resumo objetivo da funcionalidade e objetivo da ferramenta..."
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
            />
          </div>

          {/* Access Link / URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Link de Acesso (URL) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (errors.url) setErrors((prev) => ({ ...prev, url: '' }));
              }}
              placeholder="https://lookerstudio.google.com/..."
              className={`w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all ${
                errors.url
                  ? 'border-rose-400 focus:ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800'
              }`}
            />
            {errors.url ? (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.url}
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                O link deve começar obrigatoriamente com <code>http://</code> ou <code>https://</code>.
              </p>
            )}
          </div>

          {/* Sector & Type Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Sector */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Setor Responsável (Dono) <span className="text-rose-500">*</span>
              </label>
              <select
                value={sectorId}
                onChange={(e) => {
                  const newSecId = e.target.value;
                  setSectorId(newSecId);
                  if (newSecId && !allowedSectors.includes(newSecId)) {
                    setAllowedSectors((prev) => [...prev, newSecId]);
                  }
                  if (errors.sectorId) setErrors((prev) => ({ ...prev, sectorId: '' }));
                }}
                className={`w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all ${
                  errors.sectorId
                    ? 'border-rose-400 focus:ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800'
                }`}
              >
                <option value="">Selecione um setor...</option>
                {sectors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {errors.sectorId && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.sectorId}
                </p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Tipo do Projeto <span className="text-rose-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ProjectType)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
              >
                {projectTypesList.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Allowed Sectors Multi-Select */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                Setores Autorizados a Acessar <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setAllowedSectors(sectors.map((s) => s.id));
                    if (errors.allowedSectors) setErrors((prev) => ({ ...prev, allowedSectors: '' }));
                  }}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold cursor-pointer"
                >
                  Selecionar Todos
                </button>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <button
                  type="button"
                  onClick={() => setAllowedSectors([])}
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium cursor-pointer"
                >
                  Limpar
                </button>
              </div>
            </div>

            <div
              className={`p-3 bg-slate-50 dark:bg-slate-800/60 border rounded-xl grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto transition-all ${
                errors.allowedSectors ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              {sectors.map((sec) => {
                const isSelected = allowedSectors.includes(sec.id) || allowedSectors.includes(sec.name);
                return (
                  <label
                    key={sec.id}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-medium cursor-pointer transition-all select-none ${
                      isSelected
                        ? 'bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 shadow-2xs font-semibold'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {
                        setAllowedSectors((prev) => {
                          const exists = prev.includes(sec.id) || prev.includes(sec.name);
                          let updated: string[];
                          if (exists) {
                            updated = prev.filter((item) => item !== sec.id && item !== sec.name);
                          } else {
                            updated = [...prev, sec.id];
                          }
                          if (errors.allowedSectors && updated.length > 0) {
                            setErrors((e) => ({ ...e, allowedSectors: '' }));
                          }
                          return updated;
                        });
                      }}
                      className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-600"
                    />
                    <span className="truncate">{sec.name}</span>
                  </label>
                );
              })}
            </div>
            {errors.allowedSectors ? (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.allowedSectors}
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                Apenas usuários dos setores selecionados acima poderão visualizar esta ferramenta.
              </p>
            )}
          </div>

          {/* Tags / Keywords */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Tags / Palavras-chave
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Separe por vírgulas: Vendas, VGV, Metas, Looker..."
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
            />
          </div>

          {/* Responsible & Notes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Nome do Responsável <span className="text-slate-400 dark:text-slate-500 font-normal">(Opcional)</span>
              </label>
              <input
                type="text"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                placeholder="Ex: Eng. Roberto Alves"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Observações / Avisos <span className="text-slate-400 dark:text-slate-500 font-normal">(Opcional)</span>
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Requer VPN ou login corporativo..."
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
              />
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeFormModal}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Salvando...</span>
              ) : editingProject ? (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Projeto</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
