import React, { useState } from 'react';

export const CandlestickChart = ({ candles = [], range = '1M', currentPrice }) => {
  const [hoveredCandle, setHoveredCandle] = useState(null);

  if (!candles || candles.length < 2) {
    return (
      <div className="w-full h-56 bg-slate-950/80 rounded-2xl p-4 border border-slate-800/80 flex items-center justify-center text-xs text-slate-500 font-mono">
        Insufficient candlestick history data available for this range.
      </div>
    );
  }

  const width = 720;
  const height = 240;
  const padding = { top: 20, right: 65, bottom: 35, left: 15 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const priceChartHeight = chartHeight * 0.78;
  const volumeChartHeight = chartHeight * 0.20;
  const volumeTop = padding.top + chartHeight - volumeChartHeight;

  // Calculate min & max price across all candle highs/lows
  const allHighs = candles.map((c) => c.high);
  const allLows = candles.map((c) => c.low);
  const allVolumes = candles.map((c) => c.volume || 1);

  const rawMinPrice = Math.min(...allLows);
  const rawMaxPrice = Math.max(...allHighs);
  const priceMargin = (rawMaxPrice - rawMinPrice) * 0.06 || rawMinPrice * 0.02 || 1;

  const minPrice = rawMinPrice - priceMargin;
  const maxPrice = rawMaxPrice + priceMargin;
  const priceRange = maxPrice - minPrice || 1;

  const maxVolume = Math.max(...allVolumes) || 1;

  // Coordinate mappers
  const getY = (price) => {
    return padding.top + (1 - (price - minPrice) / priceRange) * priceChartHeight;
  };

  const candleSpacing = chartWidth / candles.length;
  const candleWidth = Math.max(3, Math.min(14, candleSpacing * 0.65));

  const activeCandle = hoveredCandle || candles[candles.length - 1];

  // Generate 4 horizontal grid lines
  const gridLines = [0.1, 0.4, 0.7, 0.95].map((factor) => {
    const price = minPrice + (maxPrice - minPrice) * factor;
    const y = getY(price);
    return { price, y };
  });

  return (
    <div className="w-full bg-[#FEECD3] rounded-2xl p-3 sm:p-4 border border-[#FFD6A7] shadow-sm relative select-none">
      {/* Active OHLC Bar Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-2 pb-2 mb-2 border-b border-[#FFD6A7] text-[11px] font-mono">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[#7C2808]">
            Date: <strong className="text-[#370A00]">{new Date(activeCandle.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
          </span>
          <span className="text-[#7C2808]">
            O: <strong className="text-[#370A00]">₹{activeCandle.open?.toFixed(2)}</strong>
          </span>
          <span className="text-[#7C2808]">
            H: <strong className="text-[#006044]">₹{activeCandle.high?.toFixed(2)}</strong>
          </span>
          <span className="text-[#7C2808]">
            L: <strong className="text-[#A51D24]">₹{activeCandle.low?.toFixed(2)}</strong>
          </span>
          <span className="text-[#7C2808]">
            C: <strong className={activeCandle.close >= activeCandle.open ? 'text-[#006044]' : 'text-[#A51D24]'}>
              ₹{activeCandle.close?.toFixed(2)}
            </strong>
          </span>
        </div>

        <div className="text-[#7C2808] text-[10px]">
          Vol: <strong className="text-[#370A00]">
            {activeCandle.volume >= 10000000
              ? `${(activeCandle.volume / 10000000).toFixed(2)} Cr`
              : activeCandle.volume >= 100000
              ? `${(activeCandle.volume / 100000).toFixed(1)} L`
              : `${(activeCandle.volume || 0).toLocaleString('en-IN')}`}
          </strong>
        </div>
      </div>

      {/* Candlestick SVG Container */}
      <div className="relative w-full h-56 sm:h-64">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          onMouseLeave={() => setHoveredCandle(null)}
        >
          {/* Subtle Grid Lines & Price Labels */}
          {gridLines.map(({ price, y }, idx) => (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left + chartWidth}
                y2={y}
                stroke="#FFD6A7"
                strokeDasharray="3 4"
                strokeWidth="1"
              />
              <text
                x={padding.left + chartWidth + 8}
                y={y + 3.5}
                fill="#7C2808"
                fontSize="10"
                fontFamily="monospace"
              >
                ₹{price.toFixed(0)}
              </text>
            </g>
          ))}

          {/* Volume Baseline Line */}
          <line
            x1={padding.left}
            y1={volumeTop - 4}
            x2={padding.left + chartWidth}
            y2={volumeTop - 4}
            stroke="#FFD6A7"
            strokeWidth="1"
          />

          {/* Render Each Candlestick and Volume Bar */}
          {candles.map((candle, i) => {
            const x = padding.left + i * candleSpacing + candleSpacing / 2;
            const isBullish = candle.close >= candle.open;
            const color = isBullish ? '#006044' : '#A51D24';

            const yHigh = getY(candle.high);
            const yLow = getY(candle.low);
            const yOpen = getY(candle.open);
            const yClose = getY(candle.close);

            const bodyTop = Math.min(yOpen, yClose);
            const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));

            // Volume bar calculation
            const volHeight = Math.max(2, ((candle.volume || 1) / maxVolume) * volumeChartHeight);
            const volY = padding.top + chartHeight - volHeight;

            const isHovered = hoveredCandle && hoveredCandle.date === candle.date;

            return (
              <g
                key={candle.date || i}
                onMouseEnter={() => setHoveredCandle(candle)}
                className="cursor-crosshair group"
              >
                {/* Hover Column Background Highlight */}
                {isHovered && (
                  <rect
                    x={x - candleSpacing / 2}
                    y={padding.top}
                    width={candleSpacing}
                    height={chartHeight}
                    fill="#FFF7ED"
                    opacity="0.75"
                  />
                )}

                {/* Volume Histogram Bar */}
                <rect
                  x={x - candleWidth / 2}
                  y={volY}
                  width={candleWidth}
                  height={volHeight}
                  fill={color}
                  opacity={isHovered ? 0.7 : 0.35}
                  rx="1"
                />

                {/* Candlestick Wick (Upper & Lower) */}
                <line
                  x1={x}
                  y1={yHigh}
                  x2={x}
                  y2={yLow}
                  stroke={color}
                  strokeWidth={isHovered ? 1.8 : 1.2}
                />

                {/* Candlestick Real Body */}
                <rect
                  x={x - candleWidth / 2}
                  y={bodyTop}
                  width={candleWidth}
                  height={bodyHeight}
                  fill={color}
                  stroke={color}
                  strokeWidth="0.5"
                  rx="1"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Time Axis Labels */}
      <div className="flex items-center justify-between px-2 pt-1 text-[10px] font-mono text-[#7C2808] border-t border-[#FFD6A7]">
        <span>{new Date(candles[0].date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
        <span>{new Date(candles[Math.floor(candles.length / 2)].date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
        <span>{new Date(candles[candles.length - 1].date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
      </div>
    </div>
  );
};
