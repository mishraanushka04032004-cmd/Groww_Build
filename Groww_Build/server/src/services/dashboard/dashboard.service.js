import { WatchlistService } from '../watchlist/watchlist.service.js';
import { ChangeDetectionService } from '../changeDetection/changeDetection.service.js';
import { MarketService } from '../market/market.service.js';

export class DashboardService {
  /**
   * Aggregate prioritized change feed and active watchlist for dashboard view
   */
  static async getDashboardData(userId, selectedWatchlistId = null) {
    // 1. Get user watchlists
    const watchlists = await WatchlistService.getWatchlists(userId);

    let activeWatchlist = null;
    if (watchlists.length > 0) {
      const targetId = selectedWatchlistId || watchlists[0].id;
      activeWatchlist = await WatchlistService.getWatchlistById(userId, targetId).catch(() => watchlists[0]);
    }

    // 2. Run Meaningful Change Detection across user watchlists
    const changesResult = await ChangeDetectionService.evaluateUserChanges(
      userId,
      selectedWatchlistId || (activeWatchlist ? activeWatchlist.id : null)
    );

    // 3. Hydrate active watchlist items with latest market quotes
    let hydratedItems = [];
    if (activeWatchlist && activeWatchlist.items && activeWatchlist.items.length > 0) {
      const symbols = activeWatchlist.items.map((i) => i.symbol);
      const quotes = await MarketService.getQuotesForSymbols(symbols);
      const quoteMap = new Map(quotes.map((q) => [q.symbol, q]));

      hydratedItems = activeWatchlist.items.map((item) => {
        const quote = quoteMap.get(item.symbol) || {};
        return {
          ...item,
          quote,
        };
      });
    }

    return {
      summary: {
        totalWatchlists: watchlists.length,
        totalMeaningfulChanges: changesResult.totalChanges,
        highSeverityCount: changesResult.highSeverityCount,
        mediumSeverityCount: changesResult.mediumSeverityCount,
        lowSeverityCount: changesResult.lowSeverityCount,
      },
      prioritizedChanges: changesResult.prioritizedChanges,
      watchlists,
      activeWatchlist: activeWatchlist
        ? {
            ...activeWatchlist,
            items: hydratedItems,
          }
        : null,
    };
  }
}
