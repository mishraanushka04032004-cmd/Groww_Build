import React from 'react';
import { IoAddOutline, IoTrashOutline, IoChevronDownOutline } from 'react-icons/io5';

export const WatchlistSelector = ({
  watchlists = [],
  activeWatchlistId,
  onSelectWatchlist,
  onOpenCreateModal,
  onDeleteWatchlist,
}) => {
  const activeWl = watchlists.find((w) => w.id === activeWatchlistId);

  return (
    <div className="border-b border-[#FFD6A7] pb-3 mb-4">
      {/* Mobile Watchlist Dropdown View (< 640px) */}
      <div className="flex sm:hidden items-center gap-2">
        <div className="relative flex-1 min-w-0">
          <select
            value={activeWatchlistId || ''}
            onChange={(e) => onSelectWatchlist(e.target.value)}
            className="w-full appearance-none bg-[#FEECD3] border border-[#FFD6A7] text-[#370A00] font-bold text-xs rounded-xl py-2 pl-3 pr-8 focus:outline-none focus:border-[#8C3F27] shadow-sm truncate"
          >
            {watchlists.map((wl) => (
              <option key={wl.id} value={wl.id}>
                {wl.name} ({wl.itemCount || 0} stocks)
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#8C3F27]">
            <IoChevronDownOutline className="w-3.5 h-3.5" />
          </div>
        </div>

        {activeWl && !activeWl.isDefault && onDeleteWatchlist && (
          <button
            type="button"
            onClick={() => onDeleteWatchlist(activeWl.id)}
            className="p-2 rounded-xl bg-[#FEECD3] border border-[#FFD6A7] text-[#A51D24] hover:bg-[#A51D24]/10 transition-colors shrink-0"
            title="Delete Current Watchlist"
          >
            <IoTrashOutline className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={onOpenCreateModal}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#370A00] text-[#FFF7ED] text-xs font-bold shrink-0 shadow-sm"
        >
          <IoAddOutline className="w-4 h-4 text-[#FFF7ED]" />
          <span>New</span>
        </button>
      </div>

      {/* Desktop Watchlist Tabs View (>= 640px) */}
      <div className="hidden sm:flex items-center gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 flex-1 min-w-0 scrollbar-none">
          {watchlists.map((wl) => {
            const isActive = wl.id === activeWatchlistId;
            return (
              <div key={wl.id} className="flex items-center shrink-0">
                <button
                  type="button"
                  onClick={() => onSelectWatchlist(wl.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#370A00] text-[#FFF7ED] shadow-md'
                      : 'bg-[#FEECD3] hover:bg-[#FFF0DC] text-[#7C2808] hover:text-[#370A00] border border-[#FFD6A7]'
                  }`}
                >
                  <span className="max-w-[120px] lg:max-w-none truncate">{wl.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold shrink-0 ${
                      isActive ? 'bg-[#8C3F27]/40 text-[#FFF7ED]' : 'bg-[#FFD6A7] text-[#370A00]'
                    }`}
                  >
                    {wl.itemCount || 0}
                  </span>
                </button>

                {!wl.isDefault && isActive && onDeleteWatchlist && (
                  <button
                    type="button"
                    onClick={() => onDeleteWatchlist(wl.id)}
                    className="ml-1 p-1.5 rounded-lg text-[#A51D24]/70 hover:text-[#A51D24] hover:bg-[#A51D24]/10 transition-colors"
                    title="Delete Watchlist"
                  >
                    <IoTrashOutline className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onOpenCreateModal}
          className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#FEECD3] hover:bg-[#FFF0DC] text-[#370A00] border border-[#FFD6A7] hover:border-[#8C3F27] text-xs font-bold shrink-0 transition-all active:scale-[0.98] shadow-sm"
          title="New Watchlist"
        >
          <IoAddOutline className="w-4 h-4 text-[#8C3F27]" />
          <span>New Watchlist</span>
        </button>
      </div>
    </div>
  );
};

