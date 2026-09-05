import {
  calculatePriceSignal,
  calculateVolumeSignal,
  calculateVolatilitySignal,
  calculateTrendSignal,
  calculateBreakoutSignal,
} from './signalCalculators.js';

// Weight configuration for the Meaningful Change Engine
export const SIGNAL_WEIGHTS = {
  price: 0.30,      // 30% - Absolute price delta relative to user baseline
  volume: 0.25,     // 25% - Institutional volume expansion ratio
  volatility: 0.15, // 15% - Intraday true range expansion (ATR)
  trend: 0.15,      // 15% - 20-period moving average shift
  breakout: 0.15,   // 15% - 20-day high/low structural breakout
};

/**
 * Synthesize a deterministic, natural-language explanation of why a stock was flagged
 */
export const synthesizeExplanation = ({
  symbol,
  deltaPercent,
  volumeRatio,
  isBreakout,
  isBreakdown,
  crossedSMA20,
  volatilityRatio,
  severity,
}) => {
  const direction = deltaPercent >= 0 ? 'advanced' : 'declined';
  const formattedDelta = `${deltaPercent >= 0 ? '+' : ''}${deltaPercent.toFixed(2)}%`;
  const fragments = [];

  // Price & Volume primary narrative
  if (volumeRatio >= 1.5) {
    fragments.push(`${symbol} ${direction} ${formattedDelta} on trading volume ${volumeRatio}x its recent average`);
  } else {
    fragments.push(`${symbol} ${direction} ${formattedDelta} since your last visit`);
  }

  // Breakout or structural shift
  if (isBreakout) {
    fragments.push('breaking above its 20-day high resistance level');
  } else if (isBreakdown) {
    fragments.push('breaking below its 20-day low support level');
  } else if (crossedSMA20) {
    fragments.push('crossing its 20-day moving average');
  } else if (volatilityRatio >= 1.8) {
    fragments.push('with significant volatility expansion outside its normal range');
  }

  if (fragments.length === 1) {
    if (severity === 'LOW') {
      return `${symbol} experienced routine price movement of ${formattedDelta} within its historical trading range.`;
    }
    return `${fragments[0]}.`;
  }

  return `${fragments.join(', ')}.`;
};

/**
 * Composite Meaningful Change Calculator
 */
export const calculateMeaningfulness = ({
  symbol,
  companyName = '',
  currentPrice,
  baselinePrice,
  currentVolume = 0,
  averageVolume = 0,
  dayHigh,
  dayLow,
  atr14,
  sma20,
  high20Day,
  low20Day,
}) => {
  // If baseline is not established, default to current price
  const effectiveBaseline = baselinePrice || currentPrice;

  // 1. Evaluate individual signals
  const priceResult = calculatePriceSignal(currentPrice, effectiveBaseline);
  const volumeResult = calculateVolumeSignal(currentVolume, averageVolume);
  const volatilityResult = calculateVolatilitySignal(dayHigh, dayLow, atr14);
  const trendResult = calculateTrendSignal(currentPrice, effectiveBaseline, sma20);
  const breakoutResult = calculateBreakoutSignal(currentPrice, high20Day, low20Day);

  // 2. Compute composite weighted score (0 - 100)
  const compositeScore = Number(
    (
      priceResult.score * SIGNAL_WEIGHTS.price +
      volumeResult.score * SIGNAL_WEIGHTS.volume +
      volatilityResult.score * SIGNAL_WEIGHTS.volatility +
      trendResult.score * SIGNAL_WEIGHTS.trend +
      breakoutResult.score * SIGNAL_WEIGHTS.breakout
    ).toFixed(1)
  );

  // 3. Classify severity tier
  let severity = 'LOW';
  if (compositeScore >= 70) {
    severity = 'HIGH';
  } else if (compositeScore >= 40) {
    severity = 'MEDIUM';
  }

  // Determine categorical type
  let type = 'ROUTINE_DRIFT';
  if (breakoutResult.isBreakout && volumeResult.volumeRatio >= 1.5) {
    type = 'HIGH_VOLUME_BREAKOUT';
  } else if (volumeResult.volumeRatio >= 2.0) {
    type = 'VOLUME_SPIKE';
  } else if (priceResult.deltaPercent >= 3.0) {
    type = 'PRICE_SURGE';
  } else if (priceResult.deltaPercent <= -3.0) {
    type = 'PRICE_DROP';
  } else if (trendResult.crossedSMA20 && trendResult.direction === 'BULLISH') {
    type = 'TREND_SHIFT_BULLISH';
  } else if (trendResult.crossedSMA20 && trendResult.direction === 'BEARISH') {
    type = 'TREND_SHIFT_BEARISH';
  } else if (volatilityResult.volatilityRatio >= 1.8) {
    type = 'VOLATILITY_EXPANSION';
  }

  // 4. Synthesize plain-language explanation
  const explanation = synthesizeExplanation({
    symbol,
    deltaPercent: priceResult.deltaPercent,
    volumeRatio: volumeResult.volumeRatio,
    isBreakout: breakoutResult.isBreakout,
    isBreakdown: breakoutResult.isBreakdown,
    crossedSMA20: trendResult.crossedSMA20,
    volatilityRatio: volatilityResult.volatilityRatio,
    severity,
  });

  return {
    symbol,
    companyName,
    severity,
    score: compositeScore,
    type,
    deltaPercent: priceResult.deltaPercent,
    currentPrice,
    baselinePrice: effectiveBaseline,
    signals: {
      priceSignal: priceResult.score,
      volumeSignal: volumeResult.score,
      volatilitySignal: volatilityResult.score,
      trendSignal: trendResult.score,
      breakoutSignal: breakoutResult.score,
    },
    metrics: {
      volumeRatio: volumeResult.volumeRatio,
      volatilityRatio: volatilityResult.volatilityRatio,
      crossedSMA20: trendResult.crossedSMA20,
      isBreakout: breakoutResult.isBreakout,
      isBreakdown: breakoutResult.isBreakdown,
    },
    explanation,
  };
};
