package com.rotametric.app.service

import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent
import com.rotametric.app.RotaMetricApp
import com.rotametric.app.core.model.AppSource
import com.rotametric.app.core.model.ParseResult
import com.rotametric.app.core.parser.AccessibilityNodeReader
import com.rotametric.app.core.parser.NinetyNineRideParser
import com.rotametric.app.core.parser.UberRideParser
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch

class RideAccessibilityService : AccessibilityService() {

    private val serviceScope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    private val app by lazy { application as RotaMetricApp }
    private val nodeReader = AccessibilityNodeReader()
    private val uberParser = UberRideParser()
    private val ninetyNineParser = NinetyNineRideParser()

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) return
        val pkg = event.packageName?.toString() ?: return

        val source = when {
            AppSource.UBER.packageNames.contains(pkg) -> AppSource.UBER
            AppSource.NINETY_NINE.packageNames.contains(pkg) -> AppSource.NINETY_NINE
            else -> return
        }

        val rootNode = rootInActiveWindow ?: return
        serviceScope.launch {
            try {
                val snapshot = nodeReader.read(rootNode)
                val parseResult = when (source) {
                    AppSource.UBER -> uberParser.parse(snapshot)
                    AppSource.NINETY_NINE -> ninetyNineParser.parse(snapshot)
                }
                if (parseResult is ParseResult.Success) {
                    app.offerStateMachine.onOfferDetected(parseResult.offer)
                }
            } catch (_: Exception) {}
        }
    }

    override fun onInterrupt() {}

    override fun onDestroy() {
        serviceScope.cancel()
        super.onDestroy()
    }
}
