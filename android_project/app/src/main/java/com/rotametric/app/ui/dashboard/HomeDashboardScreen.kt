package com.rotametric.app.ui.dashboard

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rotametric.app.core.util.CurrencyFormatter
import com.rotametric.app.ui.components.MetricCard
import com.rotametric.app.ui.theme.DarkBackground
import com.rotametric.app.ui.theme.TextPrimary
import com.rotametric.app.ui.theme.TextSecondary

@Composable
fun HomeDashboardScreen(viewModel: DashboardViewModel) {
    val activeShift by viewModel.activeShift.collectAsState()
    val recentRides by viewModel.recentRides.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
            .padding(16.dp)
    ) {
        Text("Painel RotaMetric", fontSize = 24.sp, color = TextPrimary)
        Spacer(modifier = Modifier.height(16.dp))

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            MetricCard(
                title = "Faturamento",
                value = CurrencyFormatter.formatBrl(activeShift?.totalGrossRevenue ?: 0.0),
                modifier = Modifier.weight(1f)
            )
            MetricCard(
                title = "Lucro Líquido",
                value = CurrencyFormatter.formatBrl(activeShift?.totalEstimatedNetProfit ?: 0.0),
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(16.dp))
        Button(
            onClick = {
                if (activeShift == null) viewModel.startShift() else viewModel.finishShift()
            },
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.buttonColors(
                containerColor = if (activeShift == null) Color(0xFF10B981) else Color(0xFFEF4444)
            )
        ) {
            Text(if (activeShift == null) "▶ Iniciar Turno" else "⏹ Encerrar Turno")
        }

        Spacer(modifier = Modifier.height(24.dp))
        Text("Últimas Corridas Analisadas", fontSize = 16.sp, color = TextSecondary)
        Spacer(modifier = Modifier.height(8.dp))

        LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(recentRides.take(10)) { ride ->
                MetricCard(
                    title = "${ride.platform} • R$ ${ride.offeredValue}",
                    value = "R$ ${String.format(\"%.2f\", ride.valuePerKm)} / km",
                    subtitle = "Lucro estimado: R$ ${String.format(\"%.2f\", ride.estimatedNetProfit)}"
                )
            }
        }
    }
}
