package com.rotametric.app.ui.reports

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.rotametric.app.RotaMetricApp
import com.rotametric.app.data.local.entity.RideEntity
import com.rotametric.app.data.local.entity.ShiftEntity
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn

class ReportsViewModel(private val app: RotaMetricApp) : ViewModel() {
    val shifts: StateFlow<List<ShiftEntity>> = app.shiftRepository.getAllShiftsFlow()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val rides: StateFlow<List<RideEntity>> = app.rideRepository.getAllRidesFlow()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
}
