# PostVisit.ai Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a frontend-only 4-step wizard demo on Tab 1 that simulates PostVisit.ai's agentic patient care platform.

**Architecture:** Monolithic `"use client"` page component with step-based rendering. All mock data and simulated AI in a separate `mock-data.ts` file. No backend, no database — pure React state.

**Tech Stack:** Next.js 15, React 19, TypeScript, inline styles with CSS variables from `globals.css`

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `app/tab-1/mock-data.ts` | Create | Types, default values, care plan generator, chat response engine, adherence helpers |
| `app/tab-1/page.tsx` | Rewrite | Wizard component: progress bar, 4 step views, all state and handlers |
| `app/components/AppShell.tsx` | Modify line 9 | Update page title from "Tab 1" to "PostVisit.ai" |
| `app/components/Sidebar.tsx` | Modify line 5 | Update nav label from "Tab 1" to "PostVisit.ai" |

---

### Task 1: Create mock-data.ts

**Files:**
- Create: `app/tab-1/mock-data.ts`

- [ ] **Step 1: Create mock-data.ts with all types, defaults, and logic**

```ts
export type Medication = {
  name: string
  dosage: string
  frequency: string
}

export type VisitData = {
  patientName: string
  age: number
  diagnosis: string
  medications: Medication[]
  instructions: string
  followUpDate: string
}

export type MedicationScheduleItem = {
  drug: string
  dose: string
  timeOfDay: string
  specialInstructions: string
}

export type DailyRoutine = {
  morning: string[]
  afternoon: string[]
  evening: string[]
}

export type TimelineEvent = {
  day: number
  label: string
}

export type CarePlan = {
  medicationSchedule: MedicationScheduleItem[]
  dailyRoutine: DailyRoutine
  warningSigns: string[]
  timeline: TimelineEvent[]
}

export type ChatMessage = {
  role: "assistant" | "user"
  content: string
}

export type AdherenceTask = {
  id: string
  label: string
}

function getFutureDate(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split("T")[0]
}

export const DEFAULT_VISIT_DATA: VisitData = {
  patientName: "Maria Santos",
  age: 62,
  diagnosis: "Hypertension Stage 2, Type 2 Diabetes",
  medications: [
    { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
    { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
    { name: "Amlodipine", dosage: "5mg", frequency: "Once daily" },
  ],
  instructions:
    "Low sodium diet, 30 min walking daily, monitor blood glucose before meals",
  followUpDate: getFutureDate(14),
}

const MED_INSTRUCTIONS: Record<string, string> = {
  Lisinopril: "Take on empty stomach. Avoid potassium supplements.",
  Metformin: "Take with food to reduce stomach upset.",
  Amlodipine: "May cause mild ankle swelling. Take at same time each day.",
}

export function generateCarePlan(visit: VisitData): CarePlan {
  return {
    medicationSchedule: visit.medications.map((med) => ({
      drug: med.name,
      dose: med.dosage,
      timeOfDay: med.frequency.toLowerCase().includes("twice")
        ? "Morning & Evening"
        : "Morning",
      specialInstructions:
        MED_INSTRUCTIONS[med.name] || "Follow prescriber directions.",
    })),
    dailyRoutine: {
      morning: [
        "Check blood pressure",
        "Take morning medications with breakfast",
        "Monitor blood glucose",
      ],
      afternoon: [
        "30 minute walk",
        "Healthy low-sodium lunch",
        "Light stretching",
      ],
      evening: [
        "Take evening medications if applicable",
        "Log daily vitals",
        "Prepare low-sodium dinner",
      ],
    },
    warningSigns: [
      "Blood pressure above 180/120 — seek immediate care",
      "Blood glucose below 70 mg/dL — eat fast-acting sugar, call doctor",
      "Persistent dizziness or fainting spells",
      "Unusual swelling in legs or feet",
      "Chest pain or shortness of breath — call 911",
    ],
    timeline: [
      { day: 1, label: "Start care plan" },
      { day: 3, label: "First vitals check-in" },
      { day: 7, label: "Week 1 review" },
      { day: 10, label: "Medication tolerance check" },
      { day: 14, label: "Follow-up with Dr. Chen" },
    ],
  }
}

export function getWelcomeMessage(visit: VisitData): string {
  const firstName = visit.patientName.split(" ")[0]
  return `Hi ${firstName}, I'm your PostVisit assistant. I have your care plan from Dr. Chen for managing your ${visit.diagnosis.toLowerCase()}. What questions do you have?`
}

export const SUGGESTED_QUESTIONS = [
  "Side effects?",
  "What can I eat?",
  "When should I worry?",
  "My exercise plan",
]

export function getChatResponse(input: string, visit: VisitData): string {
  const lower = input.toLowerCase()
  const firstName = visit.patientName.split(" ")[0]

  if (lower.includes("side effect")) {
    return `Great question, ${firstName}. Here are the key side effects to watch for with your current medications:\n\n• Lisinopril: Dry cough, dizziness, elevated potassium. Avoid salt substitutes.\n• Metformin: Stomach upset, nausea (usually improves after 1-2 weeks). Take with food.\n• Amlodipine: Ankle swelling, flushing, headache.\n\nIf any of these become severe or persistent, contact Dr. Chen's office before your follow-up.`
  }

  if (
    lower.includes("eat") ||
    lower.includes("diet") ||
    lower.includes("food")
  ) {
    return `For managing both hypertension and diabetes, ${firstName}, here's what I recommend:\n\nFoods to enjoy:\n• Fresh vegetables, leafy greens, berries\n• Whole grains (brown rice, oats, quinoa)\n• Lean proteins (chicken, fish, legumes)\n• Healthy fats (olive oil, avocado, nuts)\n\nFoods to limit:\n• Sodium — aim for under 1,500mg/day\n• Refined sugars and white bread\n• Processed meats and canned soups\n• Sugary drinks\n\nSmall, consistent changes make the biggest difference.`
  }

  if (
    lower.includes("exercise") ||
    lower.includes("walk") ||
    lower.includes("activity")
  ) {
    return `Your care plan includes 30 minutes of walking daily, ${firstName}. Here's how to build up safely:\n\nWeek 1: Start with 15-minute walks at a comfortable pace\nWeek 2: Increase to 20-25 minutes, slightly brisker\nWeeks 3-4: Work up to 30 minutes at moderate pace\n\nTips:\n• Walk after meals to help with blood sugar\n• Wear supportive shoes\n• Check blood pressure before and after exercise initially\n• Stop if you feel dizzy, short of breath, or have chest discomfort\n\nConsistency matters more than intensity at this stage.`
  }

  if (
    lower.includes("worry") ||
    lower.includes("emergency") ||
    lower.includes("call") ||
    lower.includes("danger")
  ) {
    return `${firstName}, here's when you should seek immediate help:\n\nCall 911:\n• Chest pain or tightness\n• Difficulty breathing\n• Signs of stroke (face drooping, arm weakness, speech difficulty)\n\nCall Dr. Chen's office:\n• Blood pressure consistently above 160/100\n• Blood glucose below 70 mg/dL or above 300 mg/dL\n• Persistent dizziness or fainting\n• Severe medication side effects\n• Unusual leg swelling\n\nDon't hesitate to call — it's always better to check.`
  }

  if (
    lower.includes("medication") ||
    lower.includes("med") ||
    lower.includes("drug") ||
    lower.includes("pill")
  ) {
    const medList = visit.medications
      .map(
        (m) =>
          `• ${m.name} (${m.dosage}, ${m.frequency.toLowerCase()}): ${MED_INSTRUCTIONS[m.name] || "Follow prescriber directions."}`
      )
      .join("\n")
    return `Here's your current medication overview, ${firstName}:\n\n${medList}\n\nImportant: Never skip doses or stop medications without talking to Dr. Chen first, even if you feel better.`
  }

  return `That's a great question, ${firstName}. Based on your care plan, I'd recommend discussing this with Dr. Chen at your follow-up on ${visit.followUpDate}. In the meantime, you can reach the office at (555) 234-5678 for urgent concerns.`
}

export function getAdherenceTasks(visit: VisitData): AdherenceTask[] {
  return [
    ...visit.medications.map((m) => ({
      id: `med-${m.name.toLowerCase()}`,
      label: `${m.name} ${m.dosage}`,
    })),
    { id: "exercise", label: "30 min walk" },
    { id: "vitals", label: "Log vitals" },
  ]
}

export function getDefaultAdherence(
  tasks: AdherenceTask[],
  days: number
): Record<string, Record<string, boolean>> {
  const result: Record<string, Record<string, boolean>> = {}
  for (let d = 1; d <= days; d++) {
    result[`day-${d}`] = {}
    for (const task of tasks) {
      if (d === 1) result[`day-${d}`][task.id] = true
      else if (d === 2)
        result[`day-${d}`][task.id] = task.id !== "exercise"
      else if (d === 3)
        result[`day-${d}`][task.id] = task.id.startsWith("med-")
      else result[`day-${d}`][task.id] = false
    }
  }
  return result
}

export const AI_NUDGES = [
  {
    icon: "\uD83D\uDC8A",
    text: "Time for your evening Metformin",
    time: "6:00 PM",
  },
  {
    icon: "\u2764\uFE0F",
    text: "You haven't logged blood pressure today",
    time: "2:30 PM",
  },
  {
    icon: "\uD83C\uDF89",
    text: "Great job — 3 day streak on your walking goal!",
    time: "10:00 AM",
  },
]
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/richardlao/Documents/Github/Personal/Hackathon-Practice && npx tsc --noEmit app/tab-1/mock-data.ts --esModuleInterop --module esnext --moduleResolution bundler --target es2017 --strict`

Expected: No errors (or only import-related warnings that Next.js handles)

- [ ] **Step 3: Commit**

```bash
git add app/tab-1/mock-data.ts
git commit -m "feat: add PostVisit.ai mock data and simulated AI logic"
```

---

### Task 2: Build wizard shell with progress bar and Step 1 form

**Files:**
- Rewrite: `app/tab-1/page.tsx`

- [ ] **Step 1: Replace page.tsx with wizard skeleton including Step 1 form**

Replace the entire contents of `app/tab-1/page.tsx` with:

```tsx
"use client"

import { useState, useRef, useEffect } from "react"
import {
  type VisitData,
  type CarePlan,
  type ChatMessage,
  type AdherenceTask,
  DEFAULT_VISIT_DATA,
  generateCarePlan,
  getWelcomeMessage,
  SUGGESTED_QUESTIONS,
  getChatResponse,
  getAdherenceTasks,
  getDefaultAdherence,
  AI_NUDGES,
} from "./mock-data"

const STEPS = [
  { num: 1, label: "Visit Summary" },
  { num: 2, label: "Care Plan" },
  { num: 3, label: "Patient Chat" },
  { num: 4, label: "Adherence" },
]

const card: React.CSSProperties = {
  background: "var(--bg-surface)",
  borderRadius: 12,
  boxShadow: "var(--shadow-sm)",
  padding: 24,
  border: "1px solid var(--border)",
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid var(--border)",
  fontSize: 14,
  fontFamily: "inherit",
  color: "var(--text-primary)",
  background: "var(--bg-surface)",
  outline: "none",
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

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "var(--text-secondary)",
  marginBottom: 6,
  display: "block",
}

export default function Tab1() {
  const [step, setStep] = useState(1)
  const [maxStep, setMaxStep] = useState(1)
  const [visitData, setVisitData] = useState<VisitData>({
    ...DEFAULT_VISIT_DATA,
  })
  const [carePlan, setCarePlan] = useState<CarePlan | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [adherence, setAdherence] = useState<
    Record<string, Record<string, boolean>>
  >({})
  const [adherenceTasks, setAdherenceTasks] = useState<AdherenceTask[]>([])
  const chatEndRef = useRef<HTMLDivElement>(null)

  function goToStep(target: number) {
    if (target <= maxStep) setStep(target)
  }

  function handleNext() {
    if (step === 1) {
      setStep(2)
      setMaxStep((prev) => Math.max(prev, 2))
      setIsGenerating(true)
      setTimeout(() => {
        setCarePlan(generateCarePlan(visitData))
        setIsGenerating(false)
      }, 1500)
    } else if (step === 2) {
      setChatMessages([
        { role: "assistant", content: getWelcomeMessage(visitData) },
      ])
      setStep(3)
      setMaxStep((prev) => Math.max(prev, 3))
    } else if (step === 3) {
      const tasks = getAdherenceTasks(visitData)
      setAdherenceTasks(tasks)
      setAdherence(getDefaultAdherence(tasks, 7))
      setStep(4)
      setMaxStep((prev) => Math.max(prev, 4))
    }
  }

  function handleBack() {
    if (step > 1) setStep(step - 1)
  }

  function handleRestart() {
    setStep(1)
    setMaxStep(1)
    setVisitData({ ...DEFAULT_VISIT_DATA })
    setCarePlan(null)
    setChatMessages([])
    setChatInput("")
    setAdherence({})
    setAdherenceTasks([])
    setIsGenerating(false)
    setIsTyping(false)
  }

  function handleSendMessage(text: string) {
    if (!text.trim()) return
    setChatMessages((prev) => [...prev, { role: "user", content: text.trim() }])
    setChatInput("")
    setIsTyping(true)
    const delay = 800 + Math.random() * 400
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: getChatResponse(text, visitData) },
      ])
      setIsTyping(false)
    }, delay)
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages, isTyping])

  function toggleAdherence(dayKey: string, taskId: string) {
    setAdherence((prev) => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], [taskId]: !prev[dayKey][taskId] },
    }))
  }

  function updateMedication(
    index: number,
    field: keyof VisitData["medications"][0],
    value: string
  ) {
    setVisitData((prev) => ({
      ...prev,
      medications: prev.medications.map((m, i) =>
        i === index ? { ...m, [field]: value } : m
      ),
    }))
  }

  function addMedication() {
    setVisitData((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        { name: "", dosage: "", frequency: "" },
      ],
    }))
  }

  function removeMedication(index: number) {
    setVisitData((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }))
  }

  const nextLabel =
    step === 1
      ? "Generate Care Plan →"
      : step === 2
        ? "Continue as Patient →"
        : step === 3
          ? "View Adherence →"
          : ""

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
        {STEPS.map((s, i) => (
          <div key={s.num} style={{ display: "flex", alignItems: "center" }}>
            <div
              onClick={() => goToStep(s.num)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: s.num <= maxStep ? "pointer" : "default",
                opacity: s.num <= maxStep ? 1 : 0.4,
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
                    s.num <= step ? "var(--accent)" : "var(--bg-hover)",
                  color: s.num <= step ? "#fff" : "var(--text-secondary)",
                  transition: "all 0.2s",
                }}
              >
                {s.num < step ? "✓" : s.num}
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: s.num === step ? 600 : 400,
                  color:
                    s.num === step
                      ? "var(--accent)"
                      : "var(--text-secondary)",
                }}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                style={{
                  width: 48,
                  height: 2,
                  margin: "0 8px",
                  background:
                    s.num < step ? "var(--accent)" : "var(--border)",
                  transition: "background 0.2s",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Doctor Visit Summary */}
      {step === 1 && (
        <div style={card}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: 4,
            }}
          >
            Doctor Visit Summary
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              marginBottom: 24,
            }}
          >
            Enter the patient visit details. Pre-filled with demo data for
            quick walkthrough.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 20,
            }}
          >
            <div>
              <label style={labelStyle}>Patient Name</label>
              <input
                style={inputStyle}
                value={visitData.patientName}
                onChange={(e) =>
                  setVisitData((p) => ({
                    ...p,
                    patientName: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label style={labelStyle}>Age</label>
              <input
                style={inputStyle}
                type="number"
                value={visitData.age}
                onChange={(e) =>
                  setVisitData((p) => ({
                    ...p,
                    age: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Diagnosis</label>
            <input
              style={inputStyle}
              value={visitData.diagnosis}
              onChange={(e) =>
                setVisitData((p) => ({ ...p, diagnosis: e.target.value }))
              }
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Medications</label>
            {visitData.medications.map((med, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 100px 120px auto",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <input
                  style={inputStyle}
                  placeholder="Drug name"
                  value={med.name}
                  onChange={(e) =>
                    updateMedication(i, "name", e.target.value)
                  }
                />
                <input
                  style={inputStyle}
                  placeholder="Dosage"
                  value={med.dosage}
                  onChange={(e) =>
                    updateMedication(i, "dosage", e.target.value)
                  }
                />
                <input
                  style={inputStyle}
                  placeholder="Frequency"
                  value={med.frequency}
                  onChange={(e) =>
                    updateMedication(i, "frequency", e.target.value)
                  }
                />
                <button
                  onClick={() => removeMedication(i)}
                  style={{
                    ...secondaryBtn,
                    padding: "8px 12px",
                    color: "#e74c3c",
                    borderColor: "#e74c3c33",
                  }}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={addMedication}
              style={{
                ...secondaryBtn,
                fontSize: 13,
                padding: "6px 14px",
                marginTop: 4,
              }}
            >
              + Add Medication
            </button>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Lifestyle Instructions</label>
            <textarea
              style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
              value={visitData.instructions}
              onChange={(e) =>
                setVisitData((p) => ({
                  ...p,
                  instructions: e.target.value,
                }))
              }
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={labelStyle}>Follow-Up Date</label>
            <input
              style={{ ...inputStyle, maxWidth: 200 }}
              type="date"
              value={visitData.followUpDate}
              onChange={(e) =>
                setVisitData((p) => ({
                  ...p,
                  followUpDate: e.target.value,
                }))
              }
            />
          </div>
        </div>
      )}

      {/* Step 2: placeholder */}
      {step === 2 && (
        <div style={card}>
          <p style={{ color: "var(--text-secondary)" }}>
            Step 2 — Care Plan (coming next)
          </p>
        </div>
      )}

      {/* Step 3: placeholder */}
      {step === 3 && (
        <div style={card}>
          <p style={{ color: "var(--text-secondary)" }}>
            Step 3 — Patient Chat (coming next)
          </p>
        </div>
      )}

      {/* Step 4: placeholder */}
      {step === 4 && (
        <div style={card}>
          <p style={{ color: "var(--text-secondary)" }}>
            Step 4 — Adherence Dashboard (coming next)
          </p>
        </div>
      )}

      {/* Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 24,
        }}
      >
        {step > 1 && step <= 4 ? (
          <button onClick={handleBack} style={secondaryBtn}>
            ← Back
          </button>
        ) : (
          <div />
        )}
        {step < 4 ? (
          <button
            onClick={handleNext}
            disabled={isGenerating}
            style={{
              ...primaryBtn,
              opacity: isGenerating ? 0.6 : 1,
            }}
          >
            {nextLabel}
          </button>
        ) : (
          <button onClick={handleRestart} style={primaryBtn}>
            Restart Demo
          </button>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Start dev server and verify Step 1 renders**

Run: `npm run dev`

Open `http://localhost:3000/tab-1`. Verify:
- Progress bar shows 4 steps, step 1 highlighted
- Form is visible with pre-filled data (Maria Santos, 62, medications, etc.)
- Fields are editable
- Add/remove medication rows work
- "Generate Care Plan →" button is visible

- [ ] **Step 3: Commit**

```bash
git add app/tab-1/page.tsx
git commit -m "feat: add PostVisit.ai wizard shell with Step 1 doctor form"
```

---

### Task 3: Build Step 2 — Care Plan Display

**Files:**
- Modify: `app/tab-1/page.tsx` — replace Step 2 placeholder

- [ ] **Step 1: Replace Step 2 placeholder with care plan display**

In `app/tab-1/page.tsx`, find and replace this block:

```tsx
      {/* Step 2: placeholder */}
      {step === 2 && (
        <div style={card}>
          <p style={{ color: "var(--text-secondary)" }}>
            Step 2 — Care Plan (coming next)
          </p>
        </div>
      )}
```

Replace with:

```tsx
      {/* Step 2: AI-Generated Care Plan */}
      {step === 2 && (
        <div style={card}>
          {isGenerating ? (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  border: "3px solid var(--border)",
                  borderTopColor: "var(--accent)",
                  animation: "spin 0.8s linear infinite",
                  margin: "0 auto 16px",
                }}
              />
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                Analyzing visit data...
              </p>
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
          ) : carePlan ? (
            <div>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: 4,
                }}
              >
                Care Plan for {visitData.patientName}
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  marginBottom: 24,
                }}
              >
                Generated based on visit summary — {visitData.diagnosis}
              </p>

              {/* Medication Schedule */}
              <div style={{ marginBottom: 24 }}>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: 12,
                  }}
                >
                  Medication Schedule
                </h3>
                <div
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 80px 120px 1fr",
                      background: "var(--bg-hover)",
                      padding: "8px 12px",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    <span>Drug</span>
                    <span>Dose</span>
                    <span>Time</span>
                    <span>Instructions</span>
                  </div>
                  {carePlan.medicationSchedule.map((med, i) => (
                    <div
                      key={i}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 80px 120px 1fr",
                        padding: "10px 12px",
                        fontSize: 14,
                        borderTop: "1px solid var(--border)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>{med.drug}</span>
                      <span>{med.dose}</span>
                      <span>{med.timeOfDay}</span>
                      <span style={{ color: "var(--text-secondary)" }}>
                        {med.specialInstructions}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Routine */}
              <div style={{ marginBottom: 24 }}>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: 12,
                  }}
                >
                  Daily Routine
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 12,
                  }}
                >
                  {(
                    ["morning", "afternoon", "evening"] as const
                  ).map((period) => (
                    <div
                      key={period}
                      style={{
                        background: "var(--bg-hover)",
                        borderRadius: 8,
                        padding: 16,
                      }}
                    >
                      <h4
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--accent)",
                          textTransform: "capitalize",
                          marginBottom: 8,
                        }}
                      >
                        {period}
                      </h4>
                      {carePlan.dailyRoutine[period].map((item, i) => (
                        <div
                          key={i}
                          style={{
                            fontSize: 13,
                            color: "var(--text-primary)",
                            padding: "4px 0",
                            display: "flex",
                            gap: 8,
                          }}
                        >
                          <span style={{ color: "var(--text-muted)" }}>
                            •
                          </span>
                          {item}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning Signs */}
              <div style={{ marginBottom: 24 }}>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: 12,
                  }}
                >
                  Warning Signs
                </h3>
                <div
                  style={{
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: 8,
                    padding: 16,
                  }}
                >
                  {carePlan.warningSigns.map((sign, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: 13,
                        color: "#991b1b",
                        padding: "4px 0",
                        display: "flex",
                        gap: 8,
                      }}
                    >
                      <span>⚠</span>
                      {sign}
                    </div>
                  ))}
                </div>
              </div>

              {/* Follow-Up Timeline */}
              <div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: 12,
                  }}
                >
                  Follow-Up Timeline
                </h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0,
                    padding: "8px 0",
                  }}
                >
                  {carePlan.timeline.map((event, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flex: 1,
                      }}
                    >
                      <div style={{ textAlign: "center", minWidth: 80 }}>
                        <div
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: "var(--accent)",
                            margin: "0 auto 6px",
                          }}
                        />
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: "var(--accent)",
                          }}
                        >
                          Day {event.day}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--text-secondary)",
                          }}
                        >
                          {event.label}
                        </div>
                      </div>
                      {i < carePlan.timeline.length - 1 && (
                        <div
                          style={{
                            flex: 1,
                            height: 2,
                            background: "var(--border)",
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
```

- [ ] **Step 2: Verify in browser**

Navigate to `/tab-1`. Click "Generate Care Plan →". Verify:
- Spinning loader appears with "Analyzing visit data..." text
- After 1.5s, care plan renders with medication table, daily routine cards, warning signs, timeline
- All data matches what was entered in Step 1

- [ ] **Step 3: Commit**

```bash
git add app/tab-1/page.tsx
git commit -m "feat: add Step 2 care plan display with simulated AI generation"
```

---

### Task 4: Build Step 3 — Patient Chat

**Files:**
- Modify: `app/tab-1/page.tsx` — replace Step 3 placeholder

- [ ] **Step 1: Replace Step 3 placeholder with chat interface**

In `app/tab-1/page.tsx`, find and replace this block:

```tsx
      {/* Step 3: placeholder */}
      {step === 3 && (
        <div style={card}>
          <p style={{ color: "var(--text-secondary)" }}>
            Step 3 — Patient Chat (coming next)
          </p>
        </div>
      )}
```

Replace with:

```tsx
      {/* Step 3: Patient Chat */}
      {step === 3 && (
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          {/* Patient Context Card */}
          <div style={{ ...card, width: 280, flexShrink: 0 }}>
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
                  {visitData.patientName}
                </span>
              </div>
              <div>
                <span style={{ color: "var(--text-secondary)" }}>Age: </span>
                <span style={{ fontWeight: 500 }}>{visitData.age}</span>
              </div>
              <div>
                <span style={{ color: "var(--text-secondary)" }}>
                  Diagnosis:{" "}
                </span>
                <span style={{ fontWeight: 500 }}>
                  {visitData.diagnosis}
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
                  Active Medications:
                </span>
                {visitData.medications.map((m, i) => (
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
                    {m.name} {m.dosage}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div style={{ ...card, flex: 1, display: "flex", flexDirection: "column", height: 500, padding: 0 }}>
            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "75%",
                      padding: "10px 14px",
                      borderRadius: 12,
                      fontSize: 13,
                      lineHeight: 1.6,
                      whiteSpace: "pre-line",
                      background:
                        msg.role === "user"
                          ? "var(--accent)"
                          : "var(--bg-hover)",
                      color:
                        msg.role === "user"
                          ? "#fff"
                          : "var(--text-primary)",
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: 12,
                      background: "var(--bg-hover)",
                      color: "var(--text-muted)",
                      fontSize: 13,
                    }}
                  >
                    <style>{`@keyframes blink { 0%,60% { opacity:1 } 30% { opacity:0.3 } }`}</style>
                    <span style={{ animation: "blink 1.4s infinite" }}>●</span>{" "}
                    <span style={{ animation: "blink 1.4s infinite 0.2s" }}>
                      ●
                    </span>{" "}
                    <span style={{ animation: "blink 1.4s infinite 0.4s" }}>
                      ●
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggested Questions */}
            <div
              style={{
                padding: "0 20px 8px",
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSendMessage(q)}
                  disabled={isTyping}
                  style={{
                    background: "var(--accent-subtle)",
                    color: "var(--accent)",
                    border: "none",
                    borderRadius: 16,
                    padding: "6px 12px",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: isTyping ? "default" : "pointer",
                    opacity: isTyping ? 0.5 : 1,
                    fontFamily: "inherit",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div
              style={{
                borderTop: "1px solid var(--border)",
                padding: 12,
                display: "flex",
                gap: 8,
              }}
            >
              <input
                style={{ ...inputStyle, flex: 1 }}
                placeholder="Ask a question about your care plan..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isTyping)
                    handleSendMessage(chatInput)
                }}
                disabled={isTyping}
              />
              <button
                onClick={() => handleSendMessage(chatInput)}
                disabled={isTyping || !chatInput.trim()}
                style={{
                  ...primaryBtn,
                  padding: "8px 16px",
                  opacity: isTyping || !chatInput.trim() ? 0.5 : 1,
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
```

- [ ] **Step 2: Verify in browser**

Navigate through Steps 1 → 2 → 3. Verify:
- Patient context card on the left shows visit data
- Welcome message appears
- Suggested question chips work (click one, see response after delay)
- Typing indicator (animated dots) shows during delay
- Free-text input works, Enter key sends
- Messages scroll automatically

- [ ] **Step 3: Commit**

```bash
git add app/tab-1/page.tsx
git commit -m "feat: add Step 3 patient chat with simulated AI responses"
```

---

### Task 5: Build Step 4 — Adherence Dashboard

**Files:**
- Modify: `app/tab-1/page.tsx` — replace Step 4 placeholder

- [ ] **Step 1: Replace Step 4 placeholder with adherence dashboard**

In `app/tab-1/page.tsx`, find and replace this block:

```tsx
      {/* Step 4: placeholder */}
      {step === 4 && (
        <div style={card}>
          <p style={{ color: "var(--text-secondary)" }}>
            Step 4 — Adherence Dashboard (coming next)
          </p>
        </div>
      )}
```

Replace with:

```tsx
      {/* Step 4: Adherence Dashboard */}
      {step === 4 && (
        <div>
          {/* Progress Header */}
          <div
            style={{
              ...card,
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: 4,
                }}
              >
                Adherence Tracker
              </h2>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                Day 3 of 14 — {visitData.patientName}&apos;s care plan
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: "var(--accent)",
                }}
              >
                {(() => {
                  const total = Object.values(adherence).flatMap((d) =>
                    Object.values(d)
                  )
                  const checked = total.filter(Boolean).length
                  return total.length
                    ? Math.round((checked / total.length) * 100)
                    : 0
                })()}
                %
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-secondary)",
                  fontWeight: 500,
                }}
              >
                Overall Adherence
              </div>
            </div>
          </div>

          {/* 7-Day Grid */}
          <div style={{ ...card, marginBottom: 16, overflowX: "auto" }}>
            <h3
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: 16,
              }}
            >
              Weekly View
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: `160px repeat(7, 1fr)`, gap: 0 }}>
              {/* Header row */}
              <div
                style={{
                  padding: "8px 12px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                Task
              </div>
              {Array.from({ length: 7 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    padding: "8px 4px",
                    fontSize: 12,
                    fontWeight: 600,
                    color:
                      i < 3
                        ? "var(--accent)"
                        : "var(--text-muted)",
                    textAlign: "center",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  Day {i + 1}
                </div>
              ))}

              {/* Task rows */}
              {adherenceTasks.flatMap((task) => [
                <div
                  key={`label-${task.id}`}
                  style={{
                    padding: "10px 12px",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--text-primary)",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {task.label}
                </div>,
                ...Array.from({ length: 7 }, (_, i) => {
                  const dayKey = `day-${i + 1}`
                  const checked = adherence[dayKey]?.[task.id] ?? false
                  return (
                    <div
                      key={`${task.id}-${i}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderBottom: "1px solid var(--border)",
                        padding: "10px 4px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAdherence(dayKey, task.id)}
                        style={{
                          width: 18,
                          height: 18,
                          cursor: "pointer",
                          accentColor: "var(--accent)",
                        }}
                      />
                    </div>
                  )
                }),
              ])}
            </div>
          </div>

          {/* AI Nudges */}
          <div style={card}>
            <h3
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: 12,
              }}
            >
              AI Nudges
            </h3>
            <p
              style={{
                fontSize: 12,
                color: "var(--text-secondary)",
                marginBottom: 16,
              }}
            >
              Automated reminders the agent would send to{" "}
              {visitData.patientName.split(" ")[0]}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {AI_NUDGES.map((nudge, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    background: "var(--bg-hover)",
                    borderRadius: 8,
                  }}
                >
                  <span style={{ fontSize: 20 }}>{nudge.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "var(--text-primary)",
                      }}
                    >
                      {nudge.text}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      fontWeight: 500,
                    }}
                  >
                    {nudge.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
```

- [ ] **Step 2: Verify in browser**

Navigate through all 4 steps. Verify:
- Progress header shows "Day 3 of 14" with adherence percentage
- 7-day grid shows checkboxes, days 1-3 partially pre-checked
- Toggling checkboxes updates the percentage in real time
- AI nudge cards display with icons and times
- "Restart Demo" button resets everything back to Step 1

- [ ] **Step 3: Commit**

```bash
git add app/tab-1/page.tsx
git commit -m "feat: add Step 4 adherence dashboard with interactive tracking"
```

---

### Task 6: Update labels and final verification

**Files:**
- Modify: `app/components/AppShell.tsx:9` — change "Tab 1" to "PostVisit.ai"
- Modify: `app/components/Sidebar.tsx:5` — change "Tab 1" to "PostVisit.ai"

- [ ] **Step 1: Update AppShell page title**

In `app/components/AppShell.tsx`, change:

```ts
  "/tab-1": "Tab 1",
```

to:

```ts
  "/tab-1": "PostVisit.ai",
```

- [ ] **Step 2: Update Sidebar nav label**

In `app/components/Sidebar.tsx`, change:

```ts
  { href: "/tab-1", label: "Tab 1" },
```

to:

```ts
  { href: "/tab-1", label: "PostVisit.ai" },
```

- [ ] **Step 3: Full walkthrough verification**

Open `http://localhost:3000/tab-1`. Run through the complete demo flow:

1. **Sidebar** shows "PostVisit.ai" label, topbar shows "PostVisit.ai"
2. **Step 1:** Form pre-filled, edit a field (e.g., change patient name), click "Generate Care Plan →"
3. **Step 2:** Loader spins, care plan appears with the edited data, click "Continue as Patient →"
4. **Step 3:** Welcome message uses correct name, click a suggested question, see response, type a custom question, click "View Adherence →"
5. **Step 4:** Adherence grid loads, toggle checkboxes, percentage updates, click "Restart Demo"
6. **Back to Step 1:** Fresh state, form re-filled with defaults
7. **Progress bar:** Click completed steps to navigate back

- [ ] **Step 4: Commit**

```bash
git add app/components/AppShell.tsx app/components/Sidebar.tsx
git commit -m "feat: update Tab 1 labels to PostVisit.ai"
```
