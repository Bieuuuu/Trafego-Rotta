package com.rotametric.app.core.parser

import com.rotametric.app.core.model.AppSource
import com.rotametric.app.core.model.NodeSnapshot
import com.rotametric.app.core.model.ParseResult
import com.rotametric.app.core.model.RideOffer

interface RideParser {
    val source: AppSource
    fun parse(root: NodeSnapshot, timestamp: Long = System.currentTimeMillis()): ParseResult
}

/**
 * Lógica compartilhada entre parsers: varre textos, identifica valor, distâncias e tempos
 * por heurística de palavras-chave e ordem de aparição.
 */
abstract class BaseRideParser : RideParser {

    protected abstract val pickupKeywords: List<String>
    protected abstract val tripKeywords: List<String>
    protected abstract val offerMarkers: List<String>

    override fun parse(root: NodeSnapshot, timestamp: Long): ParseResult {
        val texts = root.allTexts().map(RideDataNormalizer::normalizeText).filter { it.isNotBlank() }
        if (texts.isEmpty()) return ParseResult.NoOffer("Tela vazia")

        val joined = texts.joinToString(" | ")
        val lower = joined.lowercase()
        val looksLikeOffer = offerMarkers.any { lower.contains(it) } || RideDataNormalizer.containsCurrency(joined)
        if (!looksLikeOffer) return ParseResult.NoOffer("Nenhum marcador de oferta")

        val value = texts.firstNotNullOfOrNull { t -> if (RideDataNormalizer.containsCurrency(t)) RideDataNormalizer.parseCurrency(t) else null }

        val distances = mutableListOf<Pair<Double, String>>()
        val times = mutableListOf<Pair<Double, String>>()
        texts.forEach { t ->
            RideDataNormalizer.parseDistanceKm(t)?.let { distances += it to t.lowercase() }
            RideDataNormalizer.parseMinutes(t)?.let { times += it to t.lowercase() }
        }

        val (pickupDist, tripDist) = split(distances)
        val (pickupTime, tripTime) = split(times)

        if (value == null && distances.isEmpty() && times.isEmpty()) {
            return ParseResult.NoOffer("Nenhum campo numérico reconhecido")
        }

        val offer = RideOffer(
            source = source,
            detectedAt = timestamp,
            offeredValue = value,
            pickupDistanceKm = pickupDist,
            tripDistanceKm = tripDist,
            pickupTimeMinutes = pickupTime,
            tripTimeMinutes = tripTime,
            rawTextSummary = joined.take(300)
        )

        val confidence = ParserConfidence.score(
            hasValue = value != null,
            hasTripDistance = tripDist != null,
            hasPickupDistance = pickupDist != null,
            hasTripTime = tripTime != null,
            hasPickupTime = pickupTime != null
        )

        val missing = buildList {
            if (value == null) add("valor")
            if (tripDist == null) add("distância da viagem")
            if (tripTime == null) add("tempo da viagem")
        }

        return if (missing.isEmpty() && confidence >= ParserConfidence.HIGH) ParseResult.Success(offer, confidence)
        else ParseResult.Partial(offer, confidence, missing)
    }

    /**
     * Separa pares (valor, textoOrigem) em (pickup, trip) usando palavras-chave;
     * sem palavras-chave assume ordem: primeiro = busca, segundo = viagem.
     */
    private fun split(items: List<Pair<Double, String>>): Pair<Double?, Double?> {
        if (items.isEmpty()) return null to null
        val pickup = items.firstOrNull { p -> pickupKeywords.any { p.second.contains(it) } }?.first
        val trip = items.firstOrNull { p -> tripKeywords.any { p.second.contains(it) } }?.first
        if (pickup != null || trip != null) {
            val remaining = items.map { it.first }.filter { it != pickup && it != trip }
            return (pickup ?: remaining.firstOrNull()) to (trip ?: remaining.lastOrNull().takeIf { pickup != null })
        }
        return when (items.size) {
            1 -> null to items[0].first
            else -> items[0].first to items[1].first
        }
    }
}