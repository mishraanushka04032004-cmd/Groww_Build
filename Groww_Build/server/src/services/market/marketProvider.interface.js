/**
 * Abstract interface for financial market data providers
 */
export class IMarketDataProvider {
  /**
   * Fetch normalized current quote for a symbol
   * @param {string} symbol
   * @returns {Promise<Object>}
   */
  async getQuote(symbol) {
    throw new Error('Method getQuote() must be implemented');
  }

  /**
   * Fetch historical candlestick data
   * @param {string} symbol
   * @param {string} range - '1D' | '5D' | '1M' | '3M' | '1Y'
   * @returns {Promise<Object>}
   */
  async getHistoricalData(symbol, range = '1M') {
    throw new Error('Method getHistoricalData() must be implemented');
  }

  /**
   * Search for symbols matching query string
   * @param {string} query
   * @returns {Promise<Array>}
   */
  async searchSymbols(query) {
    throw new Error('Method searchSymbols() must be implemented');
  }
}
