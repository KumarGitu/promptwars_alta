import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  Building2,
  Calendar,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { api } from '../services/api';
import { ClaimVerificationBadge } from '../components/ClaimVerificationBadge';
import { VerificationStatus } from '../types/index';

interface Props {
  onOpenCase: (caseId: string) => void;
}

export const VerificationCenterPage: React.FC<Props> = ({ onOpenCase }) => {
  const [claims, setClaims] = useState<any[]>([]);
  const [counts, setCounts] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [reverifyingId, setReverifyingId] = useState<string | null>(null);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const data = await api.getAllClaims({
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
        search: searchQuery.trim() || undefined,
      });
      setClaims(data.claims || []);
      setCounts(data.counts || {});
    } catch (err) {
      console.error('Failed to load claims:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchClaims();
  };

  const handleReverify = async (caseId: string, claimId: string) => {
    setReverifyingId(claimId);
    try {
      await api.reverifyClaim(caseId, claimId);
      await fetchClaims();
    } catch (err) {
      console.error('Failed to reverify:', err);
    } finally {
      setReverifyingId(null);
    }
  };

  const filterTabs = [
    { id: 'ALL', label: 'All Claims', count: counts.total || 0 },
    { id: 'VERIFIED', label: 'Verified', count: counts.verified || 0 },
    { id: 'PARTIALLY_SUPPORTED', label: 'Partially Supported', count: counts.partiallySupported || 0 },
    { id: 'UNVERIFIED', label: 'Unverified', count: counts.unverified || 0 },
    { id: 'CONFLICTING', label: 'Conflicting', count: counts.conflicting || 0 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Authoritative Verification Registry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Verification Center
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
          Review, cross-reference, and audit citizen assertions against authoritative municipal, meteorological, and
          statutory databases. Never hallucinates verification without supporting citations.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search claims by keyword, source title, or case name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 text-white rounded-xl text-xs font-bold transition-transform active:scale-95"
          >
            Search Claims
          </button>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                selectedStatus === tab.id
                  ? 'bg-slate-900 text-white dark:bg-teal-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Claims List */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 text-xs flex flex-col items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-teal-600" />
          <span>Querying Verification Registries...</span>
        </div>
      ) : claims.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center text-slate-400 text-xs border border-slate-200 dark:border-slate-800">
          No claims matching the selected filters were found.
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ClaimVerificationBadge status={claim.status as VerificationStatus} size="md" />
                  <span className="text-xs font-mono text-slate-400">{claim.caseNumber}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={reverifyingId === claim.id}
                    onClick={() => handleReverify(claim.caseId, claim.id)}
                    className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${reverifyingId === claim.id ? 'animate-spin' : ''}`} />
                    <span>{reverifyingId === claim.id ? 'Rechecking...' : 'Re-verify Claim'}</span>
                  </button>

                  <button
                    onClick={() => onOpenCase(claim.caseId)}
                    className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-teal-600 text-white font-semibold hover:opacity-95"
                  >
                    <span>View Case</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Claim Statement */}
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                "{claim.claimText}"
              </h3>

              {/* Case Context pill */}
              <div className="text-xs text-slate-500">
                Originating Case: <strong className="text-slate-700 dark:text-slate-300">{claim.caseTitle}</strong>
              </div>

              {/* Source attribution & quote */}
              {claim.sourceTitle && (
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                  <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                    <span className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400">
                      <Building2 className="w-4 h-4" />
                      <span>{claim.sourceTitle}</span>
                    </span>
                    {claim.sourceDate && (
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{claim.sourceDate}</span>
                      </span>
                    )}
                  </div>

                  {claim.sourceExcerpt && (
                    <p className="text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                      "{claim.sourceExcerpt}"
                    </p>
                  )}

                  {claim.sourceUrl && (
                    <a
                      href={claim.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-teal-600 hover:underline"
                    >
                      <span>Public Record: {claim.sourceUrl}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              {/* Uncertainty explanation */}
              <div className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-850 p-3 rounded-xl border border-slate-200 dark:border-slate-750">
                <strong className="text-slate-700 dark:text-slate-300 font-semibold block mb-0.5">
                  Verification Rationale & Boundaries of Certainty:
                </strong>
                {claim.uncertaintyExplanation}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
