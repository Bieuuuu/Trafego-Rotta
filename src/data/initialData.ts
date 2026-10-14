import { RideOffer, RideRecord, Shift, VehicleConfig } from '../types/rotametric';

export const DEFAULT_VEHICLE_CONFIG: VehicleConfig = {
  fuelPricePerLiter: 5.89,     // R$ 5,89 por litro (Gasolina comum média Brasil)
  consumptionKmPerLiter: 11.2,  // 11.2 km/L no trânsito urbano
  minValuePerKm: 2.20,          // Meta mínima de R$ 2,20 por km
  minValuePerHour: 42.00,       // Meta mínima de R$ 42,00 por hora
  hourlyOperatingCost: 4.50,    // R$ 4,50/h (depreciação, pneus, óleo, manutenção)
  platformFeePercent: 0.0,      // Taxa já descontada na tela da Uber/99
  yellowMarginPercent: 12.0,    // 12% de tolerância para semáforo amarelo
};

export interface RidePreset {
  id: string;
  title: string;
  description: string;
  source: 'UBER' | 'NINETY_NINE';
  rawText: string;
  category: 'lucrativa' | 'atencao' | 'prejuizo';
}

export const RIDE_PRESETS: RidePreset[] = [
  {
    id: 'preset_1',
    title: '🟢 UberX Centro - Viagem Lucrativa',
    description: 'R$ 29,80 para 7,4 km total e 18 min de viagem.',
    source: 'UBER',
    rawText: 'UberX R$ 29,80 • 1,2 km (4 min) até o local de partida • Viagem de 6,2 km (14 min) para Bairro Jardins',
    category: 'lucrativa',
  },
  {
    id: 'preset_2',
    title: '🟢 99Pop Dinâmico 1.4x - Alta Rentabilidade',
    description: 'R$ 44,50 para 11,2 km total e 26 min.',
    source: 'NINETY_NINE',
    rawText: '99Pop Tarifa Dinâmica 1.4x • R$ 44,50 • Embarque a 1,8 km 6 min • Trajeto 9,4 km 20 min • Pagamento no App',
    category: 'lucrativa',
  },
  {
    id: 'preset_3',
    title: '🟡 UberX Trânsito Pesado - Margem Limite',
    description: 'R$ 18,20 para 8,1 km e 35 min de trânsito lento.',
    source: 'UBER',
    rawText: 'UberX R$ 18,20 • 2,1 km a 8 min • Destino a 6,0 km 27 min • Trânsito intenso na Av. Radial Leste',
    category: 'atencao',
  },
  {
    id: 'preset_4',
    title: '🔴 99Poupa / Corrida Curta - Prejuízo Certo',
    description: 'R$ 7,50 com busca de 3,5 km e viagem de 2,1 km.',
    source: 'NINETY_NINE',
    rawText: '99Poupa R$ 7,50 • Buscar passageiro a 3,5 km (11 min) • Destino a 2,1 km (8 min) • Total 5,6 km',
    category: 'prejuizo',
  },
  {
    id: 'preset_5',
    title: '🔴 UberX Tiro Longo sem Retorno - Falso Alto Valor',
    description: 'R$ 52,00 para 42 km e 58 min (R$ 1,23/km).',
    source: 'UBER',
    rawText: 'UberX R$ 52,00 • 3,0 km a 8 min • Viagem de 39,0 km 50 min para Região Rural Metropolitana',
    category: 'prejuizo',
  },
];

export const INITIAL_SHIFTS: Shift[] = [
  {
    id: 'shift_today',
    startTimestamp: Date.now() - 4 * 3600 * 1000,
    isActive: true,
    totalRidesAccepted: 7,
    totalRidesRejected: 4,
    totalGrossRevenue: 184.60,
    totalEstimatedNetProfit: 122.40,
    totalDistanceKm: 61.8,
    totalTimeMinutes: 195,
    totalFuelCost: 32.50,
    notes: 'Turno da tarde - Pico de trânsito moderado',
  },
  {
    id: 'shift_yesterday',
    startTimestamp: Date.now() - 28 * 3600 * 1000,
    endTimestamp: Date.now() - 21 * 3600 * 1000,
    isActive: false,
    totalRidesAccepted: 14,
    totalRidesRejected: 8,
    totalGrossRevenue: 348.90,
    totalEstimatedNetProfit: 231.10,
    totalDistanceKm: 124.5,
    totalTimeMinutes: 410,
    totalFuelCost: 65.48,
    notes: 'Turno de ontem completo',
  },
];

export const INITIAL_RIDES: RideRecord[] = [
  {
    id: 'ride_1',
    shiftId: 'shift_today',
    source: 'UBER',
    detectedAt: Date.now() - 35 * 60 * 1000,
    offeredValue: 32.50,
    pickupDistanceKm: 1.4,
    tripDistanceKm: 7.8,
    pickupTimeMinutes: 4,
    tripTimeMinutes: 18,
    totalDistanceKm: 9.2,
    totalTimeMinutes: 22,
    valuePerKm: 3.53,
    valuePerHour: 88.64,
    fuelCost: 4.84,
    operationalCost: 1.65,
    netProfit: 26.01,
    level: 'EXCELLENT',
    manualDecision: 'ACCEPTED',
    confidenceScore: 95,
    rawTextSummary: 'UberX • 9.2 km • 22 min • Jardins -> Moema',
  },
  {
    id: 'ride_2',
    shiftId: 'shift_today',
    source: 'NINETY_NINE',
    detectedAt: Date.now() - 75 * 60 * 1000,
    offeredValue: 12.80,
    pickupDistanceKm: 2.8,
    tripDistanceKm: 3.5,
    pickupTimeMinutes: 9,
    tripTimeMinutes: 15,
    totalDistanceKm: 6.3,
    totalTimeMinutes: 24,
    valuePerKm: 2.03,
    valuePerHour: 32.00,
    fuelCost: 3.31,
    operationalCost: 1.80,
    netProfit: 7.69,
    level: 'ATTENTION',
    manualDecision: 'REJECTED',
    confidenceScore: 90,
    rawTextSummary: '99Pop • 6.3 km • 24 min • Busca longa',
  },
  {
    id: 'ride_3',
    shiftId: 'shift_today',
    source: 'UBER',
    detectedAt: Date.now() - 110 * 60 * 1000,
    offeredValue: 48.00,
    pickupDistanceKm: 1.1,
    tripDistanceKm: 14.2,
    pickupTimeMinutes: 3,
    tripTimeMinutes: 31,
    totalDistanceKm: 15.3,
    totalTimeMinutes: 34,
    valuePerKm: 3.14,
    valuePerHour: 84.71,
    fuelCost: 8.05,
    operationalCost: 2.55,
    netProfit: 37.40,
    level: 'EXCELLENT',
    manualDecision: 'ACCEPTED',
    confidenceScore: 100,
    rawTextSummary: 'Uber Comfort • 15.3 km • 34 min • Pinheiros -> Congonhas',
  },
  {
    id: 'ride_4',
    shiftId: 'shift_today',
    source: 'NINETY_NINE',
    detectedAt: Date.now() - 140 * 60 * 1000,
    offeredValue: 8.40,
    pickupDistanceKm: 3.2,
    tripDistanceKm: 2.9,
    pickupTimeMinutes: 10,
    tripTimeMinutes: 11,
    totalDistanceKm: 6.1,
    totalTimeMinutes: 21,
    valuePerKm: 1.38,
    valuePerHour: 24.00,
    fuelCost: 3.21,
    operationalCost: 1.58,
    netProfit: 3.61,
    level: 'LOSS',
    manualDecision: 'REJECTED',
    confidenceScore: 85,
    rawTextSummary: '99Poupa • 6.1 km • 21 min • Valor inviável',
  },
];
