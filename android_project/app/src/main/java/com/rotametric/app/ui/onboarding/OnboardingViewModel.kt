package com.rotametric.app.ui.onboarding

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.rotametric.app.RotaMetricApp
import com.rotametric.app.core.util.PermissionChecker
import com.rotametric.app.core.util.PermissionStatus
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class OnboardingViewModel(private val app: RotaMetricApp) : ViewModel() {
    private val _status = MutableStateFlow(PermissionChecker.status(app, false))
    val status: StateFlow<PermissionStatus> = _status.asStateFlow()

    fun refresh(context: Context) {
        _status.value = PermissionChecker.status(context, false)
    }

    fun completeOnboarding() {
        viewModelScope.launch {
            app.userPreferencesRepository.setOnboardingDone(true)
            app.userPreferencesRepository.setAccessibilityConsent(true)
        }
    }
}
