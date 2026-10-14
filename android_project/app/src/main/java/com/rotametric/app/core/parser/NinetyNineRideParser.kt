package com.rotametric.app.core.parser

import com.rotametric.app.core.model.AppSource

/**
 * Heurísticas para a tela de oferta do 99 Motorista (pt-BR).
 */
class NinetyNineRideParser : BaseRideParser() {
    override val source = AppSource.NINETY_NINE
    override val pickupKeywords = listOf("até o passageiro", "até você", "embarque", "buscar", "partida", "de distância")
    override val tripKeywords = listOf("viagem", "destino", "corrida", "percurso")
    override val offerMarkers = listOf("aceitar", "99pop", "99", "nova corrida", "corrida", "viagem")
}