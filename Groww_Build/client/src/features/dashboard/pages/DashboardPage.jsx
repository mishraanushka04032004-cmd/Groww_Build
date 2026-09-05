import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard.api.js';
import { watchlistApi } from '../../watchlist/api/watchlist.api.js';
import { useAuth } from '../../auth/context/AuthContext.jsx';
import { MarketStatus } from '../../../components/common/MarketStatus.jsx';
import { PriorityChangeCard } from '../components/PriorityChangeCard.jsx';
import { WatchlistSelector } from '../../watchlist/components/WatchlistSelector.jsx';
import { StockRow } from '../../watchlist/components/StockRow.jsx';
import { AddStockModal } from '../../watchlist/components/AddStockModal.jsx';
import { CreateWatchlistModal } from '../../watchlist/components/CreateWatchlistModal.jsx';
import { StockDetailModal } from '../../market/components/StockDetailModal.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import {
  IoAddOutline,
  IoFlashOutline,
  IoRefreshOutline,
  IoAlertCircleOutline,
  IoTrendingUpOutline,
  IoAnalyticsOutline,
  IoShieldCheckmarkOutline,
  IoSparklesOutline,
  IoLayersOutline,
} from 'react-icons/io5';

import { LandingPage } from './LandingPage.jsx';

export const DashboardPage = () => {
  const { user, isAuthenticated, openAuthModal, isLoading: isAuthLoading } = useAuth();
  const queryClient = useQueryClient();

  const [selectedWatchlistId, setSelectedWatchlistId] = useState(null);
  const [selectedStockSymbol, setSelectedStockSymbol] = useState(null);
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [isCreateWatchlistOpen, setIsCreateWatchlistOpen] = useState(false);

  // Fetch complete dashboard aggregation
  const {
    data: dashboardData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['dashboard', selectedWatchlistId],
    queryFn: () => dashboardApi.getDashboard(selectedWatchlistId),
    enabled: isAuthenticated,
    staleTime: 20 * 1000, // 20s fresh
  });

  // Acknowledge change mutation
  const acknowledgeMutation = useMutation({
    mutationFn: dashboardApi.acknowledgeChanges,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  // Delete watchlist mutation
  const deleteWatchlistMutation = useMutation({
    mutationFn: (id) => watchlistApi.deleteWatchlist(id),
    onSuccess: () => {
      setSelectedWatchlistId(null);
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  // Remove stock mutation
  const removeStockMutation = useMutation({
    mutationFn: ({ watchlistId, symbol }) => watchlistApi.removeItem(watchlistId, symbol),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const handleAcknowledge = useCallback(
    (symbol) => {
      acknowledgeMutation.mutate({ symbol });
    },
    [acknowledgeMutation]
  );

  const handleAcknowledgeAll = useCallback(() => {
    acknowledgeMutation.mutate({ all: true });
  }, [acknowledgeMutation]);

  const handleRemoveStock = useCallback(
    (symbol) => {
      const currentWlId = dashboardData?.activeWatchlist?.id || selectedWatchlistId;
      if (currentWlId) {
        removeStockMutation.mutate({ watchlistId: currentWlId, symbol });
      }
    },
    [dashboardData, selectedWatchlistId, removeStockMutation]
  );

  // Authentication loading state on page reload
  if (isAuthLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto py-8">
        <div className="h-14 bg-[#FEECD3] animate-pulse rounded-2xl border border-[#FFD6A7]" />
        <div className="space-y-4">
          <div className="h-6 w-48 bg-[#FEECD3] animate-pulse rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-48 bg-[#FEECD3] animate-pulse rounded-2xl border border-[#FFD6A7]" />
            <div className="h-48 bg-[#FEECD3] animate-pulse rounded-2xl border border-[#FFD6A7]" />
          </div>
        </div>
      </div>
    );
  }

  // Unauthenticated landing state - Full Groww inspired experience
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // Loading skeleton state
  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="h-14 bg-[#FEECD3] animate-pulse rounded-2xl border border-[#FFD6A7]" />
        <div className="space-y-4">
          <div className="h-6 w-48 bg-[#FEECD3] animate-pulse rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-48 bg-[#FEECD3] animate-pulse rounded-2xl border border-[#FFD6A7]" />
            <div className="h-48 bg-[#FEECD3] animate-pulse rounded-2xl border border-[#FFD6A7]" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="p-8 rounded-2xl bg-[#A51D24]/10 border border-[#A51D24]/30 text-center max-w-lg mx-auto my-12 shadow-sm">
        <IoAlertCircleOutline className="w-10 h-10 text-[#A51D24] mx-auto mb-3" />
        <h3 className="text-lg font-bold text-[#370A00] mb-1">Unable to Load Dashboard</h3>
        <p className="text-xs text-[#7C2808] mb-5">{error?.message || 'Server connection failed.'}</p>
        <Button variant="primary" size="sm" onClick={() => refetch()} icon={IoRefreshOutline}>
          Retry Connection
        </Button>
      </div>
    );
  }

  const {
    summary = {},
    prioritizedChanges = [],
    watchlists = [],
    activeWatchlist,
  } = dashboardData || {};

  const currentWlId = activeWatchlist?.id || (watchlists[0]?.id ?? null);
  const items = activeWatchlist?.items || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Groww Market Status Ribbon */}
      <MarketStatus
        lastChecked={prioritizedChanges[0]?.baselineTimestamp}
        onAcknowledgeAll={prioritizedChanges.length > 0 ? handleAcknowledgeAll : undefined}
        isAcknowledging={acknowledgeMutation.isPending}
      />

      {/* Prioritized "What Changed Since Your Last Visit" Section */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-xl font-bold text-[#370A00] tracking-tight font-sans leading-tight">
                What Changed Since Your Last Visit?
              </h2>
              {summary.totalMeaningfulChanges > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#006044]/15 border border-[#006044]/30 text-[#006044] font-mono text-[10px] sm:text-xs font-bold shrink-0">
                  {summary.totalMeaningfulChanges} {summary.totalMeaningfulChanges === 1 ? 'Change' : 'Changes'}
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-[#7C2808] mt-1 font-medium hidden sm:block">
              Prioritized by composite market anomaly score (Price, Volume Spikes, ATR Volatility &amp; Breakouts).
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 rounded-xl bg-[#FEECD3] hover:bg-[#FFF0DC] text-[#7C2808] hover:text-[#370A00] border border-[#FFD6A7] hover:border-[#8C3F27] text-xs transition-colors shadow-sm shrink-0"
            title="Refresh Quotes"
          >
            <IoRefreshOutline className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {prioritizedChanges.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {prioritizedChanges.map((change) => (
              <PriorityChangeCard
                key={change.id || change.symbol}
                change={change}
                onAcknowledge={handleAcknowledge}
                onSelectStock={(sym) => setSelectedStockSymbol(sym)}
                isAcknowledging={acknowledgeMutation.isPending}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-[#FEECD3] border border-[#FFD6A7] text-center shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#006044]/15 border border-[#006044]/30 flex items-center justify-center text-[#006044] mx-auto mb-3 shadow-sm">
              <IoFlashOutline className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#370A00] mb-1">No Anomalous Changes Detected</h3>
            <p className="text-xs text-[#7C2808] max-w-md mx-auto">
              All stocks in your watchlists are trading within normal baseline volatility ranges.
            </p>
          </div>
        )}
      </div>

      {/* Watchlists Section */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-[#370A00] tracking-tight">Your Watchlists</h2>
            <p className="text-[11px] sm:text-xs text-[#7C2808] mt-0.5 font-medium hidden sm:block">Manage curated sectors and customize tracking baselines.</p>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={IoAddOutline}
            onClick={() => setIsAddStockOpen(true)}
            disabled={!currentWlId}
            className="text-xs font-bold text-[#FFF7ED] bg-[#370A00] hover:bg-[#250700] rounded-xl shadow-md shrink-0"
          >
            Add Stock
          </Button>
        </div>

        <WatchlistSelector
          watchlists={watchlists}
          activeWatchlistId={currentWlId}
          onSelectWatchlist={(id) => {
            setSelectedWatchlistId(id);
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
          }}
          onOpenCreateModal={() => setIsCreateWatchlistOpen(true)}
          onDeleteWatchlist={(id) => deleteWatchlistMutation.mutate(id)}
        />

        {/* Watchlist Stock Rows */}
        <div className="space-y-2">
          {items.length > 0 ? (
            items.map((item) => (
              <StockRow
                key={item.id || item.symbol}
                item={item}
                onSelectStock={(sym) => setSelectedStockSymbol(sym)}
                onRemoveStock={handleRemoveStock}
                isRemoving={removeStockMutation.isPending}
              />
            ))
          ) : (
            <div className="p-10 rounded-2xl bg-[#FEECD3] border border-dashed border-[#FFD6A7] text-center">
              <h3 className="text-sm font-bold text-[#370A00] mb-1">This watchlist is currently empty</h3>
              <p className="text-xs text-[#7C2808] mb-4 max-w-sm mx-auto">
                Add your favorite Indian equities (Reliance, TCS, HDFC Bank, Infosys) to begin tracking meaningful change anomalies.
              </p>
              <Button
                variant="primary"
                size="sm"
                icon={IoAddOutline}
                onClick={() => setIsAddStockOpen(true)}
                className="font-bold text-[#FFF7ED] bg-[#370A00] hover:bg-[#250700] rounded-xl shadow-md"
              >
                Add Your First Stock
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddStockModal
        isOpen={isAddStockOpen}
        onClose={() => setIsAddStockOpen(false)}
        watchlistId={currentWlId}
        onStockAdded={() => queryClient.invalidateQueries({ queryKey: ['dashboard'] })}
      />

      <CreateWatchlistModal
        isOpen={isCreateWatchlistOpen}
        onClose={() => setIsCreateWatchlistOpen(false)}
        onWatchlistCreated={(created) => {
          setSelectedWatchlistId(created.id);
          queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        }}
      />

      <StockDetailModal
        symbol={selectedStockSymbol}
        isOpen={!!selectedStockSymbol}
        onClose={() => setSelectedStockSymbol(null)}
      />
    </div>
  );
};

