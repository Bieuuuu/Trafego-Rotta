package com.rotametric.app.core.state

import com.rotametric.app.core.model.DecisionResult
import com.rotametric.app.core.model.RideOffer

sealed class OfferState {
    data object Idle : OfferState()
    data class Detected(val offer: RideOffer, val result: DecisionResult, val firstSeenAt: Long) : OfferState()
    data class ManualCorrection(val offer: RideOffer) : OfferState()
    data class Resolved(val result: DecisionResult, val accepted: Boolean, val at: Long) : OfferState()
    data class Dismissed(val at: Long) : OfferState()
}