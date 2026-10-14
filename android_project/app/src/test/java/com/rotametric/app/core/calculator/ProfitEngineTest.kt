package com.rotametric.app.core.calculator

import com.rotametric.app.core.model.AppSource
import com.rotametric.app.core.model.RideOffer
import com.rotametric.app.core.model.VehicleConfig
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class ProfitEngineTest {
    private val engine = ProfitEngine()
    private val config = VehicleConfig(
        fuelPricePerLiter = 5.80,
        consumptionKmPerLiter = 10.0,
        minValuePerKm = 2.0,
        minValuePerHour = 40.0
    )

    @Test
    fun calculate_simpleOffer_computesProfitCorrectly() {
        val offer = RideOffer(
            source = AppSource.UBER,
            offeredValue = 30.0,
            pickupDistanceKm = 2.0,
            tripDistanceKm = 8.0,
            pickupTimeMinutes = 5,
            tripTimeMinutes = 25
        )
        val result = engine.calculate(offer, config)
        assertEquals(10.0, result.totalDistanceKm, 0.01)
        assertEquals(30, result.totalTimeMinutes)
        assertEquals(5.80, result.fuelCost, 0.01)
        assertTrue(result.netProfit > 20.0)
    }
}
