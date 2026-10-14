package com.rotametric.app.core.model

data class DecisionResult(
    val offer: RideOffer,
    val netValue: Double?,
    val valuePerKm: Double?,
    val valuePerHour: Double?,
    val fuelCost: Double?,
    val otherCosts: Double?,
    val estimatedNetProfit: Double?,
    val level: DecisionLevel,
    val confidence: Float,
    val reason: String
) {
    val hasEnoughData: Boolean get() = level != DecisionLevel.UNKNOWN
}