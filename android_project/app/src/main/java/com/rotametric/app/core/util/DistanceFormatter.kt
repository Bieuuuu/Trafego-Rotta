package com.rotametric.app.core.util

import java.util.Locale

object DistanceFormatter {
    fun format(km: Double?): String = when {
        km == null -> "—"
        km < 1.0 -> "${(km * 1000).toInt()} m"
        else -> String.format(Locale("pt", "BR"), "%.1f km", km)
    }
}