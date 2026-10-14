package com.rotametric.app.core.calculator

import com.rotametric.app.core.model.DecisionLevel
import com.rotametric.app.core.model.DecisionResult
import com.rotametric.app.core.model.RideOffer
import com.rotametric.app.core.model.VehicleConfig

/**
 * Motor financeiro puro (sem Android). Todas as fórmulas são configuráveis via [VehicleConfig].
 */
class ProfitEngine(private val classifier: DecisionClassifier = DecisionClassifier()) {

    fun evaluate(offer: RideOffer, config: VehicleConfig, parseConfidence: Float = 1f): DecisionResult {
        val value = offer.offeredValue
        val distance = offer.totalDistanceKm
        val minutes = offer.totalTimeMinutes

        if (value == null || distance == null || minutes == null || distance <= 0.0 || minutes <= 0.0) {
            return DecisionResult(
                offer = offer,
                netValue = value,
                valuePerKm = null,
                valuePerHour = null,
                fuelCost = distance?.let { fuelCost(it, config) },
                otherCosts = null,
                estimatedNetProfit = null,
                level = DecisionLevel.UNKNOWN,
                confidence = parseConfidence * 0.5f,
                reason = "Dados insuficientes para calcular"
            )
        }

        val netValue = value * (1 - config.platformFeePercent / 100.0)
        val hours = minutes / 60.0
        val perKm = netValue / distance
        val perHour = netValue / hours
        val fuel = fuelCost(distance, config)
        val other = config.hourlyOperatingCost * hours
        val profit = netValue - fuel - other

        val level = classifier.classify(perKm, perHour, profit, config)

        return DecisionResult(
            offer = offer,
            netValue = round2(netValue),
            valuePerKm = round2(perKm),
            valuePerHour = round2(perHour),
            fuelCost = round2(fuel),
            otherCosts = round2(other),
            estimatedNetProfit = round2(profit),
            level = level,
            confidence = parseConfidence,
            reason = classifier.explain(perKm, perHour, profit, config)
        )
    }

    fun fuelCost(distanceKm: Double, config: VehicleConfig): Double =
        if (config.consumptionKmPerLiter <= 0) 0.0 else distanceKm / config.consumptionKmPerLiter * config.fuelPricePerLiter

    private fun round2(v: Double): Double = Math.round(v * 100.0) / 100.0
}