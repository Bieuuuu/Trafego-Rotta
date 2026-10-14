package com.rotametric.app.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import androidx.room.Update
import com.rotametric.app.data.local.entity.ShiftEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface ShiftDao {
    @Insert
    suspend fun insert(shift: ShiftEntity): Long

    @Update
    suspend fun update(shift: ShiftEntity)

    @Query("SELECT * FROM shifts WHERE endTimestamp IS NULL ORDER BY startTimestamp DESC LIMIT 1")
    fun observeActive(): Flow<ShiftEntity?>

    @Query("SELECT * FROM shifts WHERE endTimestamp IS NULL ORDER BY startTimestamp DESC LIMIT 1")
    suspend fun getActive(): ShiftEntity?

    @Query("SELECT * FROM shifts WHERE id = :id")
    suspend fun getById(id: Long): ShiftEntity?

    @Query("SELECT * FROM shifts ORDER BY startTimestamp DESC")
    fun observeAll(): Flow<List<ShiftEntity>>
}