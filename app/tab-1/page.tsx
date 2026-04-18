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
