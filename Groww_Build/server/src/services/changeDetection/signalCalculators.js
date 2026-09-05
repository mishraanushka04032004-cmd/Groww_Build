/**
 * Pure signal evaluation functions for the Meaningful Change Engine
 */

/**
 * Calculate normalized price movement signal (0 - 100)
 * Evaluates absolute % delta against user baseline price.
 * Formula: Cap at 5% movement = 100 points
 */
export const calculatePriceSignal = (currentPrice, baselinePrice) => {
  if (!baselinePrice || baselinePrice <= 0 || !currentPrice) return 0;

  const deltaPercent = Math.abs(((currentPrice - baselinePrice) / baselinePrice) * 100);
  const normalizedScore = Math.min(100, Math.max(0, (deltaPercent / 5.0) * 100));

  return {
    score: Number(normalizedScore.toFixed(1)),
    deltaPercent: Number((((currentPrice - baselinePrice) / baselinePrice) * 100).toFixed(2)),
  };
};

/**
 * Calculate normalized volume anomaly signal (0 - 100)
 * Evaluates volume ratio against 20-period historical moving average.
 * R >= 3.0x -> 100, R >= 2.0x -> 80, R <= 1.0x -> 20
 */
export const calculateVolumeSignal = (currentVolume, averageVolume) => {
  if (!averageVolume || averageVolume <= 0 || !currentVolume) {
    return { score: 20, volumeRatio: 1.0 };
  }

  const volumeRatio = currentVolume / averageVolume;
  let score = 20;

  if (volumeRatio >= 3.0) {
    score = 100;
  } else if (volumeRatio >= 2.0) {
    score = 80 + ((volumeRatio - 2.0) / 1.0) * 20;
  } else if (volumeRatio >= 1.2) {
    score = 40 + ((volumeRatio - 1.2) / 0.8) * 40;
  } else {
    score = Math.max(0, (volumeRatio / 1.2) * 40);
  }

  return {
    score: Number(score.toFixed(1)),
    volumeRatio: Number(volumeRatio.toFixed(2)),
  };
};

/**
 * Calculate normalized volatility signal (0 - 100)
 * Evaluates intraday range (High - Low) relative to 14-period Average True Range (ATR).
 */
export const calculateVolatilitySignal = (dayHigh, dayLow, atr14) => {
  if (!atr14 || atr14 <= 0 || dayHigh === undefined || dayLow === undefined) {
    return { score: 20, volatilityRatio: 1.0 };
  }

  const intradayRange = dayHigh - dayLow;
  const volatilityRatio = intradayRange / atr14;
  const score = Math.min(100, Math.max(0, ((volatilityRatio - 0.5) / 1.5) * 100));

  return {
    score: Number(score.toFixed(1)),
    volatilityRatio: Number(volatilityRatio.toFixed(2)),
  };
};

/**
 * Calculate normalized trend shift signal (0 - 100)
 * Evaluates if price crossed key moving averages (SMA20) since user baseline.
 */
export const calculateTrendSignal = (currentPrice, baselinePrice, sma20) => {
  if (!sma20 || !baselinePrice || !currentPrice) {
    return { score: 20, crossedSMA20: false, direction: 'NEUTRAL' };
  }

  const wasBelow = baselinePrice < sma20;
  const isAbove = currentPrice >= sma20;
  const wasAbove = baselinePrice > sma20;
  const isBelow = currentPrice <= sma20;

  if (wasBelow && isAbove) {
    return { score: 100, crossedSMA20: true, direction: 'BULLISH' };
  }
  if (wasAbove && isBelow) {
    return { score: 100, crossedSMA20: true, direction: 'BEARISH' };
  }

  // Extension from SMA20
  const deltaSMA = Math.abs(((currentPrice - sma20) / sma20) * 100);
  const score = Math.min(70, Math.max(10, (deltaSMA / 3.0) * 70));

  return {
    score: Number(score.toFixed(1)),
    crossedSMA20: false,
    direction: currentPrice >= sma20 ? 'BULLISH' : 'BEARISH',
  };
};

/**
 * Calculate normalized breakout / breakdown signal (0 - 100)
 * Evaluates if price breached 20-day high resistance or 20-day low support.
 */
export const calculateBreakoutSignal = (currentPrice, high20Day, low20Day) => {
  if (!currentPrice || (!high20Day && !low20Day)) {
    return { score: 0, isBreakout: false, isBreakdown: false };
  }

  if (high20Day && currentPrice > high20Day) {
    return { score: 100, isBreakout: true, isBreakdown: false, level: high20Day };
  }
  if (low20Day && currentPrice < low20Day) {
    return { score: 100, isBreakout: false, isBreakdown: true, level: low20Day };
  }
  if (high20Day && currentPrice >= 0.98 * high20Day) {
    return { score: 60, isBreakout: false, isBreakdown: false, testingResistance: true };
  }

  return { score: 10, isBreakout: false, isBreakdown: false };
};
