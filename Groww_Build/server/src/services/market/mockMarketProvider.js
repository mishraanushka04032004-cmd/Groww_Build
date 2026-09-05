import { IMarketDataProvider } from './marketProvider.interface.js';

// Pre-seeded high-fidelity universe (Indian Equities NSE/BSE & Global INR Equivalents)
const MOCK_STOCK_UNIVERSE = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    basePrice: 2985.40,
    previousClose: 2890.00,
    averageVolume: 8500000,
    volumeMultiplier: 2.4, // Volume surge anomaly & 20D breakout demonstration
    beta: 1.15,
    peRatio: 28.4,
    high52Week: 3217.90,
    low52Week: 2220.30,
    high20Day: 2950.00,
    low20Day: 2820.00,
    sma20: 2880.00,
    sma50: 2840.00,
    atr14: 38.50,
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services Ltd.',
    basePrice: 4180.50,
    previousClose: 4140.00,
    averageVolume: 2400000,
    volumeMultiplier: 0.95, // Routine low volume drift
    beta: 0.85,
    peRatio: 31.2,
    high52Week: 4592.25,
    low52Week: 3313.00,
    high20Day: 4220.00,
    low20Day: 4050.00,
    sma20: 4120.00,
    sma50: 4080.00,
    atr14: 42.00,
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd.',
    basePrice: 1645.20,
    previousClose: 1680.00,
    averageVolume: 18000000,
    volumeMultiplier: 1.8, // Pullback anomaly with volume expansion
    beta: 1.05,
    peRatio: 19.8,
    high52Week: 1794.00,
    low52Week: 1363.55,
    high20Day: 1720.00,
    low20Day: 1610.00,
    sma20: 1660.00,
    sma50: 1630.00,
    atr14: 22.40,
  },
  {
    symbol: 'INFY',
    name: 'Infosys Ltd.',
    basePrice: 1895.60,
    previousClose: 1872.00,
    averageVolume: 7200000,
    volumeMultiplier: 1.15,
    beta: 0.98,
    peRatio: 26.5,
    high52Week: 1991.45,
    low52Week: 1358.35,
    high20Day: 1910.00,
    low20Day: 1820.00,
    sma20: 1860.00,
    sma50: 1790.00,
    atr14: 24.50,
  },
  {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Ltd.',
    basePrice: 1082.40,
    previousClose: 1035.00,
    averageVolume: 12500000,
    volumeMultiplier: 2.2, // Strong momentum breakout
    beta: 1.45,
    peRatio: 10.2,
    high52Week: 1179.05,
    low52Week: 593.50,
    high20Day: 1060.00,
    low20Day: 960.00,
    sma20: 1010.00,
    sma50: 975.00,
    atr14: 18.20,
  },
  {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Ltd.',
    basePrice: 1248.80,
    previousClose: 1235.00,
    averageVolume: 14000000,
    volumeMultiplier: 1.1,
    beta: 1.10,
    peRatio: 18.5,
    high52Week: 1334.00,
    low52Week: 920.00,
    high20Day: 1260.00,
    low20Day: 1190.00,
    sma20: 1225.00,
    sma50: 1180.00,
    atr14: 14.80,
  },
  {
    symbol: 'SBIN',
    name: 'State Bank of India',
    basePrice: 846.50,
    previousClose: 838.00,
    averageVolume: 22000000,
    volumeMultiplier: 1.35,
    beta: 1.25,
    peRatio: 11.4,
    high52Week: 912.00,
    low52Week: 555.00,
    high20Day: 865.00,
    low20Day: 810.00,
    sma20: 832.00,
    sma50: 815.00,
    atr14: 11.20,
  },
  {
    symbol: 'BHARTIARTL',
    name: 'Bharti Airtel Ltd.',
    basePrice: 1592.00,
    previousClose: 1565.00,
    averageVolume: 6500000,
    volumeMultiplier: 1.25,
    beta: 0.90,
    peRatio: 44.0,
    high52Week: 1675.00,
    low52Week: 880.00,
    high20Day: 1610.00,
    low20Day: 1510.00,
    sma20: 1550.00,
    sma50: 1490.00,
    atr14: 19.50,
  },
  {
    symbol: 'ITC',
    name: 'ITC Ltd.',
    basePrice: 498.40,
    previousClose: 494.00,
    averageVolume: 11000000,
    volumeMultiplier: 0.9,
    beta: 0.65,
    peRatio: 27.8,
    high52Week: 528.55,
    low52Week: 399.30,
    high20Day: 512.00,
    low20Day: 480.00,
    sma20: 492.00,
    sma50: 485.00,
    atr14: 5.60,
  },
  {
    symbol: 'LT',
    name: 'Larsen & Toubro Ltd.',
    basePrice: 3695.00,
    previousClose: 3640.00,
    averageVolume: 3100000,
    volumeMultiplier: 1.3,
    beta: 1.05,
    peRatio: 33.1,
    high52Week: 3919.90,
    low52Week: 2850.00,
    high20Day: 3750.00,
    low20Day: 3520.00,
    sma20: 3620.00,
    sma50: 3560.00,
    atr14: 45.00,
  },
  // Backward compatibility symbols with INR pricing
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    basePrice: 15480.00,
    previousClose: 14720.00,
    averageVolume: 4200000,
    volumeMultiplier: 2.4,
    beta: 1.68,
    peRatio: 48.2,
    high52Week: 16700.00,
    low52Week: 7500.00,
    high20Day: 15350.00,
    low20Day: 14100.00,
    sma20: 14890.00,
    sma50: 14350.00,
    atr14: 390.00,
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    basePrice: 19850.00,
    previousClose: 19780.00,
    averageVolume: 4800000,
    volumeMultiplier: 0.95,
    beta: 1.10,
    peRatio: 33.4,
    high52Week: 20200.00,
    low52Week: 14000.00,
    high20Day: 20050.00,
    low20Day: 19150.00,
    sma20: 19480.00,
    sma50: 18850.00,
    atr14: 245.00,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    basePrice: 29120.00,
    previousClose: 30280.00,
    averageVolume: 6500000,
    volumeMultiplier: 1.8,
    beta: 2.35,
    peRatio: 72.1,
    high52Week: 30800.00,
    low52Week: 11800.00,
    high20Day: 30600.00,
    low20Day: 26450.00,
    sma20: 28590.00,
    sma50: 26620.00,
    atr14: 810.00,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    basePrice: 36580.00,
    previousClose: 36370.00,
    averageVolume: 2200000,
    volumeMultiplier: 1.05,
    beta: 1.20,
    peRatio: 36.5,
    high52Week: 39950.00,
    low52Week: 32800.00,
    high20Day: 37120.00,
    low20Day: 35680.00,
    sma20: 36280.00,
    sma50: 36700.00,
    atr14: 440.00,
  },
];

export class MockMarketProvider extends IMarketDataProvider {
  constructor() {
    super();
    this.universe = MOCK_STOCK_UNIVERSE;
    this.priceDeltas = new Map();
  }

  /**
   * Deterministically inject a price/volume delta for testing or demonstration
   */
  injectAnomaly(symbol, { priceDeltaPercent, volumeMultiplier }) {
    this.priceDeltas.set(symbol.toUpperCase(), {
      priceDeltaPercent,
      volumeMultiplier,
      injectedAt: Date.now(),
    });
  }

  async getQuote(symbol) {
    const upper = symbol.toUpperCase().trim();
    const stock = this.universe.find((s) => s.symbol === upper);

    if (!stock) {
      // Dynamic fallback for any unlisted symbol
      return {
        symbol: upper,
        companyName: `${upper} Equity`,
        price: 1500.00,
        open: 1485.00,
        high: 1520.00,
        low: 1480.00,
        previousClose: 1490.00,
        volume: 5000000,
        averageVolume: 4500000,
        volumeRatio: 1.11,
        change: 10.00,
        changePercent: 0.67,
        high52Week: 1800.00,
        low52Week: 1100.00,
        high20Day: 1540.00,
        low20Day: 1420.00,
        sma20: 1475.00,
        sma50: 1450.00,
        atr14: 25.00,
        timestamp: new Date(),
        source: 'mock-provider',
        isDelayed: false,
      };
    }

    // Apply any active injected anomaly or minor deterministic price drift
    const anomaly = this.priceDeltas.get(upper);
    let currentPrice = stock.basePrice;
    let volumeRatio = stock.volumeMultiplier;

    if (anomaly) {
      currentPrice = Number((stock.previousClose * (1 + anomaly.priceDeltaPercent / 100)).toFixed(2));
      volumeRatio = anomaly.volumeMultiplier || volumeRatio;
    }

    const change = Number((currentPrice - stock.previousClose).toFixed(2));
    const changePercent = Number(((change / stock.previousClose) * 100).toFixed(2));
    const currentVolume = Math.round(stock.averageVolume * volumeRatio);

    const openPrice = Number((stock.previousClose * (1 + (changePercent > 0 ? 0.004 : -0.004))).toFixed(2));
    const dayHigh = Number((Math.max(currentPrice, openPrice, stock.previousClose) * 1.006).toFixed(2));
    const dayLow = Number((Math.min(currentPrice, openPrice, stock.previousClose) * 0.994).toFixed(2));

    return {
      symbol: stock.symbol,
      companyName: stock.name,
      price: currentPrice,
      open: openPrice,
      high: dayHigh,
      low: dayLow,
      previousClose: stock.previousClose,
      volume: currentVolume,
      averageVolume: stock.averageVolume,
      volumeRatio: Number(volumeRatio.toFixed(2)),
      change,
      changePercent,
      high52Week: stock.high52Week,
      low52Week: stock.low52Week,
      high20Day: stock.high20Day,
      low20Day: stock.low20Day,
      sma20: stock.sma20,
      sma50: stock.sma50,
      atr14: stock.atr14,
      beta: stock.beta,
      peRatio: stock.peRatio,
      timestamp: new Date(),
      source: 'mock-provider',
      isDelayed: false,
    };
  }

  async getHistoricalData(symbol, range = '1M') {
    const quote = await this.getQuote(symbol);
    const candles = [];
    const now = Date.now();

    if (range === '1D') {
      // 1D Intraday: 18 trading intervals across market hours (9:15 AM - 3:30 PM)
      const intervals = 18;
      let prevC = quote.open || quote.previousClose;

      for (let i = intervals; i >= 0; i--) {
        const date = new Date(now - i * 20 * 60 * 1000); // 20m candles
        const progress = (intervals - i) / intervals;
        const drift = Math.sin(progress * Math.PI * 2.5) * 0.008 + (progress * ((quote.price - quote.previousClose) / quote.previousClose));
        
        const cClose = i === 0 ? quote.price : Number((quote.previousClose * (1 + drift)).toFixed(2));
        const cOpen = Number(prevC.toFixed(2));
        const cHigh = Number((Math.max(cOpen, cClose) * (1 + Math.abs(Math.sin(i * 1.7)) * 0.004)).toFixed(2));
        const cLow = Number((Math.min(cOpen, cClose) * (1 - Math.abs(Math.cos(i * 2.1)) * 0.004)).toFixed(2));
        const cVol = Math.round((quote.volume / intervals) * (0.6 + Math.abs(Math.sin(i * 0.8)) * 0.8));

        candles.push({
          date: date.toISOString(),
          open: cOpen,
          high: cHigh,
          low: cLow,
          close: cClose,
          volume: cVol,
        });

        prevC = cClose;
      }
    } else {
      const numBars = range === '5D' ? 25 : range === '3M' ? 65 : range === '1Y' ? 90 : 30;
      const days = range === '5D' ? 5 : range === '3M' ? 90 : range === '1Y' ? 365 : 30;

      let prevClose = Number((quote.price * (1 - ((quote.changePercent || 1) / 100) * 0.8)).toFixed(2));

      for (let i = numBars; i >= 0; i--) {
        const date = new Date(now - (i * (days / numBars)) * 24 * 60 * 60 * 1000);
        const cycle = Math.sin(i * 0.45) * 0.02 - (i / numBars) * 0.03;
        
        const cClose = i === 0 ? quote.price : Number((quote.previousClose * (1 + cycle)).toFixed(2));
        const cOpen = Number((prevClose * (1 + (Math.sin(i * 3.1) * 0.003))).toFixed(2));
        const cHigh = Number((Math.max(cOpen, cClose) * (1 + Math.abs(Math.cos(i * 1.5)) * 0.006)).toFixed(2));
        const cLow = Number((Math.min(cOpen, cClose) * (1 - Math.abs(Math.sin(i * 1.8)) * 0.006)).toFixed(2));
        const cVol = Math.round(quote.averageVolume * (0.7 + Math.abs(Math.sin(i)) * 0.6));

        candles.push({
          date: date.toISOString(),
          open: cOpen,
          high: cHigh,
          low: cLow,
          close: cClose,
          volume: cVol,
        });

        prevClose = cClose;
      }
    }

    if (candles.length > 0) {
      candles[candles.length - 1].close = quote.price;
    }

    return {
      symbol: quote.symbol,
      range,
      quote,
      candles,
    };
  }

  async searchSymbols(query) {
    if (!query || query.trim().length === 0) return [];
    const q = query.toUpperCase().trim();
    return this.universe
      .filter((s) => s.symbol.includes(q) || s.name.toUpperCase().includes(q))
      .map((s) => ({
        symbol: s.symbol,
        name: s.name,
        price: s.basePrice,
        changePercent: Number((((s.basePrice - s.previousClose) / s.previousClose) * 100).toFixed(2)),
      }));
  }
}
