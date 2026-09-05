import { z } from 'zod';

export const createWatchlistSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Watchlist name is required' })
      .trim()
      .min(1, 'Watchlist name cannot be empty')
      .max(50, 'Watchlist name cannot exceed 50 characters'),
  }),
});

export const updateWatchlistSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Watchlist ID is required'),
  }),
  body: z.object({
    name: z
      .string({ required_error: 'Watchlist name is required' })
      .trim()
      .min(1, 'Watchlist name cannot be empty')
      .max(50, 'Watchlist name cannot exceed 50 characters'),
  }),
});

export const getWatchlistSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Watchlist ID is required'),
  }),
});

export const addWatchlistItemSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Watchlist ID is required'),
  }),
  body: z.object({
    symbol: z
      .string({ required_error: 'Symbol is required' })
      .trim()
      .toUpperCase()
      .min(1, 'Symbol is required')
      .max(10, 'Symbol cannot exceed 10 characters'),
    displayName: z.string().trim().max(100).optional(),
  }),
});

export const removeWatchlistItemSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Watchlist ID is required'),
    symbol: z.string().trim().toUpperCase().min(1, 'Symbol is required'),
  }),
});

export const reorderWatchlistItemsSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Watchlist ID is required'),
  }),
  body: z.object({
    symbols: z.array(z.string().trim().toUpperCase()).min(1, 'At least one symbol must be provided'),
  }),
});
