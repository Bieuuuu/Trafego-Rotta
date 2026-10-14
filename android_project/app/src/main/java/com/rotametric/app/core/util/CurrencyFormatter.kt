package com.rotametric.app.core.util

import java.text.NumberFormat
import java.util.Locale

object CurrencyFormatter {
    private val brl: NumberFormat = NumberFormat.getCurrencyInstance(Locale("pt", "BR"))

    fun format(value: Double?): String = if (value == null) "—" else brl.format(value)

    fun formatPerKm(value: Double?): String = if (value == null) "—" else "${brl.format(value)}/km"

    fun formatPerHour(value: Double?): String = if (value == null) "—" else "${brl.format(value)}/h"

    fun formatCsv(value: Double): String = String.format(Locale.US, "%.2f", value)
}