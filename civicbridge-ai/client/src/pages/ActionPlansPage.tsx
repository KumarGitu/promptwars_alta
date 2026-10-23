import React, { useState, useEffect } from 'react';
import {
  ListTodo,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api';
import { TaskItemCard } from '../components/TaskItemCard';
import { TaskStatus, TaskPriority } from '../types/index';

interface Props {
  onOpenCase: (caseId: string) => void;
}

export const ActionPlansPage: React.FC<Props> = ({ onOpenCase }) => {
  const [actions, setActions] = useState<any[]>([]);
  const [counts, setCounts] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchActions = async () => {
    try {
      setLoading(true);
      const data = await api.getAllActions({
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
        priority: selectedPriority !== 'ALL' ? selectedPriority : undefined,
        search: searchQuery.trim() || undefined,
      });
      setActions(data.actions || []);
      setCounts(data.counts || {});
    } catch (err) {
      console.error('Failed to load actions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, [selectedStatus, selectedPriority]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchActions();
  };

  const handleUpdateStatus = async (caseId: string, taskId: string, newStatus: TaskStatus, proofText?: string) => {
    try {
      await api.updateTaskStatus(caseId, taskId, newStatus, proofText);
      await fetchActions();
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
          <ListTodo className="w-4 h-4" />
          <span>Community Action Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Action Plans & Task Hub
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
          Track and execute prioritized community action tasks generated from verified civic evidence. Differentiates
          proposed recommendations from physically recorded outcomes.
        </p>
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
              placeholder="Search actions by task title, responsible agency, or case..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 text-white rounded-xl text-xs font-bold transition-transform active:scale-95"
          >
            Filter Actions
          </button>
        </form>

        {/* Priority & Status Selectors */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          {/* Status buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 font-medium mr-1">Status:</span>
            {[
              { id: 'ALL', label: 'All' },
              { id: 'PENDING', label: `Pending (${counts.pending || 0})` },
              { id: 'IN_PROGRESS', label: `In Progress (${counts.inProgress || 0})` },
              { id: 'COMPLETED', label: `Completed (${counts.completed || 0})` },
              { id: 'BLOCKED', label: `Blocked (${counts.blocked || 0})` },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id)}
                className={`px-3 py-1 rounded-full font-semibold transition-all ${
                  selectedStatus === st.id
                    ? 'bg-slate-900 text-white dark:bg-teal-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Priority dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              aria-label="Filter actions by priority"
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="P1_IMMEDIATE">P1 • Immediate</option>
              <option value="P2_HIGH">P2 • High</option>
              <option value="P3_STANDARD">P3 • Standard</option>
              <option value="P4_FOLLOW_UP">P4 • Follow-up</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 text-xs flex flex-col items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-teal-600" />
          <span>Synchronizing Action Plans...</span>
        </div>
      ) : actions.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center text-slate-400 text-xs border border-slate-200 dark:border-slate-800">
          No actions matching the current filters were found.
        </div>
      ) : (
        <div className="space-y-4">
          {actions.map((act) => (
            <div key={act.id} className="space-y-1">
              <div className="flex items-center justify-between px-2 text-xs text-slate-500">
                <span>
                  Case: <strong className="text-slate-700 dark:text-slate-300">{act.caseTitle}</strong> ({act.caseNumber})
                </span>
                <button
                  onClick={() => onOpenCase(act.caseId)}
                  className="text-teal-600 dark:text-teal-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Open Full Case</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <TaskItemCard
                task={act}
                caseId={act.caseId}
                onUpdateStatus={(taskId, newStatus, proofText) =>
                  handleUpdateStatus(act.caseId, taskId, newStatus, proofText)
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
