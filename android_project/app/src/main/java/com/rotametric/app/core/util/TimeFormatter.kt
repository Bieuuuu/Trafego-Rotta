package com.rotametric.app.core.util

import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

object TimeFormatter {
    private val ptBr = Locale("pt", "BR")

    fun formatMinutes(minutes: Double?): String {
        minutes ?: return "—"
        val total = minutes.toInt()
        val h = total / 60
        val m = total % 60
        return if (h > 0) "${h}h ${m}min" else "${m} min"
    }

    fun formatMinutes(minutes: Long): String = formatMinutes(minutes.toDouble())

    fun formatClock(timestamp: Long): String = SimpleDateFormat("HH:mm", ptBr).format(Date(timestamp))

    fun formatDateTime(timestamp: Long): String = SimpleDateFormat("dd/MM/yyyy HH:mm", ptBr).format(Date(timestamp))

    fun formatIso(timestamp: Long): String = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.US).format(Date(timestamp))

    fun startOfToday(): Long {
        val cal = java.util.Calendar.getInstance()
        cal.set(java.util.Calendar.HOUR_OF_DAY, 0)
        cal.set(java.util.Calendar.MINUTE, 0)
        cal.set(java.util.Calendar.SECOND, 0)
        cal.set(java.util.Calendar.MILLISECOND, 0)
        return cal.timeInMillis
    }
}