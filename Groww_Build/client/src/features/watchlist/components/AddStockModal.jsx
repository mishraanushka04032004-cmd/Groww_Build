import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal.jsx';
import { Input } from '../../../components/ui/Input.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { marketApi } from '../../market/api/market.api.js';
import { watchlistApi } from '../api/watchlist.api.js';
import { IoSearchOutline, IoAddOutline, IoAlertCircleOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';

export const AddStockModal = ({ isOpen, onClose, watchlistId, onStockAdded }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Popular Indian Equities
  const POPULAR_INDIAN_STOCKS = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', price: 2985.40, changePercent: 3.30 },
    { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.', price: 4180.50, changePercent: 0.98 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', price: 1645.20, changePercent: -2.07 },
    { symbol: 'INFY', name: 'Infosys Ltd.', price: 1895.60, changePercent: 1.26 },
    { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', price: 1082.40, changePercent: 4.58 },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', price: 1248.80, changePercent: 1.12 },
    { symbol: 'SBIN', name: 'State Bank of India', price: 846.50, changePercent: 1.01 },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', price: 1592.00, changePercent: 1.72 },
  ];

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults(POPULAR_INDIAN_STOCKS);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setFeedback({ type: '', message: '' });
      try {
        const data = await marketApi.searchSymbols(searchQuery);
        setResults(data || []);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAddStock = async (stock) => {
    if (!watchlistId) return;

    setIsAdding(true);
    setFeedback({ type: '', message: '' });

    try {
      await watchlistApi.addItem(watchlistId, stock.symbol, stock.name);
      setFeedback({ type: 'success', message: `Added ${stock.symbol} to watchlist` });
      if (onStockAdded) onStockAdded(stock);
      setTimeout(() => {
        onClose();
        setSearchQuery('');
        setResults([]);
        setFeedback({ type: '', message: '' });
      }, 600);
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || `${stock.symbol} is already in this watchlist`,
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Indian Equity to Watchlist"
      description="Search NSE / BSE equities by symbol or company name."
    >
      <div className="space-y-4">
        <Input
          id="stock-search-input"
          label="Search Ticker / Company"
          placeholder="e.g. RELIANCE, TCS, HDFCBANK, INFY..."
          icon={IoSearchOutline}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
        />

        {feedback.message && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center gap-2 font-medium ${
              feedback.type === 'success'
                ? 'bg-[#006044]/10 border-[#006044]/30 text-[#006044]'
                : 'bg-[#A51D24]/10 border-[#A51D24]/30 text-[#A51D24]'
            }`}
          >
            {feedback.type === 'success' ? (
              <IoCheckmarkCircleOutline className="w-4 h-4 shrink-0" />
            ) : (
              <IoAlertCircleOutline className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="max-h-60 overflow-y-auto space-y-1.5 pt-1">
          {isSearching ? (
            <div className="py-8 text-center text-xs text-[#7C2808] font-mono">
              <span className="inline-block w-4 h-4 border-2 border-[#8C3F27] border-t-transparent rounded-full animate-spin mr-2 align-middle" />
              Searching market database...
            </div>
          ) : results.length > 0 ? (
            results.map((stock) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-[#FEECD3] hover:bg-[#FFF0DC] border border-[#FFD6A7] transition-colors shadow-sm gap-2"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FFF7ED] border border-[#FFD6A7] flex items-center justify-center font-mono font-bold text-[#370A00] text-[9px] sm:text-xs shrink-0">
                    {stock.symbol.slice(0, 4)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-[#370A00] text-xs sm:text-sm tracking-tight">{stock.symbol}</div>
                    <div className="text-[10px] sm:text-xs text-[#7C2808] truncate max-w-[110px] min-[380px]:max-w-[160px] font-medium">{stock.name}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right hidden min-[380px]:block">
                    <div className="font-mono font-bold text-[#370A00] text-xs">
                      ₹{stock.price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div
                      className={`text-[10px] font-mono font-bold ${
                        stock.changePercent >= 0 ? 'text-[#006044]' : 'text-[#A51D24]'
                      }`}
                    >
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent?.toFixed(2)}%
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    icon={IoAddOutline}
                    disabled={isAdding}
                    onClick={() => handleAddStock(stock)}
                    className="text-xs font-bold text-[#FFF7ED] bg-[#370A00] hover:bg-[#250700] rounded-xl px-2.5 sm:px-3"
                  >
                    Add
                  </Button>
                </div>
              </div>
            ))
          ) : searchQuery.trim() ? (
            <div className="py-8 text-center text-xs text-[#7C2808]">
              No matching stocks found for &quot;{searchQuery}&quot;
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-[#7C2808]">
              Type a stock symbol to view live quotes and add to your watchlist.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

