import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Check, 
  X, 
  Car, 
  DollarSign, 
  Fuel, 
  Clock, 
  Navigation, 
  GripHorizontal,
  SlidersHorizontal,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { DecisionResult, Shift, ManualDecision } from '../types/rotametric';

interface OverlayWidgetProps {
  currentDecision: DecisionResult | null;
  activeShift: Shift | null;
  onRecordDecision: (decision: ManualDecision, result: DecisionResult) => void;
  onDismissOffer: () => void;
  onOpenManualModal?: () => void;
  visible: boolean;
}

export const OverlayWidget: React.FC<OverlayWidgetProps> = ({
  currentDecision,
  activeShift,
  onRecordDecision,
  onDismissOffer,
  onOpenManualModal,
  visible,
}) => {
  const [mode, setMode] = useState<'pill' | 'card'>('pill');
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 24, y: 120 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
  });

  // Whenever a new decision arrives, automatically open the card mode!
  useEffect(() => {
    if (currentDecision) {
      setMode('card');
    }
  }, [currentDecision]);

  if (!visible) return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag from handle or pill
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: position.x,
      startY: position.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.mouseX;
    const dy = e.clientY - dragStartRef.current.mouseY;
    
    // Bounds check
    const maxX = window.innerWidth - 320;
    const maxY = window.innerHeight - 150;
    const newX = Math.max(10, Math.min(maxX, dragStartRef.current.startX + dx));
    const newY = Math.max(70, Math.min(maxY, dragStartRef.current.startY + dy));
    
    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (_e) {}
  };

  const getSemaphoreColor = (level: string) => {
    switch (level) {
      case 'EXCELLENT':
        return {
          bg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
          dot: 'bg-emerald-500',
          badge: 'bg-emerald-600 text-white',
          label: '🟢 EXCELENTE',
        };
      case 'ATTENTION':
        return {
          bg: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
          dot: 'bg-amber-500',
          badge: 'bg-amber-600 text-white',
          label: '🟡 ATENÇÃO',
        };
      case 'LOSS':
      default:
        return {
          bg: 'bg-rose-500/20 border-rose-500/40 text-rose-400',
          dot: 'bg-rose-500',
          badge: 'bg-rose-600 text-white',
          label: '🔴 PREJUÍZO',
        };
    }
  };

  const currentLevelInfo = currentDecision ? getSemaphoreColor(currentDecision.level) : null;

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999,
        touchAction: 'none',
      }}
      className="select-none transition-shadow"
    >
      {/* MODE 1: COMPACT PILL */}
      {mode === 'pill' ? (
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/95 border border-emerald-500/40 text-white shadow-2xl backdrop-blur-xl cursor-grab active:cursor-grabbing hover:border-emerald-400 transition-all hover:scale-105"
        >
          <GripHorizontal className="w-3.5 h-3.5 text-slate-400" />
          
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Faturamento
              </span>
              <span className="text-sm font-extrabold text-emerald-300 leading-none">
                R$ {activeShift ? activeShift.totalGrossRevenue.toFixed(2) : '0,00'}
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-700/80 mx-1"></div>

          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="font-semibold text-emerald-400">
              {activeShift ? activeShift.totalRidesAccepted : 0}✓
            </span>
            <span className="text-slate-500">/</span>
            <span className="font-semibold text-rose-400">
              {activeShift ? activeShift.totalRidesRejected : 0}✗
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setMode('card');
            }}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-300 ml-1"
            title="Expandir Card RotaMetric"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* MODE 2: EXPANDED CARD OVERLAY */
        <div className="w-80 sm:w-96 rounded-2xl bg-slate-950/95 border-2 border-slate-700 text-white shadow-2xl shadow-black/80 backdrop-blur-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
          {/* Card Drag Bar & Header */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center gap-2">
              <GripHorizontal className="w-4 h-4 text-slate-400" />
              <span className="font-bold text-xs uppercase tracking-wider text-slate-300">
                Overlay Copiloto RotaMetric
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMode('pill')}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                title="Minimizar para Pílula"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  onDismissOffer();
                  setMode('pill');
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                title="Fechar Card"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Decision Body */}
          {currentDecision ? (
            <div className="p-4 space-y-3.5">
              {/* Platform & Classification Row */}
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-black tracking-wide uppercase ${
                    currentDecision.offer.source === 'UBER'
                      ? 'bg-black text-white border border-slate-700'
                      : 'bg-amber-400 text-black font-black'
                  }`}
                >
                  {currentDecision.offer.source === 'UBER' ? 'Uber Driver' : '99 Motorista'}
                </span>

                {currentLevelInfo && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black tracking-wide border shadow-sm ${currentLevelInfo.bg}`}
                  >
                    {currentLevelInfo.label}
                  </span>
                )}
              </div>

              {/* Main Financial Values */}
              <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase block">
                    Valor da Oferta
                  </span>
                  <span className="text-2xl font-black text-white tracking-tight">
                    R$ {currentDecision.grossValue.toFixed(2)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase block">
                    Lucro Líq. Estimado
                  </span>
                  <span
                    className={`text-2xl font-black tracking-tight ${
                      currentDecision.netProfit > 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    R$ {currentDecision.netProfit.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Distances & Times Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Distância Total</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    {currentDecision.totalDistanceKm} km
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Busca: {currentDecision.offer.pickupDistanceKm} km • Viagem: {currentDecision.offer.tripDistanceKm} km
                  </div>
                </div>

                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tempo Total</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    {currentDecision.totalTimeMinutes} min
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Busca: {currentDecision.offer.pickupTimeMinutes}m • Viagem: {currentDecision.offer.tripTimeMinutes}m
                  </div>
                </div>
              </div>

              {/* Economic Indicators */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">R$ / km</span>
                  <span className="font-black text-sm text-cyan-300">
                    R$ {currentDecision.valuePerKm.toFixed(2)}
                  </span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">R$ / hora</span>
                  <span className="font-black text-sm text-emerald-300">
                    R$ {currentDecision.valuePerHour.toFixed(2)}
                  </span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">Combustível</span>
                  <span className="font-black text-sm text-amber-300">
                    -R$ {currentDecision.fuelCost.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Reason note */}
              {currentDecision.reasons.length > 0 && (
                <div className="text-[11px] bg-slate-900/70 p-2 rounded border border-slate-800/80 text-slate-300 leading-snug">
                  💡 {currentDecision.reasons[0]}
                </div>
              )}

              {/* Manual Action Buttons (No auto-click, Play Store compliant!) */}
              <div className="pt-1 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onRecordDecision('ACCEPTED', currentDecision);
                    setMode('pill');
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-lg shadow-emerald-600/30"
                >
                  <Check className="w-4 h-4" />
                  Marcar Aceita
                </button>
                <button
                  onClick={() => {
                    onRecordDecision('REJECTED', currentDecision);
                    setMode('pill');
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-lg shadow-rose-600/20"
                >
                  <X className="w-4 h-4" />
                  Marcar Recusada
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 space-y-2">
              <p className="text-sm font-medium">Nenhuma oferta na tela no momento.</p>
              <p className="text-xs text-slate-500">
                O serviço de acessibilidade está monitorando chamadas da Uber e 99 em tempo real.
              </p>
              {onOpenManualModal && (
                <button
                  onClick={onOpenManualModal}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Inserir Oferta Manualmente
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
