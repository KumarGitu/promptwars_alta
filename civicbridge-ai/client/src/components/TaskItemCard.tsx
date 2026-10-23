import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Clock,
  AlertOctagon,
  HelpCircle,
  Building2,
  FileCheck2,
  Calendar,
  Send,
  Sparkles,
} from 'lucide-react';
import { ActionTask, TaskPriority, TaskStatus } from '../types/index';

interface Props {
  task: ActionTask;
  caseId: string;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus, proofText?: string) => Promise<void>;
}

export const TaskItemCard: React.FC<Props> = ({ task, caseId, onUpdateStatus }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showProofForm, setShowProofForm] = useState(false);
  const [proofText, setProofText] = useState(task.outcomeProof?.text || '');

  const priorityStyles: Record<TaskPriority, { label: string; bg: string; text: string; border: string }> = {
    P1_IMMEDIATE: {
      label: 'P1 • Immediate Life / Safety',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-700 dark:text-rose-300 font-bold',
      border: 'border-rose-200 dark:border-rose-800',
    },
    P2_HIGH: {
      label: 'P2 • High Urgency',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-800 dark:text-amber-300 font-semibold',
      border: 'border-amber-200 dark:border-amber-800',
    },
    P3_STANDARD: {
      label: 'P3 • Standard Remediation',
      bg: 'bg-sky-50 dark:bg-sky-950/40',
      text: 'text-sky-700 dark:text-sky-300',
      border: 'border-sky-200 dark:border-sky-800',
    },
    P4_FOLLOW_UP: {
      label: 'P4 • Preventive Follow-Up',
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-700 dark:text-slate-300',
      border: 'border-slate-200 dark:border-slate-700',
    },
  };

  const statusIcons: Record<TaskStatus, { icon: React.ReactNode; label: string; badge: string }> = {
    PENDING: {
      icon: <Clock className="w-4 h-4 text-slate-400" />,
      label: 'Pending Review',
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    IN_PROGRESS: {
      icon: <Sparkles className="w-4 h-4 text-sky-500 animate-spin" />,
      label: 'In Progress',
      badge: 'bg-sky-50 text-sky-700 border-sky-200 font-medium',
    },
    COMPLETED: {
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      label: 'Action Completed',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
    },
    BLOCKED: {
      icon: <AlertOctagon className="w-4 h-4 text-rose-600" />,
      label: 'Action Blocked',
      badge: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
    },
  };

  const currentPriority = priorityStyles[task.priority] || priorityStyles.P3_STANDARD;
  const currentStatus = statusIcons[task.status] || statusIcons.PENDING;

  const handleStatusChange = async (newStatus: TaskStatus) => {
    setIsUpdating(true);
    try {
      await onUpdateStatus(task.id, newStatus);
      if (newStatus === 'COMPLETED') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0D9488', '#10B981', '#0F172A'],
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveProof = async () => {
    setIsUpdating(true);
    try {
      await onUpdateStatus(task.id, 'COMPLETED', proofText);
      setShowProofForm(false);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0D9488', '#10B981', '#38BDF8'],
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className={`rounded-2xl border p-5 transition-all shadow-sm ${
        task.status === 'COMPLETED'
          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-xs px-2.5 py-1 rounded-full border ${currentPriority.bg} ${currentPriority.text} ${currentPriority.border}`}
          >
            {currentPriority.label}
          </span>
          <span
            className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${currentStatus.badge}`}
          >
            {currentStatus.icon}
            {currentStatus.label}
          </span>
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <select
            disabled={isUpdating}
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
            aria-label="Update task status"
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="PENDING">Mark Pending</option>
            <option value="IN_PROGRESS">Mark In Progress</option>
            <option value="COMPLETED">Mark Completed</option>
            <option value="BLOCKED">Mark Blocked</option>
          </select>

          <button
            onClick={() => setShowProofForm(!showProofForm)}
            className="text-xs text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/50 px-2.5 py-1.5 rounded-lg border border-teal-200 dark:border-teal-800 transition-colors"
          >
            {showProofForm ? 'Cancel Proof' : 'Log Proof'}
          </button>
        </div>
      </div>

      <h4 className="font-semibold text-base text-slate-900 dark:text-slate-100 mb-1.5">
        {task.title}
      </h4>

      <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
        {task.description}
      </p>

      {/* Reasoning card */}
      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-150 dark:border-slate-750 text-xs text-slate-600 dark:text-slate-300 mb-3">
        <strong className="text-slate-800 dark:text-slate-200 font-semibold block mb-0.5">
          Gemini Strategic Reasoning:
        </strong>
        {task.reasoning}
      </div>

      {/* Meta tags: Responsible entity, deadline, required docs */}
      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <span>
            Responsible Entity: <strong className="text-slate-700 dark:text-slate-300">{task.responsibleEntity}</strong>
          </span>
        </div>

        {task.deadline && (
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>
              Target: <strong className="text-slate-700 dark:text-slate-300">{task.deadline}</strong>
            </span>
          </div>
        )}

        {task.requiredDocuments && task.requiredDocuments.length > 0 && (
          <div className="flex items-center gap-1.5">
            <FileCheck2 className="w-3.5 h-3.5 text-teal-500" />
            <span>
              Required Evidence: {task.requiredDocuments.join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* Verified Outcome Proof Display */}
      {task.outcomeProof?.text && (
        <div className="mt-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-3 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-semibold mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Recorded Action Outcome:</span>
          </div>
          <p className="text-emerald-900 dark:text-emerald-200">{task.outcomeProof.text}</p>
          {task.outcomeProof.submittedAt && (
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-1">
              Logged at {new Date(task.outcomeProof.submittedAt).toLocaleTimeString()}
            </span>
          )}
        </div>
      )}

      {/* Proof Submission Inline Form */}
      {showProofForm && (
        <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
            Submit Execution Proof / Outcome Details:
          </label>
          <textarea
            rows={2}
            value={proofText}
            onChange={(e) => setProofText(e.target.value)}
            placeholder="e.g. Dispatched ticket #4819 to Public Works; road barricades deployed by officer on scene..."
            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setShowProofForm(false)}
              className="text-xs px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              disabled={isUpdating || !proofText.trim()}
              onClick={handleSaveProof}
              className="text-xs px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              Confirm & Complete Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
