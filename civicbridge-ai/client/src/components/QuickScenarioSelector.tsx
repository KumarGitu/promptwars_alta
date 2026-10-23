import React from 'react';
import { Waves, Sparkles, Biohazard, Flame, ShieldAlert } from 'lucide-react';

export interface DemoScenario {
  id: string;
  badge: string;
  title: string;
  prompt: string;
  locationHint: string;
  icon: React.ReactNode;
  tags: string[];
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'school-flood',
    badge: 'Primary Demo • Competition Ready',
    title: 'School Roadway Inundation',
    prompt:
      'The road near our school is flooded. Children and pedestrians may be unable to cross safely. Water seems to be backing up from the storm drain at the intersection of Elmwood Ave and 4th Street. Morning buses had to mount the curb.',
    locationHint: 'Elmwood Ave & 4th Street, front of Oakridge Elementary School',
    icon: <Waves className="w-4 h-4 text-sky-600" />,
    tags: ['Flooding', 'Pedestrian Hazard', 'School Zone'],
  },
  {
    id: 'toxic-dump',
    badge: 'Environmental Incident',
    title: 'Hazardous Chemical Drums in Creek',
    prompt:
      'Volunteers found four 55-gallon steel drums dumped down the steep embankment by Mill Creek footbridge. One drum is punctured and leaking dark blue oily fluid directly toward the water line.',
    locationHint: 'Mill Creek Greenbelt Trail, Sector B, Southside',
    icon: <Biohazard className="w-4 h-4 text-rose-600" />,
    tags: ['Water Contamination', 'HazMat', 'Parks & Wildlife'],
  },
  {
    id: 'senior-heat',
    badge: 'Public Health & Vulnerability',
    title: 'HVAC Failure in Senior Facility',
    prompt:
      'Our central air conditioning system failed yesterday evening. Indoor hallway temperatures are reading over 89°F right now. Several 4th-floor residents have mobility issues and cannot reach cooler common areas.',
    locationHint: 'Shady Pines Senior Apartments, 1200 Highland Terrace',
    icon: <Flame className="w-4 h-4 text-amber-600" />,
    tags: ['Extreme Heat', 'Geriatric Welfare', 'Housing Code § 14-802'],
  },
];

interface Props {
  onSelectScenario: (scenario: DemoScenario) => void;
}

export const QuickScenarioSelector: React.FC<Props> = ({ onSelectScenario }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Quick-Load Real-World Civic Scenarios
          </span>
        </div>
        <span className="text-xs text-slate-500">Click any card to auto-fill input</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {DEMO_SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelectScenario(s)}
            className="text-left bg-white dark:bg-slate-900 hover:bg-teal-50/50 dark:hover:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-500 transition-all group shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800/50">
                  {s.badge}
                </span>
                <span className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-white transition-colors">
                  {s.icon}
                </span>
              </div>
              <h5 className="font-semibold text-xs text-slate-900 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-teal-300">
                {s.title}
              </h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                "{s.prompt}"
              </p>
            </div>

            <div className="flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              {s.tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                >
                  #{t}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
