import React, { useState } from 'react';
import { 
  Car, 
  Smartphone, 
  Sparkles, 
  Check, 
  X, 
  Navigation, 
  Clock, 
  DollarSign, 
  Fuel, 
  HelpCircle, 
  Play, 
  RefreshCw,
  Terminal,
  SendHorizontal
} from 'lucide-react';
import { DecisionResult, RideOffer, VehicleConfig } from '../types/rotametric';
import { RIDE_PRESETS, RidePreset } from '../data/initialData';
import { ParserEngine } from '../core/parserEngine';
import { ProfitEngine } from '../core/profitEngine';

interface SimulatorTabProps {
  vehicleConfig: VehicleConfig;
  onSendToOverlay: (decision: DecisionResult) => void;
  onRecordDecision: (type: 'ACCEPTED' | 'REJECTED', decision: DecisionResult) => void;
}

export const SimulatorTab: React.FC<SimulatorTabProps> = ({
  vehicleConfig,
  onSendToOverlay,
  onRecordDecision,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(RIDE_PRESETS[0].id);
  const [customText, setCustomText] = useState<string>(RIDE_PRESETS[0].rawText);
  const [sourcePlatform, setSourcePlatform] = useState<'UBER' | 'NINETY_NINE'>('UBER');

  // Parse current text
  const parseResult = ParserEngine.parseOfferText(customText, sourcePlatform);
  const currentOffer: RideOffer = parseResult.success && parseResult.offer ? parseResult.offer : {
    id: 'sim_default',
    source: sourcePlatform,
    offeredValue: 24.50,
    pickupDistanceKm: 1.5,
    tripDistanceKm: 6.0,
    pickupTimeMinutes: 4,
    tripTimeMinutes: 16,
    detectedAt: Date.now(),
    rawText: customText,
  };

  const decision: DecisionResult = ProfitEngine.calculate(currentOffer, vehicleConfig);

  const handleSelectPreset = (preset: RidePreset) => {
    setSelectedPresetId(preset.id);
    setCustomText(preset.rawText);
    setSourcePlatform(preset.source);
  };

  const handleTriggerSim = () => {
    onSendToOverlay(decision);
  };

  const isUber = currentOffer.source === 'UBER';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            Simulador de Ofertas de Chamada em Tempo Real
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Teste como o <strong>AccessibilityService</strong> do RotaMetric lê as telas oficiais da Uber e 99 e aciona a overlay flutuante.
          </p>
        </div>

        <button
          onClick={handleTriggerSim}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
        >
          <SendHorizontal className="w-4 h-4" />
          <span>Disparar Oferta para Overlay</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Controls & Presets (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Preset Buttons */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              1. Selecione um Cenário Pré-configurado de Corrida:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {RIDE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-left p-3 rounded-xl border text-xs transition-all ${
                    selectedPresetId === preset.id
                      ? 'bg-slate-800 border-emerald-500/60 shadow-md shadow-emerald-950/40 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="font-bold text-slate-200 flex items-center justify-between">
                    <span>{preset.title}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-black uppercase ${
                      preset.source === 'UBER' ? 'bg-black text-white' : 'bg-amber-400 text-black'
                    }`}>
                      {preset.source === 'UBER' ? 'Uber' : '99'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {preset.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Textarea for accessibility nodes text */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                2. Texto Bruto Detectado na Tela (AccessibilityNodeInfo):
              </label>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Plataforma:</span>
                <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800">
                  <button
                    onClick={() => setSourcePlatform('UBER')}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      sourcePlatform === 'UBER' ? 'bg-black text-white' : 'text-slate-400'
                    }`}
                  >
                    Uber
                  </button>
                  <button
                    onClick={() => setSourcePlatform('NINETY_NINE')}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      sourcePlatform === 'NINETY_NINE' ? 'bg-amber-400 text-black' : 'text-slate-400'
                    }`}
                  >
                    99
                  </button>
                </div>
              </div>
            </div>

            <textarea
              value={customText}
              onChange={(e) => {
                setCustomText(e.target.value);
                setSelectedPresetId('custom');
              }}
              rows={3}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono focus:border-emerald-500 focus:outline-none"
              placeholder="Exemplo: UberX R$ 28,50 • 1,4 km (4 min) • Viagem 8,2 km (18 min)"
            />

            {/* Parser logs */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center justify-between text-slate-300 font-semibold mb-1">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  Diagnóstico do Parser RotaMetric:
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  parseResult.confidence >= 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {parseResult.confidence}% Confiança
                </span>
              </div>
              {parseResult.logs.slice(-3).map((l, idx) => (
                <div key={idx} className="text-slate-500">
                  › {l}
                </div>
              ))}
            </div>
          </div>

          {/* Economics breakdown */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              3. Resultado da Análise Financeira (ProfitEngine)
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Distância Total</span>
                <span className="text-sm font-bold text-white">{decision.totalDistanceKm} km</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Tempo Total</span>
                <span className="text-sm font-bold text-white">{decision.totalTimeMinutes} min</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Gasto Gasolina</span>
                <span className="text-sm font-bold text-amber-400">-R$ {decision.fuelCost.toFixed(2)}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Lucro Líquido</span>
                <span className={`text-sm font-black ${decision.netProfit > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  R$ {decision.netProfit.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Classificação:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                  decision.level === 'EXCELLENT' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                  decision.level === 'ATTENTION' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                  'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}>
                  {decision.level === 'EXCELLENT' ? '🟢 EXCELENTE' : decision.level === 'ATTENTION' ? '🟡 ATENÇÃO' : '🔴 PREJUÍZO'}
                </span>
              </div>

              <div className="text-xs text-slate-300 font-medium">
                R$ {decision.valuePerKm.toFixed(2)}/km • R$ {decision.valuePerHour.toFixed(2)}/h
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Realistic Phone Simulation (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-[320px] sm:w-[350px] rounded-[40px] bg-slate-950 p-3 shadow-2xl border-4 border-slate-800 shadow-black relative overflow-hidden">
            {/* Top Phone Notch / Speaker */}
            <div className="w-32 h-4 bg-slate-900 rounded-b-xl mx-auto mb-2 flex items-center justify-center">
              <div className="w-10 h-1 bg-slate-700 rounded-full"></div>
            </div>

            {/* Screen Area */}
            <div className="w-full h-[580px] rounded-[28px] bg-slate-900 overflow-hidden relative flex flex-col justify-between border border-slate-800">
              {/* Map background simulation */}
              <div className="absolute inset-0 bg-[#12161f] opacity-80 pointer-events-none">
                <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 0 50 Q 150 120 350 80" stroke="#38bdf8" strokeWidth="4" fill="transparent" />
                  <path d="M 30 180 Q 200 150 320 280" stroke="#a855f7" strokeWidth="3" fill="transparent" />
                  <path d="M 120 0 L 140 580" stroke="#64748b" strokeWidth="2" fill="transparent" />
                  <path d="M 240 0 L 220 580" stroke="#64748b" strokeWidth="1.5" fill="transparent" />
                  <circle cx="160" cy="220" r="8" fill="#10b981" />
                </svg>
                {/* Floating GPS car icon */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/40 animate-pulse">
                  <Navigation className="w-4 h-4 text-cyan-300" />
                </div>
              </div>

              {/* Status Bar */}
              <div className="relative z-10 px-4 pt-2 flex items-center justify-between text-[11px] text-slate-300 font-bold bg-gradient-to-b from-slate-950/80 to-transparent">
                <span>14:35</span>
                <div className="flex items-center gap-1.5">
                  <span>5G</span>
                  <div className="w-5 h-2.5 rounded-sm border border-slate-300 p-0.5 flex items-center">
                    <div className="h-full w-4 bg-emerald-400 rounded-xs"></div>
                  </div>
                </div>
              </div>

              {/* RotaMetric FLOATING OVERLAY PREVIEW on top of map */}
              <div className="relative z-20 mx-3 my-2">
                <div className="rounded-xl bg-slate-950/95 border-2 border-emerald-500/80 p-3 text-white shadow-2xl backdrop-blur-md">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span className="text-[10px] uppercase font-black tracking-wider text-emerald-400">
                        Overlay RotaMetric
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      decision.level === 'EXCELLENT' ? 'bg-emerald-600 text-white' :
                      decision.level === 'ATTENTION' ? 'bg-amber-600 text-white' :
                      'bg-rose-600 text-white'
                    }`}>
                      {decision.level === 'EXCELLENT' ? '🟢 EXCELENTE' : decision.level === 'ATTENTION' ? '🟡 ATENÇÃO' : '🔴 PREJUÍZO'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-900/90 p-2 rounded-lg mb-2">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block">R$ / km</span>
                      <span className="text-sm font-black text-cyan-300">R$ {decision.valuePerKm.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block">R$ / hora</span>
                      <span className="text-sm font-black text-emerald-300">R$ {decision.valuePerHour.toFixed(2)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 uppercase block">Lucro Líq.</span>
                      <span className="text-sm font-black text-emerald-400">R$ {decision.netProfit.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      onClick={() => onRecordDecision('ACCEPTED', decision)}
                      className="py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold text-center transition-colors shadow-md"
                    >
                      ✓ Aceitar
                    </button>
                    <button
                      onClick={() => onRecordDecision('REJECTED', decision)}
                      className="py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold text-center transition-colors shadow-md"
                    >
                      ✗ Recusar
                    </button>
                  </div>
                </div>
              </div>

              {/* MOCK OFFICIAL DRIVER CARD (Uber / 99) */}
              <div className="relative z-10 p-3 bg-white text-slate-900 rounded-t-3xl shadow-2xl">
                {/* Platform Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-black uppercase ${
                    isUber ? 'bg-black text-white' : 'bg-amber-400 text-black'
                  }`}>
                    {isUber ? 'UberX' : '99Pop'}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    {currentOffer.pickupTimeMinutes} min até o embarque
                  </span>
                </div>

                {/* Big Offer Value */}
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-2xl font-black text-slate-950">
                      R$ {currentOffer.offeredValue.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">estimado</span>
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    {(currentOffer.pickupDistanceKm + currentOffer.tripDistanceKm).toFixed(1)} km total
                  </span>
                </div>

                {/* Ride Details Route */}
                <div className="space-y-2 text-xs text-slate-700 bg-slate-100 p-2.5 rounded-xl mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span>Embarque: {currentOffer.pickupDistanceKm} km ({currentOffer.pickupTimeMinutes} min)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>Viagem: {currentOffer.tripDistanceKm} km ({currentOffer.tripTimeMinutes} min)</span>
                  </div>
                </div>

                {/* Official Acceptance Button (Simulated) */}
                <div className="w-full py-2.5 bg-black text-white text-center font-bold text-xs rounded-xl shadow-md">
                  Toque para aceitar (App Oficial)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
