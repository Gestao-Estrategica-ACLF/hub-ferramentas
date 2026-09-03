import React, { useState } from 'react';
import { useProjectContext } from '../context/ProjectContext';
import { AclfLogo } from './AclfLogo';
import { UserRole } from '../types';
import { Shield, User, Check, ArrowRight, Building2, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const UserRoleSelectionModal: React.FC = () => {
  const {
    currentUser,
    setUserRole,
    setUserSector,
    sectors,
    isRoleSelectionModalOpen,
    closeRoleSelectionModal,
    addToast,
  } = useProjectContext();

  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser.role || 'user');
  const [selectedSectorId, setSelectedSectorId] = useState<string>(currentUser.sectorId || sectors[0]?.id || 'sec-engenharia');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  if (!isRoleSelectionModalOpen) return null;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setPasswordError('');
    setPassword('');
  };

  const handleConfirm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (selectedRole === 'admin') {
      if (!password) {
        setPasswordError('Por favor, informe a senha de administrador.');
        return;
      }
      if (password !== 'Mudar@123') {
        setPasswordError('Senha incorreta! Tente novamente.');
        addToast('error', 'Senha de administrador incorreta.');
        return;
      }
      setUserRole('admin');
      addToast('success', 'Acesso liberado como Administrador (Acesso total).');
    } else {
      setUserRole('user');
      setUserSector(selectedSectorId);
      const chosenSectorObj = sectors.find((s) => s.id === selectedSectorId);
      const sectorName = chosenSectorObj ? chosenSectorObj.name : selectedSectorId;
      addToast('info', `Acesso liberado como Usuário Comum (${sectorName}).`);
    }

    setPasswordError('');
    setPassword('');
    closeRoleSelectionModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 p-6 sm:p-8 text-white relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-xs border border-white/15">
                <AclfLogo className="w-10 h-10 text-white" />
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 mb-1 text-[10px] font-bold tracking-wider text-indigo-300 uppercase bg-indigo-500/20 border border-indigo-400/30 rounded-full">
                  Identificação & Acesso
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Hub de Ferramentas ACLF
                </h2>
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs sm:text-sm text-slate-300 max-w-xl font-normal leading-relaxed">
            Selecione como deseja acessar a plataforma. Suas permissões e as ferramentas visíveis serão adaptadas ao perfil escolhido.
          </p>
        </div>

        {/* Modal Body / Selection Cards */}
        <form onSubmit={handleConfirm} className="p-6 sm:p-8 space-y-6 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Card 1: Administrador */}
            <div
              onClick={() => handleRoleSelect('admin')}
              className={`relative p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                selectedRole === 'admin'
                   ? 'bg-white dark:bg-slate-800 border-indigo-600 dark:border-indigo-500 shadow-md ring-2 ring-indigo-600/20 dark:ring-indigo-500/20'
                  : 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              {selectedRole === 'admin' && (
                <div className="absolute top-3 right-3 p-1 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`p-2 rounded-lg ${selectedRole === 'admin' ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Administrador</h3>
                </div>

                <span className="inline-block px-2 py-0.5 mb-3 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-md">
                  Acesso Irrestrito (Exige Senha)
                </span>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Visualiza todas as ferramentas do Hub de todos os setores. Possui permissão para cadastrar novas soluções, editar links e gerenciar os setores autorizados.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Selecionar Administrador</span>
              </div>
            </div>

            {/* Card 2: Usuário Comum */}
            <div
              onClick={() => handleRoleSelect('user')}
              className={`relative p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                selectedRole === 'user'
                  ? 'bg-white dark:bg-slate-800 border-indigo-600 dark:border-indigo-500 shadow-md ring-2 ring-indigo-600/20 dark:ring-indigo-500/20'
                  : 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              {selectedRole === 'user' && (
                <div className="absolute top-3 right-3 p-1 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`p-2 rounded-lg ${selectedRole === 'user' ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    <User className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Usuário Comum</h3>
                </div>

                <span className="inline-block px-2 py-0.5 mb-3 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-md">
                  Acesso Direcionado por Setor
                </span>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Acesso personalizado para colaboradores. Exibe apenas os dashboards, projetos e ferramentas liberados para o seu setor específico.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Selecionar Usuário Comum</span>
              </div>
            </div>

          </div>

          {/* Admin Password Input Field */}
          {selectedRole === 'admin' && (
            <div className="p-4 bg-indigo-50/80 dark:bg-slate-800/80 border border-indigo-200 dark:border-slate-700 rounded-xl space-y-2 animate-fade-in">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Senha de Acesso do Administrador:</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  placeholder="Digite a senha de administrador"
                  className={`w-full pl-3.5 pr-10 py-2.5 bg-white dark:bg-slate-900 border rounded-lg text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all ${
                    passwordError ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-400' : 'border-indigo-300 dark:border-slate-700 focus:ring-indigo-500'
                  }`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                  title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError ? (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {passwordError}
                </p>
              ) : (
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  * Digite a senha cadastrada para autenticar o perfil de Administrador.
                </p>
              )}
            </div>
          )}

          {/* Sector Selection (Active when selectedRole === 'user') */}
          {selectedRole === 'user' && (
            <div className="p-4 bg-indigo-50/70 dark:bg-slate-800/80 border border-indigo-200/80 dark:border-slate-700 rounded-xl space-y-2 animate-fade-in">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Escolha o seu Setor de Atuação:</span>
              </label>
              <select
                value={selectedSectorId}
                onChange={(e) => setSelectedSectorId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs cursor-pointer"
              >
                {sectors.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.name}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                * Você visualizará apenas as ferramentas configuradas como acessíveis ao setor selecionado acima.
              </p>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Acessar Aplicação</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
