import React from 'react';
import { Compass, ShieldCheck, HeartHandshake, FileText, ExternalLink } from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<Props> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950 font-bold">
                <Compass className="w-4 h-4 text-slate-900" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">
                CivicBridge <span className="text-teal-400">AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Universal bridge between unstructured human intent and complex civic systems. Built with Google Gemini
              to transform everyday neighborhood problems into verified, accountable community actions.
            </p>
            <div className="flex items-center gap-2 pt-1 text-teal-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Proof-to-Action Engine Core</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Application Modules
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
                  Main Dashboard Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('input')} className="hover:text-white transition-colors">
                  Universal Input Center
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('verification')} className="hover:text-white transition-colors">
                  Verification Center
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('actions')} className="hover:text-white transition-colors">
                  Action Plans Registry
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('impact')} className="hover:text-white transition-colors">
                  Impact & Verification Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Societal Benefit Categories */}
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Civic Focus Areas
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>Infrastructure & Flood Hazard Mitigation</li>
              <li>School Zone Pedestrian Transit Safety</li>
              <li>Vulnerable Resident & Senior Climate Care</li>
              <li>Hazardous Waste & Riparian Protection</li>
              <li>Municipal Code Compliance & Work Orders</li>
            </ul>
          </div>

          {/* Responsible AI & Transparency */}
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Responsible AI Standard
            </h4>
            <p className="text-slate-400 leading-relaxed mb-3">
              CivicBridge AI never labels an AI output as verified without independent corroboration against cited
              authoritative records. We distinguish citizen reporting from official verification.
            </p>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300">
              <strong className="text-amber-400 block mb-0.5">Emergency Notice:</strong>
              For acute life hazards, active fires, or medical emergencies, dial 911 immediately.
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <div>
            © 2026 CivicBridge AI Platform. Gemini-Powered Societal Benefit Demonstration.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('landing')} className="hover:text-slate-200">
              Methodology
            </button>
            <button onClick={() => onNavigate('resources')} className="hover:text-slate-200">
              Civic Authority Registry
            </button>
            <button onClick={() => onNavigate('settings')} className="hover:text-slate-200">
              API Configuration
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
