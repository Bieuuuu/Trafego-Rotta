export type AppSource = 'UBER' | 'NINETY_NINE';

export type DecisionLevel = 'EXCELLENT' | 'ATTENTION' | 'LOSS';

export type ManualDecision = 'ACCEPTED' | 'REJECTED' | 'UNDECIDED';

export interface VehicleConfig {
  fuelPricePerLiter: number;     // e.g. 5.89 R$/L
  consumptionKmPerLiter: number; // e.g. 11.5 km/L
  minValuePerKm: number;         // e.g. 2.00 R$/km
  minValuePerHour: number;       // e.g. 40.00 R$/h
  hourlyOperatingCost: number;   // e.g. 5.00 R$/h (depreciation, maintenance, insurance)
  platformFeePercent: number;    // e.g. 0.0 (net is what's displayed or already deducted)
  yellowMarginPercent: number;   // e.g. 15.0% tolerance margin
}

export interface RideOffer {
  id: string;
  source: AppSource;
  offeredValue: number;
  pickupDistanceKm: number;
  tripDistanceKm: number;
  pickupTimeMinutes: number;
  tripTimeMinutes: number;
  detectedAt: number;
  rawText?: string;
  notes?: string;
}

export interface DecisionResult {
  offer: RideOffer;
  totalDistanceKm: number;
  totalTimeMinutes: number;
  grossValue: number;
  netValue: number;
  fuelCost: number;
  operationalCost: number;
  totalCost: number;
  netProfit: number;
  valuePerKm: number;
  valuePerHour: number;
  profitPerKm: number;
  profitPerHour: number;
  level: DecisionLevel;
  reasons: string[];
}

export interface RideRecord {
  id: string;
  shiftId: string;
  source: AppSource;
  detectedAt: number;
  offeredValue: number;
  pickupDistanceKm: number;
  tripDistanceKm: number;
  pickupTimeMinutes: number;
  tripTimeMinutes: number;
  totalDistanceKm: number;
  totalTimeMinutes: number;
  valuePerKm: number;
  valuePerHour: number;
  fuelCost: number;
  operationalCost: number;
  netProfit: number;
  level: DecisionLevel;
  manualDecision: ManualDecision;
  confidenceScore: number;
  rawTextSummary: string;
}

export interface Shift {
  id: string;
  startTimestamp: number;
  endTimestamp?: number;
  isActive: boolean;
  totalRidesAccepted: number;
  totalRidesRejected: number;
  totalGrossRevenue: number;
  totalEstimatedNetProfit: number;
  totalDistanceKm: number;
  totalTimeMinutes: number;
  totalFuelCost: number;
  notes?: string;
}

export interface PermissionStatus {
  accessibilityEnabled: boolean;
  overlayGranted: boolean;
  notificationsGranted: boolean;
  batteryOptimizationIgnored: boolean;
  uberInstalled: boolean;
  ninetyNineInstalled: boolean;
  overlayServiceRunning: boolean;
}
