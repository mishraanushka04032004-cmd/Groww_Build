import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button.jsx';
import { useAuth } from '../../auth/context/AuthContext.jsx';
import {
  IoTrendingUpOutline,
  IoTrendingDownOutline,
  IoFlashOutline,
  IoSparklesOutline,
  IoPulseOutline,
  IoAnalyticsOutline,
  IoTimeOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoArrowForwardOutline,
  IoStatsChartOutline,
  IoRocketOutline,
  IoPlayOutline,
  IoDesktopOutline,
} from 'react-icons/io5';

export const LandingPage = () => {
  const { openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState('baseline');
  const [activeSector, setActiveSector] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState(0);

  // Live Indian Indices Mock (Solid colors, zero gradients)
  const INDICES = [
    { name: 'NIFTY 50', price: '24,852.15', change: '+104.20', pct: '+0.42%', isUp: true },
    { name: 'SENSEX', price: '81,340.20', change: '+310.50', pct: '+0.38%', isUp: true },
    { name: 'BANK NIFTY', price: '51,280.00', change: '+280.10', pct: '+0.55%', isUp: true },
    { name: 'FIN NIFTY', price: '23,940.80', change: '+69.30', pct: '+0.29%', isUp: true },
    { name: 'NIFTY IT', price: '42,190.40', change: '+412.00', pct: '+0.99%', isUp: true },
    { name: 'INDIA VIX', price: '13.45', change: '-0.32', pct: '-2.32%', isUp: false },
  ];

  // Top Indian Equities
  const SECTOR_STOCKS = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', sector: 'Energy', price: '₹2,985.40', change: '+3.30%', volume: '2.4x Volume', score: 84, severity: 'HIGH', catalyst: 'Strong oil refining profits and mobile tariff price hike.' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'IT', price: '₹4,180.50', change: '+0.98%', volume: '1.1x Volume', score: 32, severity: 'LOW', catalyst: 'Won a new multi-million dollar cloud deal in the UK.' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', sector: 'Banking', price: '₹1,645.20', change: '-2.07%', volume: '1.8x Volume', score: 71, severity: 'HIGH', catalyst: 'Heavy selling pressure after quarterly deposit updates.' },
    { symbol: 'INFY', name: 'Infosys Ltd.', sector: 'IT', price: '₹1,895.60', change: '+1.26%', volume: '1.4x Volume', score: 45, severity: 'LOW', catalyst: 'Steady client demand and improved profit forecast.' },
    { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', sector: 'Auto', price: '₹1,082.40', change: '+4.58%', volume: '3.1x Volume', score: 92, severity: 'HIGH', catalyst: 'Record car orders at JLR and new electric vehicle launches.' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', sector: 'Banking', price: '₹1,248.80', change: '+1.12%', volume: '1.3x Volume', score: 40, severity: 'LOW', catalyst: 'Healthy loan growth and strong profit margins.' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', sector: 'Telecom', price: '₹1,592.00', change: '+1.72%', volume: '1.6x Volume', score: 58, severity: 'MEDIUM', catalyst: 'More 5G mobile users added and higher average user revenue.' },
    { symbol: 'ITC', name: 'ITC Ltd.', sector: 'FMCG', price: '₹498.30', change: '+0.45%', volume: '0.9x Volume', score: 25, severity: 'LOW', catalyst: 'Hotel business separation approved with stable consumer sales.' },
  ];

  const filteredStocks = activeSector === 'all' 
    ? SECTOR_STOCKS 
    : SECTOR_STOCKS.filter(s => s.sector.toLowerCase() === activeSector.toLowerCase());

  // Interactive Live Simulator Data (Solid Apple-like Cards)
  const SIMULATOR_DATA = {
    baseline: {
      tag: 'Personal Baseline Surveillance',
      title: 'Reliance Industries (RELIANCE)',
      stat1: '₹2,892.00',
      stat1Label: 'Baseline at Your Last Visit (10:15 AM)',
      stat2: '₹2,985.40',
      stat2Label: 'Live Price Right Now',
      delta: '+₹93.40 (+3.23%)',
      score: 84,
      severity: 'HIGH',
      badge: 'Surge While You Were Away',
      explanation: 'Stock surged +3.23% on 2.4x standard trading volume since you last reviewed it.',
      signals: [
        { label: 'Price Delta', value: '+3.23%', weight: '30%', status: 'HIGH' },
        { label: 'Relative Vol', value: '2.42x', weight: '25%', status: 'HIGH' },
        { label: 'Volatility', value: 'High', weight: '20%', status: 'MED' },
        { label: 'Trend', value: 'Upward', weight: '15%', status: 'BULL' },
        { label: '20D Level', value: 'New High', weight: '10%', status: 'HIGH' },
      ],
    },
    breakout: {
      tag: 'Volume & Breakout Engine',
      title: 'Tata Motors Ltd. (TATAMOTORS)',
      stat1: '₹1,034.00',
      stat1Label: '20-Day Resistance High',
      stat2: '₹1,082.40',
      stat2Label: 'Breakout Live Price',
      delta: '+₹48.40 (+4.68%)',
      score: 92,
      severity: 'HIGH',
      badge: 'High-Volume Breakout',
      explanation: 'Stock pierced its monthly resistance with 3.1x heavier institutional buying volume.',
      signals: [
        { label: 'Price Delta', value: '+4.58%', weight: '30%', status: 'HIGH' },
        { label: 'Relative Vol', value: '3.10x', weight: '25%', status: 'HIGH' },
        { label: 'Volatility', value: 'Very High', weight: '20%', status: 'HIGH' },
        { label: 'Trend', value: 'Bullish Cross', weight: '15%', status: 'BULL' },
        { label: '20D Level', value: 'Fresh ATH', weight: '10%', status: 'HIGH' },
      ],
    },
    catalyst: {
      tag: 'Automated Catalyst Intelligence',
      title: 'HDFC Bank Ltd. (HDFCBANK)',
      stat1: '₹1,680.00',
      stat1Label: 'Price When You Checked Yesterday',
      stat2: '₹1,645.20',
      stat2Label: 'Live Price Right Now',
      delta: '-₹34.80 (-2.07%)',
      score: 71,
      severity: 'HIGH',
      badge: 'Instant Reason Synthesized',
      explanation: 'Stock dropped 2% following institutional block sales after quarterly deposit updates.',
      signals: [
        { label: 'Price Delta', value: '-2.07%', weight: '30%', status: 'HIGH' },
        { label: 'Relative Vol', value: '1.85x', weight: '25%', status: 'MED' },
        { label: 'Volatility', value: 'Moderate', weight: '20%', status: 'MED' },
        { label: 'Trend', value: 'Under Pressure', weight: '15%', status: 'BEAR' },
        { label: '20D Level', value: 'Near Low', weight: '10%', status: 'LOW' },
      ],
    },
  };

  const currentSim = SIMULATOR_DATA[activeTab];

  // Apple-style Clear FAQs
  const FAQS = [
    {
      q: 'What is Groww.Watch and how does it work?',
      a: 'Traditional stock apps only compare prices against yesterday\'s 3:30 PM closing bell. If you step away for 4 hours or 4 days, standard apps cannot show you what changed while you were gone. Groww.Watch snapshots the exact price when you last looked at each stock and computes statistical moves against your personal timeline.',
    },
    {
      q: 'How is the Anomaly Importance Score calculated?',
      a: 'Our quantitative engine monitors 5 mathematical dimensions: Price rate-of-change, trading volume surge multiplier (RVol), ATR price volatility, 20-day trend position, and 20-day range breakout levels. Moves scoring 70+ represent statistically significant action.',
    },
    {
      q: 'What are the Automated Catalyst Briefings?',
      a: 'Whenever a stock moves unusually, you can click "Generate Briefing" to get a clean 3-part summary covering price velocity, trading volume distribution, and underlying market drivers in clear, simple English.',
    },
    {
      q: 'Is it completely free to track Indian stocks?',
      a: 'Yes, Groww.Watch is free for individual investors and traders. All prices, targets, and volume metrics are displayed in Indian Rupees (₹) with standard Indian numbering (Lakhs and Crores).',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-32 pt-2 pb-16 sm:pb-20 max-w-7xl mx-auto px-1 sm:px-4 overflow-x-hidden">
      {/* 1. APPLE-STYLE EDITORIAL HERO */}
      <section className="text-center flex flex-col items-center justify-center pt-3 sm:pt-10 px-2 sm:px-4">
        {/* Apple Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#FEECD3] border border-[#FFD6A7] text-[11px] sm:text-xs font-mono font-bold mb-5 tracking-wide">
          <span className="w-2 h-2 rounded-full bg-[#8C3F27]" />
          <span className="text-[#8C3F27]">NSE · BSE Real-Time Equities</span>
        </div>

        {/* Apple Iconic Large Headline - Fully Responsive */}
        <h1 className="text-2xl min-[360px]:text-3xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-[#370A00] mb-4 sm:mb-6 leading-[1.12] font-sans max-w-5xl">
          Track what changed.<br />
          <span className="text-[#8C3F27]">Ignore what didn&apos;t.</span>
        </h1>

        <p className="text-[#7C2808] text-xs min-[360px]:text-sm sm:text-xl lg:text-2xl max-w-3xl mb-8 sm:mb-10 leading-relaxed font-normal px-2">
          The first smart market watchlist that calculates anomalies against <strong className="text-[#370A00] font-semibold">your personal last visit baseline</strong>. Zero noise. Pure signal.
        </p>

        {/* Apple-Style Action Buttons - Responsive on mobile */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-14 w-full max-w-sm sm:max-w-none px-3">
          <Button
            variant="primary"
            size="lg"
            onClick={() => openAuthModal('register')}
            className="w-full sm:w-auto px-7 sm:px-9 py-3.5 sm:py-4 font-bold text-[#FFF7ED] text-sm sm:text-base rounded-full shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all bg-[#370A00]"
          >
            Start tracking free
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => openAuthModal('login')}
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold rounded-full border border-[#FFD6A7] bg-[#FEECD3] text-[#370A00] hover:border-[#8C3F27] transition-all"
          >
            Sign in to account
          </Button>
        </div>

        {/* Apple-Grade Hardware / Browser Showcase Display */}
        <div className="w-full max-w-5xl rounded-2xl sm:rounded-3xl bg-[#FEECD3] border-2 border-[#FFD6A7] p-2 sm:p-4 shadow-xl">
          {/* Top Window Bar */}
          <div className="flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 border-b border-[#FFD6A7] mb-2 sm:mb-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#A51D24]" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FCB700]" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#006044]" />
            </div>
            <div className="text-[10px] sm:text-[11px] font-mono font-bold text-[#7C2808] bg-[#FFF7ED] px-2.5 sm:px-4 py-0.5 sm:py-1 rounded-full border border-[#FFD6A7] truncate max-w-[130px] sm:max-w-none">
              groww.watch/live-feed
            </div>
            <div className="text-[11px] sm:text-xs font-mono text-[#006044] font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#006044] animate-pulse" /> LIVE
            </div>
          </div>

          {/* Inner Interface Preview */}
          <div className="p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-[#FFF7ED] border border-[#FFD6A7] text-left">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-[#FFD6A7]">
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#7C2808] font-bold block">
                  What Changed Since 10:15 AM
                </span>
                <h3 className="text-base sm:text-2xl font-black text-[#370A00] mt-0.5 truncate">
                  Reliance Industries Ltd. <span className="font-mono text-xs sm:text-sm text-[#8C3F27]">RELIANCE</span>
                </h3>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-lg sm:text-2xl font-black font-mono text-[#370A00]">₹2,985.40</div>
                <div className="text-xs font-mono font-bold text-[#006044] flex items-center sm:justify-end">
                  <IoTrendingUpOutline className="w-3.5 h-3.5 mr-0.5" /> +₹93.40 (+3.23%)
                </div>
              </div>
            </div>

            {/* Micro Anomaly Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-3 sm:mt-4">
              <div className="p-2 sm:p-3 rounded-xl bg-[#FEECD3] border border-[#FFD6A7]">
                <span className="text-[10px] text-[#7C2808] block truncate">Importance Score</span>
                <span className="text-xs sm:text-base font-black font-mono text-[#370A00]">84 / 100</span>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-[#FEECD3] border border-[#FFD6A7]">
                <span className="text-[10px] text-[#7C2808] block truncate">Trading Volume</span>
                <span className="text-xs sm:text-base font-black font-mono text-[#8C3F27]">2.4x Standard</span>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-[#FEECD3] border border-[#FFD6A7]">
                <span className="text-[10px] text-[#7C2808] block truncate">20-Day Position</span>
                <span className="text-xs sm:text-base font-black font-mono text-[#006044]">New High</span>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-[#FEECD3] border border-[#FFD6A7]">
                <span className="text-[10px] text-[#7C2808] block truncate">Catalyst AI</span>
                <span className="text-xs sm:text-base font-black font-mono text-[#370A00]">Synthesized</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Indian Indices Bar */}
        <div className="w-full max-w-5xl rounded-2xl bg-[#FEECD3] border border-[#FFD6A7] p-2 mt-6 sm:mt-8 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-left font-mono">
            {INDICES.map((idx) => (
              <div
                key={idx.name}
                className="p-2 sm:p-3 rounded-xl bg-[#FFF7ED] hover:bg-[#FFF0DC] border border-[#FFD6A7] transition-all"
              >
                <div className="text-[10px] text-[#7C2808] font-bold uppercase tracking-wider truncate">{idx.name}</div>
                <div className="text-xs sm:text-sm font-black text-[#370A00] mt-0.5">{idx.price}</div>
                <div className={`text-[10px] sm:text-[11px] font-bold flex items-center mt-0.5 ${idx.isUp ? 'text-[#006044]' : 'text-[#A51D24]'}`}>
                  {idx.isUp ? <IoTrendingUpOutline className="w-3 h-3 mr-0.5" /> : <IoTrendingDownOutline className="w-3 h-3 mr-0.5" />}
                  {idx.pct}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. APPLE-STYLE HIGHLIGHT NUMBERS */}
      <section className="border-y border-[#FFD6A7] py-10 sm:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center max-w-5xl mx-auto px-2">
          <div>
            <div className="text-3xl sm:text-6xl font-black font-mono text-[#370A00]">0</div>
            <div className="text-xs sm:text-sm text-[#7C2808] mt-1.5 font-medium">False alarms from static closes</div>
          </div>
          <div>
            <div className="text-3xl sm:text-6xl font-black font-mono text-[#8C3F27]">50ms</div>
            <div className="text-xs sm:text-sm text-[#7C2808] mt-1.5 font-medium">Real-time scoring engine</div>
          </div>
          <div>
            <div className="text-3xl sm:text-6xl font-black font-mono text-[#006044]">5</div>
            <div className="text-xs sm:text-sm text-[#7C2808] mt-1.5 font-medium">Quantitative signals in 1 score</div>
          </div>
          <div>
            <div className="text-3xl sm:text-6xl font-black font-mono text-[#370A00]">₹0</div>
            <div className="text-xs sm:text-sm text-[#7C2808] mt-1.5 font-medium">Free for Indian investors</div>
          </div>
        </div>
      </section>

      {/* 3. APPLE-STYLE BENTO GRID ("A CLOSER LOOK.") */}
      <section className="space-y-8 sm:space-y-12 px-2 sm:px-0">
        <div className="text-center max-w-3xl mx-auto">
          <div className="text-xs font-mono text-[#8C3F27] font-bold uppercase tracking-widest mb-2">
            A Closer Look
          </div>
          <h2 className="text-2xl sm:text-5xl font-black text-[#370A00] tracking-tight font-sans">
            Engineered to perfection.
          </h2>
          <p className="text-[#7C2808] text-sm sm:text-base mt-2 sm:mt-3">
            Every feature was built from first principles to give you market clarity.
          </p>
        </div>

        {/* Asymmetric Apple Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Large Featured Card */}
          <div className="bento-card p-5 sm:p-10 rounded-2xl sm:rounded-[2.5rem] md:col-span-2 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#FFF7ED] border border-[#FFD6A7] flex items-center justify-center text-[#8C3F27] mb-4 sm:mb-6">
                <IoTimeOutline className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-xs font-mono font-bold text-[#8C3F27] uppercase tracking-wider">The Innovation</span>
              <h3 className="text-xl sm:text-3xl font-black text-[#370A00] mt-1.5 mb-3 sm:mb-4 font-sans">
                Personal Baseline Tracking.
              </h3>
              <p className="text-xs sm:text-base text-[#7C2808] leading-relaxed max-w-xl">
                Traditional platforms compare prices against yesterday&apos;s 3:30 PM closing bell. Groww.Watch snapshots the exact price when <strong>you personally last reviewed the stock</strong>. If you check every 4 hours or 4 days, your change calculations reflect reality.
              </p>
            </div>

            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[#FFD6A7] flex flex-wrap items-center gap-3 sm:gap-6 text-xs font-mono text-[#7C2808]">
              <span className="flex items-center gap-2 text-[#370A00] font-bold">
                <IoCheckmarkCircleOutline className="w-4 h-4 text-[#006044] shrink-0" /> Zero false alarms
              </span>
              <span className="flex items-center gap-2 text-[#370A00] font-bold">
                <IoCheckmarkCircleOutline className="w-4 h-4 text-[#006044] shrink-0" /> Sub-second delta calculation
              </span>
              <span className="flex items-center gap-2 text-[#370A00] font-bold">
                <IoCheckmarkCircleOutline className="w-4 h-4 text-[#006044] shrink-0" /> 1-Click baseline reset
              </span>
            </div>
          </div>

          {/* Card 2: AI Catalyst Intelligence */}
          <div className="bento-card p-5 sm:p-10 rounded-2xl sm:rounded-[2.5rem] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#FFF7ED] border border-[#FFD6A7] flex items-center justify-center text-[#8C3F27] mb-4 sm:mb-6">
                <IoSparklesOutline className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-xs font-mono font-bold text-[#8C3F27] uppercase tracking-wider">Clarity</span>
              <h3 className="text-lg sm:text-2xl font-black text-[#370A00] mt-1.5 mb-2 sm:mb-3 font-sans">
                Instant Smart Summaries.
              </h3>
              <p className="text-xs sm:text-sm text-[#7C2808] leading-relaxed">
                Click any stock to get an automated 3-card briefing explaining volume surges, breakout thresholds, and underlying market catalysts.
              </p>
            </div>

            <div className="mt-5 sm:mt-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#FFF7ED] border border-[#FFD6A7] text-xs font-mono text-[#7C2808]">
              <span className="text-[#8C3F27] font-bold">Format:</span> 3 bullet cards in simple, plain English.
            </div>
          </div>

          {/* Card 3: Japanese Candlestick Charts */}
          <div className="bento-card p-5 sm:p-10 rounded-2xl sm:rounded-[2.5rem] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#FFF7ED] border border-[#FFD6A7] flex items-center justify-center text-[#7C2808] mb-4 sm:mb-6">
                <IoStatsChartOutline className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-xs font-mono font-bold text-[#7C2808] uppercase tracking-wider">Visual Fidelity</span>
              <h3 className="text-lg sm:text-2xl font-black text-[#370A00] mt-1.5 mb-2 sm:mb-3 font-sans">
                Interactive Candlesticks.
              </h3>
              <p className="text-xs sm:text-sm text-[#7C2808] leading-relaxed">
                Inspect high, low, open, close and volume bars with 1D, 5D, 1M, 3M, and 1Y timeframe intervals.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono text-[#8C3F27] font-bold mt-4">
              <span>Interactive OHLCV</span> <IoArrowForwardOutline className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Multi-Signal Engine */}
          <div className="bento-card p-5 sm:p-10 rounded-2xl sm:rounded-[2.5rem] md:col-span-2 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#FFF7ED] border border-[#FFD6A7] flex items-center justify-center text-[#006044] mb-4 sm:mb-6">
                <IoPulseOutline className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-xs font-mono font-bold text-[#006044] uppercase tracking-wider">Quantitative Logic</span>
              <h3 className="text-xl sm:text-3xl font-black text-[#370A00] mt-1.5 mb-2 sm:mb-3 font-sans">
                5-Signal Composite Scoring (0–100).
              </h3>
              <p className="text-xs sm:text-base text-[#7C2808] leading-relaxed max-w-xl">
                We combine price rate-of-change, trading volume surges, ATR price volatility, 20-day trend direction, and range breakouts into a single decisive score.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-[#FFD6A7] text-center text-xs font-mono">
              <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-[#FFF7ED] border border-[#FFD6A7]">
                <div className="text-[10px] text-[#7C2808]">Price Jump</div>
                <div className="font-bold text-[#370A00] mt-0.5 sm:mt-1 text-xs sm:text-sm">30%</div>
              </div>
              <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-[#FFF7ED] border border-[#FFD6A7]">
                <div className="text-[10px] text-[#7C2808]">Volume</div>
                <div className="font-bold text-[#370A00] mt-0.5 sm:mt-1 text-xs sm:text-sm">25%</div>
              </div>
              <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-[#FFF7ED] border border-[#FFD6A7]">
                <div className="text-[10px] text-[#7C2808]">Volatility</div>
                <div className="font-bold text-[#370A00] mt-0.5 sm:mt-1 text-xs sm:text-sm">20%</div>
              </div>
              <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-[#FFF7ED] border border-[#FFD6A7]">
                <div className="text-[10px] text-[#7C2808]">Trend</div>
                <div className="font-bold text-[#370A00] mt-0.5 sm:mt-1 text-xs sm:text-sm">15%</div>
              </div>
              <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-[#FFF7ED] border border-[#FFD6A7] col-span-2 sm:col-span-1">
                <div className="text-[10px] text-[#7C2808]">Breakout</div>
                <div className="font-bold text-[#370A00] mt-0.5 sm:mt-1 text-xs sm:text-sm">10%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE SIMULATOR (APPLE-STYLE INTERACTION) */}
      <section className="space-y-6 sm:space-y-8 px-2 sm:px-0">
        <div className="text-center max-w-3xl mx-auto">
          <div className="text-xs font-mono text-[#8C3F27] font-bold uppercase tracking-widest mb-2">
            Interactive Showcase
          </div>
          <h2 className="text-2xl sm:text-5xl font-black text-[#370A00] tracking-tight font-sans">
            See the engine in motion.
          </h2>
          <p className="text-[#7C2808] text-xs sm:text-base mt-2">
            Select a scenario to inspect how personal baseline surveillance isolates real trading opportunities.
          </p>
        </div>

        {/* Mobile Scenario Selector Dropdown (Visible on Mobile < 640px) */}
        <div className="block sm:hidden w-full max-w-xs mx-auto">
          <div className="relative">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full appearance-none bg-[#FEECD3] border-2 border-[#FFD6A7] text-[#370A00] font-bold text-xs rounded-xl py-2.5 pl-3.5 pr-9 focus:outline-none focus:border-[#8C3F27] shadow-sm cursor-pointer"
            >
              <option value="baseline">Personal Baseline Scenario</option>
              <option value="breakout">Volume Breakout Scenario</option>
              <option value="catalyst">Catalyst AI Scenario</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#8C3F27]">
              <IoChevronDownOutline className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Desktop Scenario Tabs (Visible on screens >= 640px) */}
        <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-full bg-[#FEECD3] border border-[#FFD6A7] max-w-xl mx-auto w-full justify-center">
          <button
            type="button"
            onClick={() => setActiveTab('baseline')}
            className={`py-2 px-3 sm:px-4 rounded-full font-bold text-xs transition-all flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap ${
              activeTab === 'baseline'
                ? 'bg-[#370A00] text-[#FFF7ED] shadow-sm'
                : 'text-[#7C2808] hover:text-[#370A00]'
            }`}
          >
            <IoTimeOutline className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Personal Baseline</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('breakout')}
            className={`py-2 px-3 sm:px-4 rounded-full font-bold text-xs transition-all flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap ${
              activeTab === 'breakout'
                ? 'bg-[#8C3F27] text-[#FFF7ED] shadow-sm'
                : 'text-[#7C2808] hover:text-[#370A00]'
            }`}
          >
            <IoFlashOutline className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Volume Breakout</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('catalyst')}
            className={`py-2 px-3 sm:px-4 rounded-full font-bold text-xs transition-all flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap ${
              activeTab === 'catalyst'
                ? 'bg-[#7C2808] text-[#FFF7ED] shadow-sm'
                : 'text-[#7C2808] hover:text-[#370A00]'
            }`}
          >
            <IoSparklesOutline className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Catalyst AI</span>
          </button>
        </div>

        {/* Apple-Style Simulator Card - Responsive for 320px+ */}
        <div className="bento-card p-3.5 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2.5rem] border-2 border-[#FFD6A7] max-w-4xl mx-auto overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 sm:gap-4 pb-3 sm:pb-6 border-b border-[#FFD6A7]">
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs font-mono font-bold text-[#8C3F27] uppercase tracking-wider block">
                {currentSim.tag}
              </span>
              <h3 className="text-base sm:text-3xl font-black text-[#370A00] mt-0.5 sm:mt-1 font-sans leading-tight break-words">
                {currentSim.title}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0">
              <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold bg-[#FFF7ED] border border-[#FFD6A7] text-[#370A00] whitespace-nowrap">
                Score: {currentSim.score} / 100
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold bg-[#FEECD3] border border-[#006044] text-[#006044] leading-tight max-w-full">
                {currentSim.badge}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 my-4 sm:my-8">
            <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#FFF7ED] border border-[#FFD6A7]">
              <span className="text-[11px] sm:text-xs text-[#7C2808] block truncate">{currentSim.stat1Label}</span>
              <span className="text-lg sm:text-2xl font-black font-mono text-[#370A00] mt-1 sm:mt-2 block">{currentSim.stat1}</span>
            </div>
            <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#FFF7ED] border border-[#FFD6A7]">
              <span className="text-[11px] sm:text-xs text-[#7C2808] block truncate">{currentSim.stat2Label}</span>
              <span className="text-lg sm:text-2xl font-black font-mono text-[#370A00] mt-1 sm:mt-2 block">{currentSim.stat2}</span>
            </div>
            <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#FFF7ED] border border-[#FFD6A7]">
              <span className="text-[11px] sm:text-xs text-[#7C2808] block truncate">Personal Delta</span>
              <span className={`text-lg sm:text-2xl font-black font-mono mt-1 sm:mt-2 block ${currentSim.delta.startsWith('+') ? 'text-[#006044]' : 'text-[#A51D24]'}`}>
                {currentSim.delta}
              </span>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#FFF7ED] border border-[#FFD6A7] flex items-start gap-2.5 sm:gap-3">
            <IoPulseOutline className="w-4 h-4 sm:w-5 sm:h-5 text-[#8C3F27] shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-[#370A00] leading-relaxed font-medium">
              {currentSim.explanation}
            </p>
          </div>
        </div>
      </section>

      {/* 5. POPULAR INDIAN STOCKS SECTOR EXPLORER */}
      <section className="space-y-6 px-2 sm:px-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#370A00] tracking-tight font-sans">
              Explore Popular Indian Equities
            </h2>
            <p className="text-xs text-[#7C2808] mt-1 font-medium">
              Select any stock to start tracking its personal baseline free.
            </p>
          </div>

          {/* Sector Selector Dropdown on Mobile (Visible < 640px) */}
          <div className="block sm:hidden w-full max-w-xs">
            <div className="relative">
              <select
                value={activeSector}
                onChange={(e) => setActiveSector(e.target.value)}
                className="w-full appearance-none bg-[#FEECD3] border border-[#FFD6A7] text-[#370A00] font-bold text-xs rounded-xl py-2 pl-3.5 pr-9 focus:outline-none focus:border-[#8C3F27] shadow-sm cursor-pointer"
              >
                {['All', 'Energy', 'IT', 'Banking', 'Auto', 'FMCG'].map((sec) => (
                  <option key={sec} value={sec.toLowerCase()}>
                    Sector: {sec}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#8C3F27]">
                <IoChevronDownOutline className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Sector Filter Pills on Desktop (Visible >= 640px) */}
          <div className="hidden sm:flex items-center gap-1.5 p-1 rounded-full bg-[#FEECD3] border border-[#FFD6A7] text-xs font-bold">
            {['All', 'Energy', 'IT', 'Banking', 'Auto', 'FMCG'].map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setActiveSector(sec.toLowerCase())}
                className={`px-3.5 py-1.5 rounded-full whitespace-nowrap shrink-0 transition-all ${
                  activeSector === sec.toLowerCase()
                    ? 'bg-[#370A00] text-[#FFF7ED] shadow-sm'
                    : 'text-[#7C2808] hover:text-[#370A00]'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* Stock Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredStocks.map((stock) => (
            <div
              key={stock.symbol}
              onClick={() => openAuthModal('register')}
              className="bento-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl cursor-pointer group hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[#370A00] text-base group-hover:text-[#8C3F27] transition-colors">
                  {stock.symbol}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    stock.severity === 'HIGH'
                      ? 'bg-[#FFD6A7] text-[#A51D24] border border-[#A51D24]'
                      : stock.severity === 'MEDIUM'
                      ? 'bg-[#FFD6A7] text-[#7C2808] border border-[#8C3F27]'
                      : 'bg-[#FFF7ED] text-[#006044] border border-[#006044]'
                  }`}
                >
                  Score: {stock.score}
                </span>
              </div>

              <div className="text-xs text-[#7C2808] truncate font-medium mb-3 sm:mb-4">
                {stock.name}
              </div>

              <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-[#FFD6A7]">
                <span className="font-mono font-bold text-[#370A00] text-sm sm:text-base">{stock.price}</span>
                <span
                  className={`font-mono text-xs font-bold ${
                    stock.change.startsWith('+') ? 'text-[#006044]' : 'text-[#A51D24]'
                  }`}
                >
                  {stock.change}
                </span>
              </div>

              <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-[#FFD6A7] text-[11px] text-[#7C2808] flex items-center justify-between">
                <span>{stock.volume}</span>
                <span className="text-[#8C3F27] font-bold flex items-center gap-1 group-hover:underline">
                  Track free <IoArrowForwardOutline className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. APPLE-STYLE FAQ ACCORDION */}
      <section className="max-w-3xl mx-auto space-y-5 sm:space-y-6 px-2 sm:px-0">
        <div className="text-center">
          <div className="text-xs font-mono text-[#8C3F27] font-bold uppercase tracking-widest mb-1.5 sm:mb-2">
            Questions &amp; Answers
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#370A00] tracking-tight font-sans">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-2.5 sm:space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl sm:rounded-3xl bg-[#FEECD3] border border-[#FFD6A7] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-6 text-left flex items-center justify-between gap-3 sm:gap-4 font-bold text-[#370A00] text-sm sm:text-base hover:text-[#8C3F27] transition-colors"
                >
                  <span className="pr-2">{faq.q}</span>
                  {isOpen ? (
                    <IoChevronUpOutline className="w-5 h-5 text-[#8C3F27] shrink-0" />
                  ) : (
                    <IoChevronDownOutline className="w-5 h-5 text-[#7C2808] shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-xs sm:text-sm text-[#7C2808] leading-relaxed font-normal border-t border-[#FFD6A7] pt-3 sm:pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. APPLE-STYLE MINIMALIST BOTTOM CALL TO ACTION */}
      <section className="rounded-3xl sm:rounded-[3rem] bg-[#FEECD3] border-2 border-[#FFD6A7] p-6 sm:p-16 text-center shadow-sm mx-2 sm:mx-0">
        <div className="max-w-2xl mx-auto space-y-4 sm:space-y-5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FFF7ED] border border-[#FFD6A7] flex items-center justify-center text-[#8C3F27] mx-auto">
            <IoRocketOutline className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <h2 className="text-2xl sm:text-5xl font-black text-[#370A00] tracking-tight font-sans">
            Ready to experience smart market watchlists?
          </h2>

          <p className="text-xs sm:text-base text-[#7C2808] max-w-lg mx-auto leading-relaxed">
            Create your account in 10 seconds. Completely free for individual Indian investors.
          </p>

          <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none mx-auto">
            <Button
              variant="primary"
              size="lg"
              onClick={() => openAuthModal('register')}
              className="w-full sm:w-auto px-8 sm:px-9 py-3.5 sm:py-4 font-bold text-[#FFF7ED] rounded-full text-sm sm:text-base bg-[#370A00]"
            >
              Start tracking free
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => openAuthModal('login')}
              className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-bold border border-[#FFD6A7] text-[#370A00] bg-[#FFF7ED]"
            >
              Sign in
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
