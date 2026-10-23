export type VerificationStatus =
  | 'VERIFIED'
  | 'PARTIALLY_SUPPORTED'
  | 'UNVERIFIED'
  | 'CONFLICTING'
  | 'UNABLE_TO_VERIFY';

export type CaseCategory =
  | 'INFRASTRUCTURE_HAZARD'
  | 'PUBLIC_HEALTH_SAFETY'
  | 'CIVIC_SERVICES'
  | 'ENVIRONMENTAL'
  | 'HOUSING_RIGHTS'
  | 'COMMUNITY_EMERGENCY';

export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type TaskPriority = 'P1_IMMEDIATE' | 'P2_HIGH' | 'P3_STANDARD' | 'P4_FOLLOW_UP';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';

export type CaseStatus =
  | 'NEW'
  | 'ANALYZING'
  | 'AWAITING_VERIFICATION'
  | 'ACTION_IN_PROGRESS'
  | 'RESOLVED'
  | 'ARCHIVED';

export interface EvidenceAttachment {
  id: string;
  name: string;
  type: 'IMAGE' | 'DOCUMENT' | 'AUDIO';
  url: string;
  size: number;
  summary?: string;
  uploadedAt: string;
}

export interface ExtractedFact {
  id: string;
  fact: string;
  confidence: number;
  sourceSegment?: string;
  isReportedByCitizen: boolean;
}

export interface MissingInfoItem {
  id: string;
  item: string;
  importance: 'CRITICAL' | 'HELPFUL';
  reason: string;
  remedySuggestion: string;
}

export interface ContradictionItem {
  id: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  sourceA: string;
  sourceB: string;
}

export interface ClaimVerification {
  id: string;
  claimText: string;
  status: VerificationStatus;
  sourceTitle?: string;
  sourceUrl?: string;
  sourceExcerpt?: string;
  sourceDate?: string;
  confidenceScore: number;
  uncertaintyExplanation: string;
  verificationEngine: string;
  lastChecked: string;
}

export interface ActionTask {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  reasoning: string;
  requiredDocuments: string[];
  responsibleEntity: string;
  deadline?: string;
  status: TaskStatus;
  outcomeProof?: {
    text?: string;
    fileUrl?: string;
    submittedAt?: string;
    verifiedOutcome?: string;
  };
}

export interface CaseOutcome {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  recordedBy: string;
  isVerified: boolean;
  verificationProofUrl?: string;
}

export interface CivicCase {
  id: string;
  caseNumber: string;
  title: string;
  summary: string;
  intent: string;
  category: CaseCategory;
  userReport: string;
  attachments: EvidenceAttachment[];
  location: {
    rawInput: string;
    parsedAddress?: string;
    landmark?: string;
    certainty: 'CONFIRMED' | 'APPROXIMATE' | 'UNSPECIFIED';
    coordinates?: { lat: number; lng: number };
  };
  incidentTime: {
    rawInput: string;
    reportedTimestamp?: string;
    isOngoing: boolean;
    certainty: 'CONFIRMED' | 'APPROXIMATE' | 'UNSPECIFIED';
  };
  urgency: UrgencyLevel;
  urgencyReasoning: string;
  extractedFacts: ExtractedFact[];
  missingInformation: MissingInfoItem[];
  contradictions: ContradictionItem[];
  claims: ClaimVerification[];
  actions: ActionTask[];
  recordedOutcomes: CaseOutcome[];
  currentStage: 1 | 2 | 3 | 4 | 5;
  overallStatus: CaseStatus;
  aiModelUsed: string;
  isDemoMode: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityResource {
  id: string;
  name: string;
  category: CaseCategory | 'EMERGENCY_DISPATCH';
  description: string;
  jurisdiction: string;
  contact: {
    phone: string;
    email?: string;
    portalUrl?: string;
    hours: string;
  };
  servicesProvided: string[];
  lastVerifiedDate: string;
  isOfficialSource: boolean;
  isEmergencyOnly: boolean;
}

export interface ImpactMetrics {
  totalCases: number;
  successfullyProcessed: number;
  awaitingVerification: number;
  actionPlansCreated: number;
  tasksCompleted: number;
  openCases: number;
  resolvedCases: number;
  averageProcessingTimeSeconds: number;
  verificationBreakdown: {
    verified: number;
    partiallySupported: number;
    unverified: number;
    conflicting: number;
    unableToVerify: number;
  };
  categoryBreakdown: Record<string, number>;
}
