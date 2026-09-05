import { WatchlistItem } from '../../models/WatchlistItem.js';
import { UserMarketState } from '../../models/UserMarketState.js';
import { ChangeEvent } from '../../models/ChangeEvent.js';
import { MarketService } from '../market/market.service.js';
import { calculateMeaningfulness } from './meaningfulChange.service.js';
import { logger } from '../../config/logger.js';

export class ChangeDetectionService {
  /**
   * Run change detection pipeline for a user across all their watchlist stocks
   */
  static async evaluateUserChanges(userId, specificWatchlistId = null) {
    // 1. Fetch user's active watchlist items
    const query = specificWatchlistId ? { watchlistId: specificWatchlistId } : {};
    // Find items for watchlists owned by user
    const items = await WatchlistItem.find(query).populate({
      path: 'watchlistId',
      match: { userId },
      select: '_id name isDefault',
    });

    const userItems = items.filter((item) => item.watchlistId !== null);
    if (userItems.length === 0) {
      return {
        totalChanges: 0,
        highSeverityCount: 0,
        mediumSeverityCount: 0,
        lowSeverityCount: 0,
        prioritizedChanges: [],
      };
    }

    const uniqueSymbols = [...new Set(userItems.map((i) => i.symbol))];

    // 2. Fetch latest quotes for all unique symbols (batch cached)
    const quotes = await MarketService.getQuotesForSymbols(uniqueSymbols);
    const quoteMap = new Map(quotes.map((q) => [q.symbol, q]));

    // 3. Fetch user's baseline states
    const userStates = await UserMarketState.find({ userId, symbol: { $in: uniqueSymbols } });
    const stateMap = new Map(userStates.map((s) => [s.symbol, s]));

    const evaluatedEvents = [];
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    // Build a set of recently-acknowledged symbols so we can skip them
    const acknowledgedStates = await UserMarketState.find({
      userId,
      symbol: { $in: uniqueSymbols },
      lastAcknowledgedAt: { $gte: oneHourAgo },
    }).select('symbol');
    const recentlyAcknowledgedSymbols = new Set(acknowledgedStates.map((s) => s.symbol));

    for (const item of userItems) {
      const quote = quoteMap.get(item.symbol);
      if (!quote) continue;

      // Skip stocks the user has acknowledged within the last hour
      if (recentlyAcknowledgedSymbols.has(item.symbol)) continue;

      let baselineState = stateMap.get(item.symbol);

      // If user has never seen this stock before, initialize baseline to current price
      if (!baselineState) {
        baselineState = await UserMarketState.create({
          userId,
          symbol: item.symbol,
          lastSeenPrice: quote.previousClose || quote.price,
          lastSeenTimestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Default to yesterday's baseline
        });
        stateMap.set(item.symbol, baselineState);
      }

      // 4. Run multi-signal evaluation
      const evaluated = calculateMeaningfulness({
        symbol: quote.symbol,
        companyName: item.displayName || quote.companyName,
        currentPrice: quote.price,
        baselinePrice: baselineState.lastSeenPrice,
        currentVolume: quote.volume,
        averageVolume: quote.averageVolume,
        dayHigh: quote.high,
        dayLow: quote.low,
        atr14: quote.atr14,
        sma20: quote.sma20,
        high20Day: quote.high20Day,
        low20Day: quote.low20Day,
      });

      // 5. Idempotent Deduplication
      // Check if identical event was already recorded for this user within the last hour
      // Only reuse an existing event if it hasn't been acknowledged yet
      const recentEvent = await ChangeEvent.findOne({
        userId,
        symbol: quote.symbol,
        type: evaluated.type,
        detectedAt: { $gte: oneHourAgo },
        acknowledgedAt: null,
      });

      let eventDoc = recentEvent;

      if (!recentEvent) {
        // Persist new change event
        eventDoc = await ChangeEvent.create({
          userId,
          watchlistId: item.watchlistId._id,
          symbol: quote.symbol,
          companyName: item.displayName || quote.companyName,
          type: evaluated.type,
          severity: evaluated.severity,
          score: evaluated.score,
          deltaPercent: evaluated.deltaPercent,
          baseline: {
            price: baselineState.lastSeenPrice,
            timestamp: baselineState.lastSeenTimestamp,
          },
          current: {
            price: quote.price,
            volume: quote.volume,
            volumeRatio: evaluated.metrics.volumeRatio,
            timestamp: quote.timestamp,
          },
          signals: evaluated.signals,
          explanation: evaluated.explanation,
        });

        logger.info(
          { userId, symbol: quote.symbol, severity: evaluated.severity, score: evaluated.score },
          'Meaningful change event detected & persisted'
        );
      }

      evaluatedEvents.push({
        id: eventDoc ? eventDoc._id.toString() : undefined,
        ...evaluated,
        watchlistId: item.watchlistId._id.toString(),
        watchlistName: item.watchlistId.name,
        baselineTimestamp: baselineState.lastSeenTimestamp,
        currentTimestamp: quote.timestamp,
        isDelayed: quote.isDelayed,
        isStale: quote.isStale,
      });
    }

    // 6. Sort prioritized feed: HIGH first, then descending by composite score
    evaluatedEvents.sort((a, b) => {
      const severityWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      if (severityWeight[b.severity] !== severityWeight[a.severity]) {
        return severityWeight[b.severity] - severityWeight[a.severity];
      }
      return b.score - a.score;
    });

    const highSeverityCount = evaluatedEvents.filter((e) => e.severity === 'HIGH').length;
    const mediumSeverityCount = evaluatedEvents.filter((e) => e.severity === 'MEDIUM').length;
    const lowSeverityCount = evaluatedEvents.filter((e) => e.severity === 'LOW').length;

    return {
      totalChanges: evaluatedEvents.length,
      highSeverityCount,
      mediumSeverityCount,
      lowSeverityCount,
      prioritizedChanges: evaluatedEvents,
    };
  }

  /**
   * Acknowledge change and update user baseline to latest snapshot
   */
  static async acknowledgeBaseline(userId, symbol = null, all = false) {
    if (all) {
      // Find all symbols in user's watchlists
      const items = await WatchlistItem.find().populate({
        path: 'watchlistId',
        match: { userId },
        select: '_id',
      });
      const userItems = items.filter((i) => i.watchlistId !== null);
      const symbols = [...new Set(userItems.map((i) => i.symbol))];
      const quotes = await MarketService.getQuotesForSymbols(symbols);

      const bulkOps = quotes.map((q) => ({
        updateOne: {
          filter: { userId, symbol: q.symbol },
          update: {
            $set: {
              lastSeenPrice: q.price,
              lastSeenTimestamp: new Date(),
              lastAcknowledgedAt: new Date(),
            },
          },
          upsert: true,
        },
      }));

      if (bulkOps.length > 0) {
        await UserMarketState.bulkWrite(bulkOps);
      }

      logger.info({ userId }, 'All baselines acknowledged');
      return { acknowledged: true, count: bulkOps.length };
    }

    if (symbol) {
      const upper = symbol.toUpperCase().trim();
      const quote = await MarketService.getQuote(upper);

      await UserMarketState.findOneAndUpdate(
        { userId, symbol: upper },
        {
          lastSeenPrice: quote.price,
          lastSeenTimestamp: new Date(),
          lastAcknowledgedAt: new Date(),
        },
        { upsert: true, new: true }
      );

      // Mark unacknowledged change events as acknowledged
      await ChangeEvent.updateMany(
        { userId, symbol: upper, acknowledgedAt: null },
        { $set: { acknowledgedAt: new Date() } }
      );

      logger.info({ userId, symbol: upper }, 'Symbol baseline acknowledged');
      return { acknowledged: true, symbol: upper };
    }

    return { acknowledged: false };
  }

  /**
   * Get chronological change history for a symbol
   */
  static async getChangeHistory(symbol, limit = 20) {
    const upper = symbol.toUpperCase().trim();
    const events = await ChangeEvent.find({ symbol: upper })
      .sort({ detectedAt: -1 })
      .limit(limit);

    return events.map((e) => e.toJSON());
  }
}
