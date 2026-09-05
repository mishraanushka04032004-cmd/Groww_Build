import React from 'react';
import { useGlobalLoader } from '../../context/LoadingContext.jsx';
import { BrandLogo } from './BrandLogo.jsx';

/**
 * CentralLoader
 * An Apple-grade central loader tailored for the Caramellatte theme.
 * Features a pure rotatory spinning border directly framing the central logo.
 * 100% Solid colors, zero gradients, zero orbiting/revolutionary dots.
 */
export const CentralLoader = () => {
  const { isLoading, loadingText } = useGlobalLoader();

  if (!isLoading) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#FFF7ED]/95 backdrop-blur-md transition-all duration-300 animate-fadeIn p-4 overflow-hidden"
    >
      {/* Central Capsule with Circular Rotatory Border */}
      <div className="relative flex items-center justify-center w-64 h-64 sm:w-72 sm:h-72 max-w-[90vw] max-h-[90vw]">
        {/* Outer Circular Rotatory Dashed Ring */}
        <div className="absolute inset-0 rounded-full border border-dashed border-[#8C3F27]/35 animate-[spin_9s_linear_infinite_reverse] pointer-events-none" />

        {/* Primary Circular Rotatory Segmented Border */}
        <div className="absolute inset-3 rounded-full border-[3px] border-t-[#370A00] border-r-[#8C3F27] border-b-[#FFD6A7] border-l-[#FEECD3] animate-[spin_2.4s_linear_infinite] pointer-events-none" />

        {/* Elevated Solid Center Badge */}
        <div className="relative z-10 w-48 sm:w-52 px-4 py-5 rounded-2xl bg-[#FEECD3] border-2 border-[#FFD6A7] shadow-xl flex flex-col items-center gap-2.5 text-center">
          {/* Logo in Center */}
          <BrandLogo size="sm" />

          {/* Real-time Subtitle & Pulsing Signal */}
          <div className="flex items-center gap-2 pt-2 border-t border-[#FFD6A7] w-full justify-center">
            <span className="w-2 h-2 rounded-full bg-[#006044] animate-ping shrink-0" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#7C2808] truncate">
              {loadingText || 'Syncing Market'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
