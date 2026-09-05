import { Router } from 'express';
import {
  getWatchlists,
  createWatchlist,
  getWatchlistById,
  updateWatchlist,
  deleteWatchlist,
  addItem,
  removeItem,
  reorderItems,
} from '../controllers/watchlist.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createWatchlistSchema,
  updateWatchlistSchema,
  getWatchlistSchema,
  addWatchlistItemSchema,
  removeWatchlistItemSchema,
  reorderWatchlistItemsSchema,
} from '../validators/watchlist.validator.js';

const router = Router();

// All watchlist routes require authentication
router.use(requireAuth);

router.get('/', getWatchlists);
router.post('/', validate(createWatchlistSchema), createWatchlist);

router.get('/:id', validate(getWatchlistSchema), getWatchlistById);
router.patch('/:id', validate(updateWatchlistSchema), updateWatchlist);
router.delete('/:id', validate(getWatchlistSchema), deleteWatchlist);

// Watchlist Items
router.post('/:id/items', validate(addWatchlistItemSchema), addItem);
router.delete('/:id/items/:symbol', validate(removeWatchlistItemSchema), removeItem);
router.patch('/:id/items/reorder', validate(reorderWatchlistItemsSchema), reorderItems);

export default router;
