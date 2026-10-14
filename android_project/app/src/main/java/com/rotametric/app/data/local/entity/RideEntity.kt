package com.rotametric.app.data.local.entity

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey
import com.rotametric.app.core.model.AppSource
import com.rotametric.app.core.model.DecisionLevel
import com.rotametric.app.core.model.ManualDecision
import com.rotametric.app.core.model.RideRecord

@Entity(tableName = "rides", indices = [Index("shiftId"), Index("detectedAt")])
data class RideEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val shiftId: Long?,
    val platform: String,
    val detectedAt: Long,
    val offeredValue: Double,
    val pickupDistanceKm: Double,
    val tripDistanceKm: Double,
    val pickupTimeMinutes: Double,
    val tripTimeMinutes: Double,
    val totalDistanceKm: Double,
    val totalTimeMinutes: Double,
    val valuePerKm: Double,
    val valuePerHour: Double,
    val fuelCost: Double,
    val estimatedNetProfit: Double,
    val decisionLevel: String,
    val manualDecision: String,
    val manuallyEntered: Boolean,
    val confidenceScore: Float,
    val rawTextSummary: String
) {
    fun toModel() = RideRecord(
        id = id,
        shiftId = shiftId,
        platform = runCatching { AppSource.valueOf(platform) }.getOrDefault(AppSource.UNKNOWN),
        detectedAt = detectedAt,
        offeredValue = offeredValue,
        pickupDistanceKm = pickupDistanceKm,
        tripDistanceKm = tripDistanceKm,
        pickupTimeMinutes = pickupTimeMinutes,
        tripTimeMinutes = tripTimeMinutes,
        totalDistanceKm = totalDistanceKm,
        totalTimeMinutes = totalTimeMinutes,
        valuePerKm = valuePerKm,
        valuePerHour = valuePerHour,
        fuelCost = fuelCost,
        estimatedNetProfit = estimatedNetProfit,
        decisionLevel = runCatching { DecisionLevel.valueOf(decisionLevel) }.getOrDefault(DecisionLevel.UNKNOWN),
        manualDecision = runCatching { ManualDecision.valueOf(manualDecision) }.getOrDefault(ManualDecision.UNDECIDED),
        manuallyEntered = manuallyEntered,
        confidenceScore = confidenceScore,
        rawTextSummary = rawTextSummary
    )

    companion object {
        fun from(r: RideRecord) = RideEntity(
            id = r.id,
            shiftId = r.shiftId,
            platform = r.platform.name,
            detectedAt = r.detectedAt,
            offeredValue = r.offeredValue,
            pickupDistanceKm = r.pickupDistanceKm,
            tripDistanceKm = r.tripDistanceKm,
            pickupTimeMinutes = r.pickupTimeMinutes,
            tripTimeMinutes = r.tripTimeMinutes,
            totalDistanceKm = r.totalDistanceKm,
            totalTimeMinutes = r.totalTimeMinutes,
            valuePerKm = r.valuePerKm,
            valuePerHour = r.valuePerHour,
            fuelCost = r.fuelCost,
            estimatedNetProfit = r.estimatedNetProfit,
            decisionLevel = r.decisionLevel.name,
            manualDecision = r.manualDecision.name,
            manuallyEntered = r.manuallyEntered,
            confidenceScore = r.confidenceScore,
            rawTextSummary = r.rawTextSummary
        )
    }
}