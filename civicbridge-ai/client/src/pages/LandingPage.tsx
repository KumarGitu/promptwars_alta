import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Brain,
  ListTodo,
  Waves,
  Building2,
  Biohazard,
  Flame,
  FileCheck2,
  Sparkles,
  Users,
  Search,
  ExternalLink,
} from 'lucide-react';
import { ProofToActionStages } from '../components/ProofToActionStages';
import { ClaimVerificationBadge } from '../components/ClaimVerificationBadge';

interface Props {
  onNavigate: (page: string) => void;
  onOpenCase: (caseId: string) => void;
}

export const LandingPage: React.FC<Props> = ({ onNavigate, onOpenCase }) => {
  const [interactiveInput, setInteractiveInput] = useState(
    'The road near our school is flooded. Children and pedestrians may be unable to cross safely. Water seems to be backing up from the storm drain at the intersection of Elmwood Ave and 4th Street.'
  );
  const [activeStepTab, setActiveStepTab] = useState<'understand' | 'verify' | 'act'>('understand');

  const sampleScenarios = [
    {
      title: 'School Crosswalk Flooding',
      category: 'Infrastructure & Transit Safety',
      text: 'The road near our school is flooded. Children and pedestrians may be unable to cross safely. Water seems to be backing up from the storm drain at the intersection of Elmwood Ave and 4th Street.',
    },
    {
      title: 'Illegal Chemical Runoff',
      category: 'Environmental Protection',
      text: 'Four rusted 55-gallon drums found leaking dark oily liquid down the Mill Creek embankment near the footbridge.',
    },
    {
      title: 'Senior Facility Chiller Failure',
      category: 'Public Health & Vulnerable Citizens',
      text: 'Central air conditioning failed yesterday at Shady Pines senior housing. 4th floor hallways are reading 89°F during 102°F heat advisory.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-teal-500 selection:text-white">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Google Gemini 3.8 Flash • Societal Benefit Platform</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.12]"
            >
              Turn Complex Problems <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-teal-600 via-teal-500 to-sky-600 bg-clip-text text-transparent">
                Into Clear Next Steps.
              </span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal"
            >
              Bring your documents, photos, reports, and everyday concerns into one intelligent workspace. Understand
              what matters, verify important information, and build an actionable plan with Gemini-powered assistance.
            </motion.p>

            {/* Primary & Secondary CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <button
                onClick={() => onNavigate('input')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>Start a Case</span>
                <ArrowRight className="w-5 h-5 text-teal-400 dark:text-white" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('engine-explanation');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-base border border-slate-300 dark:border-slate-700 shadow-sm transition-all"
              >
                <span>Explore How It Works</span>
              </button>
            </motion.div>

            {/* Pitch Callout */}
            <div className="pt-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                ⭐ Competition Demonstration Ready: Includes the complete Oakridge Elementary Flooding Case
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE INPUT DEMONSTRATION */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Brain className="w-4 h-4" />
                <span>Interactive Live Engine Simulator</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                Experience the Proof-to-Action Transformation
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {sampleScenarios.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setInteractiveInput(s.text)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Load: {s.title}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Side */}
            <div className="lg:col-span-5 space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Citizen Input (Unstructured Chaos):
              </label>
              <textarea
                rows={5}
                value={interactiveInput}
                onChange={(e) => setInteractiveInput(e.target.value)}
                className="w-full p-4 text-sm rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none font-medium"
              />

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Supports Text, Photos, Audio recordings & PDFs</span>
                <button
                  onClick={() => onNavigate('input')}
                  className="text-teal-600 dark:text-teal-400 font-bold hover:underline flex items-center gap-1"
                >
                  Open in Full Universal Input Center →
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onOpenCase('case-flood-001')}
                  className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
                >
                  <span>Launch Full Case CB-2026-0104 Inspection Workspace</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Transformation Output Side */}
            <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-750 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Instant Gemini & Verification Extraction Preview
                </span>
                <span className="text-[11px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                  Live Engine Pipeline
                </span>
              </div>

              {/* Transformation Cards */}
              <div className="space-y-3">
                {/* Structured Extraction */}
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Structured Classification
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      Category: Infrastructure & Pedestrian Hazard
                    </span>
                    <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-bold">
                      Urgency: HIGH
                    </span>
                    <span className="text-slate-500">
                      Location: Elmwood Ave & 4th St (Front of Oakridge School)
                    </span>
                  </div>
                </div>

                {/* Evidence Verification */}
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Evidence Verification Checks</span>
                    <span className="text-[10px] text-teal-600 font-medium">Checked against 2 authoritative feeds</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2 text-xs">
                      <span className="text-slate-700 dark:text-slate-300">
                        Precipitation exceeded 1.4 inches in Oakridge basin (NWS Station #4029)
                      </span>
                      <ClaimVerificationBadge status="VERIFIED" size="sm" />
                    </div>
                    <div className="flex items-start justify-between gap-2 text-xs">
                      <span className="text-slate-700 dark:text-slate-300">
                        Catch basin scheduled cleaning incomplete due to parked cars
                      </span>
                      <ClaimVerificationBadge status="PARTIALLY_SUPPORTED" size="sm" />
                    </div>
                    <div className="flex items-start justify-between gap-2 text-xs">
                      <span className="text-slate-700 dark:text-slate-300">
                        Water depth exceeds 18 inches entering school interior
                      </span>
                      <ClaimVerificationBadge status="UNVERIFIED" size="sm" />
                    </div>
                  </div>
                </div>

                {/* Practical Action Plan */}
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Generated Community Action Plan</span>
                    <span className="text-[10px] text-slate-500">4 Prioritized Tasks</span>
                  </div>
                  <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      <strong>P1 Dispatch:</strong> Emergency Vacuum Crew to Elmwood Culvert (Public Works)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      <strong>P1 Transit:</strong> Redirect school dismissal pickup to North Birch Gate
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      <strong>P2 Warning:</strong> Deploy high-water signage at 3rd & 5th intersections
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. UNDERSTAND -> VERIFY -> ACT WORKFLOW */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Methodology & Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white mt-2">
              How CivicBridge AI Solves Everyday Chaos
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 mt-3">
              Standard AI chatbots merely synthesize language. CivicBridge executes an audited, multi-stage
              pipeline grounded in truth, accountability, and real civic outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1: Understand */}
            <div className="rounded-2xl p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 relative group hover:border-teal-400 transition-all">
              <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300 font-extrabold text-lg mb-4">
                01
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Understand Intent</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Gemini parses voice recordings, phone photos, fragmented reports, and municipal documents to extract
                verified observations, precise geolocations, and time markers.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                <li className="flex items-center gap-1.5">✓ Multimodal image & audio comprehension</li>
                <li className="flex items-center gap-1.5">✓ Missing information identification</li>
                <li className="flex items-center gap-1.5">✓ Contradiction detection</li>
              </ul>
            </div>

            {/* Step 2: Verify */}
            <div className="rounded-2xl p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 relative group hover:border-teal-400 transition-all">
              <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-700 dark:text-sky-300 font-extrabold text-lg mb-4">
                02
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Verify Evidence</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Every extracted claim is cross-checked against authoritative civic sources: hydrological telemetry,
                municipal catch-basin schedules, weather alerts, and cadastral maps.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                <li className="flex items-center gap-1.5">✓ 5 rigorous verification labels</li>
                <li className="flex items-center gap-1.5">✓ Never calls AI inference "verified"</li>
                <li className="flex items-center gap-1.5">✓ Transparent uncertainty explanations</li>
              </ul>
            </div>

            {/* Step 3: Act */}
            <div className="rounded-2xl p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 relative group hover:border-teal-400 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-extrabold text-lg mb-4">
                03
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Track Action & Outcomes</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Generates a prioritized community action plan with responsible civic departments, required proof, and
                tracks actions through verified resolution.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                <li className="flex items-center gap-1.5">✓ P1 to P4 prioritization matrix</li>
                <li className="flex items-center gap-1.5">✓ Proof submission & verification</li>
                <li className="flex items-center gap-1.5">✓ Audited civic outcome timeline</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SIGNATURE PROOF-TO-ACTION ENGINE EXPLANATION */}
      <section id="engine-explanation" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Our Main USP</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-white">
              The Proof-to-Action Engine
            </h2>
            <p className="text-slate-300 text-base mt-2 leading-relaxed">
              Most AI apps provide conversational text. CivicBridge AI delivers an end-to-end transformation that connects
              raw human distress directly to verifiable societal impact.
            </p>
          </div>

          {/* Connected 5-stage graphic */}
          <div className="mb-10">
            <ProofToActionStages currentStage={4} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800 text-sm">
            <div className="space-y-3">
              <h4 className="font-bold text-teal-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Distinct Information Layers</span>
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                We clearly differentiate between <strong>Reported Information</strong> (citizen assertions),{' '}
                <strong>AI Inferences</strong> (Gemini deductions), <strong>Verified Evidence</strong> (authoritative
                records), and <strong>Recorded Outcomes</strong> (physical results confirmed on the ground).
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-teal-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Strict Verification Standards</span>
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                If an integration is offline or no matching public sensor exists, we explicitly label claims as{' '}
                <span className="text-amber-300 font-semibold">Unverified</span> or{' '}
                <span className="text-slate-300 font-semibold">Unable to verify</span>. We never hallucinate safety
                assurances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SOCIETAL-BENEFIT USE CASES */}
      <section className="py-20 bg-slate-100 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Broad Community Impact
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white mt-2">
              Built for Real-World Societal Benefit
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 mt-2">
              Deployable across municipal departments, neighborhood associations, and civic advocacy groups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Flood Hazard */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
                <Waves className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white mb-1.5">
                Infrastructure Floods
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Clogged culverts, submerged school crosswalks, roadway washouts, and rapid stormwater diversion.
              </p>
            </div>

            {/* Senior & Climate Care */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Flame className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white mb-1.5">
                Vulnerable Resident Care
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Extreme heat chiller failures in senior residences, habitability code enforcement, and wellness checks.
              </p>
            </div>

            {/* Toxic Contamination */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
                <Biohazard className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white mb-1.5">
                Environmental Dumping
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Illegal chemical drums on riparian trails, wastewater containment, and state DEQ rapid intervention.
              </p>
            </div>

            {/* Safe Routes to School */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white mb-1.5">
                Civic & School Transit
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Broken pedestrian signals, ADA ramp obstacles, crossing guard repositioning, and parent SMS alerts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRUST & TRANSPARENCY SECTION */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Responsible AI Charter
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white mt-2">
              Trust, Verification & Transparency
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 mt-2">
              How we guarantee honesty, data privacy, and ethical boundaries in public service technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
                <span>5-State Verification System</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Every claim is classified into: Verified Against Cited Source, Partially Supported, Unverified, Conflicting,
                or Unable to Verify.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <span>Life-Safety 911 Redirection</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                We immediately detect life-threatening danger and redirect citizens to emergency dispatch instead of
                waiting for asynchronous analysis.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-sky-600" />
                <span>Non-Diagnostic Safeguards</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Health and habitability information organizes evidence and prepares inquiries for clinicians and code
                inspectors—never generating medical diagnoses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-tr from-slate-900 via-slate-900 to-teal-950 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to Turn Chaos Into Verified Civic Action?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
            Try the Universal Input Center with your own photos and notes, or inspect the pre-verified Oakridge
            Flooding demonstration case.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('input')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-base shadow-lg transition-transform active:scale-95"
            >
              Start New Case Report →
            </button>
            <button
              onClick={() => onOpenCase('case-flood-001')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-base border border-slate-700 transition-colors"
            >
              Inspect School Flood Case (CB-2026-0104)
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
