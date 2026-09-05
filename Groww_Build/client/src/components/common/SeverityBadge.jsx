import React from 'react';
import { IoAlertCircle, IoInformationCircle, IoFlame } from 'react-icons/io5';

export const SeverityBadge = ({ severity, score, className = '' }) => {
  const configs = {
    HIGH: {
      label: 'HIGH IMPACT',
      bg: 'bg-[#A51D24]/10 text-[#A51D24] border-[#A51D24]/30 shadow-sm',
      icon: IoFlame,
      dot: 'bg-[#A51D24]',
    },
    MEDIUM: {
      label: 'MEDIUM IMPACT',
      bg: 'bg-[#FCB700]/20 text-[#8C3F27] border-[#FCB700]/40 shadow-sm',
      icon: IoAlertCircle,
      dot: 'bg-[#FCB700]',
    },
    LOW: {
      label: 'LOW IMPACT',
      bg: 'bg-[#006044]/10 text-[#006044] border-[#006044]/30 shadow-sm',
      icon: IoInformationCircle,
      dot: 'bg-[#006044]',
    },
  };

  const current = configs[severity] || configs.LOW;
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] sm:text-[11px] font-mono font-bold tracking-wider ${current.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot} animate-pulse`} />
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{current.label}</span>
      {score !== undefined && (
        <span className="opacity-75 pl-1 border-l border-current/20 text-[10px]">
          {score}
        </span>
      )}
    </span>
  );
};
