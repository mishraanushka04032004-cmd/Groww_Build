import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variants = {
    default: 'bg-[#FEECD3] text-[#7C2808] border-[#FFD6A7]',
    brand: 'bg-[#FEECD3] text-[#370A00] border-[#8C3F27] font-bold',
    high: 'bg-[#A51D24]/10 text-[#A51D24] border-[#A51D24]/30 font-bold',
    medium: 'bg-[#FCB700]/15 text-[#8C3F27] border-[#FCB700]/40 font-bold',
    low: 'bg-[#006044]/10 text-[#006044] border-[#006044]/30 font-bold',
    neutral: 'bg-[#FEECD3] text-[#7C2808] border-[#FFD6A7]',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono tracking-wide ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};

