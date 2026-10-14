import React, { useState } from 'react';
import { 
  Sliders, 
  Fuel, 
  Car, 
  DollarSign, 
  Clock, 
  RotateCcw, 
  Save, 
  Check, 
  Info,
  ShieldAlert,
  Percent
} from 'lucide-react';
import { VehicleConfig } from '../types/rotametric';
import { DEFAULT_VEHICLE_CONFIG } from '../data/initialData';

interface SettingsTabProps {
  vehicleConfig: VehicleConfig;
  onSaveConfig: (newConfig: VehicleConfig) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  vehicleConfig,
  onSaveConfig,
}) => {
  const [formData, setFormData] = useState<VehicleConfig>(vehicleConfig);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (key: keyof VehicleConfig, value: number) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setSavedSuccess(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const applyVehiclePreset = (preset: 'gasolina' | 'etanol' | 'gnv' | 'hibrido') => {
    switch (preset) {
      case 'gasolina':
        setFormData(prev => ({
          ...prev,
          fuelPricePerLiter: 5.89,
          consumptionKmPerLiter: 11.5,
          minValuePerKm: 2.20,
        }));
        break;
      case 'etanol':
        setFormData(prev => ({
          ...prev,
          fuelPricePerLiter: 3.99,
          consumptionKmPerLiter: 8.2,
          minValuePerKm: 2.10,
        }));
        break;
      case 'gnv':
        setFormData(prev => ({
          ...prev,
          fuelPricePerLiter: 4.60,
          consumptionKmPerLiter: 14.0,
          minValuePerKm: 1.90,
        }));
        break;
      case 'hibrido':
        setFormData(prev => ({
          ...prev,
          fuelPricePerLiter: 5.89,
          consumptionKmPerLiter: 18.5,
          minValuePerKm: 2.00,
        }));
        break;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            Configurações Financeiras do Veículo & Metas
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Personalize seu custo real por quilômetro e as metas do semáforo de rentabilidade.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold animate-in fade-in">
            <Check className="w-4 h-4" />
            Salvo com sucesso!
          </div>
        )}
      </div>

      {/* Quick Fuel Presets */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Perfis Rápidos de Combustível:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => applyVehiclePreset('gasolina')}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-left text-xs transition-colors"
          >
            <span className="font-bold text-white block">Gasolina Comum</span>
            <span className="text-[11px] text-slate-400">R$ 5,89/L • 11.5 km/L</span>
          </button>
          <button
            type="button"
            onClick={() => applyVehiclePreset('etanol')}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-left text-xs transition-colors"
          >
            <span className="font-bold text-white block">Etanol (Álcool)</span>
            <span className="text-[11px] text-slate-400">R$ 3,99/L • 8.2 km/L</span>
          </button>
          <button
            type="button"
            onClick={() => applyVehiclePreset('gnv')}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-left text-xs transition-colors"
          >
            <span className="font-bold text-white block">GNV (Gás Natural)</span>
            <span className="text-[11px] text-slate-400">R$ 4,60/m³ • 14 km/m³</span>
          </button>
          <button
            type="button"
            onClick={() => applyVehiclePreset('hibrido')}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-left text-xs transition-colors"
          >
            <span className="font-bold text-white block">Híbrido / Econômico</span>
            <span className="text-[11px] text-slate-400">R$ 5,89/L • 18.5 km/L</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Preço do Combustível */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">
                Preço do Combustível (R$ / Litro)
              </label>
              <Fuel className="w-4 h-4 text-amber-400" />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-bold">R$</span>
              <input
                type="number"
                step="0.01"
                min="1.0"
                value={formData.fuelPricePerLiter}
                onChange={(e) => handleChange('fuelPricePerLiter', parseFloat(e.target.value) || 0)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm font-bold text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Valor médio pago na bomba de combustível.
            </p>
          </div>

          {/* Consumo do Veículo */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">
                Consumo Médio Urbano (km / Litro)
              </label>
              <Car className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="1.0"
                value={formData.consumptionKmPerLiter}
                onChange={(e) => handleChange('consumptionKmPerLiter', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm font-bold text-white focus:border-emerald-500 focus:outline-none"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-bold">km/L</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Média do veículo em trânsito urbano com ar condicionado ligado.
            </p>
          </div>

          {/* Meta Mínima R$ / km */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">
                Meta Mínima Desejada por KM (R$ / km)
              </label>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-bold">R$</span>
              <input
                type="number"
                step="0.05"
                min="0.5"
                value={formData.minValuePerKm}
                onChange={(e) => handleChange('minValuePerKm', parseFloat(e.target.value) || 0)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm font-bold text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Piso mínimo para acender semáforo Verde 🟢 na chamada.
            </p>
          </div>

          {/* Meta Mínima R$ / hora */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">
                Meta Mínima Desejada por Hora (R$ / h)
              </label>
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-bold">R$</span>
              <input
                type="number"
                step="1.0"
                min="10.0"
                value={formData.minValuePerHour}
                onChange={(e) => handleChange('minValuePerHour', parseFloat(e.target.value) || 0)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm font-bold text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Rentabilidade horária mínima esperada para aceitar a corrida.
            </p>
          </div>

          {/* Custo Operacional Adicional por hora */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">
                Custo de Manutenção / Depreciação (R$ / h)
              </label>
              <DollarSign className="w-4 h-4 text-rose-400" />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-bold">R$</span>
              <input
                type="number"
                step="0.5"
                min="0.0"
                value={formData.hourlyOperatingCost}
                onChange={(e) => handleChange('hourlyOperatingCost', parseFloat(e.target.value) || 0)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm font-bold text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Desgaste de pneus, óleo, seguro e limpeza rateados por hora trabalhada.
            </p>
          </div>

          {/* Margem do Semáforo Amarelo */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">
                Tolerância do Semáforo Amarelo (%)
              </label>
              <Percent className="w-4 h-4 text-amber-400" />
            </div>
            <div className="relative">
              <input
                type="number"
                step="1.0"
                min="0"
                max="50"
                value={formData.yellowMarginPercent}
                onChange={(e) => handleChange('yellowMarginPercent', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm font-bold text-white focus:border-emerald-500 focus:outline-none"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-bold">%</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Faixa de tolerância abaixo da meta classificada como 🟡 Atenção.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setFormData(DEFAULT_VEHICLE_CONFIG)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restaurar Padrões
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
          >
            <Save className="w-4 h-4" />
            Salvar Configurações
          </button>
        </div>
      </form>
    </div>
  );
};
