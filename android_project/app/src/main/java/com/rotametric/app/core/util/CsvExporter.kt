package com.rotametric.app.core.util

import android.content.Context
import android.net.Uri
import com.rotametric.app.core.model.RideRecord
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Exporta via Storage Access Framework: o usuário escolhe o destino (ACTION_CREATE_DOCUMENT)
 * e recebemos apenas a Uri. Nenhuma permissão de armazenamento é necessária.
 */
object CsvExporter {

    private const val HEADER =
        "id;shift_id;platform;detected_at;offered_value;pickup_distance_km;trip_distance_km;" +
            "pickup_time_min;trip_time_min;total_distance_km;total_time_min;value_per_km;value_per_hour;" +
            "fuel_cost;estimated_net_profit;decision_level;manual_decision;manually_entered;confidence"

    fun buildCsv(records: List<RideRecord>): String {
        val sb = StringBuilder()
        sb.append('\uFEFF') // BOM para Excel abrir UTF-8 corretamente
        sb.appendLine(HEADER)
        records.forEach { r ->
            sb.append(r.id).append(';')
                .append(r.shiftId ?: "").append(';')
                .append(r.platform.displayName).append(';')
                .append(TimeFormatter.formatIso(r.detectedAt)).append(';')
                .append(CurrencyFormatter.formatCsv(r.offeredValue)).append(';')
                .append(CurrencyFormatter.formatCsv(r.pickupDistanceKm)).append(';')
                .append(CurrencyFormatter.formatCsv(r.tripDistanceKm)).append(';')
                .append(CurrencyFormatter.formatCsv(r.pickupTimeMinutes)).append(';')
                .append(CurrencyFormatter.formatCsv(r.tripTimeMinutes)).append(';')
                .append(CurrencyFormatter.formatCsv(r.totalDistanceKm)).append(';')
                .append(CurrencyFormatter.formatCsv(r.totalTimeMinutes)).append(';')
                .append(CurrencyFormatter.formatCsv(r.valuePerKm)).append(';')
                .append(CurrencyFormatter.formatCsv(r.valuePerHour)).append(';')
                .append(CurrencyFormatter.formatCsv(r.fuelCost)).append(';')
                .append(CurrencyFormatter.formatCsv(r.estimatedNetProfit)).append(';')
                .append(r.decisionLevel.name).append(';')
                .append(r.manualDecision.name).append(';')
                .append(r.manuallyEntered).append(';')
                .append(String.format(java.util.Locale.US, "%.2f", r.confidenceScore))
                .appendLine()
        }
        return sb.toString()
    }

    suspend fun writeTo(context: Context, uri: Uri, records: List<RideRecord>): Result<Int> =
        withContext(Dispatchers.IO) {
            runCatching {
                val csv = buildCsv(records)
                context.contentResolver.openOutputStream(uri, "wt")?.use { out ->
                    out.write(csv.toByteArray(Charsets.UTF_8))
                    out.flush()
                } ?: error("Não foi possível abrir o destino")
                records.size
            }
        }

    fun suggestedFileName(): String =
        "rotametric_${java.text.SimpleDateFormat("yyyyMMdd_HHmm", java.util.Locale.US).format(java.util.Date())}.csv"
}