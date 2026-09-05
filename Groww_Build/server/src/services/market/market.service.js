import { getMarketProvider } from './marketProvider.service.js';
import { MarketSnapshot } from '../../models/MarketSnapshot.js';
import { logger } from '../../config/logger.js';

// In-memory cache layer for low-latency quote retrieval (TTL: 60s)
const memoryCache = new Map();
const CACHE_TTL_MS = 60 * 1000;

export class MarketService {
  /**
   * Get latest quote for a symbol with caching and fallback
   */
  static async getQuote(symbol) {
    const upperSymbol = symbol.toUpperCase().trim();
    const cached = memoryCache.get(upperSymbol);

    if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
      return cached.data;
    }

    const provider = getMarketProvider();

    try {
      const liveQuote = await provider.getQuote(upperSymbol);

      // Save snapshot to database
      await MarketSnapshot.create({
        ...liveQuote,
        symbol: upperSymbol,
      });

      // Update in-memory cache
      memoryCache.set(upperSymbol, {
        cachedAt: Date.now(),
        data: liveQuote,
      });

      return liveQuote;
    } catch (error) {
      logger.warn({ symbol: upperSymbol, err: error.message }, 'Provider fetch failed, falling back to cached snapshot');

      // Fallback: Query latest snapshot from MongoDB
      const latestSnapshot = await MarketSnapshot.findOne({ symbol: upperSymbol }).sort({ timestamp: -1 });

      if (latestSnapshot) {
        const fallbackData = {
          ...latestSnapshot.toJSON(),
          isDelayed: true,
          isStale: true,
        };
        return fallbackData;
      }

      throw error;
    }
  }

  /**
   * Batch fetch quotes for an array of unique symbols
   */
  static async getQuotesForSymbols(symbols) {
    const uniqueSymbols = [...new Set(symbols.map((s) => s.toUpperCase().trim()))];
    const quotes = await Promise.all(
      uniqueSymbols.map((sym) =>
        this.getQuote(sym).catch((err) => {
          logger.error({ symbol: sym, err: err.message }, 'Error fetching symbol quote');
          return null;
        })
      )
    );

    return quotes.filter(Boolean);
  }

  /**
   * Get historical candlestick series and indicators
   */
  static async getHistoricalData(symbol, range = '1M') {
    const provider = getMarketProvider();
    return provider.getHistoricalData(symbol.toUpperCase().trim(), range);
  }

  /**
   * Search symbols matching query
   */
  static async searchSymbols(query) {
    const provider = getMarketProvider();
    return provider.searchSymbols(query);
  }
}
