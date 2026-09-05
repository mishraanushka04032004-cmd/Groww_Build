import React from 'react';

/**
 * BrandLogo
 * Executive calligraphic script wordmark inspired by the iconic Tata / TCS signature heritage,
 * featuring bold cursive letterforms, architectural letter-spacing sub-line, and 100% solid Caramellatte colors.
 */
export const BrandLogo = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: {
      text: 'text-base sm:text-xl',
      subText: 'text-[6px] sm:text-[7px]',
      badge: 'text-[7px] sm:text-[8px] px-1 sm:px-1.5 py-0',
    },
    md: {
      text: 'text-lg sm:text-2xl',
      subText: 'text-[7px] sm:text-[8px]',
      badge: 'text-[8px] sm:text-[9px] px-1.5 sm:px-2 py-0.5',
    },
    lg: {
      text: 'text-2xl sm:text-4xl',
      subText: 'text-[9px] sm:text-[10px]',
      badge: 'text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1',
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-1.5 sm:gap-3 cursor-pointer select-none group ${className}`}>
      {/* Tata/TCS Signature-Style Cursive Wordmark */}
      <div className="flex flex-col items-start leading-none">
        <div className="flex items-baseline font-cursive tracking-wide">
          <span className={`font-bold text-[#370A00] ${currentSize.text} tracking-tight group-hover:text-[#7C2808] transition-colors drop-shadow-sm`}>
            Groww
          </span>
          <span className={`font-bold text-[#8C3F27] ${currentSize.text} ml-0.5 tracking-tight group-hover:text-[#370A00] transition-colors`}>
            .Watch
          </span>
        </div>

        {/* TCS-Style Architectural Corporate Sub-tagline */}
        <div className="flex items-center gap-1 mt-0.5 w-full">
          <span className="h-[1px] flex-1 bg-[#FFD6A7]" />
          <span className={`font-mono font-bold uppercase tracking-[0.2em] text-[#7C2808] ${currentSize.subText}`}>
            INTELLIGENCE
          </span>
          <span className="h-[1px] flex-1 bg-[#FFD6A7]" />
        </div>
      </div>

      {/* Solid Institutional Tag */}
      <span className={`font-mono font-bold uppercase tracking-wider bg-[#FEECD3] text-[#7C2808] group-hover:text-[#370A00] border border-[#FFD6A7] rounded-md transition-all self-center shrink-0 ${currentSize.badge}`}>
        PRO
      </span>
    </div>
  );
};
