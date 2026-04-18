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
