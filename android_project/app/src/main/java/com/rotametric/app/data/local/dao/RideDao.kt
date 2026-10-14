package com.rotametric.app.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import androidx.room.Update
import com.rotametric.app.data.local.entity.RideEntity
import kotlinx.coroutines.flow.Flow

data class RideAggregate(
    val count: Int,
    val accepted: Int,
    val rejected: Int,
    val gross: Double,
    val netProfit: Double,
    val distanceKm: Double,
    val timeMinutes: Double,
    val fuelCost: Double
)

@Dao
interface RideDao {
    @Insert
    suspend fun insert(ride: RideEntity): Long

    @Update
    suspend fun update(ride: RideEntity)

    @Query("SELECT * FROM rides ORDER BY detectedAt DESC")
    fun observeAll(): Flow<List<RideEntity>>

    @Query("SELECT * FROM rides WHERE detectedAt >= :since ORDER BY detectedAt DESC")
    fun observeSince(since: Long): Flow<List<RideEntity>>

    @Query("SELECT * FROM rides WHERE shiftId = :shiftId ORDER BY detectedAt DESC")
    fun observeByShift(shiftId: Long): Flow<List<RideEntity>>

    @Query("SELECT * FROM rides ORDER BY detectedAt DESC")
    suspend fun getAll(): List<RideEntity>

    @Query(
        """
        SELECT COUNT(*) AS count,
               SUM(CASE WHEN manualDecision = 'ACCEPTED' THEN 1 ELSE 0 END) AS accepted,
               SUM(CASE WHEN manualDecision = 'REJECTED' THEN 1 ELSE 0 END) AS rejected,
               COALESCE(SUM(CASE WHEN manualDecision = 'ACCEPTED' THEN offeredValue ELSE 0 END), 0) AS gross,
               COALESCE(SUM(CASE WHEN manualDecision = 'ACCEPTED' THEN estimatedNetProfit ELSE 0 END), 0) AS netProfit,
               COALESCE(SUM(CASE WHEN manualDecision = 'ACCEPTED' THEN totalDistanceKm ELSE 0 END), 0) AS distanceKm,
               COALESCE(SUM(CASE WHEN manualDecision = 'ACCEPTED' THEN totalTimeMinutes ELSE 0 END), 0) AS timeMinutes,
               COALESCE(SUM(CASE WHEN manualDecision = 'ACCEPTED' THEN fuelCost ELSE 0 END), 0) AS fuelCost
        FROM rides WHERE detectedAt >= :since
        """
    )
    fun observeAggregateSince(since: Long): Flow<RideAggregate>

    @Query(
        """
        SELECT COUNT(*) AS count,
               SUM(CASE WHEN manualDecision = 'ACCEPTED' THEN 1 ELSE 0 END) AS accepted,
               SUM(CASE WHEN manualDecision = 'REJECTED' THEN 1 ELSE 0 END) AS rejected,
               COALESCE(SUM(CASE WHEN manualDecision = 'ACCEPTED' THEN offeredValue ELSE 0 END), 0) AS gross,
               COALESCE(SUM(CASE WHEN manualDecision = 'ACCEPTED' THEN estimatedNetProfit ELSE 0 END), 0) AS netProfit,
               COALESCE(SUM(CASE WHEN manualDecision = 'ACCEPTED' THEN totalDistanceKm ELSE 0 END), 0) AS distanceKm,
               COALESCE(SUM(CASE WHEN manualDecision = 'ACCEPTED' THEN totalTimeMinutes ELSE 0 END), 0) AS timeMinutes,
               COALESCE(SUM(CASE WHEN manualDecision = 'ACCEPTED' THEN fuelCost ELSE 0 END), 0) AS fuelCost
        FROM rides WHERE shiftId = :shiftId
        """
    )
    suspend fun aggregateByShift(shiftId: Long): RideAggregate

    @Query("DELETE FROM rides WHERE detectedAt < :before")
    suspend fun deleteOlderThan(before: Long)
}