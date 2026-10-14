package com.rotametric.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.rotametric.app.core.model.Shift

@Entity(tableName = "shifts")
data class ShiftEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val startTimestamp: Long,
    val endTimestamp: Long?,
    val totalRidesAccepted: Int,
    val totalRidesRejected: Int,
    val totalGrossRevenue: Double,
    val totalEstimatedNetProfit: Double,
    val totalDistanceKm: Double,
    val totalTimeMinutes: Double,
    val totalFuelCost: Double,
    val notes: String
) {
    fun toModel() = Shift(
        id, startTimestamp, endTimestamp, totalRidesAccepted, totalRidesRejected,
        totalGrossRevenue, totalEstimatedNetProfit, totalDistanceKm, totalTimeMinutes, totalFuelCost, notes
    )

    companion object {
        fun from(s: Shift) = ShiftEntity(
            s.id, s.startTimestamp, s.endTimestamp, s.totalRidesAccepted, s.totalRidesRejected,
            s.totalGrossRevenue, s.totalEstimatedNetProfit, s.totalDistanceKm, s.totalTimeMinutes, s.totalFuelCost, s.notes
        )
    }
}