import React, { useState, useEffect } from 'react';
import {
  Compass,
  PlusCircle,
  ShieldCheck,
  Activity,
  Layers,
  Settings,
  Menu,
  X,
  Sparkles,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api';

interface Props {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<Props> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState<{ isConfigured: boolean; model: string }>({
    isConfigured: false,
    model: 'gemini-3.8-flash',
  });

  useEffect(() => {
    api
      .getSettings()
      .then((data) => {
        if (data?.gemini) {
          setGeminiStatus({
            isConfigured: data.gemini.isConfigured,
            model: data.gemini.model,
          });
        }
      })
      .catch(() => {});
  }, [currentPage]);

  const navLinks = [
    { id: 'landing', label: 'Home & Tour' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'cases', label: 'My Cases' },
    { id: 'verification', label: 'Verification Center' },
    { id: 'actions', label: 'Action Plans' },
    { id: 'resources', label: 'Civic Resources' },
    { id: 'impact', label: 'Impact' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-teal-800 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-100 font-sans">
                  CivicBridge <span className="text-teal-600 dark:text-teal-400">AI</span>
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800 hidden sm:inline-block">
                  Proof-to-Action
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight hidden sm:block">
                From Real-World Chaos to Verified Action
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-teal-600 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            {/* Gemini Status Indicator */}
            <button
              onClick={() => onNavigate('settings')}
              title={
                geminiStatus.isConfigured
                  ? 'Gemini 3.8 Flash API is connected and active on server'
                  : 'Operating in secure civic rule engine. View diagnostics in Settings.'
              }
              className={`hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-all ${
                geminiStatus.isConfigured
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-medium text-[11px]">
                {geminiStatus.isConfigured ? 'Gemini 3.8 Flash' : 'Civic Demo Engine'}
              </span>
            </button>

            {/* Start Case Primary Button */}
            <button
              onClick={() => onNavigate('input')}
              className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm hover:shadow transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Start a Case</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
