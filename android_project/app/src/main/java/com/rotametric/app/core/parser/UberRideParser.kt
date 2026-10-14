package com.rotametric.app.core.parser

import com.rotametric.app.core.model.AppSource

/**
 * Heurísticas para a tela de oferta do Uber Driver (pt-BR).
 * Layouts mudam com frequência; o parser depende apenas de textos visíveis.
 */
class UberRideParser : BaseRideParser() {
    override val source = AppSource.UBER
    override val pickupKeywords = listOf("de distância", "até o passageiro", "buscar", "embarque", "retirada", "away")
    override val tripKeywords = listOf("viagem", "trip", "destino", "corrida")
    override val offerMarkers = listOf("aceitar", "uberx", "uber ", "comfort", "black", "flash", "viagem", "accept")
}