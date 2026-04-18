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

      {/* Scene 3 placeholder — implemented in Task 4 */}
      {scene === 3 && null}
    </div>
  )
}
