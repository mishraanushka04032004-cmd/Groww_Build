import React from 'react';
import { IoTimeOutline, IoCheckmarkCircleOutline, IoAlertCircleOutline } from 'react-icons/io5';

export const MarketStatus = ({ isDelayed = false, lastChecked, onAcknowledgeAll, isAcknowledging = false }) => {
  return (
    <div className="bg-[#FEECD3] border border-[#FFD6A7] px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 text-xs shadow-sm">
      {/* Left: Market open + feed status */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
        <div className="flex items-center gap-1.5 font-mono">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#006044] animate-pulse shrink-0" />
          <span className="text-[#370A00] font-bold text-xs">Indian Markets Open</span>
          <span className="text-[#7C2808] text-[11px]">(NSE &bull; BSE)</span>
        </div>

        {isDelayed ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FCB700]/15 border border-[#FCB700]/30 text-[#8C3F27] font-mono text-[10px] sm:text-[11px] font-bold">
            <IoAlertCircleOutline className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            15m Delayed
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#006044]/10 border border-[#006044]/30 text-[#006044] font-mono text-[10px] sm:text-[11px] font-bold">
            <IoCheckmarkCircleOutline className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Live Market Feed
          </span>
        )}
      </div>

      {/* Right: Baseline timestamp + Acknowledge All button */}
      <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
        {lastChecked && (
          <div className="flex items-center gap-1 text-[#7C2808] font-mono text-[10px] sm:text-[11px]">
            <IoTimeOutline className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#7C2808] shrink-0" />
            <span className="whitespace-nowrap">Baseline: {new Date(lastChecked).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        )}

        {onAcknowledgeAll && (
          <button
            type="button"
            onClick={onAcknowledgeAll}
            disabled={isAcknowledging}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-[#FFF7ED] hover:bg-[#FFF0DC] text-[#370A00] border border-[#FFD6A7] hover:border-[#8C3F27] text-[11px] sm:text-xs font-semibold shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            {isAcknowledging ? 'Resetting...' : 'Acknowledge All'}
          </button>
        )}
      </div>
    </div>
  );
};
