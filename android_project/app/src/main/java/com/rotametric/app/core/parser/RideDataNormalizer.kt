package com.rotametric.app.core.parser

import java.util.Locale

/**
 * Normaliza textos de tela em números. Puro Kotlin, testável.
 */
object RideDataNormalizer {

    private val currencyRegex = Regex("""R\$\s*(\d{1,4}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)""")
    private val plainNumberRegex = Regex("""(?<![\d,.])(\d{1,4}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)(?![\d,.])""")
    private val distanceRegex = Regex("""(\d+(?:[.,]\d+)?)\s*(km|m)\b""", RegexOption.IGNORE_CASE)
    private val hourMinRegex = Regex("""(\d+)\s*h(?:ora)?s?\s*(?:e\s*)?(\d+)?\s*(?:min)?""", RegexOption.IGNORE_CASE)
    private val minRegex = Regex("""(\d+(?:[.,]\d+)?)\s*min""", RegexOption.IGNORE_CASE)

    const val MIN_VALUE = 1.0
    const val MAX_VALUE = 2000.0
    const val MIN_DISTANCE_KM = 0.05
    const val MAX_DISTANCE_KM = 500.0
    const val MIN_TIME_MIN = 0.5
    const val MAX_TIME_MIN = 600.0

    fun normalizeText(raw: String): String =
        raw.replace('\u00A0', ' ').replace(Regex("\\s+"), " ").trim()

    /** "R$ 12,34" | "12,34" | "12.34" | "R$12,34" | "1.234,56" → Double */
    fun parseCurrency(text: String): Double? {
        val t = normalizeText(text)
        val match = currencyRegex.find(t) ?: plainNumberRegex.find(t) ?: return null
        val number = toDouble(match.groupValues[1]) ?: return null
        return number.takeIf { it in MIN_VALUE..MAX_VALUE }
    }

    /** "1,2 km" | "800 m" | "2.5 km" → km */
    fun parseDistanceKm(text: String): Double? {
        val t = normalizeText(text)
        val match = distanceRegex.find(t) ?: return null
        val number = toDouble(match.groupValues[1]) ?: return null
        val km = if (match.groupValues[2].lowercase(Locale.ROOT) == "m") number / 1000.0 else number
        return km.takeIf { it in MIN_DISTANCE_KM..MAX_DISTANCE_KM }
    }

    /** "5 min" | "1h 10min" | "70 min" | "1h" → minutos */
    fun parseMinutes(text: String): Double? {
        val t = normalizeText(text)
        hourMinRegex.find(t)?.let { m ->
            val hours = m.groupValues[1].toDoubleOrNull() ?: return@let
            val mins = m.groupValues[2].toDoubleOrNull() ?: 0.0
            val total = hours * 60 + mins
            return total.takeIf { it in MIN_TIME_MIN..MAX_TIME_MIN }
        }
        minRegex.find(t)?.let { m ->
            val mins = toDouble(m.groupValues[1]) ?: return@let
            return mins.takeIf { it in MIN_TIME_MIN..MAX_TIME_MIN }
        }
        return null
    }

    fun containsCurrency(text: String): Boolean = currencyRegex.containsMatchIn(text)
    fun containsDistance(text: String): Boolean = distanceRegex.containsMatchIn(text)
    fun containsTime(text: String): Boolean = minRegex.containsMatchIn(text) || hourMinRegex.containsMatchIn(text)

    /**
     * Converte "1.234,56" / "1,234.56" / "12,34" / "12.34" para Double.
     */
    fun toDouble(raw: String): Double? {
        val s = raw.trim()
        if (s.isEmpty()) return null
        val hasComma = s.contains(',')
        val hasDot = s.contains('.')
        val normalized = when {
            hasComma && hasDot -> {
                if (s.lastIndexOf(',') > s.lastIndexOf('.')) s.replace(".", "").replace(',', '.')
                else s.replace(",", "")
            }
            hasComma -> {
                val afterComma = s.substringAfterLast(',')
                if (afterComma.length == 3 && s.count { it == ',' } == 1 && s.substringBefore(',').length <= 3 && !s.startsWith("0"))
                    s.replace(",", "") // 1,234 = milhar
                else s.replace(',', '.')
            }
            hasDot -> {
                val afterDot = s.substringAfterLast('.')
                if (afterDot.length == 3 && s.count { it == '.' } == 1 && s.substringBefore('.').length <= 3)
                    s.replace(".", "") // 1.234 = milhar
                else s
            }
            else -> s
        }
        return normalized.toDoubleOrNull()
    }
}