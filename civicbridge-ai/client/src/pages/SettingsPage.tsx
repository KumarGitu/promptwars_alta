import React, { useState, useEffect } from 'react';
import {
  Settings,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Server,
  Lock,
  Code,
  HardDrive,
  Info,
} from 'lucide-react';
import { api } from '../services/api';

interface Props {
  onResetComplete?: () => void;
}

export const SettingsPage: React.FC<Props> = ({ onResetComplete }) => {
  const [settingsData, setSettingsData] = useState<any>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettingsData(data);
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleResetDemoData = async () => {
    if (!window.confirm('Reset all demo cases and resources to initial presentation state?')) return;
    setIsResetting(true);
    setResetMessage(null);
    try {
      await api.resetDemoData();
      setResetMessage('Demo dataset restored to initial presentation state!');
      if (onResetComplete) onResetComplete();
      await fetchSettings();
    } catch (err: any) {
      setResetMessage('Failed to reset demo data: ' + err.message);
    } finally {
      setIsResetting(false);
    }
  };

  const isConfigured = Boolean(settingsData?.gemini?.isConfigured);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
          <Settings className="w-4 h-4" />
          <span>System Administration & Platform Diagnostics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          System Architecture & Security Settings
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
          Review server-side AI model status, platform diagnostics, data retention, and presentation states.
        </p>
      </div>

      {/* Security Architecture Card: No Keys Exposed */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>Server-Side Credential Security</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Zero Client Secret Exposure
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Official Google Gen AI SDK • Target Model: <code>gemini-3.8-flash</code>
              </p>
            </div>
          </div>

          <div>
            <span
              className={`text-xs px-3 py-1.5 rounded-full font-bold border inline-flex items-center gap-1.5 ${
                isConfigured
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              <span>{isConfigured ? 'Live Gemini 3.8 Flash Active' : 'Secure Local Civic Engine (Offline Mode)'}</span>
            </span>
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/60 text-xs text-teal-900 dark:text-teal-200 space-y-1.5">
          <div className="font-bold flex items-center gap-1.5 text-teal-800 dark:text-teal-300">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Strict Security Standard: Protected Environment Credentials</span>
          </div>
          <p className="leading-relaxed">
            In accordance with production security policies, API keys and credentials are{' '}
            <strong>never handled, stored, or exposed in frontend code, browser storage, or network payloads</strong>.
            All AI operations are executed exclusively through server-side environment variables.
          </p>
        </div>

        {/* Backend Environment Diagnostics */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Model Assigned:</span>
            <span className="font-mono text-slate-900 dark:text-slate-100 font-bold">
              gemini-3.8-flash (Google Gen AI SDK)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Credential Source:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {settingsData?.gemini?.credentialSource || 'Server Environment (.env)'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Active Execution Mode:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {isConfigured
                ? 'Server-side Google Gemini 3.8 Flash API'
                : 'Local Civic Rule Engine (Simulated Demo Fallback)'}
            </span>
          </div>
        </div>

        {/* Instructions for Server Administrators */}
        <div className="p-4 rounded-2xl bg-slate-900 text-slate-300 text-xs space-y-2">
          <div className="flex items-center gap-2 text-white font-bold">
            <Code className="w-4 h-4 text-teal-400" />
            <span>Server Administrator Setup (Environment Variables Only):</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            To provide or rotate the Google Gemini API key on your server, edit the server-side environment file
            (<code>server/.env</code>):
          </p>
          <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-teal-300 font-mono text-[11px] overflow-x-auto select-all">
GEMINI_API_KEY=your_google_ai_studio_api_key_here
PORT=3005
          </pre>
          <p className="text-slate-400 text-[11px]">
            The server automatically loads the key upon process launch with zero client-side leakage.
          </p>
        </div>
      </div>

      {/* Demo Reset Card for Competition Judges */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Presentation State Reset
            </h3>
            <p className="text-xs text-slate-500">
              Restore the pristine demo dataset (Oakridge Elementary Flooding, Mill Creek chemical spill, Shady Pines HVAC failure).
            </p>
          </div>
        </div>

        {resetMessage && (
          <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{resetMessage}</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={handleResetDemoData}
            disabled={isResetting}
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>Reset Demo Dataset to Pristine State</span>
          </button>
        </div>
      </div>

      {/* System Information & Data Sovereignty */}
      <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-6 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 space-y-2">
        <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-teal-600" />
          <span>Server Diagnostics & Runtime Environment</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Node Runtime:</span>
            <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">{settingsData?.system?.nodeVersion || 'v24'}</span>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Storage Layer:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{settingsData?.system?.storageMode || 'Persistent JSON'}</span>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Uptime:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{settingsData?.system?.uptimeSeconds || 0}s</span>
          </div>
        </div>
      </div>
    </div>
  );
};
