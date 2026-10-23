import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Brain,
  ShieldCheck,
  ListTodo,
  CheckCircle,
  ChevronRight,
} from 'lucide-react';

interface Props {
  currentStage: number; // 1 to 5
  activeStage?: number;
  onSelectStage?: (stageNumber: number) => void;
  compact?: boolean;
}

export const STAGES = [
  {
    step: 1,
    id: 'input_received',
    title: '1. Input Received',
    shortTitle: 'Input',
    description: 'Messy text, photos, audio & docs captured',
    icon: FileText,
  },
  {
    step: 2,
    id: 'information_extracted',
    title: '2. Info Extracted',
    shortTitle: 'Extracted',
    description: 'Gemini structures facts & flags missing info',
    icon: Brain,
  },
  {
    step: 3,
    id: 'evidence_checked',
    title: '3. Evidence Checked',
    shortTitle: 'Verified',
    description: 'Corroborated against cited civic sources',
    icon: ShieldCheck,
  },
  {
    step: 4,
    id: 'actions_recommended',
    title: '4. Action Recommended',
    shortTitle: 'Actions',
    description: 'Prioritized civic tasks & responsible entities',
    icon: ListTodo,
  },
  {
    step: 5,
    id: 'outcome_tracked',
    title: '5. Outcome Tracked',
    shortTitle: 'Tracked',
    description: 'Real-world civic outcomes recorded & verified',
    icon: CheckCircle,
  },
];

export const ProofToActionStages: React.FC<Props> = ({
  currentStage,
  activeStage,
  onSelectStage,
  compact = false,
}) => {
  const selected = activeStage || currentStage;

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-teal-600 dark:text-teal-400">
            Core USP Engine
          </span>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Proof-to-Action Transformation Pipeline
          </h4>
        </div>
        <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
          Stage {currentStage} of 5 Active
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2 relative">
        {STAGES.map((s, idx) => {
          const Icon = s.icon;
          const isCompleted = currentStage > s.step;
          const isCurrent = currentStage === s.step;
          const isSelected = selected === s.step;

          return (
            <motion.div
              key={s.id}
              whileHover={{ scale: onSelectStage ? 1.02 : 1 }}
              onClick={() => onSelectStage && onSelectStage(s.step)}
              className={`relative rounded-xl p-3 flex flex-col transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-md ring-2 ring-teal-500 dark:ring-teal-400'
                  : isCompleted
                  ? 'bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/50 text-slate-800 dark:text-slate-200'
                  : isCurrent
                  ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 text-slate-900 dark:text-slate-100'
                  : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isSelected
                      ? 'bg-teal-500 text-white'
                      : isCompleted
                      ? 'bg-teal-600 text-white'
                      : isCurrent
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {isCompleted ? '✓' : s.step}
                </span>

                <Icon
                  className={`w-4 h-4 ${
                    isSelected
                      ? 'text-teal-300'
                      : isCompleted
                      ? 'text-teal-600 dark:text-teal-400'
                      : isCurrent
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-slate-400'
                  }`}
                />
              </div>

              <div className="font-semibold text-xs leading-tight line-clamp-1">
                {compact ? s.shortTitle : s.title}
              </div>

              {!compact && (
                <div
                  className={`text-[11px] leading-snug mt-1 line-clamp-2 ${
                    isSelected ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {s.description}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
