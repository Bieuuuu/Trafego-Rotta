package com.rotametric.app.core.model

data class VehicleConfig(
    val fuelPricePerLiter: Double = 6.20,
    val consumptionKmPerLiter: Double = 11.0,
    val minValuePerKm: Double = 1.80,
    val minValuePerHour: Double = 30.0,
    val hourlyOperatingCost: Double = 0.0,
    val platformFeePercent: Double = 0.0,
    val yellowMarginPercent: Double = 15.0
) {
    fun isValid(): Boolean =
        fuelPricePerLiter > 0 && consumptionKmPerLiter > 0 &&
            minValuePerKm >= 0 && minValuePerHour >= 0 &&
            hourlyOperatingCost >= 0 && platformFeePercent in 0.0..100.0 &&
            yellowMarginPercent in 0.0..100.0
}