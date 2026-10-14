package com.rotametric.app

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import com.rotametric.app.core.calculator.DecisionClassifier
import com.rotametric.app.core.calculator.ProfitEngine
import com.rotametric.app.core.state.OfferStateMachine
import com.rotametric.app.data.local.AppDatabase
import com.rotametric.app.data.repository.RideRepository
import com.rotametric.app.data.repository.ShiftRepository
import com.rotametric.app.data.settings.UserPreferencesRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob

/**
 * ServiceLocator simples. Sem Hilt/Dagger, conforme requisito.
 */
class RotaMetricApp : Application() {

    lateinit var container: AppContainer
        private set

    override fun onCreate() {
        super.onCreate()
        container = AppContainer(this)
        createNotificationChannels()
    }

    private fun createNotificationChannels() {
        val nm = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        nm.createNotificationChannel(
            NotificationChannel(
                CHANNEL_OVERLAY,
                getString(R.string.notification_channel_overlay),
                NotificationManager.IMPORTANCE_LOW
            )
        )
        nm.createNotificationChannel(
            NotificationChannel(
                CHANNEL_SHIFT,
                getString(R.string.notification_channel_shift),
                NotificationManager.IMPORTANCE_LOW
            )
        )
    }

    companion object {
        const val CHANNEL_OVERLAY = "rotametric_overlay"
        const val CHANNEL_SHIFT = "rotametric_shift"

        fun from(context: Context): RotaMetricApp = context.applicationContext as RotaMetricApp
    }
}

class AppContainer(context: Context) {
    val appScope: CoroutineScope = CoroutineScope(SupervisorJob() + Dispatchers.Default)
    val database: AppDatabase = AppDatabase.getInstance(context)
    val preferences: UserPreferencesRepository = UserPreferencesRepository(context)
    val rideRepository: RideRepository = RideRepository(database.rideDao())
    val shiftRepository: ShiftRepository = ShiftRepository(database.shiftDao(), database.rideDao())
    val profitEngine: ProfitEngine = ProfitEngine()
    val decisionClassifier: DecisionClassifier = DecisionClassifier()
    val offerStateMachine: OfferStateMachine = OfferStateMachine()
}