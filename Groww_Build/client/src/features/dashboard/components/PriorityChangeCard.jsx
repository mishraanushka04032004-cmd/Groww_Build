import React, { useState } from 'react';
import { SeverityBadge } from '../../../components/common/SeverityBadge.jsx';
import { PriceChange } from '../../../components/common/PriceChange.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import {
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoCheckmarkOutline,
  IoStatsChartOutline,
  IoPulseOutline,
  IoFlashOutline,
  IoSparklesOutline,
} from 'react-icons/io5';

export const PriorityChangeCard = ({
  change,
  onAcknowledge,
  onSelectStock,
  isAcknowledging = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    symbol,
    companyName,
    severity,
    score,
    deltaPercent,
    currentPrice,
    baselinePrice,
    metrics = {},
    signals = {},
    explanation,
    isDelayed,
  } = change;

  const volumeRatio = metrics.volumeRatio || 1.0;
  const isHighVolume = volumeRatio >= 1.5;

  return (
    <div
      className={`bento-card p-3 sm:p-5 rounded-2xl border transition-all duration-200 ${
        severity === 'HIGH'
          ? 'border-2 border-[#A51D24]/50 bg-[#FEECD3] shadow-md hover:border-[#A51D24]'
          : severity === 'MEDIUM'
          ? 'border-2 border-[#FCB700]/50 bg-[#FEECD3] shadow-md hover:border-[#8C3F27]'
          : 'border border-[#FFD6A7] bg-[#FEECD3] hover:border-[#8C3F27]'
      }`}
    >
      {/* Header row: symbol info + price */}
      <div className="flex items-start justify-between gap-2 mb-3">
        {/* Left: avatar + name */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div
            onClick={() => onSelectStock && onSelectStock(symbol)}
            className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-[#FFF7ED] border border-[#FFD6A7] flex items-center justify-center font-mono font-bold text-[#370A00] text-[10px] sm:text-sm cursor-pointer hover:border-[#8C3F27] transition-colors shadow-sm shrink-0"
          >
            {symbol.slice(0, 5)}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <h3
                onClick={() => onSelectStock && onSelectStock(symbol)}
                className="font-bold text-[#370A00] text-sm sm:text-base tracking-tight hover:text-[#8C3F27] cursor-pointer transition-colors"
              >
                {symbol}
              </h3>
              <SeverityBadge severity={severity} score={score} />
            </div>
            <p className="text-[10px] sm:text-xs text-[#7C2808] font-medium truncate max-w-[100px] min-[380px]:max-w-[150px] sm:max-w-xs mt-0.5">
              {companyName}
            </p>
          </div>
        </div>

        {/* Right: price */}
        <div className="flex flex-col items-end shrink-0">
          <div className="text-sm sm:text-xl font-bold font-mono text-[#370A00] tracking-tight whitespace-nowrap">
            ₹{currentPrice?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="hidden sm:inline text-[10px] text-[#7C2808] font-mono">Since last visit:</span>
            <PriceChange value={deltaPercent} size="sm" />
          </div>
        </div>
      </div>

      {/* Primary Key Indicators Pill Ribbon */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {isHighVolume && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#8C3F27]/10 border border-[#8C3F27]/30 text-[#8C3F27] text-xs font-mono font-bold">
            <IoPulseOutline className="w-3.5 h-3.5 text-[#8C3F27]" />
            {volumeRatio}x Average Volume
          </span>
        )}

        {metrics.isBreakout && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#006044]/10 border border-[#006044]/30 text-[#006044] text-xs font-mono font-bold">
            <IoFlashOutline className="w-3.5 h-3.5" />
            20-Day High Breakout
          </span>
        )}

        {metrics.isBreakdown && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#A51D24]/10 border border-[#A51D24]/30 text-[#A51D24] text-xs font-mono font-bold">
            <IoFlashOutline className="w-3.5 h-3.5" />
            20-Day Low Breakdown
          </span>
        )}

        {metrics.crossedSMA20 && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FCB700]/15 border border-[#FCB700]/30 text-[#8C3F27] text-xs font-mono font-semibold">
            Crossed 20-Day SMA
          </span>
        )}

        <span className="text-[11px] text-[#7C2808] font-mono ml-auto">
          Baseline: ₹{baselinePrice?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      {/* Explanation Box */}
      <div className="p-3.5 rounded-2xl bg-[#FFF7ED] border border-[#FFD6A7] text-xs text-[#370A00] leading-relaxed mb-4 shadow-sm">
        <div className="text-[10px] font-mono uppercase tracking-wider text-[#7C2808] font-bold mb-1">
          Why You&apos;re Seeing This
        </div>
        <p className="text-[#370A00]">{explanation}</p>
      </div>

      {/* Expandable Multi-Signal Score Breakdown */}
      {isExpanded && (
        <div className="mb-4 pt-3 border-t border-[#FFD6A7] grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-[#FFF7ED] border border-[#FFD6A7]">
            <div className="text-[10px] text-[#7C2808] font-mono">Price Delta</div>
            <div className="font-bold text-[#370A00] mt-0.5">{signals.priceSignal || 0}/100</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FFF7ED] border border-[#FFD6A7]">
            <div className="text-[10px] text-[#7C2808] font-mono">Volume Surge</div>
            <div className="font-bold text-[#370A00] mt-0.5">{signals.volumeSignal || 0}/100</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FFF7ED] border border-[#FFD6A7]">
            <div className="text-[10px] text-[#7C2808] font-mono">Volatility ATR</div>
            <div className="font-bold text-[#370A00] mt-0.5">{signals.volatilitySignal || 0}/100</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FFF7ED] border border-[#FFD6A7]">
            <div className="text-[10px] text-[#7C2808] font-mono">Trend Cross</div>
            <div className="font-bold text-[#370A00] mt-0.5">{signals.trendSignal || 0}/100</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FFF7ED] border border-[#FFD6A7] col-span-2 sm:col-span-1">
            <div className="text-[10px] text-[#7C2808] font-mono">Breakout</div>
            <div className="font-bold text-[#370A00] mt-0.5">{signals.breakoutSignal || 0}/100</div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between gap-2 pt-2 flex-wrap">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1 text-xs text-[#7C2808] hover:text-[#370A00] transition-colors font-mono font-semibold shrink-0"
        >
          <span>{isExpanded ? 'Hide Signals' : 'View Signal Scores'}</span>
          {isExpanded ? <IoChevronUpOutline className="w-3.5 h-3.5" /> : <IoChevronDownOutline className="w-3.5 h-3.5" />}
        </button>

        <div className="flex items-center gap-1 sm:gap-2 ml-auto flex-wrap justify-end">
          {onSelectStock && (
            <>
              <button
                type="button"
                onClick={() => onSelectStock(symbol)}
                className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl bg-[#FFF7ED] hover:bg-[#FFF0DC] border border-[#FFD6A7] hover:border-[#8C3F27] text-[#8C3F27] text-xs font-bold shadow-sm transition-all"
              >
                <IoSparklesOutline className="w-3.5 h-3.5" />
                <span>AI Briefing</span>
              </button>
              <Button
                variant="secondary"
                size="sm"
                icon={IoStatsChartOutline}
                onClick={() => onSelectStock(symbol)}
                className="text-xs px-2 sm:px-3"
              >
                Chart
              </Button>
            </>
          )}

          {onAcknowledge && (
            <Button
              variant="primary"
              size="sm"
              icon={IoCheckmarkOutline}
              onClick={() => onAcknowledge(symbol)}
              isLoading={isAcknowledging}
              className="text-xs font-bold text-[#FFF7ED] px-2.5 sm:px-3.5"
            >
              Acknowledge
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
