package com.rotametric.app.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rotametric.app.ui.theme.GreenDecision
import com.rotametric.app.ui.theme.TextPrimary
import com.rotametric.app.ui.theme.TextSecondary

@Composable
fun PermissionRow(
    title: String,
    description: String,
    granted: Boolean,
    onRequest: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(title, color = TextPrimary, fontSize = 14.sp)
            Text(description, color = TextSecondary, fontSize = 12.sp)
        }
        Spacer(modifier = Modifier.width(8.dp))
        if (granted) {
            Text("✅ Ativo", color = GreenDecision, fontSize = 12.sp)
        } else {
            Button(
                onClick = onRequest,
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3B82F6))
            ) {
                Text("Ativar", fontSize = 12.sp)
            }
        }
    }
}
