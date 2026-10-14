package com.rotametric.app.ui.reports

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rotametric.app.core.util.CurrencyFormatter
import com.rotametric.app.ui.components.MetricCard
import com.rotametric.app.ui.theme.DarkBackground
import com.rotametric.app.ui.theme.TextPrimary

@Composable
fun ReportsScreen(viewModel: ReportsViewModel) {
    val shifts by viewModel.shifts.collectAsState()
    val rides by viewModel.rides.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
            .padding(16.dp)
    ) {
        Text("Relatórios e Turnos", fontSize = 24.sp, color = TextPrimary)
        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(shifts) { shift ->
                MetricCard(
                    title = "Turno #${shift.id}",
                    value = CurrencyFormatter.formatBrl(shift.totalGrossRevenue),
                    subtitle = "Lucro: ${CurrencyFormatter.formatBrl(shift.totalEstimatedNetProfit)} • ${shift.totalRidesAccepted} aceitas"
                )
            }
        }
    }
}
