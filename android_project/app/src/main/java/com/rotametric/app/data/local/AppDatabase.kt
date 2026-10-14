package com.rotametric.app.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.rotametric.app.data.local.dao.RideDao
import com.rotametric.app.data.local.dao.ShiftDao
import com.rotametric.app.data.local.entity.RideEntity
import com.rotametric.app.data.local.entity.ShiftEntity

@Database(entities = [RideEntity::class, ShiftEntity::class], version = 1, exportSchema = true)
abstract class AppDatabase : RoomDatabase() {
    abstract fun rideDao(): RideDao
    abstract fun shiftDao(): ShiftDao

    companion object {
        @Volatile private var instance: AppDatabase? = null

        fun getInstance(context: Context): AppDatabase = instance ?: synchronized(this) {
            instance ?: Room.databaseBuilder(context.applicationContext, AppDatabase::class.java, "rotametric.db")
                .fallbackToDestructiveMigration()
                .build()
                .also { instance = it }
        }
    }
}