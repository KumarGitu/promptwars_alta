import React, { useState, useEffect } from 'react';
import {
  FolderOpen,
  Search,
  Filter,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api';
import { CivicCase } from '../types/index';
import { ClaimVerificationBadge } from '../components/ClaimVerificationBadge';

interface Props {
  onOpenCase: (caseId: string) => void;
  onNavigate: (page: string) => void;
}

export const CasesListPage: React.FC<Props> = ({ onOpenCase, onNavigate }) => {
  const [cases, setCases] = useState<CivicCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCases = async () => {
    try {
      setLoading(true);
      const data = await api.getCases({
        category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
        search: searchQuery.trim() || undefined,
      });
      setCases(data || []);
    } catch (err) {
      console.error('Failed to load cases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [selectedCategory, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCases();
  };

  const categories = [
    { id: 'ALL', label: 'All Categories' },
    { id: 'INFRASTRUCTURE_HAZARD', label: 'Infrastructure Hazards' },
    { id: 'CIVIC_SERVICES', label: 'Civic & Transit' },
    { id: 'ENVIRONMENTAL', label: 'Environmental' },
    { id: 'PUBLIC_HEALTH_SAFETY', label: 'Public Health' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
            <FolderOpen className="w-4 h-4" />
            <span>Case Management Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Community Case Registry
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            All submitted citizen cases transformed through the Proof-to-Action Engine.
          </p>
        </div>

        <button
          onClick={() => onNavigate('input')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-transform active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Incident Report</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cases by title, case number, or street location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 text-white rounded-xl text-xs font-bold transition-transform active:scale-95"
          >
            Search Cases
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === c.id
                  ? 'bg-slate-900 text-white dark:bg-teal-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cases List */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 text-xs flex flex-col items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-teal-600" />
          <span>Loading Cases...</span>
        </div>
      ) : cases.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center text-slate-400 text-xs border border-slate-200 dark:border-slate-800">
          No cases found matching your criteria.
        </div>
      ) : (
        <div className="space-y-4">
          {cases.map((c) => {
            const verifiedCount = c.claims.filter((cl) => cl.status === 'VERIFIED').length;
            const completedCount = c.actions.filter((a) => a.status === 'COMPLETED').length;

            return (
              <div
                key={c.id}
                onClick={() => onOpenCase(c.id)}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-500 transition-all cursor-pointer group space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-extrabold bg-slate-900 text-white dark:bg-teal-600 px-3 py-0.5 rounded-full">
                      {c.caseNumber}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                      {c.category.replace(/_/g, ' ')}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        c.urgency === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800'
                          : c.urgency === 'HIGH'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      Urgency: {c.urgency}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">
                      Stage {c.currentStage}/5 Active
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>

                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {c.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {c.summary}
                </p>

                {/* Footer Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-600" />
                      <span>{c.location.rawInput}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-teal-600" />
                      <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                      ✓ {verifiedCount} / {c.claims.length} Claims Verified
                    </span>
                    <span className="text-sky-700 dark:text-sky-300 font-semibold">
                      ⚙️ {completedCount} / {c.actions.length} Tasks Done
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
