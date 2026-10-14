package com.rotametric.app.core.state

import com.rotametric.app.core.model.DecisionResult
import com.rotametric.app.core.model.RideOffer
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * Máquina de estado da oferta com debounce por fingerprint.
 * Puro Kotlin, sem dependências Android.
 */
class OfferStateMachine(
    private val debounceMillis: Long = 4_000L,
    private val autoDismissMillis: Long = 45_000L,
    private val clock: () -> Long = System::currentTimeMillis
) {
    private val _state = MutableStateFlow<OfferState>(OfferState.Idle)
    val state: StateFlow<OfferState> = _state.asStateFlow()

    private var lastFingerprint: String? = null
    private var lastFingerprintAt: Long = 0L

    /**
     * Retorna true se a oferta foi aceita como nova (não duplicada).
     */
    fun onOfferDetected(offer: RideOffer, result: DecisionResult): Boolean {
        val now = clock()
        val fp = offer.fingerprint
        val isDuplicate = fp == lastFingerprint && now - lastFingerprintAt < debounceMillis
        lastFingerprint = fp
        lastFingerprintAt = now
        if (isDuplicate) return false

        val current = _state.value
        if (current is OfferState.Detected && current.offer.fingerprint == fp) return false

        _state.value = OfferState.Detected(offer, result, now)
        return true
    }

    fun onManualCorrectionRequested() {
        val current = _state.value
        val offer = when (current) {
            is OfferState.Detected -> current.offer
            is OfferState.ManualCorrection -> current.offer
            else -> RideOffer(
                source = com.rotametric.app.core.model.AppSource.MANUAL,
                detectedAt = clock(),
                offeredValue = null,
                pickupDistanceKm = null,
                tripDistanceKm = null,
                pickupTimeMinutes = null,
                tripTimeMinutes = null,
                manuallyEntered = true
            )
        }
        _state.value = OfferState.ManualCorrection(offer)
    }

    fun onManualCorrectionApplied(result: DecisionResult) {
        _state.value = OfferState.Detected(result.offer, result, clock())
    }

    fun onResolved(accepted: Boolean): DecisionResult? {
        val current = _state.value as? OfferState.Detected ?: return null
        _state.value = OfferState.Resolved(current.result, accepted, clock())
        return current.result
    }

    fun onDismissed() {
        _state.value = OfferState.Dismissed(clock())
    }

    fun reset() {
        _state.value = OfferState.Idle
    }

    /** Chamado periodicamente para expirar cards antigos. */
    fun tick() {
        val current = _state.value
        val now = clock()
        when (current) {
            is OfferState.Detected -> if (now - current.firstSeenAt > autoDismissMillis) _state.value = OfferState.Idle
            is OfferState.Resolved -> if (now - current.at > 2_000) _state.value = OfferState.Idle
            is OfferState.Dismissed -> if (now - current.at > 500) _state.value = OfferState.Idle
            else -> Unit
        }
    }
}