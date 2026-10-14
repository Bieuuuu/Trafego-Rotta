# Arquitetura do RotaMetric

Arquitetura modular em camadas, desacoplada e 100% testável:
1. **Core Domain**: Modelos imutáveis, algoritmos matemáticos sem dependência de Android SDK.
2. **Parser Layer**: Interpreta árvores de acessibilidade transformadas em NodeSnapshot.
3. **State Engine**: State Machine com debounce e detecção de ciclos de vida de chamadas.
4. **Data Layer**: Room SQLite com DataStore Preferences para configurações.
5. **UI Layer**: Jetpack Compose com Material 3 e WindowManager Overlays nativas.
