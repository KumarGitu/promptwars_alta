import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Share2,
  Printer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  MapPin,
  Calendar,
  Building2,
  Sparkles,
  RefreshCw,
  Plus,
  ExternalLink,
  FileText,
  Volume2,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import { CivicCase, ClaimVerification, TaskStatus } from '../types/index';
import { api } from '../services/api';
import { ProofToActionStages } from '../components/ProofToActionStages';
import { ClaimVerificationBadge } from '../components/ClaimVerificationBadge';
import { TaskItemCard } from '../components/TaskItemCard';

interface Props {
  caseId: string;
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export const CaseDetailPage: React.FC<Props> = ({ caseId, onBack, onNavigate }) => {
  const [currentCase, setCurrentCase] = useState<CivicCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'facts' | 'verification' | 'actions' | 'outcomes'>('pipeline');
  const [reverifyingClaimId, setReverifyingClaimId] = useState<string | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [showAddOutcomeModal, setShowAddOutcomeModal] = useState(false);
  const [outcomeTitle, setOutcomeTitle] = useState('');
  const [outcomeDescription, setOutcomeDescription] = useState('');
  const [outcomeRecorder, setOutcomeRecorder] = useState('');

  const fetchCase = async () => {
    try {
      setLoading(true);
      const data = await api.getCaseById(caseId);
      setCurrentCase(data);
    } catch (err) {
      console.error('Failed to load case:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCase();
  }, [caseId]);

  const handleUpdateTaskStatus = async (taskId: string, newStatus: TaskStatus, proofText?: string) => {
    if (!currentCase) return;
    try {
      const res = await api.updateTaskStatus(currentCase.id, taskId, newStatus, proofText);
      setCurrentCase(res.case);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleReverifyClaim = async (claimId: string) => {
    if (!currentCase) return;
    setReverifyingClaimId(claimId);
    try {
      const res = await api.reverifyClaim(currentCase.id, claimId);
      setCurrentCase(res.case);
    } catch (err) {
      console.error('Failed to reverify claim:', err);
    } finally {
      setReverifyingClaimId(null);
    }
  };

  const handleAddOutcome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCase || !outcomeTitle.trim()) return;
    try {
      const res = await api.recordOutcome(currentCase.id, {
        title: outcomeTitle,
        description: outcomeDescription,
        recordedBy: outcomeRecorder || 'Case Coordinator',
      });
      setCurrentCase(res.case);
      setShowAddOutcomeModal(false);
      setOutcomeTitle('');
      setOutcomeDescription('');
    } catch (err) {
      console.error('Failed to record outcome:', err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-teal-600" />
        <p className="text-sm text-slate-500 font-medium">Loading Proof-to-Action Workspace...</p>
      </div>
    );
  }

  if (!currentCase) {
    return (
      <div className="text-center py-20 space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Case Not Found</h3>
        <p className="text-sm text-slate-500">The requested case could not be located in records.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const verifiedClaimsCount = currentCase.claims.filter((c) => c.status === 'VERIFIED').length;
  const completedTasksCount = currentCase.actions.filter((a) => a.status === 'COMPLETED').length;

  return (
    <div className="space-y-6 pb-16">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Cases</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-50 transition-colors"
          >
            {copiedNotification ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedNotification ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-50 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Case Brief</span>
          </button>
        </div>
      </div>

      {/* Case Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-extrabold bg-slate-900 text-white dark:bg-teal-600 px-3 py-1 rounded-full">
              {currentCase.caseNumber}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 px-2.5 py-1 rounded-full">
              {currentCase.category.replace(/_/g, ' ')}
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                currentCase.urgency === 'CRITICAL'
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : currentCase.urgency === 'HIGH'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              Urgency: {currentCase.urgency}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Status:</span>
            <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
              {currentCase.overallStatus.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-snug">
          {currentCase.title}
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
          {currentCase.summary}
        </p>

        {/* Location & Time Meta */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-teal-600" />
            <span>
              Location: <strong>{currentCase.location.rawInput}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>
              Reported: <strong>{new Date(currentCase.createdAt).toLocaleString()}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>
              Intelligence Engine: <strong>{currentCase.aiModelUsed}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Signature Proof-to-Action 5-Stage Visualizer */}
      <ProofToActionStages
        currentStage={currentCase.currentStage}
        activeStage={
          activeTab === 'pipeline'
            ? 1
            : activeTab === 'facts'
            ? 2
            : activeTab === 'verification'
            ? 3
            : activeTab === 'actions'
            ? 4
            : 5
        }
        onSelectStage={(stage) => {
          if (stage === 1) setActiveTab('pipeline');
          else if (stage === 2) setActiveTab('facts');
          else if (stage === 3) setActiveTab('verification');
          else if (stage === 4) setActiveTab('actions');
          else if (stage === 5) setActiveTab('outcomes');
        }}
      />

      {/* Workspace Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-px">
        {[
          { id: 'pipeline', label: '1. Overview & Transformation Flow' },
          { id: 'facts', label: `2. Extracted Facts & Context (${currentCase.extractedFacts.length})` },
          { id: 'verification', label: `3. Evidence & Verification (${currentCase.claims.length})` },
          { id: 'actions', label: `4. Action Plan (${completedTasksCount}/${currentCase.actions.length} Done)` },
          { id: 'outcomes', label: `5. Recorded Outcomes (${currentCase.recordedOutcomes.length})` },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
                isActive
                  ? 'border-teal-600 text-teal-700 dark:text-teal-400 bg-white dark:bg-slate-900 rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & TRANSFORMATION FLOW */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              End-to-End Transformation Summary
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Original Input */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Step 1 • Unstructured Citizen Submission
                </span>
                <p className="text-xs text-slate-800 dark:text-slate-200 italic leading-relaxed">
                  "{currentCase.userReport}"
                </p>

                {currentCase.attachments.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 space-y-1">
                    <span className="font-semibold block text-[11px]">Attached Evidence:</span>
                    {currentCase.attachments.map((att) => (
                      <div key={att.id} className="flex items-center gap-1.5 text-[11px] text-teal-700 dark:text-teal-400">
                        {att.type === 'IMAGE' && <ImageIcon className="w-3.5 h-3.5" />}
                        {att.type === 'AUDIO' && <Volume2 className="w-3.5 h-3.5" />}
                        {att.type === 'DOCUMENT' && <FileText className="w-3.5 h-3.5" />}
                        <span>{att.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Gemini Strategic Intent */}
              <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/60 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  Step 2 • Gemini Inferred Intent & Urgency
                </span>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  {currentCase.intent}
                </p>
                <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-teal-200/80 dark:border-teal-800/60 text-xs">
                  <strong className="text-slate-900 dark:text-white block mb-0.5">Urgency Rationale:</strong>
                  <span className="text-slate-600 dark:text-slate-300">{currentCase.urgencyReasoning}</span>
                </div>
              </div>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
                <div className="text-emerald-700 dark:text-emerald-300 font-bold text-xs uppercase mb-1">
                  Evidence Verified
                </div>
                <div className="text-2xl font-extrabold text-emerald-800 dark:text-emerald-200">
                  {verifiedClaimsCount} / {currentCase.claims.length} Claims
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                  Grounded against official public registries
                </p>
              </div>

              <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800/50">
                <div className="text-sky-700 dark:text-sky-300 font-bold text-xs uppercase mb-1">
                  Action Progress
                </div>
                <div className="text-2xl font-extrabold text-sky-800 dark:text-sky-200">
                  {completedTasksCount} / {currentCase.actions.length} Completed
                </div>
                <p className="text-[11px] text-sky-600 dark:text-sky-400 mt-0.5">
                  Tasks coordinated with civic departments
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="text-slate-700 dark:text-slate-300 font-bold text-xs uppercase mb-1">
                  Outcomes Recorded
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {currentCase.recordedOutcomes.length} Audited Logs
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Verified real-world results on scene
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EXTRACTED FACTS & CONTEXT */}
      {activeTab === 'facts' && (
        <div className="space-y-6">
          {/* Extracted Facts */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
              <span>Structured Facts Extracted from Submission</span>
              <span className="text-xs text-slate-500 font-normal">Extracted via Gemini 3.8 Flash</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentCase.extractedFacts.map((fact) => (
                <div
                  key={fact.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5 text-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{fact.fact}</p>
                    {fact.sourceSegment && (
                      <p className="text-[11px] text-slate-400 mt-1 italic">
                        Source excerpt: "{fact.sourceSegment}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Information & Gaps */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-500" />
              <span>Identified Missing Information & Follow-Up Remedies</span>
            </h3>
            <p className="text-xs text-slate-500">
              CivicBridge AI identifies critical operational gaps required by municipal field teams to respond safely:
            </p>

            <div className="space-y-3">
              {currentCase.missingInformation.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {item.item}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.importance === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.importance}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>Operational Reason:</strong> {item.reason}
                  </p>
                  <p className="text-teal-700 dark:text-teal-400 font-medium">
                    💡 <strong>Suggested Remedy:</strong> {item.remedySuggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EVIDENCE & VERIFICATION CENTER */}
      {activeTab === 'verification' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                  <span>Claims Verification Center</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Strictly verified against cited authoritative databases. Never fabricated.
                </p>
              </div>

              <div className="text-xs text-slate-500">
                {verifiedClaimsCount} of {currentCase.claims.length} claims verified
              </div>
            </div>

            <div className="space-y-4">
              {currentCase.claims.map((claim) => (
                <div
                  key={claim.id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <ClaimVerificationBadge status={claim.status} size="md" />

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-mono">
                        Engine: {claim.verificationEngine}
                      </span>
                      <button
                        disabled={reverifyingClaimId === claim.id}
                        onClick={() => handleReverifyClaim(claim.id)}
                        className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors disabled:opacity-50"
                      >
                        <RefreshCw
                          className={`w-3 h-3 ${reverifyingClaimId === claim.id ? 'animate-spin' : ''}`}
                        />
                        <span>{reverifyingClaimId === claim.id ? 'Checking...' : 'Re-verify'}</span>
                      </button>
                    </div>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    "{claim.claimText}"
                  </h4>

                  {/* Supporting Source Excerpt Card */}
                  {claim.sourceTitle && (
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                      <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                        <span className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{claim.sourceTitle}</span>
                        </span>
                        {claim.sourceDate && (
                          <span className="text-[10px] text-slate-400">{claim.sourceDate}</span>
                        )}
                      </div>

                      {claim.sourceExcerpt && (
                        <p className="text-slate-600 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-950 p-2 rounded-lg">
                          "{claim.sourceExcerpt}"
                        </p>
                      )}

                      {claim.sourceUrl && (
                        <a
                          href={claim.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-teal-600 hover:underline pt-0.5"
                        >
                          <span>Official Registry Link: {claim.sourceUrl}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Transparent Uncertainty Statement */}
                  <div className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-200 dark:border-slate-750">
                    <strong className="text-slate-700 dark:text-slate-300 font-semibold block mb-0.5">
                      Verification Assessment & Remaining Uncertainty:
                    </strong>
                    {claim.uncertaintyExplanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ACTION PLAN & NEXT STEPS */}
      {activeTab === 'actions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Prioritized Community Action Plan
              </h3>
              <p className="text-xs text-slate-500">
                Practical, prioritized next steps generated from verified facts. Update task progress as actions occur.
              </p>
            </div>

            <div className="text-xs font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-3 py-1.5 rounded-full border border-teal-200 dark:border-teal-800">
              {completedTasksCount} of {currentCase.actions.length} Completed
            </div>
          </div>

          <div className="space-y-4">
            {currentCase.actions.map((task) => (
              <TaskItemCard
                key={task.id}
                task={task}
                caseId={currentCase.id}
                onUpdateStatus={handleUpdateTaskStatus}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: RECORDED OUTCOMES & TIMELINE */}
      {activeTab === 'outcomes' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Audited Physical Outcomes Registry</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Real-world civic outcomes actually recorded on scene. Differentiated from recommendations.
                </p>
              </div>

              <button
                onClick={() => setShowAddOutcomeModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 text-white rounded-xl text-xs font-bold transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Log Verified Civic Outcome</span>
              </button>
            </div>

            {currentCase.recordedOutcomes.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No outcomes logged yet. As actions are completed, outcomes will appear on this audited timeline.
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                {currentCase.recordedOutcomes.map((outcome) => (
                  <div
                    key={outcome.id}
                    className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-emerald-950 dark:text-emerald-200">
                        {outcome.title}
                      </span>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                        {new Date(outcome.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-emerald-900 dark:text-emerald-300">{outcome.description}</p>
                    <div className="text-[11px] text-slate-500 pt-1 flex items-center gap-2">
                      <span>Recorded by: <strong>{outcome.recordedBy}</strong></span>
                      <span className="text-emerald-600 font-semibold">• Officially Verified</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Log Outcome Modal */}
      {showAddOutcomeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Log Real-World Civic Outcome
            </h4>
            <p className="text-xs text-slate-500">
              Record a verified result that has actually been executed on the ground.
            </p>

            <form onSubmit={handleAddOutcome} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Outcome Headline:
                </label>
                <input
                  type="text"
                  required
                  value={outcomeTitle}
                  onChange={(e) => setOutcomeTitle(e.target.value)}
                  placeholder="e.g. Catch basin cleared; water receded completely"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Outcome Description / Details:
                </label>
                <textarea
                  rows={3}
                  value={outcomeDescription}
                  onChange={(e) => setOutcomeDescription(e.target.value)}
                  placeholder="e.g. Metro Public Works vacuum unit arrived at 09:15 and extracted leaves from drain grate..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reporting Official or Citizen Name:
                </label>
                <input
                  type="text"
                  value={outcomeRecorder}
                  onChange={(e) => setOutcomeRecorder(e.target.value)}
                  placeholder="e.g. Sarah Vance, Parent Association Lead"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddOutcomeModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs"
                >
                  Save Outcome Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
