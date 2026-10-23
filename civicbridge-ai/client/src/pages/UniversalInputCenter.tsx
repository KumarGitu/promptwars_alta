import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  Mic,
  MapPin,
  Calendar,
  Sparkles,
  AlertTriangle,
  X,
  CheckCircle2,
  ArrowRight,
  Loader2,
  FileUp,
  Volume2,
} from 'lucide-react';
import { api } from '../services/api';
import { QuickScenarioSelector, DemoScenario } from '../components/QuickScenarioSelector';
import { EmergencyBanner } from '../components/EmergencyBanner';

interface Props {
  onCaseCreated: (caseId: string) => void;
  onNavigate: (page: string) => void;
}

interface UploadedAttachment {
  id: string;
  name: string;
  type: 'IMAGE' | 'DOCUMENT' | 'AUDIO';
  url: string;
  size: number;
  summary?: string;
}

export const UniversalInputCenter: React.FC<Props> = ({ onCaseCreated, onNavigate }) => {
  const [reportText, setReportText] = useState('');
  const [locationHint, setLocationHint] = useState('');
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [attachments, setAttachments] = useState<UploadedAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if there was pre-filled text from dashboard quick-bar
  useEffect(() => {
    const prefill = sessionStorage.getItem('prefill_case_input');
    if (prefill) {
      setReportText(prefill);
      sessionStorage.removeItem('prefill_case_input');
    }
  }, []);

  // Life-safety emergency keyword detector
  const emergencyKeywords = ['fire', 'heart attack', 'gunshot', 'collapsed building', 'trapped in swift water', 'chest pain'];
  const detectedEmergency = emergencyKeywords.find((kw) => reportText.toLowerCase().includes(kw));

  const handleSelectScenario = (scenario: DemoScenario) => {
    setReportText(scenario.prompt);
    setLocationHint(scenario.locationHint);
    setErrorMessage(null);

    // If it's the primary school flood scenario, pre-attach sample evidence metadata
    if (scenario.id === 'school-flood') {
      setAttachments([
        {
          id: 'att-sample-photo',
          name: 'crosswalk_standing_water.jpg',
          type: 'IMAGE',
          url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80',
          size: 2450000,
          summary: 'Photograph showing 10-14 inches of standing water over Elmwood crosswalk.',
        },
        {
          id: 'att-sample-audio',
          name: 'parent_voice_note_oct23.mp3',
          type: 'AUDIO',
          url: '/uploads/parent_voice_note.mp3',
          size: 1140000,
          summary: '38s voice message detailing clogged culvert grate and school bus mounting curb.',
        },
      ]);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setErrorMessage(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 15 * 1024 * 1024) {
          throw new Error(`File ${file.name} exceeds the 15MB limit.`);
        }
        const uploaded = await api.uploadFile(file);
        setAttachments((prev) => [...prev, uploaded]);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'File upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSimulateVoiceRecording = () => {
    if (isRecordingAudio) {
      setIsRecordingAudio(false);
      // Attach recorded audio snippet
      const newAudioAtt: UploadedAttachment = {
        id: `att-voice-${Date.now()}`,
        name: `voice_recording_${new Date().toLocaleTimeString().replace(/:/g, '')}.mp3`,
        type: 'AUDIO',
        url: '/uploads/samples/recorded_audio.mp3',
        size: 890000,
        summary: `Citizen voice recording (${recordingSeconds}s length)`,
      };
      setAttachments((prev) => [...prev, newAudioAtt]);
      setRecordingSeconds(0);
    } else {
      setIsRecordingAudio(true);
      setRecordingSeconds(0);
      const timer = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 12) {
            clearInterval(timer);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim() || reportText.length < 5) {
      setErrorMessage('Please describe the problem with at least 5 characters.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Step-by-step pipeline visualizer
      setAnalysisStep('Ingesting multimodal evidence & transcripts...');
      await new Promise((r) => setTimeout(r, 600));

      setAnalysisStep('Gemini 3.8 Flash extracting structured facts & contradictions...');
      await new Promise((r) => setTimeout(r, 700));

      setAnalysisStep('Querying municipal hydrology & public works verification registries...');
      await new Promise((r) => setTimeout(r, 600));

      setAnalysisStep('Synthesizing prioritized community action plan...');

      const createdCase = await api.createCase({
        userReport: reportText,
        locationHint: locationHint.trim() || undefined,
        attachments,
      });

      // Navigate to created case detail
      onCaseCreated(createdCase.id);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to analyze case. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Universal Input Center</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Submit Unstructured Real-World Chaos
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
          Type naturally, paste messages, upload photos, audio notes, or PDF records. CivicBridge AI structures the
          facts, verifies evidence, and builds an accountable action plan.
        </p>
      </div>

      {/* Emergency safety detector banner */}
      {detectedEmergency && (
        <EmergencyBanner detectedKeyword={detectedEmergency} />
      )}

      {/* 1-Click Quick Scenario Pickers (Competition judges friendly) */}
      <QuickScenarioSelector onSelectScenario={handleSelectScenario} />

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {/* Text Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Describe the Problem or Situation: <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-slate-400">Natural language, voice memos & multi-modal uploads</span>
          </div>
          <textarea
            required
            rows={6}
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder="e.g. The road near our school is flooded. Children and pedestrians may be unable to cross safely. Water seems to be backing up from the storm drain at the intersection of Elmwood Ave and 4th Street..."
            className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed font-normal"
          />
        </div>

        {/* Location & Incident Time Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>Location / Intersection Hint (Optional):</span>
            </label>
            <input
              type="text"
              value={locationHint}
              onChange={(e) => setLocationHint(e.target.value)}
              placeholder="e.g. Elmwood Ave & 4th Street, front of Oakridge Elementary"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              <span>Incident Date / Time:</span>
            </label>
            <input
              type="date"
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Multimodal Attachments Section */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Supporting Evidence Attachments ({attachments.length}):
            </label>
            <span className="text-[11px] text-slate-400">Photos (JPEG/PNG), Documents (PDF), Audio memos</span>
          </div>

          {/* Upload Drop Zone & Voice Record Button */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Drag & Drop File Upload Trigger */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-950/50 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,application/pdf,audio/*"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
              <FileUp className="w-6 h-6 text-slate-400 group-hover:text-teal-600 mx-auto mb-1 transition-colors" />
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Click to browse or drop photos & PDF files
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Up to 15MB per file</div>
            </div>

            {/* Voice Recording Simulator */}
            <button
              type="button"
              onClick={handleSimulateVoiceRecording}
              className={`sm:w-52 p-4 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-semibold ${
                isRecordingAudio
                  ? 'bg-rose-50 dark:bg-rose-950 border-rose-300 text-rose-700 animate-pulse'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-700 hover:border-teal-500 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Mic className={`w-5 h-5 ${isRecordingAudio ? 'text-rose-600' : 'text-slate-400'}`} />
              <span>{isRecordingAudio ? `Recording (${recordingSeconds}s) - Click to Save` : 'Record Voice Memo'}</span>
            </button>
          </div>

          {/* File Previews */}
          {attachments.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    {att.type === 'IMAGE' && <ImageIcon className="w-4 h-4 text-sky-500 shrink-0" />}
                    {att.type === 'DOCUMENT' && <FileText className="w-4 h-4 text-amber-500 shrink-0" />}
                    {att.type === 'AUDIO' && <Volume2 className="w-4 h-4 text-teal-500 shrink-0" />}
                    <div className="truncate">
                      <div className="font-medium text-slate-800 dark:text-slate-200 truncate">{att.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {(att.size / 1024).toFixed(0)} KB • {att.type}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeAttachment(att.id)}
                    aria-label={`Remove attachment ${att.name}`}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Processing State Indicator */}
        {isProcessing && (
          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2.5 text-teal-800 dark:text-teal-300 text-xs font-bold">
              <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
              <span>Proof-to-Action Engine Active: {analysisStep}</span>
            </div>
            <div className="w-full bg-teal-200 dark:bg-teal-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-teal-600 h-full rounded-full animate-pulse w-3/4"></div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => {
              setReportText('');
              setLocationHint('');
              setAttachments([]);
              setErrorMessage(null);
            }}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            Clear Form
          </button>

          <button
            type="submit"
            disabled={isProcessing || isUploading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-sm shadow-md transition-transform active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running Engine...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>Transform to Verified Action Plan</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
