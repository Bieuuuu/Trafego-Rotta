package com.rotametric.app.core.model

/**
 * Oferta de corrida com dados operacionais apenas. Nunca contém dados do passageiro.
 */
data class RideOffer(
    val source: AppSource,
    val detectedAt: Long,
    val offeredValue: Double?,
    val pickupDistanceKm: Double?,
    val tripDistanceKm: Double?,
    val pickupTimeMinutes: Double?,
    val tripTimeMinutes: Double?,
    val rawTextSummary: String = "",
    val manuallyEntered: Boolean = false
) {
    val totalDistanceKm: Double? get() = sumNullable(pickupDistanceKm, tripDistanceKm)
    val totalTimeMinutes: Double? get() = sumNullable(pickupTimeMinutes, tripTimeMinutes)

    val isComplete: Boolean
        get() = offeredValue != null && totalDistanceKm != null && totalTimeMinutes != null

    /** Chave usada para debounce/duplicidade. */
    val fingerprint: String
        get() = "${source.name}|$offeredValue|$pickupDistanceKm|$tripDistanceKm|$pickupTimeMinutes|$tripTimeMinutes"

    private fun sumNullable(a: Double?, b: Double?): Double? = when {
        a == null && b == null -> null
        a == null -> b
        b == null -> a
        else -> a + b
    }
}