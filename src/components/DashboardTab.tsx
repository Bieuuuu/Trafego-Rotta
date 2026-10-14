import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Fuel, 
  MapPin, 
  Clock, 
  Percent, 
  Play, 
  Square, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  ArrowUpRight,
  Filter,
  Car
} from 'lucide-react';
import { DecisionResult, RideRecord, Shift, VehicleConfig } from '../types/rotametric';

interface DashboardTabProps {
  activeShift: Shift | null;
  onToggleShift: () => void;
  rides: RideRecord[];
  vehicleConfig: VehicleConfig;
  onSelectRideForSim: (record: RideRecord) => void;
  onOpenManualModal: () => void;
  goToSimulator: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  activeShift,
  onToggleShift,
  rides,
  vehicleConfig,
  onSelectRideForSim,
  onOpenManualModal,
  goToSimulator,
}) => {
  const [platformFilter, setPlatformFilter] = useState<'ALL' | 'UBER' | 'NINETY_NINE'>('ALL');

  // Filtered rides
  const filteredRides = rides.filter(r => {
    if (platformFilter === 'ALL') return true;
    return r.source === platformFilter;
  });

  // Calculate quick stats from active shift or all rides today
  const totalGross = activeShift ? activeShift.totalGrossRevenue : rides.reduce((acc, r) => acc + (r.manualDecision === 'ACCEPTED' ? r.offeredValue : 0), 0);
  const totalNet = activeShift ? activeShift.totalEstimatedNetProfit : rides.reduce((acc, r) => acc + (r.manualDecision === 'ACCEPTED' ? r.netProfit : 0), 0);
  const totalFuel = activeShift ? activeShift.totalFuelCost : rides.reduce((acc, r) => acc + (r.manualDecision === 'ACCEPTED' ? r.fuelCost : 0), 0);
  const totalDist = activeShift ? activeShift.totalDistanceKm : rides.reduce((acc, r) => acc + (r.manualDecision === 'ACCEPTED' ? r.totalDistanceKm : 0), 0);
  const totalMins = activeShift ? activeShift.totalTimeMinutes : rides.reduce((acc, r) => acc + (r.manualDecision === 'ACCEPTED' ? r.totalTimeMinutes : 0), 0);

  const acceptedCount = rides.filter(r => r.manualDecision === 'ACCEPTED').length;
  const rejectedCount = rides.filter(r => r.manualDecision === 'REJECTED').length;
  const totalEvaluated = acceptedCount + rejectedCount;
  const acceptanceRate = totalEvaluated > 0 ? Math.round((acceptedCount / totalEvaluated) * 100) : 0;

  const avgPerKm = totalDist > 0 ? totalGross / totalDist : 0;
  const avgPerHour = totalMins > 0 ? (totalGross / (totalMins / 60)) : 0;

  return (
    <div className="space-y-6">
      {/* Shift status hero card */}
      <div className={`p-5 rounded-2xl border transition-all ${
        activeShift 
          ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border-emerald-500/40 shadow-lg shadow-emerald-950/30' 
          : 'bg-slate-900/80 border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              activeShift ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
            }`}>
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  {activeShift ? 'Turno em Andamento' : 'Turno Desconectado'}
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  activeShift ? 'bg-emerald-500/20 text-emerald-400 animate-pulse' : 'bg-slate-800 text-slate-400'
                }`}>
                  {activeShift ? '● Gravando Métricas' : '○ Em Espera'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeShift 
                  ? `${activeShift.notes || 'Monitorando acessibilidade dos apps Uber e 99'}`
                  : 'Inicie seu turno para começar a acumular faturamento, custos e estatísticas.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onOpenManualModal}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              Lançar Corrida
            </button>

            <button
              onClick={onToggleShift}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                activeShift
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              }`}
            >
              {activeShift ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  Encerrar Turno
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  Iniciar Turno Agora
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Gross Revenue */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] uppercase font-semibold">Faturamento Bruto</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-white">
            R$ {totalGross.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {acceptedCount} corridas aceitas
          </span>
        </div>

        {/* Net Profit */}
        <div className="p-4 rounded-xl bg-slate-900 border border-emerald-900/50 hover:border-emerald-700/60 transition-colors shadow-sm shadow-emerald-950/20">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] uppercase font-semibold text-emerald-400">Lucro Líquido Real</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-300">
            R$ {totalNet.toFixed(2)}
          </div>
          <span className="text-[10px] text-emerald-500/80 mt-1 block">
            Livre no bolso
          </span>
        </div>

        {/* Fuel Cost */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] uppercase font-semibold">Gasto Combustível</span>
            <Fuel className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400">
            R$ {totalFuel.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            @{vehicleConfig.consumptionKmPerLiter} km/L • R${vehicleConfig.fuelPricePerLiter}/L
          </span>
        </div>

        {/* Average R$/km */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] uppercase font-semibold">Média R$ / km</span>
            <MapPin className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-black text-white">
            R$ {avgPerKm.toFixed(2)}
          </div>
          <span className={`text-[10px] mt-1 block ${avgPerKm >= vehicleConfig.minValuePerKm ? 'text-emerald-400' : 'text-amber-400'}`}>
            Meta: R$ {vehicleConfig.minValuePerKm.toFixed(2)}/km
          </span>
        </div>

        {/* Average R$/hour */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] uppercase font-semibold">Média R$ / hora</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-black text-white">
            R$ {avgPerHour.toFixed(2)}
          </div>
          <span className={`text-[10px] mt-1 block ${avgPerHour >= vehicleConfig.minValuePerHour ? 'text-emerald-400' : 'text-amber-400'}`}>
            Meta: R$ {vehicleConfig.minValuePerHour.toFixed(2)}/h
          </span>
        </div>

        {/* Acceptance Rate */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] uppercase font-semibold">Taxa de Aceite</span>
            <Percent className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-white">
            {acceptanceRate}%
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {rejectedCount} recusadas evitadas
          </span>
        </div>
      </div>

      {/* Simulator Quick Action Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900 border border-blue-800/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <div>
            <h4 className="text-sm font-bold text-white">Quer testar uma oferta de corrida agora?</h4>
            <p className="text-xs text-slate-400">
              Experimente simular chamadas da Uber ou 99 no celular virtual com a Overlay Flutuante ativa.
            </p>
          </div>
        </div>
        <button
          onClick={goToSimulator}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30"
        >
          <span>Abrir Simulador</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Recent Rides Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white">Ofertas Analisadas Recentemente</h3>
            <p className="text-xs text-slate-400">
              Registros capturados pelo serviço de acessibilidade do RotaMetric
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setPlatformFilter('ALL')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                platformFilter === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Todas ({rides.length})
            </button>
            <button
              onClick={() => setPlatformFilter('UBER')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                platformFilter === 'UBER' ? 'bg-black text-white border border-slate-700' : 'text-slate-400 hover:text-white'
              }`}
            >
              Uber ({rides.filter(r => r.source === 'UBER').length})
            </button>
            <button
              onClick={() => setPlatformFilter('NINETY_NINE')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                platformFilter === 'NINETY_NINE' ? 'bg-amber-400 text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              99 ({rides.filter(r => r.source === 'NINETY_NINE').length})
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Plataforma</th>
                <th className="px-4 py-3">Valor da Corrida</th>
                <th className="px-4 py-3">Distância / Tempo</th>
                <th className="px-4 py-3">R$ / km</th>
                <th className="px-4 py-3">Combustível</th>
                <th className="px-4 py-3">Lucro Líquido</th>
                <th className="px-4 py-3">Semáforo</th>
                <th className="px-4 py-3">Decisão</th>
                <th className="px-4 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRides.map((ride) => {
                const isAccept = ride.manualDecision === 'ACCEPTED';
                const isReject = ride.manualDecision === 'REJECTED';

                return (
                  <tr key={ride.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Platform */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        ride.source === 'UBER' ? 'bg-black text-white border border-slate-700' : 'bg-amber-400 text-black'
                      }`}>
                        {ride.source === 'UBER' ? 'Uber' : '99'}
                      </span>
                    </td>

                    {/* Gross Value */}
                    <td className="px-4 py-3.5 font-bold text-white text-sm whitespace-nowrap">
                      R$ {ride.offeredValue.toFixed(2)}
                    </td>

                    {/* Distance / Time */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-slate-300">
                      <div>{ride.totalDistanceKm} km</div>
                      <div className="text-[10px] text-slate-500">{ride.totalTimeMinutes} minutos</div>
                    </td>

                    {/* Value per km */}
                    <td className="px-4 py-3.5 whitespace-nowrap font-semibold text-cyan-300">
                      R$ {ride.valuePerKm.toFixed(2)}
                      <span className="text-[10px] text-slate-500 block">
                        R$ {ride.valuePerHour.toFixed(2)}/h
                      </span>
                    </td>

                    {/* Fuel */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-amber-400 font-medium">
                      -R$ {ride.fuelCost.toFixed(2)}
                    </td>

                    {/* Net profit */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`font-black ${ride.netProfit > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        R$ {ride.netProfit.toFixed(2)}
                      </span>
                    </td>

                    {/* Semaphore */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {ride.level === 'EXCELLENT' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          🟢 Excelente
                        </span>
                      )}
                      {ride.level === 'ATTENTION' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          🟡 Atenção
                        </span>
                      )}
                      {ride.level === 'LOSS' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          🔴 Prejuízo
                        </span>
                      )}
                    </td>

                    {/* Decision */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {isAccept && (
                        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Aceita
                        </span>
                      )}
                      {isReject && (
                        <span className="flex items-center gap-1 text-rose-400 font-semibold">
                          <XCircle className="w-3.5 h-3.5" /> Recusada
                        </span>
                      )}
                      {!isAccept && !isReject && (
                        <span className="text-slate-500">Pendente</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => onSelectRideForSim(ride)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] transition-colors"
                      >
                        Ver no Simulador
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
