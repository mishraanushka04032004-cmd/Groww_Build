import React from 'react';
import { IoTrendingUpOutline, IoTrendingDownOutline } from 'react-icons/io5';

export const PriceChange = ({
  value,
  isPercent = true,
  showIcon = true,
  prefix = '',
  suffix = '',
  size = 'md',
  className = '',
}) => {
  const num = typeof value === 'number' ? value : parseFloat(value) || 0;
  const isPositive = num > 0;
  const isZero = num === 0;

  const colors = isZero
    ? 'text-[#7C2808] bg-[#FEECD3] border-[#FFD6A7]'
    : isPositive
    ? 'text-[#006044] bg-[#006044]/10 border-[#006044]/25'
    : 'text-[#A51D24] bg-[#A51D24]/10 border-[#A51D24]/25';

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-mono font-semibold rounded-md',
    md: 'text-xs px-2.5 py-0.5 gap-1.5 font-mono font-bold rounded-lg',
    lg: 'text-sm px-3 py-1 gap-2 font-mono font-bold rounded-lg',
  };

  const formattedValue = `${isPositive ? '+' : ''}${num.toFixed(2)}${isPercent ? '%' : ''}`;

  return (
    <span
      className={`inline-flex items-center border ${colors} ${sizes[size]} ${className}`}
    >
      {showIcon && !isZero && (
        isPositive ? (
          <IoTrendingUpOutline className="w-3.5 h-3.5 shrink-0 text-[#006044]" />
        ) : (
          <IoTrendingDownOutline className="w-3.5 h-3.5 shrink-0 text-[#A51D24]" />
        )
      )}
      <span>{prefix}{formattedValue}{suffix}</span>
    </span>
  );
};
