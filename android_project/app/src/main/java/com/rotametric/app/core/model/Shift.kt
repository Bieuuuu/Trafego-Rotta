package com.rotametric.app.core.model

data class Shift(
    val id: Long = 0,
    val startTimestamp: Long,
    val endTimestamp: Long? = null,
    val totalRidesAccepted: Int = 0,
    val totalRidesRejected: Int = 0,
    val totalGrossRevenue: Double = 0.0,
    val totalEstimatedNetProfit: Double = 0.0,
    val totalDistanceKm: Double = 0.0,
    val totalTimeMinutes: Double = 0.0,
    val totalFuelCost: Double = 0.0,
    val notes: String = ""
) {
    val isActive: Boolean get() = endTimestamp == null
    val durationMinutes: Long
        get() = ((endTimestamp ?: System.currentTimeMillis()) - startTimestamp) / 60_000
}