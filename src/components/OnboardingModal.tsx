import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  Layers, 
  Eye, 
  BatteryCharging, 
  Bell, 
  Smartphone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PermissionStatus } from '../types/rotametric';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [permissions, setPermissions] = useState<PermissionStatus>({
    accessibilityEnabled: true,
    overlayGranted: true,
    notificationsGranted: true,
    batteryOptimizationIgnored: true,
    uberInstalled: true,
    ninetyNineInstalled: true,
    overlayServiceRunning: true,
  });

  if (!isOpen) return null;

  const togglePermission = (key: keyof PermissionStatus) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Diagnóstico de Permissões & Termos Android
              </h3>
              <p className="text-xs text-slate-400">
                Conformidade com as políticas do Google Play e Android 14/15
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Prominent Disclosure Notice */}
          <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200 space-y-1.5">
            <div className="font-bold text-blue-300 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-cyan-400" />
              Declaração Proeminente de Uso do AccessibilityService
            </div>
            <p className="text-[11px] text-blue-200/80 leading-relaxed">
              O <strong>RotaMetric</strong> utiliza a API de Acessibilidade do Android exclusivamente para ler dados operacionais das chamadas exibidas na tela (valor da corrida, tempo e distância). O app <strong>NÃO</strong> executa cliques automáticos, <strong>NÃO</strong> acessa dados de passageiros e <strong>NÃO</strong> transmite nenhuma informação para servidores externos.
            </p>
          </div>

          <div className="space-y-3">
            {/* 1. Accessibility Service */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Serviço de Acessibilidade</h4>
                  <p className="text-[11px] text-slate-400">
                    Leitura de texto da oferta nos apps Uber Driver e 99 Motorista
                  </p>
                </div>
              </div>
              <button
                onClick={() => togglePermission('accessibilityEnabled')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  permissions.accessibilityEnabled
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}
              >
                {permissions.accessibilityEnabled ? 'Concedida ✓' : 'Pendente ✗'}
              </button>
            </div>

            {/* 2. Overlay Permission */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Sobreposição de Tela (Overlay)</h4>
                  <p className="text-[11px] text-slate-400">
                    Permite desenhar a pílula e o card financeiro por cima do mapa
                  </p>
                </div>
              </div>
              <button
                onClick={() => togglePermission('overlayGranted')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  permissions.overlayGranted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}
              >
                {permissions.overlayGranted ? 'Concedida ✓' : 'Pendente ✗'}
              </button>
            </div>

            {/* 3. Battery Optimizations */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <BatteryCharging className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Execução em Segundo Plano</h4>
                  <p className="text-[11px] text-slate-400">
                    Evita que o sistema Android encerre o app durante a rota
                  </p>
                </div>
              </div>
              <button
                onClick={() => togglePermission('batteryOptimizationIgnored')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  permissions.batteryOptimizationIgnored
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}
              >
                {permissions.batteryOptimizationIgnored ? 'Ativa ✓' : 'Otimizada ✗'}
              </button>
            </div>

            {/* 4. Monitored Apps status */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Apps Monitorados Detectados</h4>
                  <p className="text-[11px] text-slate-400">
                    Uber Driver e 99 Motorista instalados no dispositivo
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400">
                2/2 Instalados
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
          >
            Concluir Verificação
          </button>
        </div>
      </div>
    </div>
  );
};
