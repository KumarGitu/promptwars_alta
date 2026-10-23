import React from 'react';
import { CheckCircle2, AlertCircle, HelpCircle, XCircle, MinusCircle } from 'lucide-react';
import { VerificationStatus } from '../types/index';

interface Props {
  status: VerificationStatus;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ClaimVerificationBadge: React.FC<Props> = ({ status, showIcon = true, size = 'md' }) => {
  const configMap: Record<
    VerificationStatus,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode; tooltip: string }
  > = {
    VERIFIED: {
      label: 'Verified Against Cited Source',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
      tooltip: 'Independently confirmed by official municipal, meteorological, or administrative record.',
    },
    PARTIALLY_SUPPORTED: {
      label: 'Partially Supported',
      bg: 'bg-sky-50 dark:bg-sky-950/40',
      text: 'text-sky-700 dark:text-sky-300',
      border: 'border-sky-200 dark:border-sky-800',
      icon: <AlertCircle className="w-3.5 h-3.5 text-sky-600 shrink-0" />,
      tooltip: 'Supported by municipal records in general, but specific localized details remain unconfirmed.',
    },
    UNVERIFIED: {
      label: 'Unverified Claim',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-800 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800',
      icon: <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
      tooltip: 'Citizen assertion with no currently matching authoritative database confirmation.',
    },
    CONFLICTING: {
      label: 'Conflicting Information',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-200 dark:border-rose-800',
      icon: <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />,
      tooltip: 'Direct discrepancy detected between citizen report and authoritative civic log.',
    },
    UNABLE_TO_VERIFY: {
      label: 'Unable to Verify',
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-700 dark:text-slate-300',
      border: 'border-slate-200 dark:border-slate-700',
      icon: <MinusCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />,
      tooltip: 'No public telemetry or civic records exist for this specific parameter.',
    },
  };

  const item = configMap[status] || configMap.UNVERIFIED;

  const sizeClass =
    size === 'sm'
      ? 'text-xs px-2 py-0.5 gap-1'
      : size === 'lg'
      ? 'text-sm px-3.5 py-1.5 gap-2 font-medium'
      : 'text-xs px-2.5 py-1 gap-1.5 font-medium';

  return (
    <span
      title={item.tooltip}
      className={`inline-flex items-center rounded-full border ${item.bg} ${item.text} ${item.border} ${sizeClass} transition-all`}
    >
      {showIcon && item.icon}
      <span>{item.label}</span>
    </span>
  );
};
