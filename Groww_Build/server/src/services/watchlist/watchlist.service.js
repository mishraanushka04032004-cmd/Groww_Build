import mongoose from 'mongoose';
import { Watchlist } from '../../models/Watchlist.js';
import { WatchlistItem } from '../../models/WatchlistItem.js';
import { AppError } from '../../utils/AppError.js';
import { logger } from '../../config/logger.js';

export class WatchlistService {
  /**
   * Get all watchlists for a user with item counts
   */
  static async getWatchlists(userId) {
    const watchlists = await Watchlist.find({ userId }).sort({ isDefault: -1, createdAt: 1 });

    // Aggregate item counts per watchlist
    const watchlistIds = watchlists.map((w) => w._id);
    const itemCounts = await WatchlistItem.aggregate([
      { $match: { watchlistId: { $in: watchlistIds } } },
      { $group: { _id: '$watchlistId', count: { $sum: 1 } } },
    ]);

    const countMap = new Map(itemCounts.map((item) => [item._id.toString(), item.count]));

    return watchlists.map((w) => ({
      ...w.toJSON(),
      itemCount: countMap.get(w._id.toString()) || 0,
    }));
  }

  /**
   * Create a new custom watchlist
   */
  static async createWatchlist(userId, name) {
    const watchlist = await Watchlist.create({
      userId,
      name,
      isDefault: false,
    });

    logger.info({ userId, watchlistId: watchlist._id, name }, 'Watchlist created');
    return { ...watchlist.toJSON(), itemCount: 0, items: [] };
  }

  /**
   * Get a single watchlist by ID with its items
   */
  static async getWatchlistById(userId, watchlistId) {
    if (!mongoose.Types.ObjectId.isValid(watchlistId)) {
      throw new AppError('Invalid watchlist ID', 400, 'INVALID_ID');
    }

    const watchlist = await Watchlist.findOne({ _id: watchlistId, userId });
    if (!watchlist) {
      throw new AppError('Watchlist not found', 404, 'WATCHLIST_NOT_FOUND');
    }

    const items = await WatchlistItem.find({ watchlistId }).sort({ position: 1, createdAt: 1 });

    return {
      ...watchlist.toJSON(),
      items: items.map((item) => item.toJSON()),
      itemCount: items.length,
    };
  }

  /**
   * Update watchlist name
   */
  static async updateWatchlist(userId, watchlistId, name) {
    if (!mongoose.Types.ObjectId.isValid(watchlistId)) {
      throw new AppError('Invalid watchlist ID', 400, 'INVALID_ID');
    }

    const watchlist = await Watchlist.findOneAndUpdate(
      { _id: watchlistId, userId },
      { name },
      { new: true, runValidators: true }
    );

    if (!watchlist) {
      throw new AppError('Watchlist not found', 404, 'WATCHLIST_NOT_FOUND');
    }

    return watchlist.toJSON();
  }

  /**
   * Delete custom watchlist & its constituent items
   */
  static async deleteWatchlist(userId, watchlistId) {
    if (!mongoose.Types.ObjectId.isValid(watchlistId)) {
      throw new AppError('Invalid watchlist ID', 400, 'INVALID_ID');
    }

    const watchlist = await Watchlist.findOne({ _id: watchlistId, userId });
    if (!watchlist) {
      throw new AppError('Watchlist not found', 404, 'WATCHLIST_NOT_FOUND');
    }

    if (watchlist.isDefault) {
      throw new AppError('Default watchlist cannot be deleted', 400, 'CANNOT_DELETE_DEFAULT_WATCHLIST');
    }

    await WatchlistItem.deleteMany({ watchlistId });
    await Watchlist.deleteOne({ _id: watchlistId });

    logger.info({ userId, watchlistId }, 'Watchlist deleted');
    return { deleted: true, id: watchlistId };
  }

  /**
   * Add a stock item to watchlist
   */
  static async addItem(userId, watchlistId, symbol, displayName = '') {
    if (!mongoose.Types.ObjectId.isValid(watchlistId)) {
      throw new AppError('Invalid watchlist ID', 400, 'INVALID_ID');
    }

    // Verify ownership of the watchlist
    const watchlist = await Watchlist.findOne({ _id: watchlistId, userId });
    if (!watchlist) {
      throw new AppError('Watchlist not found', 404, 'WATCHLIST_NOT_FOUND');
    }

    const upperSymbol = symbol.toUpperCase().trim();

    // Check duplicate existence
    const existingItem = await WatchlistItem.findOne({ watchlistId, symbol: upperSymbol });
    if (existingItem) {
      throw new AppError(`${upperSymbol} is already in this watchlist`, 409, 'DUPLICATE_STOCK');
    }

    // Determine next position index
    const count = await WatchlistItem.countDocuments({ watchlistId });

    try {
      const item = await WatchlistItem.create({
        watchlistId,
        symbol: upperSymbol,
        displayName: displayName || upperSymbol,
        position: count,
      });

      logger.info({ userId, watchlistId, symbol: upperSymbol }, 'Stock added to watchlist');
      return item.toJSON();
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError(`${upperSymbol} is already in this watchlist`, 409, 'DUPLICATE_STOCK');
      }
      throw error;
    }
  }

  /**
   * Remove a stock item from watchlist
   */
  static async removeItem(userId, watchlistId, symbol) {
    if (!mongoose.Types.ObjectId.isValid(watchlistId)) {
      throw new AppError('Invalid watchlist ID', 400, 'INVALID_ID');
    }

    const watchlist = await Watchlist.findOne({ _id: watchlistId, userId });
    if (!watchlist) {
      throw new AppError('Watchlist not found', 404, 'WATCHLIST_NOT_FOUND');
    }

    const upperSymbol = symbol.toUpperCase().trim();
    const result = await WatchlistItem.findOneAndDelete({ watchlistId, symbol: upperSymbol });

    if (!result) {
      throw new AppError(`Stock ${upperSymbol} not found in this watchlist`, 404, 'STOCK_NOT_FOUND');
    }

    logger.info({ userId, watchlistId, symbol: upperSymbol }, 'Stock removed from watchlist');
    return { removed: upperSymbol };
  }

  /**
   * Reorder items within a watchlist
   */
  static async reorderItems(userId, watchlistId, symbols) {
    if (!mongoose.Types.ObjectId.isValid(watchlistId)) {
      throw new AppError('Invalid watchlist ID', 400, 'INVALID_ID');
    }

    const watchlist = await Watchlist.findOne({ _id: watchlistId, userId });
    if (!watchlist) {
      throw new AppError('Watchlist not found', 404, 'WATCHLIST_NOT_FOUND');
    }

    // Bulk write new positions
    const bulkOps = symbols.map((symbol, index) => ({
      updateOne: {
        filter: { watchlistId, symbol: symbol.toUpperCase().trim() },
        update: { $set: { position: index } },
      },
    }));

    if (bulkOps.length > 0) {
      await WatchlistItem.bulkWrite(bulkOps);
    }

    const updatedItems = await WatchlistItem.find({ watchlistId }).sort({ position: 1 });
    return updatedItems.map((item) => item.toJSON());
  }
}
