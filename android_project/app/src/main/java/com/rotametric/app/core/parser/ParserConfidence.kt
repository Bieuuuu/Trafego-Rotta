package com.rotametric.app.core.parser

/**
 * Pontuação de confiança do parser. Cada campo encontrado soma pontos.
 */
object ParserConfidence {
    const val WEIGHT_VALUE = 0.40f
    const val WEIGHT_TRIP_DISTANCE = 0.20f
    const val WEIGHT_PICKUP_DISTANCE = 0.10f
    const val WEIGHT_TRIP_TIME = 0.20f
    const val WEIGHT_PICKUP_TIME = 0.10f

    const val MIN_ACCEPTABLE = 0.45f
    const val HIGH = 0.85f

    fun score(
        hasValue: Boolean,
        hasTripDistance: Boolean,
        hasPickupDistance: Boolean,
        hasTripTime: Boolean,
        hasPickupTime: Boolean
    ): Float {
        var s = 0f
        if (hasValue) s += WEIGHT_VALUE
        if (hasTripDistance) s += WEIGHT_TRIP_DISTANCE
        if (hasPickupDistance) s += WEIGHT_PICKUP_DISTANCE
        if (hasTripTime) s += WEIGHT_TRIP_TIME
        if (hasPickupTime) s += WEIGHT_PICKUP_TIME
        return s.coerceIn(0f, 1f)
    }
}