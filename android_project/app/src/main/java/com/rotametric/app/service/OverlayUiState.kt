package com.rotametric.app.service

import com.rotametric.app.core.model.DecisionResult

sealed class OverlayUiState {
    data class Pill(
        val totalRevenueToday: Double = 0.0,
        val acceptedCount: Int = 0,
        val rejectedCount: Int = 0,
        val isShiftActive: Boolean = false
    ) : OverlayUiState()

    data class Card(
        val decision: DecisionResult,
        val isSaving: Boolean = false
    ) : OverlayUiState()
}
