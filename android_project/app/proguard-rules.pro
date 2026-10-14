# Room
-keep class * extends androidx.room.RoomDatabase
-dontwarn androidx.room.paging.**

# Kotlin coroutines
-dontwarn kotlinx.coroutines.**

# Mantém entidades e modelos usados por reflexão no Room
-keep class com.rotametric.app.data.local.entity.** { *; }
-keep class com.rotametric.app.core.model.** { *; }

# Serviços declarados no manifest
-keep class com.rotametric.app.service.** { *; }