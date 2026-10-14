package com.rotametric.app.service

import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.PixelFormat
import android.os.Build
import android.os.IBinder
import android.provider.Settings
import android.view.Gravity
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import android.widget.Button
import android.widget.TextView
import com.rotametric.app.R
import com.rotametric.app.RotaMetricApp
import com.rotametric.app.core.model.DecisionLevel
import com.rotametric.app.core.model.DecisionResult
import com.rotametric.app.core.model.ManualDecision
import com.rotametric.app.core.state.OfferState
import com.rotametric.app.core.util.CurrencyFormatter
import com.rotametric.app.core.util.DistanceFormatter
import com.rotametric.app.core.util.TimeFormatter
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.launch

class FloatingOverlayService : Service() {

    private val serviceScope = CoroutineScope(Dispatchers.Main + SupervisorJob())
    private lateinit var windowManager: WindowManager
    private val app by lazy { application as RotaMetricApp }

    private var overlayView: View? = null
    private var pillView: View? = null
    private var cardView: View? = null

    private var layoutParams: WindowManager.LayoutParams? = null
    private var isCardMode = false
    private var currentDecision: DecisionResult? = null

    companion object {
        var isRunning = false
            private set

        fun start(context: Context) {
            if (!Settings.canDrawOverlays(context)) return
            val intent = Intent(context, FloatingOverlayService::class.java)
            context.startService(intent)
        }

        fun stop(context: Context) {
            val intent = Intent(context, FloatingOverlayService::class.java)
            context.stopService(intent)
        }
    }

    override fun onCreate() {
        super.onCreate()
        isRunning = true
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        setupOverlay()
        observeState()
    }

    private fun setupOverlay() {
        val type = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        } else {
            @Suppress("DEPRECATION")
            WindowManager.LayoutParams.TYPE_PHONE
        }

        layoutParams = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            type,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP or Gravity.START
            x = 20
            y = 350
        }

        val inflater = LayoutInflater.from(this)
        overlayView = inflater.inflate(R.layout.overlay_container_stub, null, false) ?: View(this)
        createPillView()
        createCardView()
        showPill()
    }

    private fun createPillView() {
        pillView = TextView(this).apply {
            setBackgroundResource(R.drawable.overlay_pill_background)
            setTextColor(0xFFFFFFFF.toInt())
            setPadding(32, 18, 32, 18)
            textSize = 13f
            text = "RotaMetric 🟢"
            setupDragListener(this)
        }
    }

    private fun createCardView() {
        cardView = TextView(this).apply {
            setBackgroundResource(R.drawable.overlay_card_background)
            setTextColor(0xFFFFFFFF.toInt())
            setPadding(40, 30, 40, 30)
            textSize = 14f
            text = "Analisando..."
            setupDragListener(this)
        }
    }

    private fun showPill() {
        isCardMode = false
        overlayView?.let { windowManager.removeViewImmediate(it) }
        overlayView = pillView
        try {
            windowManager.addView(overlayView, layoutParams)
        } catch (_: Exception) {}
    }

    private fun showCard(decision: DecisionResult) {
        currentDecision = decision
        isCardMode = true
        val cardText = buildString {
            append("${decision.level.emoji} ${decision.level.label}\n")
            append("Plataforma: ${decision.offer.source.displayName}\n")
            append("Valor: ${CurrencyFormatter.formatBrl(decision.offer.offeredValue)}\n")
            append("Distância total: ${DistanceFormatter.formatKm(decision.totalDistanceKm)}\n")
            append("R$/km: ${CurrencyFormatter.formatBrl(decision.valuePerKm)} | R$/h: ${CurrencyFormatter.formatBrl(decision.valuePerHour)}\n")
            append("Lucro líq.: ${CurrencyFormatter.formatBrl(decision.netProfit)}")
        }
        (cardView as? TextView)?.text = cardText
        overlayView?.let { windowManager.removeViewImmediate(it) }
        overlayView = cardView
        try {
            windowManager.addView(overlayView, layoutParams)
        } catch (_: Exception) {}
    }

    private fun setupDragListener(view: View) {
        view.setOnTouchListener(object : View.OnTouchListener {
            private var initialX = 0
            private var initialY = 0
            private var touchX = 0f
            private var touchY = 0f

            override fun onTouch(v: View, event: MotionEvent): Boolean {
                when (event.action) {
                    MotionEvent.ACTION_DOWN -> {
                        initialX = layoutParams?.x ?: 0
                        initialY = layoutParams?.y ?: 0
                        touchX = event.rawX
                        touchY = event.rawY
                        return true
                    }
                    MotionEvent.ACTION_MOVE -> {
                        layoutParams?.x = initialX + (event.rawX - touchX).toInt()
                        layoutParams?.y = initialY + (event.rawY - touchY).toInt()
                        try {
                            windowManager.updateViewLayout(overlayView, layoutParams)
                        } catch (_: Exception) {}
                        return true
                    }
                    MotionEvent.ACTION_UP -> {
                        val dx = Math.abs(event.rawX - touchX)
                        val dy = Math.abs(event.rawY - touchY)
                        if (dx < 10 && dy < 10) {
                            if (isCardMode) showPill()
                        }
                        return true
                    }
                }
                return false
            }
        })
    }

    private fun observeState() {
        app.offerStateMachine.stateFlow.onEach { state ->
            when (state) {
                is OfferState.Analyzing -> {
                    showCard(state.decision)
                }
                is OfferState.Idle -> {
                    if (isCardMode) showPill()
                }
                else -> {}
            }
        }.launchIn(serviceScope)
    }

    override fun onDestroy() {
        isRunning = false
        serviceScope.cancel()
        overlayView?.let {
            try {
                windowManager.removeView(it)
            } catch (_: Exception) {}
        }
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
