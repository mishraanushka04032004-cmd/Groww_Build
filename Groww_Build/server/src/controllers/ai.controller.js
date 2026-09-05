import { MistralAIService } from '../services/ai/mistral.service.js';
import { MarketService } from '../services/market/market.service.js';
import { calculateMeaningfulness } from '../services/changeDetection/meaningfulChange.service.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAIBriefing = asyncHandler(async (req, res) => {
  const { symbol } = req.params;
  const quote = await MarketService.getQuote(symbol);

  // Evaluate technical parameters
  const evaluated = calculateMeaningfulness({
    symbol: quote.symbol,
    companyName: quote.companyName,
    currentPrice: quote.price,
    baselinePrice: quote.previousClose,
    currentVolume: quote.volume,
    averageVolume: quote.averageVolume,
    dayHigh: quote.high,
    dayLow: quote.low,
    atr14: quote.atr14,
    sma20: quote.sma20,
    high20Day: quote.high20Day,
    low20Day: quote.low20Day,
  });

  const briefing = await MistralAIService.generateMarketBriefing({
    symbol: quote.symbol,
    companyName: quote.companyName,
    currentPrice: quote.price,
    baselinePrice: quote.previousClose,
    deltaPercent: evaluated.deltaPercent,
    volumeRatio: evaluated.metrics.volumeRatio,
    severity: evaluated.severity,
    signals: evaluated.signals,
    explanation: evaluated.explanation,
  });

  return sendSuccess(res, briefing, 200);
});
