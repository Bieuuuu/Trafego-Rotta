package com.rotametric.app.core.model

enum class AppSource(val displayName: String, val packageNames: Set<String>) {
    UBER("Uber", setOf("com.ubercab.driver")),
    NINETY_NINE("99", setOf("com.taxis99.driver", "com.app99.driver")),
    MANUAL("Manual", emptySet()),
    UNKNOWN("Desconhecido", emptySet());

    companion object {
        fun fromPackage(packageName: String?): AppSource =
            entries.firstOrNull { packageName != null && packageName in it.packageNames } ?: UNKNOWN
    }
}