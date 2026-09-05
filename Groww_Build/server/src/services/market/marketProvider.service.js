import { env } from '../../config/env.js';
import { MockMarketProvider } from './mockMarketProvider.js';
import { FinnhubProvider } from './finnhubProvider.js';
import { logger } from '../../config/logger.js';

let activeProvider = null;

export const getMarketProvider = () => {
  if (!activeProvider) {
    const apiKey = process.env.FINNHUB_API_KEY || process.env.MARKET_DATA_API_KEY;
    if (apiKey && apiKey.trim().length > 0) {
      logger.info('Initializing Finnhub Live Market Data Provider with API Key');
      activeProvider = new FinnhubProvider(apiKey.trim());
    } else {
      activeProvider = new MockMarketProvider();
    }
  }
  return activeProvider;
};
