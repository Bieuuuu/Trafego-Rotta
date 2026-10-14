package com.rotametric.app.ui.onboarding

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rotametric.app.ui.components.PermissionRow
import com.rotametric.app.ui.theme.DarkBackground
import com.rotametric.app.ui.theme.TextPrimary
import com.rotametric.app.ui.theme.TextSecondary

@Composable
fun OnboardingScreen(
    viewModel: OnboardingViewModel,
    onComplete: () -> Unit
) {
    val status by viewModel.status.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
            .padding(24.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column {
            Text("Bem-vindo ao RotaMetric", fontSize = 24.sp, color = TextPrimary)
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                "Seu copiloto financeiro inteligente para Uber e 99. Antes de começar, precisamos de algumas permissões do Android.",
                fontSize = 14.sp,
                color = TextSecondary
            )
            Spacer(modifier = Modifier.height(24.dp))

            PermissionRow(
                title = "Serviço de Acessibilidade",
                description = "Necessário para ler o valor e distância das ofertas.",
                granted = status.accessibilityEnabled,
                onRequest = {}
            )

            PermissionRow(
                title = "Sobrepor a Outros Apps",
                description = "Permite exibir a pílula e card de lucro na tela.",
                granted = status.overlayGranted,
                onRequest = {}
            )
        }

        Button(
            onClick = {
                viewModel.completeOnboarding()
                onComplete()
            },
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3B82F6))
        ) {
            Text("Concluir e Ir para o Painel")
        }
    }
}
