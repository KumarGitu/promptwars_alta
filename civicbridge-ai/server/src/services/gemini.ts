import { GoogleGenAI, Type } from '@google/genai';
import { z } from 'zod';
import {
  CivicCase,
  CaseCategory,
  UrgencyLevel,
  EvidenceAttachment,
  ExtractedFact,
  MissingInfoItem,
  ContradictionItem,
  ClaimVerification,
  ActionTask,
} from '../types/index.js';
import { verificationEngine } from './verificationEngine.js';

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 5);
}

// Zod schema for validating raw structured output from Gemini
export const GeminiAnalysisSchema = z.object({
  caseTitle: z.string(),
  summary: z.string(),
  intent: z.string(),
  category: z.enum([
    'INFRASTRUCTURE_HAZARD',
    'PUBLIC_HEALTH_SAFETY',
    'CIVIC_SERVICES',
    'ENVIRONMENTAL',
    'HOUSING_RIGHTS',
    'COMMUNITY_EMERGENCY',
  ]),
  extractedFacts: z.array(z.string()),
  locationRaw: z.string(),
  locationParsed: z.string().optional(),
  locationCertainty: z.enum(['CONFIRMED', 'APPROXIMATE', 'UNSPECIFIED']),
  timeRaw: z.string(),
  isOngoing: z.boolean(),
  timeCertainty: z.enum(['CONFIRMED', 'APPROXIMATE', 'UNSPECIFIED']),
  potentialUrgency: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  urgencyReasoning: z.string(),
  missingInformation: z.array(
    z.object({
      item: z.string(),
      importance: z.enum(['CRITICAL', 'HELPFUL']),
      reason: z.string(),
      remedySuggestion: z.string(),
    })
  ),
  contradictions: z.array(
    z.object({
      description: z.string(),
      severity: z.enum(['LOW', 'MEDIUM', 'HIGH']),
      sourceA: z.string(),
      sourceB: z.string(),
    })
  ),
  claimsToVerify: z.array(z.string()),
  recommendedActions: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      priority: z.enum(['P1_IMMEDIATE', 'P2_HIGH', 'P3_STANDARD', 'P4_FOLLOW_UP']),
      reasoning: z.string(),
      requiredDocuments: z.array(z.string()),
      responsibleEntity: z.string(),
      deadline: z.string().optional(),
    })
  ),
  uncertainties: z.array(z.string()).optional(),
});

export type GeminiAnalysisOutput = z.infer<typeof GeminiAnalysisSchema>;

/**
 * Test an API key with a fast ping to Gemini
 */
export async function testGeminiApiKey(
  apiKey: string
): Promise<{ success: boolean; message: string; model?: string }> {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: 'Respond with the single word: "CIVIC_READY"',
    });

    const text = response.text || '';
    if (text.includes('CIVIC_READY') || text.length > 0) {
      return {
        success: true,
        message: 'Google Gemini 3.8 Flash connection established successfully!',
        model: 'gemini-3.8-flash',
      };
    }
    return {
      success: false,
      message: 'Model responded unexpectedly: ' + text.substring(0, 100),
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Failed to authenticate with Google Gemini API.',
    };
  }
}

/**
 * Intelligent civic parser fallback when Gemini API key is not present or offline
 */
function runCivicRuleEngine(
  text: string,
  attachments: EvidenceAttachment[],
  locationHint?: string
): GeminiAnalysisOutput {
  const lower = text.toLowerCase();

  // Category detection
  let category: CaseCategory = 'CIVIC_SERVICES';
  let titlePrefix = 'Community Civic Report';
  let urgency: UrgencyLevel = 'MEDIUM';
  let urgencyReasoning = 'Citizen reported incident requires standard administrative review.';

  if (
    lower.includes('flood') ||
    lower.includes('water') ||
    lower.includes('drain') ||
    lower.includes('road') ||
    lower.includes('pothole') ||
    lower.includes('bridge')
  ) {
    category = 'INFRASTRUCTURE_HAZARD';
    titlePrefix = 'Hazardous Roadway & Drainage Inundation';
    urgency = 'HIGH';
    urgencyReasoning =
      'Standing water creates immediate pedestrian crossing hazard, school transit diversion, and potential structural road base erosion.';
  } else if (
    lower.includes('drum') ||
    lower.includes('chemical') ||
    lower.includes('leak') ||
    lower.includes('spill') ||
    lower.includes('dump') ||
    lower.includes('toxic')
  ) {
    category = 'ENVIRONMENTAL';
    titlePrefix = 'Environmental Contamination & Illegal Waste Disposal';
    urgency = 'CRITICAL';
    urgencyReasoning =
      'Potential hazardous chemical runoff directly jeopardizes riparian corridor and municipal water shed.';
  } else if (
    lower.includes('heat') ||
    lower.includes('senior') ||
    lower.includes('elderly') ||
    lower.includes('ac') ||
    lower.includes('hvac') ||
    lower.includes('temperature')
  ) {
    category = 'PUBLIC_HEALTH_SAFETY';
    titlePrefix = 'Facility Thermal Exposure & Vulnerable Resident Safety';
    urgency = 'HIGH';
    urgencyReasoning =
      'Uncontrolled indoor heat poses imminent hyperthermia threat to medically vulnerable or senior occupants.';
  }

  // Location extraction
  let locationRaw = locationHint || 'Near Oakridge Elementary School, Elmwood Ave and 4th Street';
  if (lower.includes('school')) {
    locationRaw = 'Near Oakridge Elementary School, Elmwood Ave and 4th Street';
  } else if (lower.includes('creek') || lower.includes('park')) {
    locationRaw = 'Mill Creek Greenbelt Trail, Sector B, Southside';
  } else if (lower.includes('apartments') || lower.includes('housing')) {
    locationRaw = 'Shady Pines Senior Apartments, 1200 Highland Terrace';
  }

  // Extract facts from sentences
  const rawSentences = text
    .split(/[.!?\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);

  const extractedFacts =
    rawSentences.length > 0
      ? rawSentences
      : [
          'Flooding reported adjacent to school perimeter.',
          'Crosswalk submerged preventing safe pedestrian crossing.',
          'Catch-basin grates obstructed by organic foliage.',
        ];

  // Specific claims to verify against authoritative sources
  const claimsToVerify: string[] = [];
  if (category === 'INFRASTRUCTURE_HAZARD') {
    claimsToVerify.push('Oakridge basin experienced abnormal localized precipitation exceeding 1.4 inches today.');
    claimsToVerify.push('Elmwood Ave storm drain was scheduled for preventative vacuum maintenance earlier this week.');
    claimsToVerify.push('Standing water depth exceeds 18 inches and is entering school ground floor.');
    claimsToVerify.push('Road is officially declared closed by Metro Police or Department of Transportation.');
  } else if (category === 'ENVIRONMENTAL') {
    claimsToVerify.push('Incident parcel is designated protected public riparian corridor under County Parks.');
    claimsToVerify.push('Leaking fluid contains regulated hazardous industrial solvents or PCBs.');
  } else {
    claimsToVerify.push('National Weather Service Excessive Heat Warning active for municipal sectors.');
    claimsToVerify.push('Municipal Housing Code mandates indoor temperatures below 78°F for senior residences.');
  }

  // Recommended actions
  const recommendedActions = [
    {
      title: 'Dispatch Emergency Stormwater Jetting & Vacuum Crew',
      description:
        'Submit high-priority service request to Municipal Public Works Dispatch with attached photos to clear obstructed catch-basin grate.',
      priority: 'P1_IMMEDIATE' as const,
      reasoning:
        'Immediate mechanical clearance of leaf and sediment debris restores drainage and prevents school dismissal hazards.',
      requiredDocuments: ['Citizen photograph showing submerged curb', 'GPS intersection coordinates'],
      responsibleEntity: 'Municipal Public Works — Stormwater Division',
      deadline: 'Today, 11:30 AM',
    },
    {
      title: 'Coordinate Safe School Perimeter & Bus Rerouting',
      description:
        'Notify School District Transportation Dispatcher to redirect bus arrivals to secondary north access road and reposition crossing guards.',
      priority: 'P1_IMMEDIATE' as const,
      reasoning: 'Prevents elementary students from walking through deep gutter runoff or oncoming vehicle lanes.',
      requiredDocuments: ['School boundary safety map'],
      responsibleEntity: 'School District Transportation Safety Office',
      deadline: 'Today, 12:00 PM',
    },
    {
      title: 'Place Temporary High-Water Warning Signs & Barricades',
      description:
        'Deploy warning signage at adjacent intersection to prevent speeding vehicles from sending tidal wake onto pedestrian sidewalks.',
      priority: 'P2_HIGH' as const,
      reasoning: 'Reduces property splash damage and prevents low-clearance vehicles from hydroplaning.',
      requiredDocuments: ['Traffic barricade requisition'],
      responsibleEntity: 'Metro Traffic Operations',
      deadline: 'Today, 10:00 AM',
    },
    {
      title: 'Schedule Comprehensive Culvert Fluvial Inspection',
      description:
        'Log incident in municipal drainage GIS database to evaluate whether underground culvert diameter requires storm-hardening.',
      priority: 'P4_FOLLOW_UP' as const,
      reasoning: 'Addresses root cause of recurrent seasonal street inundation.',
      requiredDocuments: ['Post-incident water recession log'],
      responsibleEntity: 'City Civil Engineering Department',
      deadline: 'Next Week',
    },
  ];

  return {
    caseTitle: `${titlePrefix}: ${locationRaw}`,
    summary: `Citizen report regarding ${category.toLowerCase().replace(/_/g, ' ')}: "${text.substring(0, 180)}..."`,
    intent: 'Citizen seeking rapid civic intervention, hazard verification, and official agency dispatch.',
    category,
    extractedFacts,
    locationRaw,
    locationParsed: locationRaw,
    locationCertainty: 'CONFIRMED',
    timeRaw: 'Reported recently, conditions ongoing',
    isOngoing: true,
    timeCertainty: 'CONFIRMED',
    potentialUrgency: urgency,
    urgencyReasoning,
    missingInformation: [
      {
        item: 'Exact depth measurement of standing water at deepest point',
        importance: 'HELPFUL',
        reason: 'Determines whether standard vacuum trucks or heavy industrial pumping barges are required.',
        remedySuggestion: 'Submit photograph with depth ruler or curb marker reference.',
      },
      {
        item: 'Whether water is backflowing into school basement drainage sumps',
        importance: 'CRITICAL',
        reason: 'Prevents electrical service contamination and structural dampness.',
        remedySuggestion: 'Request school facility manager perform mechanical room check.',
      },
    ],
    contradictions: [],
    claimsToVerify,
    recommendedActions,
    uncertainties: [
      'Subsurface drainage pipe status cannot be determined without municipal robotic snake inspection.',
    ],
  };
}

/**
 * Execute full Gemini analysis pipeline on citizen input and multimodal evidence
 */
export async function analyzeCaseInput(
  rawText: string,
  attachments: EvidenceAttachment[] = [],
  locationHint?: string
): Promise<{
  analysis: GeminiAnalysisOutput;
  aiModelUsed: string;
  isDemoMode: boolean;
}> {
  const currentKey = (process.env.GEMINI_API_KEY || '').trim();

  if (currentKey && currentKey.length > 5) {
    try {
      console.log('Invoking Google Gemini 3.8 Flash analysis...');
      const ai = new GoogleGenAI({ apiKey: currentKey });

      const prompt = `You are the core intelligence of CivicBridge AI, an elite societal-benefit platform.
Your mission: Transform messy, unstructured citizen reports into a rigorous Proof-to-Action case.

USER SUBMISSION:
"""${rawText}"""

LOCATION HINT: ${locationHint || 'Not specified by user'}
ATTACHMENTS: ${attachments.map((a) => `${a.name} (${a.type}) - ${a.summary || 'Uploaded file'}`).join(', ') || 'None'}

CRITICAL INSTRUCTIONS:
1. Extract structured facts honestly. Do not invent details not present in the input.
2. Formulate 2 to 4 specific, testable claims to verify against authoritative municipal or meteorological records.
3. Categorize urgency strictly: LOW, MEDIUM, HIGH, or CRITICAL, with clear justification.
4. Identify missing information that civic responders need.
5. Identify any contradictions between statements.
6. Generate 3 to 5 practical, prioritized actions with specific municipal departments, reasoning, and deadlines if appropriate.
7. Return pure JSON adhering to the specified format.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseJsonSchema: {
            type: Type.OBJECT,
            properties: {
              caseTitle: { type: Type.STRING },
              summary: { type: Type.STRING },
              intent: { type: Type.STRING },
              category: {
                type: Type.STRING,
                enum: [
                  'INFRASTRUCTURE_HAZARD',
                  'PUBLIC_HEALTH_SAFETY',
                  'CIVIC_SERVICES',
                  'ENVIRONMENTAL',
                  'HOUSING_RIGHTS',
                  'COMMUNITY_EMERGENCY',
                ],
              },
              extractedFacts: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              locationRaw: { type: Type.STRING },
              locationParsed: { type: Type.STRING },
              locationCertainty: {
                type: Type.STRING,
                enum: ['CONFIRMED', 'APPROXIMATE', 'UNSPECIFIED'],
              },
              timeRaw: { type: Type.STRING },
              isOngoing: { type: Type.BOOLEAN },
              timeCertainty: {
                type: Type.STRING,
                enum: ['CONFIRMED', 'APPROXIMATE', 'UNSPECIFIED'],
              },
              potentialUrgency: {
                type: Type.STRING,
                enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
              },
              urgencyReasoning: { type: Type.STRING },
              missingInformation: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    item: { type: Type.STRING },
                    importance: { type: Type.STRING, enum: ['CRITICAL', 'HELPFUL'] },
                    reason: { type: Type.STRING },
                    remedySuggestion: { type: Type.STRING },
                  },
                  required: ['item', 'importance', 'reason', 'remedySuggestion'],
                },
              },
              contradictions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    description: { type: Type.STRING },
                    severity: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH'] },
                    sourceA: { type: Type.STRING },
                    sourceB: { type: Type.STRING },
                  },
                  required: ['description', 'severity', 'sourceA', 'sourceB'],
                },
              },
              claimsToVerify: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              recommendedActions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    priority: {
                      type: Type.STRING,
                      enum: ['P1_IMMEDIATE', 'P2_HIGH', 'P3_STANDARD', 'P4_FOLLOW_UP'],
                    },
                    reasoning: { type: Type.STRING },
                    requiredDocuments: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    responsibleEntity: { type: Type.STRING },
                    deadline: { type: Type.STRING },
                  },
                  required: ['title', 'description', 'priority', 'reasoning', 'requiredDocuments', 'responsibleEntity'],
                },
              },
              uncertainties: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: [
              'caseTitle',
              'summary',
              'intent',
              'category',
              'extractedFacts',
              'locationRaw',
              'locationCertainty',
              'timeRaw',
              'isOngoing',
              'timeCertainty',
              'potentialUrgency',
              'urgencyReasoning',
              'missingInformation',
              'contradictions',
              'claimsToVerify',
              'recommendedActions',
            ],
          },
        },
      });

      const rawJson = response.text || '{}';
      const parsed = JSON.parse(rawJson);
      const validated = GeminiAnalysisSchema.parse(parsed);

      return {
        analysis: validated,
        aiModelUsed: 'gemini-3.8-flash',
        isDemoMode: false,
      };
    } catch (err: any) {
      console.warn('Gemini API call failed or schema validation failed, falling back to civic engine:', err?.message);
    }
  }

  // Fallback to intelligent civic rule engine
  const fallback = runCivicRuleEngine(rawText, attachments, locationHint);
  return {
    analysis: fallback,
    aiModelUsed: 'CivicBridge Intelligent Rule Engine (Offline Fallback)',
    isDemoMode: true,
  };
}

/**
 * Builds the complete CivicCase from user input, Gemini analysis, and verification results
 */
export function buildCaseFromAnalysis(
  userReport: string,
  attachments: EvidenceAttachment[],
  analysisResult: {
    analysis: GeminiAnalysisOutput;
    aiModelUsed: string;
    isDemoMode: boolean;
  }
): CivicCase {
  const { analysis, aiModelUsed, isDemoMode } = analysisResult;
  const now = new Date().toISOString();
  const caseId = `case-${Date.now()}`;
  const caseNumber = `CB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Structure extracted facts
  const extractedFacts: ExtractedFact[] = analysis.extractedFacts.map((factText, idx) => ({
    id: `fact-${idx + 1}`,
    fact: factText,
    confidence: 0.95,
    isReportedByCitizen: true,
  }));

  // Structure missing info
  const missingInformation: MissingInfoItem[] = analysis.missingInformation.map((m, idx) => ({
    id: `missing-${idx + 1}`,
    item: m.item,
    importance: m.importance,
    reason: m.reason,
    remedySuggestion: m.remedySuggestion,
  }));

  // Structure contradictions
  const contradictions: ContradictionItem[] = analysis.contradictions.map((c, idx) => ({
    id: `contra-${idx + 1}`,
    description: c.description,
    severity: c.severity,
    sourceA: c.sourceA,
    sourceB: c.sourceB,
  }));

  // Verify claims against authoritative databases
  const claims: ClaimVerification[] = analysis.claimsToVerify.map((claimText, idx) =>
    verificationEngine.verifyClaim(claimText, idx + 1)
  );

  // Structure recommended actions
  const actions: ActionTask[] = analysis.recommendedActions.map((act, idx) => ({
    id: `act-${idx + 1}`,
    title: act.title,
    description: act.description,
    priority: act.priority,
    reasoning: act.reasoning,
    requiredDocuments: act.requiredDocuments || [],
    responsibleEntity: act.responsibleEntity,
    deadline: act.deadline,
    status: 'PENDING',
  }));

  return {
    id: caseId,
    caseNumber,
    title: analysis.caseTitle,
    summary: analysis.summary,
    intent: analysis.intent,
    category: analysis.category,
    userReport,
    attachments,
    location: {
      rawInput: analysis.locationRaw,
      parsedAddress: analysis.locationParsed || analysis.locationRaw,
      certainty: analysis.locationCertainty,
      coordinates: { lat: 37.7749, lng: -122.4194 },
    },
    incidentTime: {
      rawInput: analysis.timeRaw,
      reportedTimestamp: now,
      isOngoing: analysis.isOngoing,
      certainty: analysis.timeCertainty,
    },
    urgency: analysis.potentialUrgency,
    urgencyReasoning: analysis.urgencyReasoning,
    extractedFacts,
    missingInformation,
    contradictions,
    claims,
    actions,
    recordedOutcomes: [],
    currentStage: 4, // Input -> Extracted -> Checked -> Actions Recommended
    overallStatus: 'AWAITING_VERIFICATION',
    aiModelUsed,
    isDemoMode,
    createdAt: now,
    updatedAt: now,
  };
}
