import React from 'react';
import { AlertTriangle, PhoneCall, X } from 'lucide-react';

interface Props {
  detectedKeyword?: string;
  onDismiss?: () => void;
}

export const EmergencyBanner: React.FC<Props> = ({ detectedKeyword, onDismiss }) => {
  return (
    <div className="bg-rose-600 text-white p-4 rounded-2xl shadow-lg border-2 border-rose-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 my-4 animate-in fade-in slide-in-from-top duration-300">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-rose-700/80 rounded-xl shrink-0">
          <AlertTriangle className="w-6 h-6 text-amber-300 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-wide uppercase bg-rose-800 px-2 py-0.5 rounded text-rose-100">
              Immediate Life Safety Warning
            </span>
            {detectedKeyword && (
              <span className="text-xs bg-rose-900/60 text-rose-200 px-2 py-0.5 rounded">
                Flagged term: "{detectedKeyword}"
              </span>
            )}
          </div>
          <p className="text-sm text-rose-100 mt-1 max-w-2xl">
            If anyone is in immediate physical danger, trapped in moving floodwaters, experiencing acute medical distress,
            or an active fire is underway, <strong>do not wait for AI case processing</strong>.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
        <a
          href="tel:911"
          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-white text-rose-700 hover:bg-rose-50 px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition-transform active:scale-95"
        >
          <PhoneCall className="w-4 h-4 text-rose-600" />
          Call 911 Emergency
        </a>
        {onDismiss && (
          <button
            onClick={onDismiss}
            aria-label="Dismiss warning"
            className="p-1.5 hover:bg-rose-700 text-rose-200 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
