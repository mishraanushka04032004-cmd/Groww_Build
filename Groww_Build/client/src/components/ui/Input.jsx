import React, { forwardRef } from 'react';

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      type = 'text',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-bold text-[#7C2808] mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7C2808]">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={type}
            className={`w-full bg-[#FEECD3] border text-[#370A00] rounded-xl text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#8C3F27]/25 ${
              Icon ? 'pl-10' : 'pl-3.5'
            } pr-3.5 py-2.5 ${
              error
                ? 'border-[#A51D24] focus:border-[#A51D24]'
                : 'border-[#FFD6A7] hover:border-[#8C3F27]/60 focus:border-[#8C3F27]'
            } placeholder:text-[#7C2808]/40 disabled:opacity-50 ${className}`}
            {...props}
          />
        </div>
        {error ? (
          <p className="mt-1.5 text-xs text-[#A51D24] font-semibold">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-[#7C2808]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

