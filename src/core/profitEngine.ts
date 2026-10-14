import { DecisionLevel, DecisionResult, RideOffer, VehicleConfig } from '../types/rotametric';

export class ProfitEngine {
  static calculate(offer: RideOffer, config: VehicleConfig): DecisionResult {
    const totalDistanceKm = Math.max(0.1, offer.pickupDistanceKm + offer.tripDistanceKm);
    const totalTimeMinutes = Math.max(1, offer.pickupTimeMinutes + offer.tripTimeMinutes);
    const totalTimeHours = totalTimeMinutes / 60;

    // Platform fee deduction (if applicable)
    const feeAmount = offer.offeredValue * (config.platformFeePercent / 100);
    const netValue = offer.offeredValue - feeAmount;

    // Direct fuel cost
    const litersUsed = totalDistanceKm / Math.max(1, config.consumptionKmPerLiter);
    const fuelCost = litersUsed * config.fuelPricePerLiter;

    // Operational cost (depreciation, maintenance, tires per hour)
    const operationalCost = totalTimeHours * config.hourlyOperatingCost;
    const totalCost = fuelCost + operationalCost;

    // Net profit
    const netProfit = netValue - totalCost;

    // Unit economics
    const valuePerKm = netValue / totalDistanceKm;
    const valuePerHour = totalTimeHours > 0 ? netValue / totalTimeHours : 0;
    const profitPerKm = netProfit / totalDistanceKm;
    const profitPerHour = totalTimeHours > 0 ? netProfit / totalTimeHours : 0;

    // Decision classification
    const reasons: string[] = [];
    const yellowFactor = 1 - (config.yellowMarginPercent / 100);

    const targetKm = config.minValuePerKm;
    const targetHour = config.minValuePerHour;
    const yellowThresholdKm = targetKm * yellowFactor;
    const yellowThresholdHour = targetHour * yellowFactor;

    let level: DecisionLevel = 'ATTENTION';

    if (netProfit <= 0) {
      level = 'LOSS';
      reasons.push('Lucro negativo ou nulo após descontar custos operacionais.');
    } else if (valuePerKm < yellowThresholdKm && valuePerHour < yellowThresholdHour) {
      level = 'LOSS';
      reasons.push(`Abaixo do piso aceitável (R$ ${valuePerKm.toFixed(2)}/km e R$ ${valuePerHour.toFixed(2)}/h).`);
    } else if (valuePerKm >= targetKm && valuePerHour >= targetHour && netProfit > 3) {
      level = 'EXCELLENT';
      reasons.push(`Supera as metas: R$ ${valuePerKm.toFixed(2)}/km e R$ ${valuePerHour.toFixed(2)}/h.`);
      reasons.push(`Lucro líquido livre estimado de R$ ${netProfit.toFixed(2)}.`);
    } else {
      level = 'ATTENTION';
      if (valuePerKm < targetKm) {
        reasons.push(`R$/km (R$ ${valuePerKm.toFixed(2)}) um pouco abaixo da meta (R$ ${targetKm.toFixed(2)}).`);
      }
      if (valuePerHour < targetHour) {
        reasons.push(`R$/h (R$ ${valuePerHour.toFixed(2)}) abaixo da meta horária (R$ ${targetHour.toFixed(2)}).`);
      }
      if (reasons.length === 0) {
        reasons.push('Margem aceitável, mas requer atenção ao trânsito.');
      }
    }

    return {
      offer,
      totalDistanceKm: Number(totalDistanceKm.toFixed(2)),
      totalTimeMinutes: Math.round(totalTimeMinutes),
      grossValue: offer.offeredValue,
      netValue: Number(netValue.toFixed(2)),
      fuelCost: Number(fuelCost.toFixed(2)),
      operationalCost: Number(operationalCost.toFixed(2)),
      totalCost: Number(totalCost.toFixed(2)),
      netProfit: Number(netProfit.toFixed(2)),
      valuePerKm: Number(valuePerKm.toFixed(2)),
      valuePerHour: Number(valuePerHour.toFixed(2)),
      profitPerKm: Number(profitPerKm.toFixed(2)),
      profitPerHour: Number(profitPerHour.toFixed(2)),
      level,
      reasons,
    };
  }
}
