package com.rotametric.app.data.settings

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.doublePreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.rotametric.app.core.model.VehicleConfig
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "rotametric_prefs")

data class OverlayPosition(val x: Int = 0, val y: Int = 300, val collapsed: Boolean = false)

class UserPreferencesRepository(context: Context) {
    private val store = context.applicationContext.dataStore

    private object Keys {
        val FUEL_PRICE = doublePreferencesKey("fuel_price")
        val CONSUMPTION = doublePreferencesKey("consumption")
        val MIN_PER_KM = doublePreferencesKey("min_per_km")
        val MIN_PER_HOUR = doublePreferencesKey("min_per_hour")
        val HOURLY_COST = doublePreferencesKey("hourly_cost")
        val FEE_PERCENT = doublePreferencesKey("fee_percent")
        val YELLOW_MARGIN = doublePreferencesKey("yellow_margin")
        val ONBOARDING_DONE = booleanPreferencesKey("onboarding_done")
        val ACCESSIBILITY_CONSENT = booleanPreferencesKey("accessibility_consent")
        val OVERLAY_X = intPreferencesKey("overlay_x")
        val OVERLAY_Y = intPreferencesKey("overlay_y")
        val OVERLAY_COLLAPSED = booleanPreferencesKey("overlay_collapsed")
        val OVERLAY_ENABLED = booleanPreferencesKey("overlay_enabled")
    }

    val vehicleConfig: Flow<VehicleConfig> = store.data.map { p ->
        val d = VehicleConfig()
        VehicleConfig(
            fuelPricePerLiter = p[Keys.FUEL_PRICE] ?: d.fuelPricePerLiter,
            consumptionKmPerLiter = p[Keys.CONSUMPTION] ?: d.consumptionKmPerLiter,
            minValuePerKm = p[Keys.MIN_PER_KM] ?: d.minValuePerKm,
            minValuePerHour = p[Keys.MIN_PER_HOUR] ?: d.minValuePerHour,
            hourlyOperatingCost = p[Keys.HOURLY_COST] ?: d.hourlyOperatingCost,
            platformFeePercent = p[Keys.FEE_PERCENT] ?: d.platformFeePercent,
            yellowMarginPercent = p[Keys.YELLOW_MARGIN] ?: d.yellowMarginPercent
        )
    }

    val onboardingDone: Flow<Boolean> = store.data.map { it[Keys.ONBOARDING_DONE] ?: false }
    val accessibilityConsent: Flow<Boolean> = store.data.map { it[Keys.ACCESSIBILITY_CONSENT] ?: false }
    val overlayEnabled: Flow<Boolean> = store.data.map { it[Keys.OVERLAY_ENABLED] ?: true }

    val overlayPosition: Flow<OverlayPosition> = store.data.map {
        OverlayPosition(
            x = it[Keys.OVERLAY_X] ?: 0,
            y = it[Keys.OVERLAY_Y] ?: 300,
            collapsed = it[Keys.OVERLAY_COLLAPSED] ?: false
        )
    }

    suspend fun saveVehicleConfig(config: VehicleConfig) {
        store.edit { p ->
            p[Keys.FUEL_PRICE] = config.fuelPricePerLiter
            p[Keys.CONSUMPTION] = config.consumptionKmPerLiter
            p[Keys.MIN_PER_KM] = config.minValuePerKm
            p[Keys.MIN_PER_HOUR] = config.minValuePerHour
            p[Keys.HOURLY_COST] = config.hourlyOperatingCost
            p[Keys.FEE_PERCENT] = config.platformFeePercent
            p[Keys.YELLOW_MARGIN] = config.yellowMarginPercent
        }
    }

    suspend fun setOnboardingDone(done: Boolean) {
        store.edit { it[Keys.ONBOARDING_DONE] = done }
    }

    suspend fun setAccessibilityConsent(consent: Boolean) {
        store.edit { it[Keys.ACCESSIBILITY_CONSENT] = consent }
    }

    suspend fun setOverlayEnabled(enabled: Boolean) {
        store.edit { it[Keys.OVERLAY_ENABLED] = enabled }
    }

    suspend fun saveOverlayPosition(x: Int, y: Int, collapsed: Boolean) {
        store.edit {
            it[Keys.OVERLAY_X] = x
            it[Keys.OVERLAY_Y] = y
            it[Keys.OVERLAY_COLLAPSED] = collapsed
        }
    }

    suspend fun getVehicleConfigSync(): VehicleConfig = vehicleConfig.first()
}
