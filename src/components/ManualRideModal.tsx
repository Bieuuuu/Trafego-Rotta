import React, { useState } from 'react';
import { X, Plus, DollarSign, MapPin, Clock, Check, Car } from 'lucide-react';
import { AppSource, DecisionResult, RideOffer, VehicleConfig } from '../types/rotametric';
import { ProfitEngine } from '../core/profitEngine';

interface ManualRideModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleConfig: VehicleConfig;
  onSaveRide: (decision: DecisionResult, manualChoice: 'ACCEPTED' | 'REJECTED') => void;
}

export const ManualRideModal: React.FC<ManualRideModalProps> = ({
  isOpen,
  onClose,
  vehicleConfig,
  onSaveRide,
}) => {
  const [source, setSource] = useState<AppSource>('UBER');
  const [value, setValue] = useState('28.50');
  const [pickupDist, setPickupDist] = useState('1.5');
  const [tripDist, setTripDist] = useState('7.0');
  const [pickupTime, setPickupTime] = useState('4');
  const [tripTime, setTripTime] = useState('18');
  const [decisionChoice, setDecisionChoice] = useState<'ACCEPTED' | 'REJECTED'>('ACCEPTED');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const offer: RideOffer = {
      id: 'manual_' + Date.now(),
      source,
      offeredValue: parseFloat(value) || 0,
      pickupDistanceKm: parseFloat(pickupDist) || 0,
      tripDistanceKm: parseFloat(tripDist) || 0,
      pickupTimeMinutes: parseInt(pickupTime, 10) || 0,
      tripTimeMinutes: parseInt(tripTime, 10) || 0,
      detectedAt: Date.now(),
      rawText: `Lançamento manual: ${source} R$ ${value}`,
    };

    const decision = ProfitEngine.calculate(offer, vehicleConfig);
    onSaveRide(decision, decisionChoice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-400" />
            Lançar Corrida Manualmente
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Platform selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Plataforma:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSource('UBER')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors ${
                  source === 'UBER' ? 'bg-black text-white border-2 border-slate-600' : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                Uber Driver
              </button>
              <button
                type="button"
                onClick={() => setSource('NINETY_NINE')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors ${
                  source === 'NINETY_NINE' ? 'bg-amber-400 text-black border-2 border-amber-500' : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                99 Motorista
              </button>
            </div>
          </div>

          {/* Value */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Valor Bruto Ofertado (R$):</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-bold">R$</span>
              <input
                type="number"
                step="0.10"
                min="1"
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Distances */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Busca (km):</label>
              <input
                type="number"
                step="0.1"
                min="0"
                required
                value={pickupDist}
                onChange={(e) => setPickupDist(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Viagem (km):</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={tripDist}
                onChange={(e) => setTripDist(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Times */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Tempo Busca (min):</label>
              <input
                type="number"
                min="0"
                required
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Tempo Viagem (min):</label>
              <input
                type="number"
                min="1"
                required
                value={tripTime}
                onChange={(e) => setTripTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Result Action Choice */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-slate-300">Decisão do Motorista:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDecisionChoice('ACCEPTED')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors ${
                  decisionChoice === 'ACCEPTED' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                ✓ Corrida Aceita
              </button>
              <button
                type="button"
                onClick={() => setDecisionChoice('REJECTED')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors ${
                  decisionChoice === 'REJECTED' ? 'bg-rose-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                ✗ Corrida Recusada
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all mt-2"
          >
            Gravar Corrida no Histórico
          </button>
        </form>
      </div>
    </div>
  );
};
