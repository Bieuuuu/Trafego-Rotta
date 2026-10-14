# RotaMetric - Copiloto Financeiro para Motoristas de Aplicativo

O **RotaMetric** é um aplicativo Android nativo completo projetado para motoristas da Uber e 99. Ele atua como um copiloto financeiro em tempo real que analisa ofertas de corrida através de um serviço de acessibilidade, calcula instantaneamente a viabilidade econômica (R$/km, R$/hora, custo estimado de combustível e lucro líquido), e exibe as métricas em uma overlay flutuante (modo pílula e modo card expandido).

## Funcionalidades Principais
1. **Parser Inteligente de Ofertas**: Lê telas de chamadas da Uber e 99 via AccessibilityService (sem automação de cliques nem violação de termos).
2. **Motor Financeiro Configurável**: Considera consumo do carro, preço do combustível, taxa da plataforma e meta mínima.
3. **Classificação em Semáforo**:
   - 🟢 **Excelente**: Acima das metas com lucro real comprovado.
   - 🟡 **Atenção**: Margem apertada, avaliar trânsito e destino.
   - 🔴 **Prejuízo**: Corrida que paga menos que o custo por km/h.
4. **Overlay Flutuante Arrastável**: Pílula compacta de faturamento e card expandido nas chamadas com botões de registro manual.
5. **Rastreamento de Turnos e Exportação CSV**: Armazena histórico offline em banco Room e gera planilhas via Storage Access Framework.

## Estrutura do Projeto
- `app/src/main/java/com/rotametric/app/core/`: Modelos, Parser, ProfitEngine, StateMachine.
- `app/src/main/java/com/rotametric/app/service/`: AccessibilityService e FloatingOverlayService.
- `app/src/main/java/com/rotametric/app/data/`: Room database, DAOs, repositórios.
- `app/src/main/java/com/rotametric/app/ui/`: Interface completa em Jetpack Compose.
