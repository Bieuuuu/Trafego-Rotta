package com.rotametric.app.core.model

enum class DecisionLevel(val emoji: String, val label: String) {
    EXCELLENT("🟢", "Excelente"),
    ATTENTION("🟡", "Atenção"),
    LOSS("🔴", "Prejuízo"),
    UNKNOWN("⚪", "Dados insuficientes")
}