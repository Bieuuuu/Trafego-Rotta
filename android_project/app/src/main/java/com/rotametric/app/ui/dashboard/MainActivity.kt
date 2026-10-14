package com.rotametric.app.ui.dashboard

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.lifecycle.viewmodel.compose.viewModel
import com.rotametric.app.RotaMetricApp
import com.rotametric.app.ui.theme.RotaMetricTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val app = application as RotaMetricApp
        val viewModel = DashboardViewModel(app)

        setContent {
            RotaMetricTheme {
                HomeDashboardScreen(viewModel = viewModel)
            }
        }
    }
}
