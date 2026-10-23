# CivicBridge AI

> **From Real-World Chaos to Verified Action.**  
> A Google Gemini-Powered Societal Benefit Platform featuring the **Proof-to-Action Engine**.

[![Built with Gemini](https://img.shields.io/badge/Google%20Gemini-3.8--flash-0D9488?style=flat&logo=google)](https://ai.google.dev/)
[![React 19](https://img.shields.io/badge/React-19.3-61DAFB?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat&logo=vite)](https://vite.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

---

## 1. Executive Summary & Core USP

Most AI applications merely summarize text or provide conversational answers. **CivicBridge AI** solves a fundamental gap in civic technology: everyday human problems arrive as **unstructured chaos** (frantic voice memos, phone photos of flooded roads, leaked chemical containers, damaged school crossings, and contradictory public notices).

CivicBridge AI acts as a **universal bridge between human intent and complex civic systems**, transforming chaos into verified truth and accountable community progress through its core USP:

### The Proof-to-Action Engine
```
Unstructured Input → Structured Facts → Evidence Verification → Action Plan → Tracked Outcome
```

### The 5 Standard Verification Labels
CivicBridge AI enforces rigorous honesty. **Never is an AI-generated statement labeled as verified simply because Gemini produced it.** Verification requires independent corroboration against cited authoritative records:
1. **Verified against a cited source**: Independently corroborated by cited municipal, meteorological, or statutory registries.
2. **Partially supported**: Corroborated in general municipal logs, but specific localized parameters remain unconfirmed.
3. **Unverified**: Citizen assertion with no matching public record or sensor telemetry currently accessible.
4. **Conflicting information**: Direct discrepancy detected between citizen report and authoritative civic log.
5. **Unable to verify**: No public telemetry or civic records exist for this specific parameter.

---

## 2. Primary Demonstration Scenario (Competition Ready)

The application includes an end-to-end demonstration around a community safety incident:

**User Submission:**
> *"The road near our school is flooded. Children and pedestrians may be unable to cross safely. Water seems to be backing up from the storm drain at the intersection of Elmwood Ave and 4th Street. Morning buses had to mount the curb."*

### 5-Step Workflow:
1. **Understand**: Gemini analyzes the multimodal inputs (text, voice recording, photo of submerged crosswalk) and extracts the core problem, location, time, and urgent safety risks.
2. **Structure**: Structures Case `CB-2026-0104`, categorizing it as `INFRASTRUCTURE_HAZARD` with `HIGH` urgency, extracting 4 verifiable facts, identifying missing telemetry, and formulating testable claims.
3. **Verify**: Cross-references claims against the National Weather Service Hydrology Bureau (Station #4029 confirming 1.42 inches of rain) and Metro Public Works Catch-Basin Logs (noting prior cleaning was incomplete due to parked cars). Marks unconfirmed indoor flooding claims as **Unverified**.
4. **Recommend**: Generates a prioritized action plan:
   - **P1 Immediate**: Dispatch emergency stormwater jetting crew to Elmwood Ave.
   - **P1 Immediate**: Redirect school bus drop-off to North Birch Gate and reposition crossing guards.
   - **P2 High**: Erect high-water warning signs at 3rd & 5th intersections.
   - **P4 Follow-Up**: Log mandatory Autumn leaf sweep protocol in municipal GIS.
5. **Track**: Tracks actions through completion, records verified physical outcomes, and distinguishes recommendations from completed tasks.

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Framer Motion, Canvas Confetti.
- **Backend**: Node.js, Express, TypeScript, REST APIs, Multer (multimodal uploads), Zod (structured schema validation).
- **Artificial Intelligence**: Google Gemini API via official `@google/genai` SDK (`gemini-3.8-flash`).
- **Data & Verification**: Local persistent JSON data layer (`server/data/cases.json`, `resources.json`), Open Civic Telemetry simulation engine.
- **Dual Mode**: Full live Gemini API execution when `GEMINI_API_KEY` is supplied, with an automatic, transparent civic rule engine fallback if operating offline.

---

## 4. Setup and Run Instructions

### Prerequisites
- Node.js >= 18.0.0 (Node 24 recommended)
- npm >= 9.0.0

### Step 1: Install Dependencies
From the repository root:
```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### Step 2: Configure Environment (Optional)
To enable live Gemini calls, configure the server-side environment file (`server/.env`):
```bash
# server/.env
PORT=3005
GEMINI_API_KEY=your_google_gemini_api_key_here
```
> **Security Note:** In accordance with production security standards, API keys and secrets are **strictly kept on the server side** in `server/.env` and are never exposed to the frontend or browser clients. If no API key is set, CivicBridge AI runs in **Transparent Local Civic Engine Mode**, allowing complete end-to-end demonstrations with zero setup.

### Step 3: Run the Application
Start both the backend server (port 3005) and frontend client (port 5175) with a single command:
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5175
```

---

## 5. Website Pages and Navigation

1. **Landing Page (`/`)**: Hero section, interactive live simulator, 5-stage Proof-to-Action pipeline explanation, societal use cases, trust & transparency charter, impact metrics.
2. **Main Dashboard (`/#/dashboard`)**: Overview of active community incidents, verification queues, pending tasks, and quick universal input bar.
3. **Universal Input Center (`/#/input`)**: Central intake hub supporting text, photos, audio memos, and PDF documents with 1-click pre-populated competition scenarios and life-safety 911 emergency detection.
4. **Case Detail Workspace (`/#/case/:id`)**: Signature workspace featuring the 5-stage transformation pipeline, extracted facts, authoritative citations, interactive task status toggles, proof submission, and audited physical outcomes.
5. **Verification Center (`/#/verification`)**: Cross-case claim audit registry with status filtering (Verified, Partially Supported, Unverified, Conflicting) and 1-click re-verification against live feeds.
6. **Action Plans (`/#/actions`)**: Centralized municipal task hub filterable by priority (P1–P4) and completion status.
7. **Community Resources (`/#/resources`)**: Authenticated directory of municipal public works, EPA spill response, school transit offices, and weather hydrology bureaus.
8. **Impact Dashboard (`/#/impact`)**: Transparent societal metrics, claim verification distribution, and processing benchmarks.
9. **Settings (`/#/settings`)**: Server environment security status, system diagnostics, and 1-click presentation state reset.

---

## 6. Security, Privacy & Responsible AI

- **Untrusted Input Defense**: All citizen reports and attachments are treated as untrusted input; prompt injections cannot override application schemas.
- **Server-Side API Security**: Gemini API keys are never exposed to browser clients; all requests route securely through the backend.
- **Immediate Life-Safety Redirection**: Emergency keyword detection triggers critical alerts advising citizens to call 911 immediately rather than awaiting AI processing.
- **Non-Diagnostic Medical & Legal Safeguards**: Summaries organize records for certified authorities and never prescribe medical or legal actions.

---

© 2026 CivicBridge AI Team. Built for Competition Demonstration.
