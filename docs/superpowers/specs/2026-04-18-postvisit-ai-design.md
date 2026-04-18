# PostVisit.ai — Hackathon Practice Build

## Overview

A frontend-only, 4-step wizard demo inspired by PostVisit.ai (Anthropic AI Hackathon winner). Built on Tab 1 of the existing Next.js 15 dashboard. Simulates an agentic care platform that guides patients after doctor visits — from visit summary input through care plan generation, patient chat, and adherence tracking.

**Goal:** Practice hackathon implementation skills by reverse-engineering PostVisit.ai's likely architecture and building the agentic flow end-to-end in a single session (2-4 hours).

**Constraints:**
- Pure frontend — no API routes, no backend, no database
- All state in React `useState` (no Context, no stores)
- Simulated AI responses (setTimeout + pre-written data)
- Two files only: `page.tsx` and `mock-data.ts`
- Uses existing CSS variables from `globals.css`

## Architecture

### File Structure

```
app/tab-1/
  page.tsx          # Main wizard component ("use client", ~300-400 lines)
  mock-data.ts      # All mock data, templates, and simulated response logic
```

### State

Single page component manages all state via `useState`:

```ts
type VisitData = {
  patientName: string
  age: number
  diagnosis: string
  medications: { name: string; dosage: string; frequency: string }[]
  instructions: string
  followUpDate: string
}
```

Additional state: `step` (1-4), `carePlan` (generated object), `chatMessages` (array), `adherenceChecks` (record of day/task booleans), `isGenerating` (loading flag).

### Simulated AI

All AI is faked on the frontend:

- **Care plan generation:** 1.5s `setTimeout`, then a template function that interpolates `VisitData` fields into a structured care plan object
- **Chat responses:** Keyword matching on lowercased input against a response map. 0.8-1.2s random delay. Fallback response for unmatched queries. All responses reference actual visit data.
- **Adherence nudges:** Static pre-written cards referencing patient medication names

## Wizard Flow

```
[1. Visit Summary] → [2. Care Plan] → [3. Patient Chat] → [4. Adherence]
```

Progress bar at top: four labeled circles connected by lines. Current step highlighted with accent color. Completed steps show checkmark. Completed steps are clickable to go back.

### Step 1 — Doctor Visit Summary

Card-style form with **pre-filled demo values** (fast demo click-through):

| Field | Type | Default Value |
|-------|------|---------------|
| Patient Name | text | Maria Santos |
| Age | number | 62 |
| Diagnosis | text | Hypertension Stage 2, Type 2 Diabetes |
| Medications | dynamic list (name, dosage, frequency) | Lisinopril 10mg daily; Metformin 500mg twice daily; Amlodipine 5mg daily |
| Lifestyle Instructions | textarea | Low sodium diet, 30 min walking daily, monitor blood glucose before meals |
| Follow-Up Date | date | 14 days from today |

**Action button:** "Generate Care Plan →"

Medications list has add/remove row capability.

### Step 2 — AI-Generated Care Plan

**On enter:** 1.5s simulated generation with pulsing skeleton loader and "Analyzing visit data..." text.

**Generated content** (interpolated from Step 1 data):

1. **Medication Schedule** — table with columns: Drug, Dose, Time of Day, Special Instructions
2. **Daily Routine** — morning/afternoon/evening checklist derived from lifestyle instructions
3. **Warning Signs** — red-flagged list (e.g., "Blood pressure above 180/120 — seek immediate care")
4. **Follow-Up Timeline** — visual timeline showing check-in points leading to the follow-up date

Editing the form in Step 1 changes the care plan output — template interpolation, not hardcoded.

**Action button:** "Continue as Patient →"

### Step 3 — Patient Chat Assistant

**Layout:** Split view
- **Left (narrow, ~280px):** Patient context card — name, age, diagnosis, active medications. Always visible.
- **Right (wide):** Chat interface with message bubbles

**Pre-seeded welcome message:** "Hi Maria, I'm your PostVisit assistant. I have your care plan from Dr. Chen. What questions do you have?"

**Suggested question chips** below input: "Side effects?", "What can I eat?", "When should I worry?", "My exercise plan"

**Chat behavior:**
- Keyword matching: input lowercased, checked against response map
- Keywords: "side effect", "eat"/"diet"/"food", "exercise"/"walk", "worry"/"emergency"/"call", "medication"/"med"/"drug"
- Responses reference actual visit data (medication names, diagnosis, dates)
- Fallback: "That's a great question. Based on your care plan, I'd recommend discussing this with Dr. Chen at your follow-up on [followUpDate]."
- 0.8-1.2s random delay with typing indicator (three animated dots)

**Action button:** "View Adherence →"

### Step 4 — Adherence Dashboard

- **Top:** Progress display — "Day 3 of 14" with overall adherence percentage (circular or bar)
- **Middle:** 7-day grid. Each day column has checkboxes for: each medication (by name), exercise, vitals logged. Days 1-3 pre-checked with partial adherence (some missed).
- **Bottom:** "AI Nudge" card — 2-3 static notification examples:
  - "Time for your evening Metformin"
  - "You haven't logged blood pressure today"
  - "Great job — 3 day streak on your walking goal!"

Checkboxes are interactive — toggling updates the adherence percentage in real time.

**Action button:** "Restart Demo" (resets to Step 1)

## Styling

All inline styles using existing CSS variables:

- Cards: `background: var(--bg-surface)`, `box-shadow: var(--shadow-sm)`, `border-radius: 12px`
- Text: `color: var(--text-primary)` for headings, `var(--text-secondary)` for body
- Accent: `var(--accent)` for progress bar, active states, primary buttons
- Spacing: 16px gaps between cards, 24px section padding
- Consistent with existing dashboard look — no new CSS framework needed

## Navigation

- Progress bar clickable for completed steps only
- "Back" button on steps 2-4 (left-aligned)
- Primary action button on right — label changes per step
- Step 4 "Restart Demo" loops back to step 1 with fresh state

## Out of Scope

- Real Claude API integration (future enhancement)
- Backend / API routes
- Database / persistent storage
- Authentication
- Mobile responsiveness (desktop-first demo)
- Dark mode
- Real medical accuracy (demo-realistic only)
