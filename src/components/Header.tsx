import React from 'react';
import { 
  Activity, 
  BarChart3, 
  Car, 
  Code2, 
  Layers, 
  Play, 
  Square, 
  Sliders, 
  Sparkles,
  ShieldCheck,
  Fuel,
  TrendingUp
} from 'lucide-react';
import { Shift, VehicleConfig } from '../types/rotametric';

interface HeaderProps {
  activeTab: 'dashboard' | 'simulator' | 'reports' | 'settings' | 'android';
  setActiveTab: (tab: 'dashboard' | 'simulator' | 'reports' | 'settings' | 'android') => void;
  activeShift: Shift | null;
  onToggleShift: () => void;
  overlayVisible: boolean;
  setOverlayVisible: (visible: boolean) => void;
  openOnboarding: () => void;
  vehicleConfig: VehicleConfig;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeShift,
  onToggleShift,
  overlayVisible,
  setOverlayVisible,
  openOnboarding,
  vehicleConfig,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-black text-xl tracking-tight">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white tracking-tight">RotaMetric</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Android & Web
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Copiloto Financeiro para Uber & 99
              </p>
            </div>
          </div>

          {/* Quick Metrics & Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Overlay toggle button */}
            <button
              onClick={() => setOverlayVisible(!overlayVisible)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                overlayVisible
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
              }`}
              title="Alternar Overlay Flutuante na tela"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Overlay na Tela:</span>
              <span className="font-bold">{overlayVisible ? 'Ligada' : 'Desligada'}</span>
            </button>

            {/* Shift start/stop button */}
            <button
              onClick={onToggleShift}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-md ${
                activeShift
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
              }`}
            >
              {activeShift ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Encerrar Turno</span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-rose-700/60 text-[11px]">
                    R$ {activeShift.totalGrossRevenue.toFixed(2)}
                  </span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Iniciar Turno</span>
                </>
              )}
            </button>

            {/* Permissions / Onboarding link */}
            <button
              onClick={openOnboarding}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
              title="Diagnóstico de Permissões Android"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-1 pt-1 pb-2 border-t border-slate-800/60 text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-slate-800 text-emerald-400 font-semibold shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Activity className="w-4 h-4" />
            Painel do Motorista
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'simulator'
                ? 'bg-slate-800 text-emerald-400 font-semibold shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Car className="w-4 h-4" />
            Simulador de Ofertas (Uber / 99)
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'reports'
                ? 'bg-slate-800 text-emerald-400 font-semibold shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Relatórios & CSV
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'settings'
                ? 'bg-slate-800 text-emerald-400 font-semibold shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Configurações do Veículo
          </button>

          <button
            onClick={() => setActiveTab('android')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'android'
                ? 'bg-gradient-to-r from-blue-900/60 to-indigo-900/60 text-blue-300 font-semibold border border-blue-700/50'
                : 'text-blue-400/80 hover:text-blue-300 hover:bg-blue-950/30'
            }`}
          >
            <Code2 className="w-4 h-4 text-blue-400" />
            <span>Código Nativo Android</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
              73 Arquivos
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
