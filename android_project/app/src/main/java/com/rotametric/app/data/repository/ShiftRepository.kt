package com.rotametric.app.data.repository

import com.rotametric.app.core.model.Shift
import com.rotametric.app.data.local.dao.RideDao
import com.rotametric.app.data.local.dao.ShiftDao
import com.rotametric.app.data.local.entity.ShiftEntity
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class ShiftRepository(private val shiftDao: ShiftDao, private val rideDao: RideDao) {

    fun observeActive(): Flow<Shift?> = shiftDao.observeActive().map { it?.toModel() }

    fun observeAll(): Flow<List<Shift>> = shiftDao.observeAll().map { l -> l.map { it.toModel() } }

    suspend fun getActive(): Shift? = shiftDao.getActive()?.toModel()

    suspend fun startShift(): Shift {
        getActive()?.let { return it }
        val shift = Shift(startTimestamp = System.currentTimeMillis())
        val id = shiftDao.insert(ShiftEntity.from(shift))
        return shift.copy(id = id)
    }

    /** Encerra o turno ativo consolidando os agregados das corridas registradas nele. */
    suspend fun endActiveShift(notes: String = ""): Shift? {
        val active = getActive() ?: return null
        val agg = rideDao.aggregateByShift(active.id)
        val closed = active.copy(
            endTimestamp = System.currentTimeMillis(),
            totalRidesAccepted = agg.accepted,
            totalRidesRejected = agg.rejected,
            totalGrossRevenue = agg.gross,
            totalEstimatedNetProfit = agg.netProfit,
            totalDistanceKm = agg.distanceKm,
            totalTimeMinutes = agg.timeMinutes,
            totalFuelCost = agg.fuelCost,
            notes = notes
        )
        shiftDao.update(ShiftEntity.from(closed))
        return closed
    }

    /** Atualiza agregados do turno ativo sem encerrá-lo (chamado após cada corrida). */
    suspend fun refreshActiveAggregates() {
        val active = getActive() ?: return
        val agg = rideDao.aggregateByShift(active.id)
        shiftDao.update(
            ShiftEntity.from(
                active.copy(
                    totalRidesAccepted = agg.accepted,
                    totalRidesRejected = agg.rejected,
                    totalGrossRevenue = agg.gross,
                    totalEstimatedNetProfit = agg.netProfit,
                    totalDistanceKm = agg.distanceKm,
                    totalTimeMinutes = agg.timeMinutes,
                    totalFuelCost = agg.fuelCost
                )
            )
        )
    }
}