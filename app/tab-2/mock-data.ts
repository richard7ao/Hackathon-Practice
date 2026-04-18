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
