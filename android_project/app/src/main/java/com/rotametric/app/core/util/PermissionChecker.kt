package com.rotametric.app.core.util

import android.Manifest
import android.accessibilityservice.AccessibilityServiceInfo
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import android.provider.Settings
import android.view.accessibility.AccessibilityManager
import androidx.core.content.ContextCompat
import com.rotametric.app.core.model.AppSource
import com.rotametric.app.service.RideAccessibilityService

data class PermissionStatus(
    val accessibilityEnabled: Boolean,
    val overlayGranted: Boolean,
    val notificationsGranted: Boolean,
    val batteryOptimizationIgnored: Boolean,
    val uberInstalled: Boolean,
    val ninetyNineInstalled: Boolean,
    val overlayServiceRunning: Boolean
) {
    val essentialsGranted: Boolean get() = accessibilityEnabled && overlayGranted
}

object PermissionChecker {

    fun status(context: Context, overlayRunning: Boolean): PermissionStatus = PermissionStatus(
        accessibilityEnabled = isAccessibilityEnabled(context),
        overlayGranted = Settings.canDrawOverlays(context),
        notificationsGranted = areNotificationsGranted(context),
        batteryOptimizationIgnored = isIgnoringBatteryOptimizations(context),
        uberInstalled = isAnyInstalled(context, AppSource.UBER.packageNames),
        ninetyNineInstalled = isAnyInstalled(context, AppSource.NINETY_NINE.packageNames),
        overlayServiceRunning = overlayRunning
    )

    fun isAccessibilityEnabled(context: Context): Boolean {
        val am = context.getSystemService(Context.ACCESSIBILITY_SERVICE) as AccessibilityManager
        val expected = "${context.packageName}/${RideAccessibilityService::class.java.name}"
        val enabled = am.getEnabledAccessibilityServiceList(AccessibilityServiceInfo.FEEDBACK_ALL_MASK)
        if (enabled.any { it.id == expected }) return true
        // Fallback por Settings.Secure (alguns OEMs demoram a atualizar a lista do AccessibilityManager)
        val setting = Settings.Secure.getString(context.contentResolver, Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES) ?: return false
        return setting.split(':').any { it.equals(expected, ignoreCase = true) }
    }

    fun areNotificationsGranted(context: Context): Boolean =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU)
            ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED
        else true

    fun isIgnoringBatteryOptimizations(context: Context): Boolean {
        val pm = context.getSystemService(Context.POWER_SERVICE) as PowerManager
        return pm.isIgnoringBatteryOptimizations(context.packageName)
    }

    fun isAnyInstalled(context: Context, packages: Set<String>): Boolean = packages.any { pkg ->
        runCatching { context.packageManager.getPackageInfo(pkg, 0); true }.getOrDefault(false)
    }

    fun accessibilitySettingsIntent(): Intent =
        Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

    fun overlaySettingsIntent(context: Context): Intent =
        Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:${context.packageName}"))
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

    /**
     * Uso legítimo: o motorista precisa que a overlay sobreviva ao turno inteiro.
     * O sistema exibe o diálogo oficial; o usuário decide.
     */
    fun batteryOptimizationIntent(context: Context): Intent =
        Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS, Uri.parse("package:${context.packageName}"))
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

    fun appDetailsIntent(context: Context): Intent =
        Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:${context.packageName}"))
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
}