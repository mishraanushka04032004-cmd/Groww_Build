import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  isLoading = false,
  onClick,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-groww-green/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl';

  const variants = {
    primary: 'bg-[#370A00] hover:bg-[#521303] text-[#FFF7ED] shadow-md shadow-[#370A00]/15 hover:shadow-lg active:scale-[0.98]',
    secondary: 'bg-[#FEECD3] hover:bg-[#FFD6A7] text-[#370A00] border border-[#FFD6A7] active:scale-[0.98]',
    outline: 'bg-transparent hover:bg-[#FEECD3] text-[#370A00] border border-[#FFD6A7] hover:border-[#8C3F27]',
    ghost: 'bg-transparent hover:bg-[#FEECD3] text-[#7C2808] hover:text-[#370A00]',
    danger: 'bg-[#FF6266]/15 hover:bg-[#FF6266]/25 text-[#C93400] border border-[#FF6266]/30 active:scale-[0.98]',
    success: 'bg-[#006044]/15 hover:bg-[#006044]/25 text-[#006044] border border-[#006044]/30',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 font-medium',
    md: 'text-sm px-4 py-2 gap-2 font-semibold',
    lg: 'text-base px-6 py-2.5 gap-2.5 font-bold',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        Icon && <Icon className="w-4 h-4 shrink-0" />
      )}
      {children}
    </button>
  );
};
