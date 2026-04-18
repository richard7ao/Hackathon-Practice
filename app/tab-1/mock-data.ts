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
    const sideEffects = visit.medications
      .map((m) => `• ${m.name}: ${MED_INSTRUCTIONS[m.name] || "Follow prescriber directions."}`)
      .join("\n")
    return `Great question, ${firstName}. Here are the key side effects to watch for with your current medications:\n\n${sideEffects}\n\nIf any of these become severe or persistent, contact Dr. Chen's office before your follow-up.`
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
    icon: "💊",
    text: "Time for your evening Metformin",
    time: "6:00 PM",
  },
  {
    icon: "❤️",
    text: "You haven't logged blood pressure today",
    time: "2:30 PM",
  },
  {
    icon: "🎉",
    text: "Great job — 3 day streak on your walking goal!",
    time: "10:00 AM",
  },
]
