import React from 'react';
import { 
  Download, 
  BarChart3, 
  Calendar, 
  TrendingUp, 
  Fuel, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle,
  FileSpreadsheet
} from 'lucide-react';
import { RideRecord, Shift, VehicleConfig } from '../types/rotametric';

interface ReportsTabProps {
  shifts: Shift[];
  rides: RideRecord[];
  vehicleConfig: VehicleConfig;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({
  shifts,
  rides,
  vehicleConfig,
}) => {
  // Export CSV
  const handleExportCsv = () => {
    const headers = [
      'ID',
      'Data/Hora',
      'Plataforma',
      'Valor_Bruto_BRL',
      'Distancia_Total_KM',
      'Tempo_Total_MIN',
      'Custo_Combustivel_BRL',
      'Lucro_Liquido_BRL',
      'R_Por_KM',
      'R_Por_Hora',
      'Semaforo',
      'Decisao_Motorista',
      'Confianca_Parser'
    ];

    const rows = rides.map(r => [
      r.id,
      new Date(r.detectedAt).toLocaleString('pt-BR'),
      r.source === 'UBER' ? 'Uber' : '99',
      r.offeredValue.toFixed(2),
      r.totalDistanceKm.toFixed(2),
      r.totalTimeMinutes,
      r.fuelCost.toFixed(2),
      r.netProfit.toFixed(2),
      r.valuePerKm.toFixed(2),
      r.valuePerHour.toFixed(2),
      r.level,
      r.manualDecision,
      `${r.confidenceScore}%`
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.join(';'))
    ].join('\r\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = `rotametric_relatorio_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalAcceptedRides = rides.filter(r => r.manualDecision === 'ACCEPTED');
  const totalRejectedRides = rides.filter(r => r.manualDecision === 'REJECTED');

  const totalRevenue = totalAcceptedRides.reduce((acc, r) => acc + r.offeredValue, 0);
  const totalProfit = totalAcceptedRides.reduce((acc, r) => acc + r.netProfit, 0);
  const totalFuel = totalAcceptedRides.reduce((acc, r) => acc + r.fuelCost, 0);
  const totalKm = totalAcceptedRides.reduce((acc, r) => acc + r.totalDistanceKm, 0);
  const totalMins = totalAcceptedRides.reduce((acc, r) => acc + r.totalTimeMinutes, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & Export CSV button */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            Relatórios Financeiros & Exportação de Turnos
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Demonstrativo de faturamento real, despesas com combustível e rentabilidade líquida por km e hora.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Exportar Planilha CSV</span>
        </button>
      </div>

      {/* Aggregate Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Faturamento Bruto Acumulado</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">
            R$ {totalRevenue.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Em {totalAcceptedRides.length} corridas realizadas
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-emerald-900/60">
          <div className="flex items-center justify-between text-emerald-400 text-xs mb-1 font-semibold">
            <span>Lucro Líquido Real</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            R$ {totalProfit.toFixed(2)}
          </div>
          <p className="text-[11px] text-emerald-500/80 mt-1">
            Margem líquida de {totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0}%
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Combustível Consumido</span>
            <Fuel className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            R$ {totalFuel.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {totalKm > 0 ? (totalKm / vehicleConfig.consumptionKmPerLiter).toFixed(1) : '0'} Litros estimados
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Taxa de Aproveitamento</span>
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300">
            {rides.length > 0 ? Math.round((totalAcceptedRides.length / rides.length) * 100) : 0}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {totalRejectedRides.length} corridas ruins recusadas
          </p>
        </div>
      </div>

      {/* Shifts History Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            Histórico de Turnos Fechados
          </h3>
          <p className="text-xs text-slate-400">
            Cada sessão de trabalho gravada com métricas totais consolidadas
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Turno</th>
                <th className="px-4 py-3">Início</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Corridas (Aceitas / Rec.)</th>
                <th className="px-4 py-3">KM Total</th>
                <th className="px-4 py-3">Faturamento</th>
                <th className="px-4 py-3">Combustível</th>
                <th className="px-4 py-3">Lucro Líquido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {shifts.map((s, idx) => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-bold text-white whitespace-nowrap">
                    Turno #{shifts.length - idx}
                  </td>
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                    {new Date(s.startTimestamp).toLocaleString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      s.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {s.isActive ? 'Em Aberto' : 'Encerrado'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300 whitespace-nowrap font-medium">
                    <span className="text-emerald-400">{s.totalRidesAccepted} aceitas</span> / <span className="text-rose-400">{s.totalRidesRejected} rec.</span>
                  </td>
                  <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                    {s.totalDistanceKm} km ({Math.round(s.totalTimeMinutes / 60)}h)
                  </td>
                  <td className="px-4 py-3 font-bold text-white whitespace-nowrap">
                    R$ {s.totalGrossRevenue.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-amber-400 whitespace-nowrap">
                    -R$ {s.totalFuelCost.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 font-black text-emerald-400 whitespace-nowrap">
                    R$ {s.totalEstimatedNetProfit.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
