package com.rotametric.app.core.model

sealed class ParseResult {
    data class Success(val offer: RideOffer, val confidence: Float) : ParseResult()
    data class Partial(val offer: RideOffer, val confidence: Float, val missing: List<String>) : ParseResult()
    data class NoOffer(val reason: String) : ParseResult()

    val offerOrNull: RideOffer?
        get() = when (this) {
            is Success -> offer
            is Partial -> offer
            is NoOffer -> null
        }

    val confidenceOrZero: Float
        get() = when (this) {
            is Success -> confidence
            is Partial -> confidence
            is NoOffer -> 0f
        }
}