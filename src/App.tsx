import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DashboardTab } from './components/DashboardTab';
import { SimulatorTab } from './components/SimulatorTab';
import { ReportsTab } from './components/ReportsTab';
import { SettingsTab } from './components/SettingsTab';
import { AndroidCodeExplorerTab } from './components/AndroidCodeExplorerTab';
import { OverlayWidget } from './components/OverlayWidget';
import { OnboardingModal } from './components/OnboardingModal';
import { ManualRideModal } from './components/ManualRideModal';
import { 
  DecisionResult, 
  ManualDecision, 
  RideRecord, 
  Shift, 
  VehicleConfig 
} from './types/rotametric';
import { 
  DEFAULT_VEHICLE_CONFIG, 
  INITIAL_RIDES, 
  INITIAL_SHIFTS, 
  RIDE_PRESETS 
} from './data/initialData';
import { ProfitEngine } from './core/profitEngine';

export default function App() {
  // Tab navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'simulator' | 'reports' | 'settings' | 'android'>('dashboard');

  // Vehicle configuration with localStorage persistence
  const [vehicleConfig, setVehicleConfig] = useState<VehicleConfig>(() => {
    try {
      const saved = localStorage.getItem('rotametric_vehicle_config');
      if (saved) return JSON.parse(saved);
    } catch (_e) {}
    return DEFAULT_VEHICLE_CONFIG;
  });

  // Shifts state
  const [shifts, setShifts] = useState<Shift[]>(() => {
    try {
      const saved = localStorage.getItem('rotametric_shifts');
      if (saved) return JSON.parse(saved);
    } catch (_e) {}
    return INITIAL_SHIFTS;
  });

  // Rides state
  const [rides, setRides] = useState<RideRecord[]>(() => {
    try {
      const saved = localStorage.getItem('rotametric_rides');
      if (saved) return JSON.parse(saved);
    } catch (_e) {}
    return INITIAL_RIDES;
  });

  // Floating Overlay State (WindowManager simulator)
  const [overlayVisible, setOverlayVisible] = useState<boolean>(true);
  const [currentDecision, setCurrentDecision] = useState<DecisionResult | null>(() => {
    // Initial sample offer for overlay
    const preset = RIDE_PRESETS[0];
    return ProfitEngine.calculate({
      id: 'init_offer',
      source: preset.source,
      offeredValue: 29.80,
      pickupDistanceKm: 1.2,
      tripDistanceKm: 6.2,
      pickupTimeMinutes: 4,
      tripTimeMinutes: 14,
      detectedAt: Date.now(),
      rawText: preset.rawText,
    }, DEFAULT_VEHICLE_CONFIG);
  });

  // Modals
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Active shift helper
  const activeShift = shifts.find(s => s.isActive) || null;

  // Persist vehicle config
  useEffect(() => {
    try {
      localStorage.setItem('rotametric_vehicle_config', JSON.stringify(vehicleConfig));
    } catch (_e) {}
  }, [vehicleConfig]);

  // Persist shifts
  useEffect(() => {
    try {
      localStorage.setItem('rotametric_shifts', JSON.stringify(shifts));
    } catch (_e) {}
  }, [shifts]);

  // Persist rides
  useEffect(() => {
    try {
      localStorage.setItem('rotametric_rides', JSON.stringify(rides));
    } catch (_e) {}
  }, [rides]);

  // Start or End Shift
  const handleToggleShift = () => {
    if (activeShift) {
      // Close active shift
      setShifts(prev => prev.map(s => s.id === activeShift.id ? { ...s, isActive: false, endTimestamp: Date.now() } : s));
    } else {
      // Create new shift
      const newShift: Shift = {
        id: 'shift_' + Date.now(),
        startTimestamp: Date.now(),
        isActive: true,
        totalRidesAccepted: 0,
        totalRidesRejected: 0,
        totalGrossRevenue: 0,
        totalEstimatedNetProfit: 0,
        totalDistanceKm: 0,
        totalTimeMinutes: 0,
        totalFuelCost: 0,
        notes: `Turno iniciado às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
      };
      setShifts(prev => [newShift, ...prev]);
    }
  };

  // Record a decision (ACCEPTED or REJECTED)
  const handleRecordDecision = (choice: ManualDecision, result: DecisionResult) => {
    const isAccepted = choice === 'ACCEPTED';
    const newRide: RideRecord = {
      id: 'ride_' + Date.now(),
      shiftId: activeShift ? activeShift.id : 'no_shift',
      source: result.offer.source,
      detectedAt: Date.now(),
      offeredValue: result.grossValue,
      pickupDistanceKm: result.offer.pickupDistanceKm,
      tripDistanceKm: result.offer.tripDistanceKm,
      pickupTimeMinutes: result.offer.pickupTimeMinutes,
      tripTimeMinutes: result.offer.tripTimeMinutes,
      totalDistanceKm: result.totalDistanceKm,
      totalTimeMinutes: result.totalTimeMinutes,
      valuePerKm: result.valuePerKm,
      valuePerHour: result.valuePerHour,
      fuelCost: result.fuelCost,
      operationalCost: result.operationalCost,
      netProfit: result.netProfit,
      level: result.level,
      manualDecision: choice,
      confidenceScore: 95,
      rawTextSummary: result.offer.rawText || `${result.offer.source} • R$ ${result.grossValue.toFixed(2)}`,
    };

    // Update rides
    setRides(prev => [newRide, ...prev]);

    // Update active shift if any
    if (activeShift) {
      setShifts(prev => prev.map(s => {
        if (s.id !== activeShift.id) return s;
        if (isAccepted) {
          return {
            ...s,
            totalRidesAccepted: s.totalRidesAccepted + 1,
            totalGrossRevenue: Number((s.totalGrossRevenue + result.grossValue).toFixed(2)),
            totalEstimatedNetProfit: Number((s.totalEstimatedNetProfit + result.netProfit).toFixed(2)),
            totalFuelCost: Number((s.totalFuelCost + result.fuelCost).toFixed(2)),
            totalDistanceKm: Number((s.totalDistanceKm + result.totalDistanceKm).toFixed(2)),
            totalTimeMinutes: s.totalTimeMinutes + result.totalTimeMinutes,
          };
        } else {
          return {
            ...s,
            totalRidesRejected: s.totalRidesRejected + 1,
          };
        }
      }));
    }

    // Dismiss current decision from overlay
    setCurrentDecision(null);
  };

  const handleSendToOverlay = (decision: DecisionResult) => {
    setCurrentDecision(decision);
    setOverlayVisible(true);
  };

  const handleSelectRideForSim = (record: RideRecord) => {
    const offer = {
      id: record.id,
      source: record.source,
      offeredValue: record.offeredValue,
      pickupDistanceKm: record.pickupDistanceKm,
      tripDistanceKm: record.tripDistanceKm,
      pickupTimeMinutes: record.pickupTimeMinutes,
      tripTimeMinutes: record.tripTimeMinutes,
      detectedAt: record.detectedAt,
      rawText: record.rawTextSummary,
    };
    const decision = ProfitEngine.calculate(offer, vehicleConfig);
    setCurrentDecision(decision);
    setOverlayVisible(true);
    setActiveTab('simulator');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeShift={activeShift}
        onToggleShift={handleToggleShift}
        overlayVisible={overlayVisible}
        setOverlayVisible={setOverlayVisible}
        openOnboarding={() => setIsOnboardingOpen(true)}
        vehicleConfig={vehicleConfig}
      />

      {/* Main Tab View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardTab
            activeShift={activeShift}
            onToggleShift={handleToggleShift}
            rides={rides}
            vehicleConfig={vehicleConfig}
            onSelectRideForSim={handleSelectRideForSim}
            onOpenManualModal={() => setIsManualModalOpen(true)}
            goToSimulator={() => setActiveTab('simulator')}
          />
        )}

        {activeTab === 'simulator' && (
          <SimulatorTab
            vehicleConfig={vehicleConfig}
            onSendToOverlay={handleSendToOverlay}
            onRecordDecision={(type, dec) => handleRecordDecision(type, dec)}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsTab
            shifts={shifts}
            rides={rides}
            vehicleConfig={vehicleConfig}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            vehicleConfig={vehicleConfig}
            onSaveConfig={(newConfig) => setVehicleConfig(newConfig)}
          />
        )}

        {activeTab === 'android' && (
          <AndroidCodeExplorerTab />
        )}
      </main>

      {/* Persistent Floating WindowManager Overlay Simulator */}
      <OverlayWidget
        visible={overlayVisible}
        currentDecision={currentDecision}
        activeShift={activeShift}
        onRecordDecision={handleRecordDecision}
        onDismissOffer={() => setCurrentDecision(null)}
        onOpenManualModal={() => setIsManualModalOpen(true)}
      />

      {/* Modals */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      <ManualRideModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        vehicleConfig={vehicleConfig}
        onSaveRide={(dec, choice) => handleRecordDecision(choice, dec)}
      />
    </div>
  );
}
