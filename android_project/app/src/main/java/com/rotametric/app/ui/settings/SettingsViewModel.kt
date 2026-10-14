package com.rotametric.app.ui.settings

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.rotametric.app.RotaMetricApp
import com.rotametric.app.core.model.VehicleConfig
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class SettingsViewModel(private val app: RotaMetricApp) : ViewModel() {
    val vehicleConfig: StateFlow<VehicleConfig> = app.userPreferencesRepository.vehicleConfig
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), VehicleConfig())

    fun saveConfig(config: VehicleConfig) {
        viewModelScope.launch {
            app.userPreferencesRepository.saveVehicleConfig(config)
        }
    }
}
