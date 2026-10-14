package com.rotametric.app.ui.settings

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rotametric.app.core.model.VehicleConfig
import com.rotametric.app.ui.theme.DarkBackground
import com.rotametric.app.ui.theme.TextPrimary

@Composable
fun SettingsScreen(viewModel: SettingsViewModel) {
    val config by viewModel.vehicleConfig.collectAsState()
    var fuelPrice by remember(config) { mutableStateOf(config.fuelPricePerLiter.toString()) }
    var consumption by remember(config) { mutableStateOf(config.consumptionKmPerLiter.toString()) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
            .padding(16.dp)
    ) {
        Text("Configurações do Veículo", fontSize = 24.sp, color = TextPrimary)
        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = fuelPrice,
            onValueChange = { fuelPrice = it },
            label = { Text("Preço do Combustível (R$/L)") },
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = consumption,
            onValueChange = { consumption = it },
            label = { Text("Consumo do Veículo (km/L)") },
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = {
                viewModel.saveConfig(
                    config.copy(
                        fuelPricePerLiter = fuelPrice.toDoubleOrNull() ?: config.fuelPricePerLiter,
                        consumptionKmPerLiter = consumption.toDoubleOrNull() ?: config.consumptionKmPerLiter
                    )
                )
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Salvar Configurações")
        }
    }
}
