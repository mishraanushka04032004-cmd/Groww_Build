import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal.jsx';
import { PriceChange } from '../../../components/common/PriceChange.jsx';
import { marketApi } from '../api/market.api.js';
import { changesApi } from '../../changes/api/changes.api.js';
import { SeverityBadge } from '../../../components/common/SeverityBadge.jsx';
import { AIBriefingSection } from '../../ai/components/AIBriefingSection.jsx';
import { CandlestickChart } from './CandlestickChart.jsx';
import { IoTimeOutline, IoPulseOutline, IoAnalyticsOutline, IoFlashOutline, IoChevronDownOutline } from 'react-icons/io5';

export const StockDetailModal = ({ symbol, isOpen, onClose }) => {
  const [historyData, setHistoryData] = useState(null);
  const [changeEvents, setChangeEvents] = useState([]);
  const [activeRange, setActiveRange] = useState('1M');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !symbol) return;

    let isMounted = true;
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const [hist, events] = await Promise.all([
          marketApi.getHistoricalData(symbol, activeRange),
          changesApi.getChangeHistory(symbol, 10).catch(() => []),
        ]);

        if (isMounted) {
          setHistoryData(hist);
          setChangeEvents(events || []);
        }
      } catch (err) {
        console.error('Error fetching stock detail:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [symbol, activeRange, isOpen]);

  if (!symbol) return null;

  const quote = historyData?.quote || {};
  const candles = historyData?.candles || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-3xl"
      title={`${symbol} - ${quote.companyName || 'Stock Analysis'}`}
      description="In-depth technical metrics, historical candles, and meaningful change audit."
    >
      <div className="space-y-6">
        {/* Hero Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#FEECD3] border border-[#FFD6A7]">
          <div>
            <div className="text-3xl font-black font-mono text-[#370A00] tracking-tight">
              ₹{quote.price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '---'}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <PriceChange value={quote.changePercent} size="md" />
              <span className="text-xs text-[#7C2808] font-mono">
                (₹{quote.change >= 0 ? '+' : ''}{quote.change?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {quote.volumeRatio >= 1.5 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#8C3F27]/10 border border-[#8C3F27]/30 text-[#8C3F27] text-xs font-mono font-bold">
                <IoPulseOutline className="w-4 h-4 text-[#8C3F27]" />
                {quote.volumeRatio}x Vol
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FFF7ED] border border-[#FFD6A7] text-[#7C2808] text-xs font-mono">
              <IoTimeOutline className="w-4 h-4 text-[#7C2808]" />
              {new Date(quote.timestamp || Date.now()).toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Range Selector: Dropdown on Mobile (<640px), Tabs on Desktop (>=640px) */}
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs font-bold text-[#370A00]">Price Performance</div>

          {/* Mobile Range Select Dropdown */}
          <div className="block sm:hidden relative">
            <select
              value={activeRange}
              onChange={(e) => setActiveRange(e.target.value)}
              className="appearance-none bg-[#FEECD3] border border-[#FFD6A7] text-[#370A00] font-mono font-bold text-xs rounded-xl py-1 pl-3 pr-7 focus:outline-none focus:border-[#8C3F27] shadow-sm cursor-pointer"
            >
              {['1D', '5D', '1M', '3M', '1Y'].map((range) => (
                <option key={range} value={range}>
                  Range: {range}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#8C3F27]">
              <IoChevronDownOutline className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Desktop Range Buttons */}
          <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-[#FEECD3] border border-[#FFD6A7] text-xs font-mono">
            {['1D', '5D', '1M', '3M', '1Y'].map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setActiveRange(range)}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activeRange === range
                    ? 'bg-[#370A00] text-[#FFF7ED] shadow-sm'
                    : 'text-[#7C2808] hover:text-[#370A00]'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Candlestick Chart */}
        {isLoading ? (
          <div className="w-full h-56 bg-[#FEECD3] animate-pulse rounded-2xl flex items-center justify-center text-xs text-[#7C2808] font-mono border border-[#FFD6A7]">
            Loading Japanese candlestick market data...
          </div>
        ) : (
          <CandlestickChart candles={candles} range={activeRange} currentPrice={quote.price} />
        )}

        {/* Automated Catalyst Briefing Section */}
        <AIBriefingSection symbol={symbol} />

        {/* Key Technical Indicators Grid */}
        <div>
          <h4 className="text-xs font-bold text-[#370A00] mb-2.5 flex items-center gap-2">
            <IoAnalyticsOutline className="w-4 h-4 text-[#8C3F27]" />
            Key Technical Indicators & Levels
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3.5 rounded-xl bg-[#FEECD3] border border-[#FFD6A7]">
              <span className="text-[11px] text-[#7C2808] font-mono block">Day Range</span>
              <span className="font-mono font-bold text-[#370A00] mt-1 block">
                ₹{quote.low?.toFixed(2)} - ₹{quote.high?.toFixed(2)}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FEECD3] border border-[#FFD6A7]">
              <span className="text-[11px] text-[#7C2808] font-mono block">Volume / 20D Avg</span>
              <span className="font-mono font-bold text-[#370A00] mt-1 block">
                {quote.volume >= 10000000 ? `${(quote.volume / 10000000).toFixed(2)} Cr` : `${(quote.volume / 100000).toFixed(1)} L`} / {quote.averageVolume >= 10000000 ? `${(quote.averageVolume / 10000000).toFixed(2)} Cr` : `${(quote.averageVolume / 100000).toFixed(1)} L`}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FEECD3] border border-[#FFD6A7]">
              <span className="text-[11px] text-[#7C2808] font-mono block">20-Day High / Low</span>
              <span className="font-mono font-bold text-[#370A00] mt-1 block">
                ₹{quote.high20Day?.toFixed(2)} / ₹{quote.low20Day?.toFixed(2)}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FEECD3] border border-[#FFD6A7]">
              <span className="text-[11px] text-[#7C2808] font-mono block">SMA (20 / 50)</span>
              <span className="font-mono font-bold text-[#370A00] mt-1 block">
                ₹{quote.sma20?.toFixed(2)} / ₹{quote.sma50?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Change History Timeline */}
        <div>
          <h4 className="text-xs font-bold text-[#370A00] mb-2.5 flex items-center gap-2">
            <IoFlashOutline className="w-4 h-4 text-[#8C3F27]" />
            Detected Change History & Catalyst Timeline
          </h4>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {changeEvents.length > 0 ? (
              changeEvents.map((evt) => (
                <div
                  key={evt.id || evt.detectedAt}
                  className="p-2.5 sm:p-3 rounded-xl bg-[#FEECD3] border border-[#FFD6A7] text-xs space-y-1.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                      <SeverityBadge severity={evt.severity} score={evt.score} />
                      <span className="text-[10px] sm:text-[11px] text-[#7C2808] font-mono font-medium">
                        {new Date(evt.detectedAt).toLocaleDateString()} at {new Date(evt.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <PriceChange value={evt.deltaPercent} size="sm" />
                  </div>
                  <p className="text-[#370A00] leading-relaxed font-normal">{evt.explanation}</p>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-[#FEECD3] border border-[#FFD6A7] text-center text-xs text-[#7C2808] font-mono">
                No past anomalous change events recorded for {symbol}.
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

