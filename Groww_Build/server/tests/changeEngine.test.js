import test from 'node:test';
import assert from 'node:assert';
import {
  calculatePriceSignal,
  calculateVolumeSignal,
  calculateVolatilitySignal,
  calculateTrendSignal,
  calculateBreakoutSignal,
} from '../src/services/changeDetection/signalCalculators.js';
import { calculateMeaningfulness } from '../src/services/changeDetection/meaningfulChange.service.js';

test('Signal Calculators: Pure mathematical functions', () => {
  // 1. Price signal (5% delta = 100 max)
  const priceResult = calculatePriceSignal(181.30, 170.00);
  assert.ok(priceResult.deltaPercent > 6.0);
  assert.strictEqual(priceResult.score, 100);

  const lowPriceResult = calculatePriceSignal(170.50, 170.00);
  assert.ok(lowPriceResult.score < 20);

  // 2. Volume signal (2.4x avg vol = high score)
  const volResult = calculateVolumeSignal(48000000, 20000000);
  assert.strictEqual(volResult.volumeRatio, 2.4);
  assert.ok(volResult.score >= 80);

  // 3. Volatility signal (day range vs ATR)
  const volaResult = calculateVolatilitySignal(182.40, 177.90, 2.50);
  assert.strictEqual(volaResult.volatilityRatio, 1.8);
  assert.ok(volaResult.score >= 70);

  // 4. Trend signal (Bullish cross above SMA20)
  const trendResult = calculateTrendSignal(181.30, 170.00, 174.50);
  assert.strictEqual(trendResult.crossedSMA20, true);
  assert.strictEqual(trendResult.direction, 'BULLISH');
  assert.strictEqual(trendResult.score, 100);

  // 5. Breakout signal (Price above 20-day high)
  const breakoutResult = calculateBreakoutSignal(181.30, 179.50, 165.00);
  assert.strictEqual(breakoutResult.isBreakout, true);
  assert.strictEqual(breakoutResult.score, 100);
});

test('Meaningful Change Engine: Composite scoring and explanation synthesis', () => {
  const result = calculateMeaningfulness({
    symbol: 'NVDA',
    companyName: 'NVIDIA Corporation',
    currentPrice: 181.30,
    baselinePrice: 170.00,
    currentVolume: 48000000,
    averageVolume: 20000000,
    dayHigh: 182.40,
    dayLow: 177.90,
    atr14: 2.50,
    sma20: 174.50,
    high20Day: 179.50,
    low20Day: 165.00,
  });

  assert.strictEqual(result.symbol, 'NVDA');
  assert.strictEqual(result.severity, 'HIGH');
  assert.ok(result.score >= 70);
  assert.strictEqual(result.type, 'HIGH_VOLUME_BREAKOUT');
  assert.ok(result.explanation.includes('NVDA advanced'));
  assert.ok(result.explanation.includes('2.4x'));
  assert.ok(result.explanation.includes('20-day high resistance'));
});
