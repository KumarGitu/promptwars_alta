import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  FolderOpen,
  ShieldCheck,
  ListTodo,
  BookOpen,
  BarChart3,
  Settings,
  Waves,
} from 'lucide-react';

interface Props {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenPrimaryDemo?: () => void;
}

export const Sidebar: React.FC<Props> = ({ currentPage, onNavigate, onOpenPrimaryDemo }) => {
  const sidebarItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'input', label: 'New Case', icon: PlusCircle, badge: 'Universal' },
    { id: 'cases', label: 'My Cases', icon: FolderOpen },
    { id: 'verification', label: 'Verification Center', icon: ShieldCheck },
    { id: 'actions', label: 'Action Plans', icon: ListTodo },
    { id: 'resources', label: 'Community Resources', icon: BookOpen },
    { id: 'impact', label: 'Impact Dashboard', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 hidden md:flex">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Platform Workspace
        </div>

        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-teal-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-teal-400 dark:text-white' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 px-1.5 py-0.5 rounded-md font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Competition Demo Spotlight Card */}
        {onOpenPrimaryDemo && (
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="bg-gradient-to-br from-teal-50 to-sky-50 dark:from-slate-800 dark:to-slate-800/80 rounded-2xl p-3.5 border border-teal-200 dark:border-slate-700">
              <div className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400 font-bold text-xs mb-1">
                <Waves className="w-4 h-4" />
                <span>Primary Scenario</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mb-2.5 leading-snug">
                Oakridge Elementary School flood demonstration (2-min pitch ready).
              </p>
              <button
                onClick={onOpenPrimaryDemo}
                className="w-full text-center text-xs bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-semibold py-1.5 px-2.5 rounded-xl shadow-xs transition-transform active:scale-95"
              >
                Inspect Case CB-2026-0104 →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer metadata in sidebar */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center justify-between">
          <span>Engine:</span>
          <span className="font-semibold text-slate-600 dark:text-slate-300">Gemini 3.8 Flash</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Verification:</span>
          <span className="font-semibold text-emerald-600">Active (5 Sources)</span>
        </div>
      </div>
    </aside>
  );
};
