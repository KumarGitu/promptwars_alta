import React, { useState, useEffect } from 'react';
import {
  Compass,
  PlusCircle,
  FolderOpen,
  ShieldCheck,
  ListTodo,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Waves,
  RefreshCw,
  Search,
} from 'lucide-react';
import { CivicCase, ImpactMetrics } from '../types/index';
import { api } from '../services/api';
import { ClaimVerificationBadge } from '../components/ClaimVerificationBadge';
import { ProofToActionStages } from '../components/ProofToActionStages';

interface Props {
  onNavigate: (page: string) => void;
  onOpenCase: (caseId: string) => void;
}

export const DashboardOverview: React.FC<Props> = ({ onNavigate, onOpenCase }) => {
  const [cases, setCases] = useState<CivicCase[]>([]);
  const [metrics, setMetrics] = useState<ImpactMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [quickInput, setQuickInput] = useState('');
  const [systemInfo, setSystemInfo] = useState<{ isConfigured: boolean; model: string }>({
    isConfigured: false,
    model: 'gemini-3.8-flash',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [casesData, metricsData, settingsData] = await Promise.all([
        api.getCases(),
        api.getImpactMetrics(),
        api.getSettings(),
      ]);
      setCases(casesData);
      setMetrics(metricsData);
      if (settingsData?.gemini) {
        setSystemInfo({
          isConfigured: settingsData.gemini.isConfigured,
          model: settingsData.gemini.model,
        });
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) {
      onNavigate('input');
      return;
    }
    // Store quick input in session storage for UniversalInputCenter to pick up
    sessionStorage.setItem('prefill_case_input', quickInput);
    onNavigate('input');
  };

  const primaryCase = cases.find((c) => c.id === 'case-flood-001') || cases[0];
  const awaitingVerificationCases = cases.filter((c) =>
    c.claims.some((cl) => cl.status === 'UNVERIFIED' || cl.status === 'UNABLE_TO_VERIFY')
  );

  return (
    <div className="space-y-6">
      {/* Welcome & Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-400/30 px-2.5 py-0.5 rounded-full">
              Civic Operations Dashboard
            </span>
            <span
              className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${
                systemInfo.isConfigured
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700'
                  : 'bg-amber-950/60 text-amber-300 border-amber-700'
              }`}
            >
              {systemInfo.isConfigured
                ? '⚡ Live Gemini 3.8 Flash Active'
                : '🛡️ Transparent Local Civic Engine (Offline Mode)'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Universal Civic Command & Verification Center
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Welcome to CivicBridge AI. Review active neighborhood incidents, verify citizen claims against
            authoritative registries, and track community remediation through to verified outcomes.
          </p>

          {/* Quick Universal Input Bar */}
          <form onSubmit={handleQuickSubmit} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-2xl">
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="Describe an everyday problem: e.g. Flooded crosswalk on Elmwood Ave..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Process Case</span>
            </button>
          </form>
        </div>
      </div>

      {/* Primary Demonstration Callout Banner (Judges 2-Minute Pitch) */}
      {primaryCase && (
        <div className="bg-teal-50/70 dark:bg-slate-900 border-2 border-teal-300 dark:border-teal-700/60 rounded-3xl p-5 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 bg-teal-100 dark:bg-teal-950 px-2.5 py-0.5 rounded-full">
                  Primary Demonstration Scenario • 2-Min Pitch
                </span>
                <span className="text-xs text-slate-500 font-mono">{primaryCase.caseNumber}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                {primaryCase.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">
                {primaryCase.userReport}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={() => onOpenCase(primaryCase.id)}
              className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-bold shadow-sm transition-transform active:scale-95"
            >
              <span>Inspect Full Case Transformation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* KPI Stats Row */}
      {metrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Active Cases</span>
              <FolderOpen className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {metrics.totalCases}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {metrics.openCases} open • {metrics.resolvedCases} resolved
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Verified Claims</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-600">
              {metrics.verificationBreakdown.verified}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {metrics.verificationBreakdown.partiallySupported} partially supported
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Actions Executed</span>
              <ListTodo className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {metrics.tasksCompleted}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Across {metrics.actionPlansCreated} action plans
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Avg Processing Time</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {metrics.averageProcessingTimeSeconds}s
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Proof-to-Action pipeline latency
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Grid: Recent Cases & Pending Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Cases Column */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Recent Civic Cases & Verification Status
              </h3>
            </div>
            <button
              onClick={() => onNavigate('cases')}
              className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline"
            >
              View All ({cases.length}) →
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {cases.slice(0, 4).map((c) => (
              <div
                key={c.id}
                onClick={() => onOpenCase(c.id)}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 p-2 rounded-xl transition-all cursor-pointer group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-slate-500">
                      {c.caseNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.urgency === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800'
                          : c.urgency === 'HIGH'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      Urgency: {c.urgency}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Stage {c.currentStage}/5
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {c.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {c.location.rawInput}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      {c.actions.filter((a) => a.status === 'COMPLETED').length} / {c.actions.length} Actions Done
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {c.claims.filter((cl) => cl.status === 'VERIFIED').length} Verified Claims
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar Column: Awaiting Verification & Quick Links */}
        <div className="lg:col-span-4 space-y-6">
          {/* Claims Awaiting Verification */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertTriangle className="w-4 h-4" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Awaiting Verification
                </h4>
              </div>
              <button
                onClick={() => onNavigate('verification')}
                className="text-[11px] text-teal-600 font-semibold hover:underline"
              >
                Inspect All
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Claims submitted by citizens requiring official municipal sensor or dispatch corroboration:
            </p>

            <div className="space-y-2.5">
              {cases
                .flatMap((c) => c.claims.filter((cl) => cl.status === 'UNVERIFIED').map((cl) => ({ ...cl, caseId: c.id })))
                .slice(0, 3)
                .map((cl) => (
                  <div
                    key={cl.id}
                    onClick={() => onOpenCase(cl.caseId)}
                    className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 text-xs cursor-pointer hover:border-amber-400 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <ClaimVerificationBadge status="UNVERIFIED" size="sm" />
                      <span className="text-[10px] text-slate-400">Click to inspect</span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 font-medium line-clamp-2">
                      "{cl.claimText}"
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Quick Action Navigator */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-teal-400">
              Action Plans In Motion
            </h4>
            <p className="text-xs text-slate-300">
              Coordinate work orders directly with public agencies: Public Works, School Safety, and EPA.
            </p>
            <button
              onClick={() => onNavigate('actions')}
              className="w-full py-2.5 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <ListTodo className="w-4 h-4" />
              <span>Review Centralized Action Hub</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
