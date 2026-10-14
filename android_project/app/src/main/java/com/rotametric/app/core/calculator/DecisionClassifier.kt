package com.rotametric.app.core.calculator

import com.rotametric.app.core.model.DecisionLevel
import com.rotametric.app.core.model.VehicleConfig

/**
 * Semáforo:
 *  - 🔴 Prejuízo: lucro <= 0 OU abaixo das metas com margem amarela estourada.
 *  - 🟡 Atenção: dentro da margem amarela (abaixo da meta, mas até yellowMarginPercent de folga).
 *  - 🟢 Excelente: ambas as metas atingidas e lucro positivo.
 */
class DecisionClassifier {

    fun classify(valuePerKm: Double, valuePerHour: Double, profit: Double, config: VehicleConfig): DecisionLevel {
        if (profit <= 0.0) return DecisionLevel.LOSS

        val factor = 1 - config.yellowMarginPercent / 100.0
        val kmFloor = config.minValuePerKm * factor
        val hourFloor = config.minValuePerHour * factor

        val kmOk = valuePerKm >= config.minValuePerKm
        val hourOk = valuePerHour >= config.minValuePerHour
        val kmYellow = valuePerKm >= kmFloor
        val hourYellow = valuePerHour >= hourFloor

        return when {
            kmOk && hourOk -> DecisionLevel.EXCELLENT
            kmYellow && hourYellow -> DecisionLevel.ATTENTION
            else -> DecisionLevel.LOSS
        }
    }

    fun explain(valuePerKm: Double, valuePerHour: Double, profit: Double, config: VehicleConfig): String {
        val parts = mutableListOf<String>()
        if (profit <= 0) parts += "lucro negativo"
        if (valuePerKm < config.minValuePerKm) parts += "R\$/km abaixo da meta"
        if (valuePerHour < config.minValuePerHour) parts += "R\$/h abaixo da meta"
        return if (parts.isEmpty()) "Metas atingidas" else parts.joinToString(", ").replaceFirstChar { it.uppercase() }
    }
}