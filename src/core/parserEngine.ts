import { AppSource, RideOffer } from '../types/rotametric';

export interface ParseResult {
  success: boolean;
  offer?: RideOffer;
  confidence: number; // 0 to 100
  logs: string[];
  errorMessage?: string;
}

export class ParserEngine {
  /**
   * Parse arbitrary text simulating the accessibility node tree from Uber Driver or 99 Motorista
   */
  static parseOfferText(rawText: string, defaultSource: AppSource = 'UBER'): ParseResult {
    const logs: string[] = [];
    const normalized = rawText
      .replace(/\r/g, ' ')
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    logs.push(`Texto normalizado: "${normalized}"`);

    // Detect platform
    let source: AppSource = defaultSource;
    const lower = normalized.toLowerCase();
    if (lower.includes('99') || lower.includes('pop') || lower.includes('poupa') || lower.includes('corrida 99')) {
      source = 'NINETY_NINE';
      logs.push('Plataforma detectada: 99 Motorista');
    } else if (lower.includes('uber') || lower.includes('uberx') || lower.includes('black') || lower.includes('comfort')) {
      source = 'UBER';
      logs.push('Plataforma detectada: Uber Driver');
    }

    // Extract monetary values (e.g., R$ 25,40 or 25,40 or R$25.40)
    let offeredValue = 0;
    const currencyMatches = normalized.match(/R\$\s*(\d+[\.,]\d{2})|(?:\bvalor\s*[:=]?\s*R?\$\s*|\bganho\s*[:=]?\s*R?\$\s*)(\d+[\.,]\d{2})/i);
    if (currencyMatches) {
      const rawVal = currencyMatches[1] || currencyMatches[2];
      offeredValue = parseFloat(rawVal.replace(',', '.'));
      logs.push(`Valor monetário extraído com prefixo R$: R$ ${offeredValue.toFixed(2)}`);
    } else {
      // Secondary fallback regex for plain numbers formatted like 19,90
      const standaloneNumMatch = normalized.match(/\b(\d{1,3}[\.,]\d{2})\b/);
      if (standaloneNumMatch) {
        offeredValue = parseFloat(standaloneNumMatch[1].replace(',', '.'));
        logs.push(`Valor monetário aproximado extraído: R$ ${offeredValue.toFixed(2)}`);
      }
    }

    // Extract distances (e.g., 2,4 km or 800 m)
    const distanceRegex = /(\d+[\.,]?\d*)\s*(km|m)\b/gi;
    const foundDistances: number[] = [];
    let match: RegExpExecArray | null;
    while ((match = distanceRegex.exec(normalized)) !== null) {
      const num = parseFloat(match[1].replace(',', '.'));
      const unit = match[2].toLowerCase();
      const km = unit === 'm' ? num / 1000 : num;
      foundDistances.push(km);
      logs.push(`Distância encontrada: ${match[0]} (${km.toFixed(2)} km)`);
    }

    // Extract times (e.g. 5 min, 1h 12 min, 45m, 1h)
    const timeRegex = /(?:(\d+)\s*h(?:oras?)?\s*)?(\d+)\s*min(?:utos?)?/gi;
    const foundTimes: number[] = [];
    while ((match = timeRegex.exec(normalized)) !== null) {
      const hours = match[1] ? parseInt(match[1], 10) : 0;
      const mins = match[2] ? parseInt(match[2], 10) : 0;
      const totalMinutes = hours * 60 + mins;
      foundTimes.push(totalMinutes);
      logs.push(`Tempo encontrado: ${match[0]} (${totalMinutes} min)`);
    }

    // Calculate pickup vs trip values
    let pickupDistanceKm = 1.2;
    let tripDistanceKm = 5.0;
    let pickupTimeMinutes = 4;
    let tripTimeMinutes = 15;

    if (foundDistances.length === 1) {
      // Single distance provided: assume mostly trip distance with small default pickup
      tripDistanceKm = foundDistances[0];
      pickupDistanceKm = Math.min(1.5, Math.max(0.5, tripDistanceKm * 0.15));
      logs.push(`1 distância detectada. Viagem = ${tripDistanceKm} km, Embarque est. = ${pickupDistanceKm.toFixed(1)} km`);
    } else if (foundDistances.length >= 2) {
      pickupDistanceKm = Math.min(foundDistances[0], foundDistances[1]);
      tripDistanceKm = Math.max(foundDistances[0], foundDistances[1]);
      logs.push(`2+ distâncias detectadas. Embarque = ${pickupDistanceKm} km, Viagem = ${tripDistanceKm} km`);
    }

    if (foundTimes.length === 1) {
      tripTimeMinutes = foundTimes[0];
      pickupTimeMinutes = Math.min(5, Math.max(2, Math.round(tripTimeMinutes * 0.2)));
      logs.push(`1 tempo detectado. Viagem = ${tripTimeMinutes} min, Embarque est. = ${pickupTimeMinutes} min`);
    } else if (foundTimes.length >= 2) {
      pickupTimeMinutes = Math.min(foundTimes[0], foundTimes[1]);
      tripTimeMinutes = Math.max(foundTimes[0], foundTimes[1]);
      logs.push(`2+ tempos detectados. Embarque = ${pickupTimeMinutes} min, Viagem = ${tripTimeMinutes} min`);
    }

    // Calculate parser confidence
    let confidence = 0;
    if (offeredValue > 0) confidence += 40;
    if (foundDistances.length >= 2) confidence += 30;
    else if (foundDistances.length === 1) confidence += 20;
    if (foundTimes.length >= 2) confidence += 20;
    else if (foundTimes.length === 1) confidence += 10;
    if (source) confidence += 10;

    if (offeredValue <= 0) {
      return {
        success: false,
        confidence: 20,
        logs,
        errorMessage: 'Não foi possível identificar o valor monetário da corrida (ex: R$ 25,00).'
      };
    }

    const offer: RideOffer = {
      id: 'offer_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      source,
      offeredValue: Number(offeredValue.toFixed(2)),
      pickupDistanceKm: Number(pickupDistanceKm.toFixed(1)),
      tripDistanceKm: Number(tripDistanceKm.toFixed(1)),
      pickupTimeMinutes,
      tripTimeMinutes,
      detectedAt: Date.now(),
      rawText: normalized,
    };

    return {
      success: true,
      offer,
      confidence,
      logs,
    };
  }
}
