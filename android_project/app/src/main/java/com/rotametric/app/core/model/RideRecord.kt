package com.rotametric.app.core.model

enum class ManualDecision { ACCEPTED, REJECTED, UNDECIDED }

data class RideRecord(
    val id: Long = 0,
    val shiftId: Long?,
    val platform: AppSource,
    val detectedAt: Long,
    val offeredValue: Double,
    val pickupDistanceKm: Double,
    val tripDistanceKm: Double,
    val pickupTimeMinutes: Double,
    val tripTimeMinutes: Double,
    val totalDistanceKm: Double,
    val totalTimeMinutes: Double,
    val valuePerKm: Double,
    val valuePerHour: Double,
    val fuelCost: Double,
    val estimatedNetProfit: Double,
    val decisionLevel: DecisionLevel,
    val manualDecision: ManualDecision,
    val manuallyEntered: Boolean,
    val confidenceScore: Float,
    val rawTextSummary: String
) {
    companion object {
        fun from(result: DecisionResult, shiftId: Long?, decision: ManualDecision): RideRecord {
            val o = result.offer
            return RideRecord(
                shiftId = shiftId,
                platform = o.source,
                detectedAt = o.detectedAt,
                offeredValue = o.offeredValue ?: 0.0,
                pickupDistanceKm = o.pickupDistanceKm ?: 0.0,
                tripDistanceKm = o.tripDistanceKm ?: 0.0,
                pickupTimeMinutes = o.pickupTimeMinutes ?: 0.0,
                tripTimeMinutes = o.tripTimeMinutes ?: 0.0,
                totalDistanceKm = o.totalDistanceKm ?: 0.0,
                totalTimeMinutes = o.totalTimeMinutes ?: 0.0,
                valuePerKm = result.valuePerKm ?: 0.0,
                valuePerHour = result.valuePerHour ?: 0.0,
                fuelCost = result.fuelCost ?: 0.0,
                estimatedNetProfit = result.estimatedNetProfit ?: 0.0,
                decisionLevel = result.level,
                manualDecision = decision,
                manuallyEntered = o.manuallyEntered,
                confidenceScore = result.confidence,
                rawTextSummary = o.rawTextSummary
            )
        }
    }
}