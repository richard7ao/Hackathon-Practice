# End-of-Life RPM Triage Co-Pilot — Hackathon Practice Build

## Overview

A frontend-only, 3-scene narrative simulation on Tab 2 of the existing Next.js 15 dashboard. Simulates a day-in-the-life of a district nurse using an RPM Triage Co-Pilot for elderly end-of-life patients. The co-pilot collapses raw alerts into triaged action cards, handles comfort care adjustments, and manages family crisis events — all while respecting advance care plans.

**Goal:** Practice hackathon implementation by building an end-of-life care triage demo that showcases RPM-to-clinical-decision workflows for elderly patients across home, care home, and hospice-at-home settings.

**Constraints:**
- Pure frontend — no API routes, no backend, no database
- All state in React `useState` (no Context, no stores)
- Simulated AI responses (setTimeout + pre-written data)
- Two files only: `page.tsx` and `mock-data.ts`
- Uses existing CSS variables from `globals.css`

## Architecture

### File Structure

```
app/tab-2/
  page.tsx          # Main narrative simulation component ("use client")
  mock-data.ts      # All mock patients, triage logic, pre-drafted actions
```

### State

Single page component manages all state via `useState`:

```ts
type Medication = {
  name: string
  dosage: string
  frequency: string
}

type SymptomTrend = {
  day: string
  painScore: number
  appetite: 'good' | 'normal' | 'reduced' | 'poor' | 'none'
  breathlessness: 'none' | 'mild' | 'moderate' | 'severe'
  anxiety: 'none' | 'mild' | 'moderate' | 'severe'
  mobility: string
  spO2: number
}

type ACP = {
  status: 'active' | 'needs-review' | 'none'
  dnacpr: boolean
  noHospitalisation: boolean
  preferredPlaceOfDeath: string
  lastReviewed: string
  nextOfKin: string
}

type Patient = {
  id: string
  name: string
  age: number
  careSetting: 'home' | 'care-home' | 'hospice-at-home'
  diagnosis: string
  medications: Medication[]
  acp: ACP
  riskLevel: 'green' | 'amber' | 'red'
  reasoning: string
  recommendedAction: string
  trends: SymptomTrend[]
  alertCount: number
}
```

Additional state: `scene` (1-3), `maxScene`, `actionedCards` (Set of patient IDs), `selectedPatient` (Patient | null), `approvedActions` (Set of action IDs), `isProcessing` (loading flag for action approvals).

### Simulated AI

All AI is faked on the frontend:

- **Alert collapse**: Pre-computed. Mock data includes the raw alert count per patient and the resulting triaged card. The "147 alerts → 10 cards" transformation is presented as already done.
- **Triage reasoning**: Static strings per patient, referencing their specific vitals, trends, and ACP status.
- **Pre-drafted actions**: Template functions that interpolate patient data into GP referral letters, ambulance ACP shares, family call scripts, and nurse dispatch requests.
- **Action approval**: 0.5-1s delay with brief spinner, then state update to show "Sent" confirmation.

## Narrative Flow

```
[Scene 1: Morning Inbox] → [Scene 2: Comfort Care] → [Scene 3: Family 999 Crisis]
```

Progress bar at top: three labeled circles connected by lines. Current scene highlighted with accent color. Completed scenes show checkmark and are clickable to revisit.

### Scene 1 — Morning Inbox Dashboard

**Top bar**: "Good morning, Nurse Sarah Chen. 28 patients | 147 overnight alerts → 10 action cards."

**Summary bar**: Patient distribution — e.g., "22 green | 4 amber | 2 red | 2 no ACP"

**Action cards list** (scrollable): 10 cards sorted by urgency (red → amber → green). Each card shows:

| Element | Description |
|---------|-------------|
| Risk strip | Coloured left border — red, amber, or green |
| Patient name + age | e.g., "Dorothy Fletcher, 82" |
| Care setting | Badge: "Home" / "Care Home" / "Hospice at Home" |
| ACP status | Badge: "ACP: comfort-focused" / "ACP: no hospitalisation" / "No ACP" (warning style) |
| Reasoning | One-line summary: "Pain trending up 3 days, appetite declining" |
| Action button | "Confirm stable" (green) / "Review care plan" (amber) / "Escalate now" (red) |

**Interactivity:**
- Green cards: "Confirm stable" button → card fades to muted acknowledged state
- Amber COPD patient card: clicking transitions to Scene 2
- Red crisis card: pulses gently, clicking transitions to Scene 3
- Counter at top: "4/10 cards actioned" (updates as cards are confirmed)

**Mock patients (10 cards):**

1. **Green** — Joan Whitfield, 78, home. Stable vitals, routine readings. "All vitals within baseline."
2. **Green** — Arthur Pemberton, 85, care home. Stable. "Morning check-in completed, no concerns."
3. **Green** — Elsie Macaulay, 91, hospice-at-home. Stable comfort care. "Pain managed, sleeping well."
4. **Green** — Frank Osei, 76, home. Stable post-medication adjustment. "Responding well to new pain regime."
5. **Green** — Margaret Liu, 88, care home. Stable. "Weight and vitals consistent."
6. **Green** — Robert Kapoor, 80, home. Stable. "Good appetite, mobile with frame."
7. **Amber** — Dorothy Fletcher, 82, home. Advanced COPD. "Pain score trending 3→6 over 4 days, declining appetite and mobility." → Scene 2
8. **Amber** — William Okafor, 74, care home. Heart failure. "Weight +0.8kg over 3 days, increased breathlessness. ACP: comfort-focused."
9. **Amber (no ACP)** — Beatrice Dunn, 87, home. Advanced frailty. "Declining mobility, missed 2 check-ins. No ACP on file."
10. **Red** — Harold Nyong'o, 89, care home. Advanced dementia + HF. "Family called 999 — patient unresponsive. ACP: DNACPR, do not hospitalise." → Scene 3

**Navigation**: "Continue →" button appears after at least 2 green cards are actioned, directing to Scene 2.

### Scene 2 — Comfort Care Adjustment

**Layout**: Split view with "← Back to dashboard" button.

**Left panel (~300px) — Patient context card:**
- Name: Dorothy Fletcher, 82
- Care setting: Home (husband is primary carer)
- Diagnosis: Advanced COPD stage 4, comorbid anxiety
- ACP: Comfort-focused, no hospitalisation, DNACPR
- Medications: Morphine sulfate 5mg PRN, salbutamol inhaler, lorazepam 0.5mg PRN, paracetamol
- RPM: Pulse oximeter, symptom check-in app

**Right panel — Co-pilot triage view:**

**Trend summary card** (4 mini visual indicators):
- Pain score: 3 → 4 → 5 → 6 over 4 days (rising line)
- Appetite: normal → reduced → poor over 3 days (declining)
- SpO2: 91-92% stable (flat line, noted as "within expected COPD baseline")
- Activity: "walked to kitchen" → "stayed in bed" over 2 days (declining)

**Co-pilot reasoning box** (visible, bordered):
> "Rising pain with declining appetite and mobility suggests symptom burden increase. SpO2 stable — not an acute exacerbation. ACP is comfort-focused. Recommend: anticipatory medication review with GP to adjust pain management, and carer welfare check (husband is sole carer)."

**Two action buttons** (each with pre-drafted content visible below):

1. "Approve: Request GP medication review"
   - Pre-drafted: "Dr. Marsh — Dorothy Fletcher (DOB 12/03/1943), COPD stage 4. Pain trending 3→6 over 4 days, declining appetite and mobility. SpO2 stable. Currently on morphine 5mg PRN. Recommend review of pain management — consider scheduled dosing or dose increase. ACP: comfort-focused."

2. "Approve: Schedule carer welfare call"
   - Pre-drafted SMS: "Hi Mr. Fletcher, this is Sarah from the community nursing team. I'd like to call today to check in on how things are going at home. Is 2pm convenient?"

**On approve**: Button changes to "Sent" with checkmark. After both actions approved, "Continue to next alert →" button appears.

### Scene 3 — Family 999 Crisis

**Transition**: Red-bordered view. Urgent styling.

**Alert banner**: "URGENT — Harold Nyong'o, 89, Meadowbank Care Home. Family called 999 — patient unresponsive. Ambulance dispatched (Cat 2)."

**Left panel — Patient context card:**
- Name: Harold Nyong'o, 89
- Care setting: Meadowbank Care Home
- Diagnosis: Advanced dementia, heart failure NYHA IV, frailty score 8/9
- ACP: DNACPR, do not hospitalise, preferred place of death: care home. Reviewed 6 weeks ago with daughter (NOK).
- Medications: Comfort only — oral morphine, hyoscine patches, midazolam PRN
- Note: "On end-of-life care pathway since 2 weeks ago"

**Right panel — Co-pilot crisis view:**

**Timeline card** (what happened):
- 09:47 — Morning check-in: not completed (patient non-responsive)
- 09:52 — Care home staff noted reduced consciousness, called daughter
- 10:03 — Daughter called 999 in distress
- 10:05 — Ambulance dispatched (Category 2)

**Co-pilot reasoning box** (red/amber highlighted border):
> "Patient is on an active end-of-life pathway with DNACPR and do-not-hospitalise in place. Reduced consciousness is consistent with expected end-of-life trajectory for advanced dementia + heart failure. Ambulance dispatch may conflict with ACP wishes. Recommend: share ACP with ambulance service, support family through expected decline, dispatch palliative nurse for comfort assessment."

**Three action buttons** (stacked):

1. "Approve: Share ACP with ambulance service"
   - Pre-drafted: "Re: Harold Nyong'o, DOB 15/08/1936, Meadowbank Care Home. Active DNACPR and advance care plan — do not hospitalise, comfort care only. Patient on end-of-life pathway (2 weeks). Current presentation consistent with expected decline. Please review dispatch. Community palliative team attending. Contact: Nurse Sarah Chen, 07700 900123."

2. "Approve: Call daughter"
   - Call script: "Mrs. Nyong'o, this is Sarah from the nursing team. I understand this is very frightening. Your father's care plan, which you helped put in place, says he should stay at Meadowbank where he's comfortable. I'm sending a nurse to assess him now and I'd like to talk you through what's happening."

3. "Approve: Dispatch palliative nurse"
   - Pre-drafted task: "Urgent comfort assessment — Harold Nyong'o, Meadowbank Care Home. Reduced consciousness, end-of-life pathway. Family distressed. Assess comfort, administer PRN if needed, support care home staff and family on-site."

**On all three approved**: Summary card appears — "Crisis managed. ACP upheld. Ambulance service notified. Family contacted. Palliative nurse dispatched." Buttons: "Return to dashboard" and "Restart demo."

## Styling

All inline styles using existing CSS variables:

- Cards: `background: var(--bg-surface)`, `box-shadow: var(--shadow-sm)`, `border-radius: 12px`
- Risk strips: Red `#dc3545`, amber `#f59e0b`, green `#22c55e` as left border (4px solid)
- ACP badges: Subtle pill shapes — green for active ACP, amber for needs-review, red outline for no ACP
- Alert banner (Scene 3): Red background with white text for urgency
- Text: `color: var(--text-primary)` for headings, `var(--text-secondary)` for body
- Accent: `var(--accent)` for progress bar, active states, primary buttons
- Spacing: 16px gaps between cards, 24px section padding
- Consistent with existing dashboard and Tab 1 look

## Navigation

- Progress bar at top: 3 labeled scene circles with connector lines
- Completed scenes clickable to revisit (show checkmark)
- "Back" button on scenes 2-3 (returns to dashboard)
- Primary action buttons per scene advance the narrative
- Scene 3 "Restart Demo" loops back to Scene 1 with fresh state

## Out of Scope

- Real AI/ML integration
- Backend / API routes
- Database / persistent storage
- Authentication
- Mobile responsiveness (desktop-first demo)
- Dark mode
- Real medical accuracy (demo-realistic only)
- Actual ambulance service integration
- EPR system integration
