import { MarketService } from '../services/market/market.service.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getQuote = asyncHandler(async (req, res) => {
  const quote = await MarketService.getQuote(req.params.symbol);
  return sendSuccess(res, quote, 200);
});

export const getHistoricalData = asyncHandler(async (req, res) => {
  const { range } = req.query;
  const history = await MarketService.getHistoricalData(req.params.symbol, range || '1M');
  return sendSuccess(res, history, 200);
});

export const searchSymbols = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const results = await MarketService.searchSymbols(q || '');
  return sendSuccess(res, results, 200);
});
