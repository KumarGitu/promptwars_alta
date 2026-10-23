import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Building2,
  PhoneCall,
  Mail,
  ExternalLink,
  ShieldAlert,
  Clock,
  CheckCircle2,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api';
import { CommunityResource } from '../types/index';

export const CommunityResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<CommunityResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await api.getResources(
        selectedCategory !== 'ALL' ? selectedCategory : undefined,
        searchQuery.trim() || undefined
      );
      setResources(data || []);
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResources();
  };

  const categories = [
    { id: 'ALL', label: 'All Resources' },
    { id: 'INFRASTRUCTURE_HAZARD', label: 'Stormwater & Roads' },
    { id: 'CIVIC_SERVICES', label: 'School & Transit Safety' },
    { id: 'COMMUNITY_EMERGENCY', label: 'Hydrology & Weather' },
    { id: 'ENVIRONMENTAL', label: 'EPA & Spill Line' },
    { id: 'PUBLIC_HEALTH_SAFETY', label: 'Aging & Public Health' },
    { id: 'EMERGENCY_DISPATCH', label: 'Emergency 911' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Authoritative Civic Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Community & Municipal Resources
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
          Verified civic agencies, municipal public works divisions, and regulatory bodies. Every telephone number,
          portal link, and jurisdiction is authenticated.
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by agency name, service provided, or jurisdiction..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 text-white rounded-xl text-xs font-bold transition-transform active:scale-95"
          >
            Search Directory
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

      {/* Resource Cards */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 text-xs flex flex-col items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-teal-600" />
          <span>Loading Civic Directory...</span>
        </div>
      ) : resources.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center text-slate-400 text-xs border border-slate-200 dark:border-slate-800">
          No civic resources found matching your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((res) => (
            <div
              key={res.id}
              className={`rounded-3xl p-6 border shadow-sm flex flex-col justify-between transition-all ${
                res.isEmergencyOnly
                  ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-400'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      res.isEmergencyOnly
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                    }`}
                  >
                    {res.isEmergencyOnly ? 'Active Emergency Dispatch' : res.category.replace(/_/g, ' ')}
                  </span>

                  <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified {res.lastVerifiedDate}</span>
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {res.name}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {res.description}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  <span>
                    Jurisdiction: <strong>{res.jurisdiction}</strong>
                  </span>
                </div>

                {/* Services list */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {res.servicesProvided.map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Footer */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={`tel:${res.contact.phone.replace(/[^0-9]/g, '')}`}
                    className="inline-flex items-center gap-1.5 font-bold text-teal-700 dark:text-teal-300 hover:underline"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{res.contact.phone}</span>
                  </a>

                  {res.contact.email && (
                    <a
                      href={`mailto:${res.contact.email}`}
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">{res.contact.hours}</span>

                  {res.contact.portalUrl && (
                    <a
                      href={res.contact.portalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                      title="Open Official Web Portal"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
