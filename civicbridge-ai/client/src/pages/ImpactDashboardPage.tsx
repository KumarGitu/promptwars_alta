import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  Clock,
  FolderOpen,
  ListTodo,
  TrendingUp,
  RefreshCw,
  Info,
  Scale,
} from 'lucide-react';
import { api } from '../services/api';
import { ImpactMetrics } from '../types/index';

export const ImpactDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<ImpactMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const data = await api.getImpactMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load impact metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading || !metrics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-2">
        <RefreshCw className="w-8 h-8 animate-spin text-teal-600" />
        <p className="text-xs text-slate-500">Calculating Societal Impact Metrics...</p>
      </div>
    );
  }

  const totalClaims =
    metrics.verificationBreakdown.verified +
    metrics.verificationBreakdown.partiallySupported +
    metrics.verificationBreakdown.unverified +
    metrics.verificationBreakdown.conflicting +
    metrics.verificationBreakdown.unableToVerify;

  const verifiedPercent = totalClaims > 0 ? Math.round((metrics.verificationBreakdown.verified / totalClaims) * 100) : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>Transparent Societal Benefit Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Impact & Verification Dashboard
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
          Audited metrics reflecting actual civic cases processed, claims corroborated against authoritative public
          data, and physical outcomes recorded on the ground.
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Total Cases Submitted</span>
            <FolderOpen className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {metrics.totalCases}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {metrics.successfullyProcessed} structured through Proof-to-Action
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Verified Claims Ratio</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">
            {verifiedPercent}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {metrics.verificationBreakdown.verified} of {totalClaims} claims verified
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Actions Completed</span>
            <CheckCircle2 className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {metrics.tasksCompleted}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Across {metrics.actionPlansCreated} community action plans
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Avg Transformation Speed</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {metrics.averageProcessingTimeSeconds}s
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            From raw input to verified action plan
          </p>
        </div>
      </div>

      {/* Detailed Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Verification Status Distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-teal-600" />
              <span>Evidence Verification Breakdown</span>
            </h3>
            <span className="text-xs text-slate-400">{totalClaims} total claims evaluated</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              {
                label: 'Verified Against Cited Source',
                count: metrics.verificationBreakdown.verified,
                color: 'bg-emerald-500',
                textColor: 'text-emerald-700 dark:text-emerald-300',
              },
              {
                label: 'Partially Supported',
                count: metrics.verificationBreakdown.partiallySupported,
                color: 'bg-sky-500',
                textColor: 'text-sky-700 dark:text-sky-300',
              },
              {
                label: 'Unverified Assertions',
                count: metrics.verificationBreakdown.unverified,
                color: 'bg-amber-500',
                textColor: 'text-amber-800 dark:text-amber-300',
              },
              {
                label: 'Conflicting Information',
                count: metrics.verificationBreakdown.conflicting,
                color: 'bg-rose-500',
                textColor: 'text-rose-700 dark:text-rose-300',
              },
              {
                label: 'Unable to Verify',
                count: metrics.verificationBreakdown.unableToVerify,
                color: 'bg-slate-400',
                textColor: 'text-slate-600 dark:text-slate-400',
              },
            ].map((item, idx) => {
              const pct = totalClaims > 0 ? (item.count / totalClaims) * 100 : 0;
              return (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold ${item.textColor}`}>{item.label}</span>
                    <span className="text-slate-500">
                      {item.count} ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full rounded-full`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              <span>Incidents by Societal Category</span>
            </h3>
            <span className="text-xs text-slate-400">{metrics.totalCases} cases total</span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(metrics.categoryBreakdown).map(([cat, count], idx) => {
              const pct = metrics.totalCases > 0 ? (count / metrics.totalCases) * 100 : 0;
              return (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {cat.replace(/_/g, ' ')}
                    </span>
                    <span className="text-slate-500 font-mono">
                      {count} cases ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ethical Metrics Guarantee Card */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
          <Info className="w-4 h-4 text-teal-600" />
          <span>CivicBridge AI Ethical Metrics Charter</span>
        </div>
        <p className="leading-relaxed">
          In strict compliance with our Public Benefit Guidelines, CivicBridge AI never claims that a generated
          recommendation resolved a real-world issue unless a confirmed outcome with supporting proof (e.g. municipal
          work order receipt, photo of unblocked culvert, or teacher liaison note) has been recorded on scene.
        </p>
      </div>
    </div>
  );
};
