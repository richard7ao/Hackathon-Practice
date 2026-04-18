# End-of-Life RPM Triage Co-Pilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a frontend-only 3-scene narrative simulation on Tab 2 demonstrating an RPM Triage Co-Pilot for end-of-life elderly care.

**Architecture:** Monolithic "use client" component with scene-based conditional rendering, same pattern as Tab 1 (PostVisit.ai). Two files: `mock-data.ts` for all types and data, `page.tsx` for the single component. All inline styles using existing CSS variables from `globals.css`.

**Tech Stack:** Next.js 15, React 19, TypeScript

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `app/tab-2/mock-data.ts` | Rewrite | Types, 10 mock patients, Dorothy detail, Harold detail, helper constants |
| `app/tab-2/page.tsx` | Rewrite | Narrative simulation component — progress bar, 3 scenes, all state and handlers |
| `app/components/Sidebar.tsx` | Modify line 5 | Update nav label: `"Tab 2"` → `"EoL Triage Co-Pilot"` |
| `app/components/AppShell.tsx` | Modify line 10 | Update page title: `"Tab 2"` → `"EoL Triage Co-Pilot"` |

---

### Task 1: Mock Data Layer

**Files:**
- Rewrite: `app/tab-2/mock-data.ts`

- [ ] **Step 1: Write the complete mock-data.ts file**

```ts
export type Medication = {
  name: string
  dosage: string
  frequency: string
}

export type SymptomTrend = {
  day: string
  painScore: number
  appetite: string
  spO2: number
  mobility: string
}

export type ActionItem = {
  id: string
  label: string
  content: string
}

export type CrisisEvent = {
  time: string
  description: string
}

export type Patient = {
  id: string
  name: string
  age: number
  careSetting: "home" | "care-home" | "hospice-at-home"
  riskLevel: "green" | "amber" | "red"
  reasoning: string
  acpBadge: string
  acpWarning: boolean
  alertCount: number
  sceneTarget?: number
}

export const NURSE_NAME = "Sarah Chen"
export const TOTAL_PATIENTS = 28
export const TOTAL_ALERTS = 147

export const RISK_COLORS: Record<string, string> = {
  green: "#22c55e",
  amber: "#f59e0b",
  red: "#dc3545",
}

export const CARE_SETTING_LABELS: Record<string, string> = {
  home: "Home",
  "care-home": "Care Home",
  "hospice-at-home": "Hospice at Home",
}

export const PATIENTS: Patient[] = [
  {
    id: "harold",
    name: "Harold Nyong'o",
    age: 89,
    careSetting: "care-home",
    riskLevel: "red",
    reasoning:
      "Family called 999 — patient unresponsive. ACP: DNACPR, do not hospitalise.",
    acpBadge: "ACP: no hospitalisation",
    acpWarning: false,
    alertCount: 12,
    sceneTarget: 3,
  },
  {
    id: "dorothy",
    name: "Dorothy Fletcher",
    age: 82,
    careSetting: "home",
    riskLevel: "amber",
    reasoning:
      "Pain score trending 3→6 over 4 days, declining appetite and mobility.",
    acpBadge: "ACP: comfort-focused",
    acpWarning: false,
    alertCount: 18,
    sceneTarget: 2,
  },
  {
    id: "william",
    name: "William Okafor",
    age: 74,
    careSetting: "care-home",
    riskLevel: "amber",
    reasoning:
      "Weight +0.8kg over 3 days, increased breathlessness. ACP: comfort-focused.",
    acpBadge: "ACP: comfort-focused",
    acpWarning: false,
    alertCount: 14,
  },
  {
    id: "beatrice",
    name: "Beatrice Dunn",
    age: 87,
    careSetting: "home",
    riskLevel: "amber",
    reasoning: "Declining mobility, missed 2 check-ins. No ACP on file.",
    acpBadge: "No ACP",
    acpWarning: true,
    alertCount: 8,
  },
  {
    id: "joan",
    name: "Joan Whitfield",
    age: 78,
    careSetting: "home",
    riskLevel: "green",
    reasoning: "All vitals within baseline.",
    acpBadge: "ACP: comfort-focused",
    acpWarning: false,
    alertCount: 15,
  },
  {
    id: "arthur",
    name: "Arthur Pemberton",
    age: 85,
    careSetting: "care-home",
    riskLevel: "green",
    reasoning: "Morning check-in completed, no concerns.",
    acpBadge: "ACP: no hospitalisation",
    acpWarning: false,
    alertCount: 12,
  },
  {
    id: "elsie",
    name: "Elsie Macaulay",
    age: 91,
    careSetting: "hospice-at-home",
    riskLevel: "green",
    reasoning: "Pain managed, sleeping well.",
    acpBadge: "ACP: comfort-focused",
    acpWarning: false,
    alertCount: 10,
  },
  {
    id: "frank",
    name: "Frank Osei",
    age: 76,
    careSetting: "home",
    riskLevel: "green",
    reasoning: "Responding well to new pain regime.",
    acpBadge: "ACP: comfort-focused",
    acpWarning: false,
    alertCount: 16,
  },
  {
    id: "margaret",
    name: "Margaret Liu",
    age: 88,
    careSetting: "care-home",
    riskLevel: "green",
    reasoning: "Weight and vitals consistent.",
    acpBadge: "ACP: no hospitalisation",
    acpWarning: false,
    alertCount: 22,
  },
  {
    id: "robert",
    name: "Robert Kapoor",
    age: 80,
    careSetting: "home",
    riskLevel: "green",
    reasoning: "Good appetite, mobile with frame.",
    acpBadge: "ACP: comfort-focused",
    acpWarning: false,
    alertCount: 20,
  },
]

export const DOROTHY_DETAIL = {
  diagnosis: "Advanced COPD stage 4, comorbid anxiety",
  careSettingDetail: "Home (husband is primary carer)",
  acp: "Comfort-focused, no hospitalisation, DNACPR",
  medications: [
    { name: "Morphine sulfate", dosage: "5mg", frequency: "PRN" },
    { name: "Salbutamol inhaler", dosage: "100mcg", frequency: "As needed" },
    { name: "Lorazepam", dosage: "0.5mg", frequency: "PRN" },
    { name: "Paracetamol", dosage: "1g", frequency: "Four times daily" },
  ] as Medication[],
  rpm: "Pulse oximeter, symptom check-in app",
  trends: [
    {
      day: "Mon",
      painScore: 3,
      appetite: "Normal",
      spO2: 92,
      mobility: "Walked to shops with husband",
    },
    {
      day: "Tue",
      painScore: 4,
      appetite: "Normal",
      spO2: 91,
      mobility: "Walked to kitchen",
    },
    {
      day: "Wed",
      painScore: 5,
      appetite: "Reduced",
      spO2: 92,
      mobility: "Moved around house",
    },
    {
      day: "Thu",
      painScore: 6,
      appetite: "Poor",
      spO2: 91,
      mobility: "Stayed in bed",
    },
  ] as SymptomTrend[],
  reasoning:
    "Rising pain with declining appetite and mobility suggests symptom burden increase. SpO2 stable — not an acute exacerbation. ACP is comfort-focused. Recommend: anticipatory medication review with GP to adjust pain management, and carer welfare check (husband is sole carer).",
  actions: [
    {
      id: "dorothy-gp",
      label: "Approve: Request GP medication review",
      content:
        "Dr. Marsh — Dorothy Fletcher (DOB 12/03/1943), COPD stage 4. Pain trending 3→6 over 4 days, declining appetite and mobility. SpO2 stable. Currently on morphine 5mg PRN. Recommend review of pain management — consider scheduled dosing or dose increase. ACP: comfort-focused.",
    },
    {
      id: "dorothy-carer",
      label: "Approve: Schedule carer welfare call",
      content:
        "Hi Mr. Fletcher, this is Sarah from the community nursing team. I'd like to call today to check in on how things are going at home. Is 2pm convenient?",
    },
  ] as ActionItem[],
}

export const HAROLD_DETAIL = {
  diagnosis: "Advanced dementia, heart failure NYHA IV, frailty score 8/9",
  careSettingDetail: "Meadowbank Care Home",
  acp: "DNACPR, do not hospitalise, preferred place of death: care home. Reviewed 6 weeks ago with daughter (NOK).",
  medications: [
    { name: "Oral morphine", dosage: "2.5mg", frequency: "PRN" },
    {
      name: "Hyoscine patches",
      dosage: "1mg/72hr",
      frequency: "Every 3 days",
    },
    { name: "Midazolam", dosage: "2.5mg", frequency: "PRN" },
  ] as Medication[],
  note: "On end-of-life care pathway since 2 weeks ago",
  timeline: [
    {
      time: "09:47",
      description:
        "Morning check-in: not completed (patient non-responsive)",
    },
    {
      time: "09:52",
      description:
        "Care home staff noted reduced consciousness, called daughter",
    },
    { time: "10:03", description: "Daughter called 999 in distress" },
    { time: "10:05", description: "Ambulance dispatched (Category 2)" },
  ] as CrisisEvent[],
  reasoning:
    "Patient is on an active end-of-life pathway with DNACPR and do-not-hospitalise in place. Reduced consciousness is consistent with expected end-of-life trajectory for advanced dementia + heart failure. Ambulance dispatch may conflict with ACP wishes. Recommend: share ACP with ambulance service, support family through expected decline, dispatch palliative nurse for comfort assessment.",
  actions: [
    {
      id: "harold-ambulance",
      label: "Approve: Share ACP with ambulance service",
      content:
        "Re: Harold Nyong'o, DOB 15/08/1936, Meadowbank Care Home. Active DNACPR and advance care plan — do not hospitalise, comfort care only. Patient on end-of-life pathway (2 weeks). Current presentation consistent with expected decline. Please review dispatch. Community palliative team attending. Contact: Nurse Sarah Chen, 07700 900123.",
    },
    {
      id: "harold-daughter",
      label: "Approve: Call daughter",
      content:
        "Mrs. Nyong'o, this is Sarah from the nursing team. I understand this is very frightening. Your father's care plan, which you helped put in place, says he should stay at Meadowbank where he's comfortable. I'm sending a nurse to assess him now and I'd like to talk you through what's happening.",
    },
    {
      id: "harold-nurse",
      label: "Approve: Dispatch palliative nurse",
      content:
        "Urgent comfort assessment — Harold Nyong'o, Meadowbank Care Home. Reduced consciousness, end-of-life pathway. Family distressed. Assess comfort, administer PRN if needed, support care home staff and family on-site.",
    },
  ] as ActionItem[],
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit app/tab-2/mock-data.ts 2>&1 || echo "Check for errors"`

Check that there are no TypeScript errors. If `tsc --noEmit` fails on a single file, run the full build check: `npm run build 2>&1 | head -30`

- [ ] **Step 3: Commit**

```bash
git add app/tab-2/mock-data.ts
git commit -m "feat(tab-2): add mock data layer for EoL triage co-pilot"
```

---

### Task 2: Page Shell with Progress Bar and Scene 1

**Files:**
- Rewrite: `app/tab-2/page.tsx`

**Context:** This task creates the full page component with all state, handlers, style constants, and the progress bar. It includes the complete Scene 1 (Morning Inbox Dashboard) rendering. Scenes 2 and 3 render `null` — they will be added in Tasks 3 and 4.

- [ ] **Step 1: Write the complete page.tsx**

```tsx
"use client"

import { useState } from "react"
import {
  type Patient,
  PATIENTS,
  NURSE_NAME,
  TOTAL_PATIENTS,
  TOTAL_ALERTS,
  DOROTHY_DETAIL,
  HAROLD_DETAIL,
  CARE_SETTING_LABELS,
  RISK_COLORS,
} from "./mock-data"

const SCENES = [
  { num: 1, label: "Morning Inbox" },
  { num: 2, label: "Comfort Care" },
  { num: 3, label: "999 Crisis" },
]

const card: React.CSSProperties = {
  background: "var(--bg-surface)",
  borderRadius: 12,
  boxShadow: "var(--shadow-sm)",
  padding: 24,
  border: "1px solid var(--border)",
}

const primaryBtn: React.CSSProperties = {
  background: "var(--accent)",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "10px 20px",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
}

const secondaryBtn: React.CSSProperties = {
  background: "transparent",
  color: "var(--text-secondary)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  padding: "10px 20px",
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: "inherit",
}

export default function Tab2() {
  const [scene, setScene] = useState(1)
  const [maxScene, setMaxScene] = useState(1)
  const [actionedCards, setActionedCards] = useState<Record<string, boolean>>({})
  const [approvedActions, setApprovedActions] = useState<
    Record<string, boolean>
  >({})
  const [processingAction, setProcessingAction] = useState<string | null>(null)

  const actionedCount = Object.values(actionedCards).filter(Boolean).length
  const greenActionedCount = PATIENTS.filter(
    (p) => p.riskLevel === "green" && actionedCards[p.id]
  ).length

  function goToScene(target: number) {
    if (target <= maxScene) setScene(target)
  }

  function advanceToScene(target: number) {
    setScene(target)
    setMaxScene((prev) => Math.max(prev, target))
  }

  function handleActionCard(patient: Patient) {
    setActionedCards((prev) => ({ ...prev, [patient.id]: true }))
    if (patient.sceneTarget) {
      advanceToScene(patient.sceneTarget)
    }
  }

  function handleApproveAction(actionId: string) {
    setProcessingAction(actionId)
    const delay = 500 + Math.random() * 500
    setTimeout(() => {
      setApprovedActions((prev) => ({ ...prev, [actionId]: true }))
      setProcessingAction(null)
    }, delay)
  }

  function handleRestart() {
    setScene(1)
    setMaxScene(1)
    setActionedCards({})
    setApprovedActions({})
    setProcessingAction(null)
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Progress Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 32,
        }}
      >
        {SCENES.map((s, i) => (
          <div key={s.num} style={{ display: "flex", alignItems: "center" }}>
            <div
              onClick={() => goToScene(s.num)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: s.num <= maxScene ? "pointer" : "default",
                opacity: s.num <= maxScene ? 1 : 0.4,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 600,
                  background:
                    s.num <= scene ? "var(--accent)" : "var(--bg-hover)",
                  color: s.num <= scene ? "#fff" : "var(--text-secondary)",
                  transition: "all 0.2s",
                }}
              >
                {s.num < scene ? "✓" : s.num}
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: s.num === scene ? 600 : 400,
                  color:
                    s.num === scene
                      ? "var(--accent)"
                      : "var(--text-secondary)",
                }}
              >
                {s.label}
              </span>
            </div>
            {i < SCENES.length - 1 && (
              <div
                style={{
                  width: 48,
                  height: 2,
                  margin: "0 8px",
                  background:
                    s.num < scene ? "var(--accent)" : "var(--border)",
                  transition: "background 0.2s",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Scene 1: Morning Inbox Dashboard */}
      {scene === 1 && (
        <div>
          {/* Greeting Header */}
          <div style={{ ...card, marginBottom: 16 }}>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 4,
              }}
            >
              Good morning, Nurse {NURSE_NAME}
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "var(--text-secondary)",
                marginBottom: 12,
              }}
            >
              {TOTAL_PATIENTS} patients | {TOTAL_ALERTS} overnight alerts →{" "}
              {PATIENTS.length} action cards
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              {(["green", "amber", "red"] as const).map((level) => {
                const count = PATIENTS.filter(
                  (p) => p.riskLevel === level
                ).length
                return (
                  <span
                    key={level}
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: RISK_COLORS[level],
                    }}
                  >
                    {count} {level}
                  </span>
                )
              })}
              {PATIENTS.some((p) => p.acpWarning) && (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: RISK_COLORS.red,
                  }}
                >
                  {PATIENTS.filter((p) => p.acpWarning).length} no ACP
                </span>
              )}
            </div>
          </div>

          {/* Action Counter */}
          <div
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              marginBottom: 12,
              fontWeight: 500,
            }}
          >
            {actionedCount}/{PATIENTS.length} cards actioned
          </div>

          {/* Patient Cards */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            {PATIENTS.map((patient) => {
              const isActioned = actionedCards[patient.id]
              const isClickable = !!patient.sceneTarget
              return (
                <div
                  key={patient.id}
                  onClick={
                    isClickable && !isActioned
                      ? () => handleActionCard(patient)
                      : undefined
                  }
                  style={{
                    ...card,
                    padding: 16,
                    borderLeft: `4px solid ${RISK_COLORS[patient.riskLevel]}`,
                    opacity: isActioned ? 0.5 : 1,
                    cursor:
                      isClickable && !isActioned ? "pointer" : "default",
                    transition: "opacity 0.3s",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    ...(patient.riskLevel === "red" && !isActioned
                      ? { animation: "pulse 2s ease-in-out infinite" }
                      : {}),
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 4,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: "var(--text-primary)",
                        }}
                      >
                        {patient.name}, {patient.age}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          padding: "2px 8px",
                          borderRadius: 12,
                          background: "var(--bg-hover)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {CARE_SETTING_LABELS[patient.careSetting]}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          padding: "2px 8px",
                          borderRadius: 12,
                          background: patient.acpWarning
                            ? "#fef2f2"
                            : "var(--accent-subtle)",
                          color: patient.acpWarning
                            ? "#dc3545"
                            : "var(--accent)",
                          border: patient.acpWarning
                            ? "1px solid #fecaca"
                            : "none",
                        }}
                      >
                        {patient.acpBadge}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--text-secondary)",
                      }}
                    >
                      {patient.reasoning}
                    </p>
                  </div>

                  {!isActioned && !isClickable && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleActionCard(patient)
                      }}
                      style={{
                        ...(patient.riskLevel === "green"
                          ? secondaryBtn
                          : primaryBtn),
                        padding: "6px 14px",
                        fontSize: 12,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {patient.riskLevel === "green"
                        ? "Confirm Stable"
                        : "Review Care Plan"}
                    </button>
                  )}
                  {!isActioned && isClickable && (
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: RISK_COLORS[patient.riskLevel],
                        whiteSpace: "nowrap",
                      }}
                    >
                      {patient.riskLevel === "red"
                        ? "Escalate Now →"
                        : "Review →"}
                    </span>
                  )}
                  {isActioned && (
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--text-muted)",
                        fontWeight: 500,
                      }}
                    >
                      ✓ Done
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Continue Button */}
          {greenActionedCount >= 2 && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 20,
              }}
            >
              <button
                onClick={() => advanceToScene(2)}
                style={primaryBtn}
              >
                Continue to Dorothy Fletcher →
              </button>
            </div>
          )}

          <style>{`@keyframes pulse { 0%, 100% { box-shadow: var(--shadow-sm) } 50% { box-shadow: 0 0 0 4px rgba(220,53,69,0.15), var(--shadow-sm) } }`}</style>
        </div>
      )}

      {/* Scene 2 placeholder — implemented in Task 3 */}
      {scene === 2 && null}

      {/* Scene 3 placeholder — implemented in Task 4 */}
      {scene === 3 && null}
    </div>
  )
}
```

- [ ] **Step 2: Verify dev server renders Scene 1**

Run: `npm run dev`

Navigate to `http://localhost:3000/tab-2`. Expected:
- Progress bar with 3 scenes at top
- Greeting card: "Good morning, Nurse Sarah Chen"
- Summary: "28 patients | 147 overnight alerts → 10 action cards"
- Risk distribution badges
- 10 patient cards sorted red → amber → green
- Red card (Harold) pulses gently
- Clicking green "Confirm Stable" fades the card
- Action counter updates
- "Continue" button appears after 2+ green confirmations

- [ ] **Step 3: Commit**

```bash
git add app/tab-2/page.tsx
git commit -m "feat(tab-2): add page shell with progress bar and Scene 1 morning inbox"
```

---

### Task 3: Scene 2 — Comfort Care Adjustment

**Files:**
- Modify: `app/tab-2/page.tsx`

**Context:** Replace `{scene === 2 && null}` with the full Scene 2 rendering. All state and handlers already exist from Task 2. This task only adds JSX.

- [ ] **Step 1: Replace the Scene 2 placeholder**

Find this line in `app/tab-2/page.tsx`:

```tsx
      {/* Scene 2 placeholder — implemented in Task 3 */}
      {scene === 2 && null}
```

Replace it with:

```tsx
      {/* Scene 2: Comfort Care Adjustment */}
      {scene === 2 && (
        <div>
          <button
            onClick={() => setScene(1)}
            style={{ ...secondaryBtn, marginBottom: 16, fontSize: 13, padding: "6px 14px" }}
          >
            ← Back to dashboard
          </button>

          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            {/* Left: Patient Context */}
            <div style={{ ...card, width: 300, flexShrink: 0 }}>
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: 16,
                }}
              >
                Patient Context
              </h3>
              <div style={{ fontSize: 13, lineHeight: 1.8 }}>
                <div>
                  <span style={{ color: "var(--text-secondary)" }}>Name: </span>
                  <span style={{ fontWeight: 500 }}>Dorothy Fletcher, 82</span>
                </div>
                <div>
                  <span style={{ color: "var(--text-secondary)" }}>Setting: </span>
                  <span style={{ fontWeight: 500 }}>
                    {DOROTHY_DETAIL.careSettingDetail}
                  </span>
                </div>
                <div>
                  <span style={{ color: "var(--text-secondary)" }}>Diagnosis: </span>
                  <span style={{ fontWeight: 500 }}>
                    {DOROTHY_DETAIL.diagnosis}
                  </span>
                </div>
                <div>
                  <span style={{ color: "var(--text-secondary)" }}>ACP: </span>
                  <span style={{ fontWeight: 500 }}>{DOROTHY_DETAIL.acp}</span>
                </div>
                <div style={{ marginTop: 12 }}>
                  <span
                    style={{
                      color: "var(--text-secondary)",
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    Medications:
                  </span>
                  {DOROTHY_DETAIL.medications.map((m, i) => (
                    <div
                      key={i}
                      style={{
                        background: "var(--accent-subtle)",
                        borderRadius: 6,
                        padding: "4px 8px",
                        fontSize: 12,
                        color: "var(--accent)",
                        fontWeight: 500,
                        marginBottom: 4,
                      }}
                    >
                      {m.name} {m.dosage} ({m.frequency})
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 8 }}>
                  <span style={{ color: "var(--text-secondary)" }}>RPM: </span>
                  <span style={{ fontWeight: 500 }}>{DOROTHY_DETAIL.rpm}</span>
                </div>
              </div>
            </div>

            {/* Right: Triage View */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {/* Trend Summary */}
              <div style={card}>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: 16,
                  }}
                >
                  Symptom Trends (4 days)
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  {/* Pain Score */}
                  <div
                    style={{
                      background: "var(--bg-hover)",
                      borderRadius: 8,
                      padding: 12,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                        marginBottom: 8,
                      }}
                    >
                      Pain Score
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      {DOROTHY_DETAIL.trends.map((t, i) => (
                        <div key={i} style={{ textAlign: "center", flex: 1 }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              background:
                                t.painScore >= 5 ? "#fef2f2" : "var(--bg-surface)",
                              border: `2px solid ${t.painScore >= 5 ? "#dc3545" : "#f59e0b"}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 13,
                              fontWeight: 600,
                              color: t.painScore >= 5 ? "#dc3545" : "#f59e0b",
                              margin: "0 auto 4px",
                            }}
                          >
                            {t.painScore}
                          </div>
                          <div
                            style={{ fontSize: 10, color: "var(--text-muted)" }}
                          >
                            {t.day}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Appetite */}
                  <div
                    style={{
                      background: "var(--bg-hover)",
                      borderRadius: 8,
                      padding: 12,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                        marginBottom: 8,
                      }}
                    >
                      Appetite
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      {DOROTHY_DETAIL.trends.map((t, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: 12,
                          }}
                        >
                          <span style={{ color: "var(--text-muted)" }}>
                            {t.day}
                          </span>
                          <span
                            style={{
                              fontWeight: 500,
                              color:
                                t.appetite === "Poor"
                                  ? "#dc3545"
                                  : t.appetite === "Reduced"
                                    ? "#f59e0b"
                                    : "var(--text-primary)",
                            }}
                          >
                            {t.appetite}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SpO2 */}
                  <div
                    style={{
                      background: "var(--bg-hover)",
                      borderRadius: 8,
                      padding: 12,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                        marginBottom: 8,
                      }}
                    >
                      SpO2
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      {DOROTHY_DETAIL.trends.map((t, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: 12,
                          }}
                        >
                          <span style={{ color: "var(--text-muted)" }}>
                            {t.day}
                          </span>
                          <span
                            style={{
                              fontWeight: 500,
                              color: "var(--text-primary)",
                            }}
                          >
                            {t.spO2}%
                          </span>
                        </div>
                      ))}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        marginTop: 4,
                        fontStyle: "italic",
                      }}
                    >
                      Within expected COPD baseline
                    </div>
                  </div>

                  {/* Mobility */}
                  <div
                    style={{
                      background: "var(--bg-hover)",
                      borderRadius: 8,
                      padding: 12,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                        marginBottom: 8,
                      }}
                    >
                      Mobility
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      {DOROTHY_DETAIL.trends.map((t, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: 12,
                          }}
                        >
                          <span style={{ color: "var(--text-muted)" }}>
                            {t.day}
                          </span>
                          <span
                            style={{
                              fontWeight: 500,
                              color: t.mobility.includes("bed")
                                ? "#dc3545"
                                : "var(--text-primary)",
                            }}
                          >
                            {t.mobility}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Co-Pilot Reasoning */}
              <div
                style={{
                  ...card,
                  borderLeft: "4px solid #f59e0b",
                  background: "#fffbeb",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#92400e",
                    marginBottom: 8,
                  }}
                >
                  Co-Pilot Assessment
                </div>
                <p style={{ fontSize: 14, color: "#78350f", lineHeight: 1.6 }}>
                  {DOROTHY_DETAIL.reasoning}
                </p>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {DOROTHY_DETAIL.actions.map((action) => (
                  <div key={action.id} style={card}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 12,
                      }}
                    >
                      <h4
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "var(--text-primary)",
                        }}
                      >
                        {action.label}
                      </h4>
                      {approvedActions[action.id] ? (
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#22c55e",
                          }}
                        >
                          Sent ✓
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApproveAction(action.id)}
                          disabled={processingAction !== null}
                          style={{
                            ...primaryBtn,
                            padding: "6px 14px",
                            fontSize: 12,
                            opacity: processingAction !== null ? 0.6 : 1,
                          }}
                        >
                          {processingAction === action.id
                            ? "Sending..."
                            : "Approve"}
                        </button>
                      )}
                    </div>
                    <div
                      style={{
                        background: "var(--bg-hover)",
                        borderRadius: 8,
                        padding: 12,
                        fontSize: 13,
                        color: "var(--text-secondary)",
                        lineHeight: 1.6,
                        fontStyle: "italic",
                      }}
                    >
                      {action.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue to Scene 3 */}
              {DOROTHY_DETAIL.actions.every(
                (a) => approvedActions[a.id]
              ) && (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => advanceToScene(3)}
                    style={primaryBtn}
                  >
                    Continue to next alert →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
```

- [ ] **Step 2: Verify Scene 2 renders correctly**

Run the dev server and navigate to `http://localhost:3000/tab-2`.
- Click Dorothy's amber card (or confirm 2 greens then click Continue)
- Expected: Split layout with patient context on left, trends grid on right
- Verify: 4-day pain scores show as circles (3, 4, 5, 6), colors change at 5+
- Verify: Appetite shows Normal → Normal → Reduced → Poor with color coding
- Verify: SpO2 shows stable 91-92% with baseline note
- Verify: Mobility shows declining with red for "Stayed in bed"
- Verify: Amber reasoning box with co-pilot text
- Verify: Two action cards with "Approve" buttons
- Click Approve on first action → shows "Sending..." then "Sent ✓"
- Click Approve on second action → "Continue to next alert →" appears
- Progress bar shows Scene 2 highlighted

- [ ] **Step 3: Commit**

```bash
git add app/tab-2/page.tsx
git commit -m "feat(tab-2): add Scene 2 comfort care adjustment with trends and actions"
```

---

### Task 4: Scene 3 — Family 999 Crisis

**Files:**
- Modify: `app/tab-2/page.tsx`

**Context:** Replace `{scene === 3 && null}` with the full Scene 3 rendering. All state and handlers already exist from Task 2.

- [ ] **Step 1: Replace the Scene 3 placeholder**

Find this line in `app/tab-2/page.tsx`:

```tsx
      {/* Scene 3 placeholder — implemented in Task 4 */}
      {scene === 3 && null}
```

Replace it with:

```tsx
      {/* Scene 3: Family 999 Crisis */}
      {scene === 3 && (
        <div>
          {/* Alert Banner */}
          <div
            style={{
              background: "#dc3545",
              color: "#fff",
              borderRadius: 12,
              padding: "16px 24px",
              marginBottom: 16,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            URGENT — Harold Nyong&apos;o, 89, Meadowbank Care Home. Family
            called 999 — patient unresponsive. Ambulance dispatched (Cat 2).
          </div>

          <button
            onClick={() => setScene(1)}
            style={{ ...secondaryBtn, marginBottom: 16, fontSize: 13, padding: "6px 14px" }}
          >
            ← Back to dashboard
          </button>

          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            {/* Left: Patient Context */}
            <div style={{ ...card, width: 300, flexShrink: 0 }}>
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: 16,
                }}
              >
                Patient Context
              </h3>
              <div style={{ fontSize: 13, lineHeight: 1.8 }}>
                <div>
                  <span style={{ color: "var(--text-secondary)" }}>Name: </span>
                  <span style={{ fontWeight: 500 }}>
                    Harold Nyong&apos;o, 89
                  </span>
                </div>
                <div>
                  <span style={{ color: "var(--text-secondary)" }}>
                    Setting:{" "}
                  </span>
                  <span style={{ fontWeight: 500 }}>
                    {HAROLD_DETAIL.careSettingDetail}
                  </span>
                </div>
                <div>
                  <span style={{ color: "var(--text-secondary)" }}>
                    Diagnosis:{" "}
                  </span>
                  <span style={{ fontWeight: 500 }}>
                    {HAROLD_DETAIL.diagnosis}
                  </span>
                </div>
                <div
                  style={{
                    marginTop: 8,
                    padding: 8,
                    background: "#fef2f2",
                    borderRadius: 8,
                    border: "1px solid #fecaca",
                  }}
                >
                  <span
                    style={{
                      color: "#991b1b",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    ACP:{" "}
                  </span>
                  <span style={{ color: "#991b1b", fontSize: 12 }}>
                    {HAROLD_DETAIL.acp}
                  </span>
                </div>
                <div style={{ marginTop: 12 }}>
                  <span
                    style={{
                      color: "var(--text-secondary)",
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    Medications:
                  </span>
                  {HAROLD_DETAIL.medications.map((m, i) => (
                    <div
                      key={i}
                      style={{
                        background: "var(--accent-subtle)",
                        borderRadius: 6,
                        padding: "4px 8px",
                        fontSize: 12,
                        color: "var(--accent)",
                        fontWeight: 500,
                        marginBottom: 4,
                      }}
                    >
                      {m.name} {m.dosage} ({m.frequency})
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    padding: 8,
                    background: "#fef2f2",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "#991b1b",
                    fontWeight: 500,
                  }}
                >
                  {HAROLD_DETAIL.note}
                </div>
              </div>
            </div>

            {/* Right: Crisis View */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {/* Timeline */}
              <div style={card}>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: 16,
                  }}
                >
                  What Happened
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {HAROLD_DETAIL.timeline.map((event, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--text-muted)",
                          minWidth: 48,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {event.time}
                      </span>
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background:
                            i === HAROLD_DETAIL.timeline.length - 1
                              ? "#dc3545"
                              : "var(--border)",
                          marginTop: 4,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 13,
                          color:
                            i === HAROLD_DETAIL.timeline.length - 1
                              ? "#dc3545"
                              : "var(--text-primary)",
                          fontWeight:
                            i === HAROLD_DETAIL.timeline.length - 1
                              ? 600
                              : 400,
                        }}
                      >
                        {event.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Co-Pilot Reasoning */}
              <div
                style={{
                  ...card,
                  borderLeft: "4px solid #dc3545",
                  background: "#fef2f2",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#991b1b",
                    marginBottom: 8,
                  }}
                >
                  Co-Pilot Assessment — URGENT
                </div>
                <p
                  style={{ fontSize: 14, color: "#7f1d1d", lineHeight: 1.6 }}
                >
                  {HAROLD_DETAIL.reasoning}
                </p>
              </div>

              {/* Actions or Completion Summary */}
              {!HAROLD_DETAIL.actions.every(
                (a) => approvedActions[a.id]
              ) ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  {HAROLD_DETAIL.actions.map((action) => (
                    <div key={action.id} style={card}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 12,
                        }}
                      >
                        <h4
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "var(--text-primary)",
                          }}
                        >
                          {action.label}
                        </h4>
                        {approvedActions[action.id] ? (
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: "#22c55e",
                            }}
                          >
                            Sent ✓
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApproveAction(action.id)}
                            disabled={processingAction !== null}
                            style={{
                              ...primaryBtn,
                              padding: "6px 14px",
                              fontSize: 12,
                              opacity:
                                processingAction !== null ? 0.6 : 1,
                            }}
                          >
                            {processingAction === action.id
                              ? "Sending..."
                              : "Approve"}
                          </button>
                        )}
                      </div>
                      <div
                        style={{
                          background: "var(--bg-hover)",
                          borderRadius: 8,
                          padding: 12,
                          fontSize: 13,
                          color: "var(--text-secondary)",
                          lineHeight: 1.6,
                          fontStyle: "italic",
                        }}
                      >
                        {action.content}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    ...card,
                    borderLeft: "4px solid #22c55e",
                    background: "#f0fdf4",
                  }}
                >
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#166534",
                      marginBottom: 8,
                    }}
                  >
                    Crisis Managed
                  </h3>
                  <div
                    style={{
                      fontSize: 14,
                      color: "#15803d",
                      lineHeight: 1.8,
                    }}
                  >
                    <div>✓ ACP upheld</div>
                    <div>✓ Ambulance service notified</div>
                    <div>✓ Family contacted</div>
                    <div>✓ Palliative nurse dispatched</div>
                  </div>
                  <div
                    style={{ display: "flex", gap: 12, marginTop: 16 }}
                  >
                    <button
                      onClick={() => setScene(1)}
                      style={secondaryBtn}
                    >
                      Return to dashboard
                    </button>
                    <button onClick={handleRestart} style={primaryBtn}>
                      Restart Demo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
```

- [ ] **Step 2: Verify Scene 3 renders correctly**

Run the dev server and navigate to `http://localhost:3000/tab-2`.
- Navigate to Scene 3 (click Harold's red card, or go through Scenes 1→2→3)
- Expected: Red alert banner at top
- Verify: Patient context card with ACP highlighted in red
- Verify: Timeline shows 4 events with timestamps, last event (ambulance) in red
- Verify: Red reasoning box with "URGENT" label
- Verify: Three action cards with "Approve" buttons
- Click Approve on each action sequentially → "Sending..." then "Sent ✓"
- After all 3 approved: Green "Crisis Managed" summary card appears
- Verify: "Return to dashboard" goes to Scene 1 (preserves state)
- Verify: "Restart Demo" goes to Scene 1 (clears all state)
- Verify: Progress bar shows all 3 scenes completed with checkmarks

- [ ] **Step 3: Commit**

```bash
git add app/tab-2/page.tsx
git commit -m "feat(tab-2): add Scene 3 family 999 crisis with ACP surfacing and actions"
```

---

### Task 5: Update Navigation Labels

**Files:**
- Modify: `app/components/Sidebar.tsx:5`
- Modify: `app/components/AppShell.tsx:10`

- [ ] **Step 1: Update Sidebar nav label**

In `app/components/Sidebar.tsx`, find line 5:

```ts
  { href: "/tab-2", label: "Tab 2" },
```

Replace with:

```ts
  { href: "/tab-2", label: "EoL Triage Co-Pilot" },
```

- [ ] **Step 2: Update AppShell page title**

In `app/components/AppShell.tsx`, find line 10:

```ts
  "/tab-2": "Tab 2",
```

Replace with:

```ts
  "/tab-2": "EoL Triage Co-Pilot",
```

- [ ] **Step 3: Verify labels display correctly**

Navigate to `http://localhost:3000/tab-2`. Expected:
- Sidebar shows "EoL Triage Co-Pilot" instead of "Tab 2"
- Top bar shows "EoL Triage Co-Pilot" as the page title
- Active state styling (accent color, left border) still works

- [ ] **Step 4: Commit**

```bash
git add app/components/Sidebar.tsx app/components/AppShell.tsx
git commit -m "feat: update Tab 2 labels to EoL Triage Co-Pilot"
```
