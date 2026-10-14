package com.rotametric.app.data.repository

import com.rotametric.app.core.model.RideRecord
import com.rotametric.app.core.util.TimeFormatter
import com.rotametric.app.data.local.dao.RideAggregate
import com.rotametric.app.data.local.dao.RideDao
import com.rotametric.app.data.local.entity.RideEntity
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class RideRepository(private val dao: RideDao) {

    suspend fun save(record: RideRecord): Long = dao.insert(RideEntity.from(record))

    suspend fun update(record: RideRecord) = dao.update(RideEntity.from(record))

    fun observeAll(): Flow<List<RideRecord>> = dao.observeAll().map { l -> l.map { it.toModel() } }

    fun observeToday(): Flow<List<RideRecord>> =
        dao.observeSince(TimeFormatter.startOfToday()).map { l -> l.map { it.toModel() } }

    fun observeTodayAggregate(): Flow<RideAggregate> = dao.observeAggregateSince(TimeFormatter.startOfToday())

    fun observeByShift(shiftId: Long): Flow<List<RideRecord>> =
        dao.observeByShift(shiftId).map { l -> l.map { it.toModel() } }

    suspend fun getAll(): List<RideRecord> = dao.getAll().map { it.toModel() }

    suspend fun aggregateByShift(shiftId: Long): RideAggregate = dao.aggregateByShift(shiftId)
}