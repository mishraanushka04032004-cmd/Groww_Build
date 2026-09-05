import { WatchlistService } from '../services/watchlist/watchlist.service.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getWatchlists = asyncHandler(async (req, res) => {
  const watchlists = await WatchlistService.getWatchlists(req.user.id);
  return sendSuccess(res, watchlists, 200);
});

export const createWatchlist = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const watchlist = await WatchlistService.createWatchlist(req.user.id, name);
  return sendSuccess(res, watchlist, 201);
});

export const getWatchlistById = asyncHandler(async (req, res) => {
  const watchlist = await WatchlistService.getWatchlistById(req.user.id, req.params.id);
  return sendSuccess(res, watchlist, 200);
});

export const updateWatchlist = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const watchlist = await WatchlistService.updateWatchlist(req.user.id, req.params.id, name);
  return sendSuccess(res, watchlist, 200);
});

export const deleteWatchlist = asyncHandler(async (req, res) => {
  const result = await WatchlistService.deleteWatchlist(req.user.id, req.params.id);
  return sendSuccess(res, result, 200);
});

export const addItem = asyncHandler(async (req, res) => {
  const { symbol, displayName } = req.body;
  const item = await WatchlistService.addItem(req.user.id, req.params.id, symbol, displayName);
  return sendSuccess(res, item, 201);
});

export const removeItem = asyncHandler(async (req, res) => {
  const result = await WatchlistService.removeItem(req.user.id, req.params.id, req.params.symbol);
  return sendSuccess(res, result, 200);
});

export const reorderItems = asyncHandler(async (req, res) => {
  const { symbols } = req.body;
  const items = await WatchlistService.reorderItems(req.user.id, req.params.id, symbols);
  return sendSuccess(res, items, 200);
});
