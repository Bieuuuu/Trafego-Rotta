package com.rotametric.app.ui.dashboard

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.rotametric.app.RotaMetricApp
import com.rotametric.app.core.model.Shift
import com.rotametric.app.core.state.OfferState
import com.rotametric.app.data.local.entity.RideEntity
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class DashboardViewModel(private val app: RotaMetricApp) : ViewModel() {
    val activeShift: StateFlow<Shift?> = app.shiftRepository.activeShiftFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    val offerState: StateFlow<OfferState> = app.offerStateMachine.stateFlow

    val recentRides: StateFlow<List<RideEntity>> = app.rideRepository.getAllRidesFlow()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun startShift() {
        viewModelScope.launch {
            app.shiftRepository.startShift()
        }
    }

    fun finishShift() {
        viewModelScope.launch {
            app.shiftRepository.finishCurrentShift()
        }
    }
}
