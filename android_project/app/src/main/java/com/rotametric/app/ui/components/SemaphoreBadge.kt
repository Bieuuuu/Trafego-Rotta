package com.rotametric.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rotametric.app.core.model.DecisionLevel
import com.rotametric.app.ui.theme.GreenDecision
import com.rotametric.app.ui.theme.RedDecision
import com.rotametric.app.ui.theme.YellowDecision

@Composable
fun SemaphoreBadge(level: DecisionLevel, modifier: Modifier = Modifier) {
    val (bg, textColor) = when (level) {
        DecisionLevel.EXCELLENT -> GreenDecision.copy(alpha = 0.2f) to GreenDecision
        DecisionLevel.ATTENTION -> YellowDecision.copy(alpha = 0.2f) to YellowDecision
        DecisionLevel.LOSS -> RedDecision.copy(alpha = 0.2f) to RedDecision
    }

    Text(
        text = "${level.emoji} ${level.label}",
        color = textColor,
        fontSize = 12.sp,
        modifier = modifier
            .background(bg, RoundedCornerShape(8.dp))
            .padding(horizontal = 10.dp, vertical = 4.dp)
    )
}
