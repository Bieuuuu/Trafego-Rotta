package com.rotametric.app.ui.onboarding

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rotametric.app.ui.theme.DarkBackground
import com.rotametric.app.ui.theme.TextPrimary
import com.rotametric.app.ui.theme.TextSecondary

@Composable
fun PermissionDisclosureScreen(
    title: String,
    disclosureText: String,
    onAccept: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
            .padding(24.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column {
            Text(text = title, fontSize = 22.sp, color = TextPrimary)
            Spacer(modifier = Modifier.height(16.dp))
            Text(text = disclosureText, fontSize = 14.sp, color = TextSecondary, lineHeight = 20.sp)
        }
        Button(
            onClick = onAccept,
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981))
        ) {
            Text("Entendi e Concordo", color = Color.White)
        }
    }
}
