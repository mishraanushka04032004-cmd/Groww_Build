import React from 'react';
import { PriceChange } from '../../../components/common/PriceChange.jsx';
import { IoTrashOutline, IoStatsChartOutline, IoPulseOutline, IoSparklesOutline } from 'react-icons/io5';

export const StockRow = ({
  item,
  onSelectStock,
  onRemoveStock,
  isRemoving = false,
}) => {
  const { symbol, displayName, quote = {} } = item;

  const price = quote.price || 0;
  const changePercent = quote.changePercent || 0;
  const volumeRatio = quote.volumeRatio || 1.0;
  const isHighVolume = volumeRatio >= 1.5;

  return (
    <div className="flex items-center justify-between p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#FEECD3] hover:bg-[#FFF0DC] border border-[#FFD6A7] hover:border-[#8C3F27] transition-all duration-150 group shadow-sm gap-2">
      {/* Left: avatar + name — clicks open detail */}
      <div
        onClick={() => onSelectStock && onSelectStock(symbol)}
        className="flex items-center gap-2 sm:gap-3 cursor-pointer min-w-0 flex-1"
      >
        {/* Avatar — fixed size, never shrinks */}
        <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#FFF7ED] border border-[#FFD6A7] flex items-center justify-center font-mono font-bold text-[#370A00] text-[9px] sm:text-xs shrink-0 group-hover:border-[#8C3F27] transition-colors shadow-sm">
          {symbol.slice(0, 5)}
        </div>

        {/* Name block — truncates, never causes overflow */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[#370A00] text-xs sm:text-sm tracking-tight group-hover:text-[#8C3F27] transition-colors truncate">
              {symbol}
            </span>
            {isHighVolume && (
              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#8C3F27]/10 border border-[#8C3F27]/30 text-[#8C3F27] text-[10px] font-mono font-bold shrink-0">
                <IoPulseOutline className="w-3 h-3" />
                {volumeRatio}x
              </span>
            )}
          </div>
          <p className="text-[10px] sm:text-xs text-[#7C2808] truncate font-medium max-w-[90px] min-[380px]:max-w-[140px] sm:max-w-xs">
            {displayName || quote.companyName || symbol}
          </p>
        </div>
      </div>

      {/* Right: price + action buttons */}
      <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
        {/* Price column */}
        <div className="text-right">
          <div className="font-mono font-bold text-[#370A00] text-xs sm:text-sm tracking-tight whitespace-nowrap">
            ₹{price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center justify-end mt-0.5">
            <PriceChange value={changePercent} size="sm" />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onSelectStock && onSelectStock(symbol)}
            className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[#FFF7ED] hover:bg-[#FEECD3] text-[#8C3F27] border border-[#FFD6A7] transition-colors shadow-sm"
            title="AI Briefing"
          >
            <IoSparklesOutline className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button
            type="button"
            onClick={() => onSelectStock && onSelectStock(symbol)}
            className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[#FFF7ED] hover:bg-[#FEECD3] text-[#370A00] border border-[#FFD6A7] transition-colors shadow-sm"
            title="Candlestick Chart"
          >
            <IoStatsChartOutline className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#7C2808]" />
          </button>

          <button
            type="button"
            onClick={() => onRemoveStock && onRemoveStock(symbol)}
            disabled={isRemoving}
            className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[#FFF7ED] hover:bg-[#A51D24]/10 text-[#7C2808] hover:text-[#A51D24] border border-[#FFD6A7] hover:border-[#A51D24]/30 transition-colors disabled:opacity-50 shadow-sm"
            title="Remove from Watchlist"
          >
            <IoTrashOutline className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
