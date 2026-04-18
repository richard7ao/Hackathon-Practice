# HCI-Grounded Background: RPM Triage Co-Pilot for Clinicians

## 1. HCI Foundations

### 1.1 Core Principles

Human-Computer Interaction (HCI) is the study of how people interact with computational systems and how to design interfaces that are effective, efficient, and satisfying. In safety-critical healthcare contexts, HCI principles are not usability niceties — they are patient safety requirements.

#### Nielsen's 10 Usability Heuristics

Jakob Nielsen's heuristics (1994) remain the most widely applied evaluation framework in interface design. In healthcare, each heuristic carries elevated stakes:

| Heuristic | General Principle | Healthcare Implication |
|-----------|------------------|----------------------|
| Visibility of system status | The system should always keep users informed | A clinician must know at a glance: is this patient deteriorating, stable, or improving? |
| Match between system and real world | Use language and concepts familiar to users | Clinical terminology (decompensation, exacerbation, SDEC) not tech jargon (API error, data sync) |
| User control and freedom | Support undo and escape | Clinicians must be able to override any automated recommendation without friction |
| Consistency and standards | Follow platform conventions | Every patient card should follow the same structure regardless of condition or severity |
| Error prevention | Design to prevent errors before they occur | In a triage system, a missed deterioration can be fatal — prevention is paramount |
| Recognition over recall | Minimise memory load | Surface patient context (history, medications, trend) on the card; don't make clinicians search |
| Flexibility and efficiency of use | Accelerators for expert users | An experienced nurse triaging 30 patients needs shortcuts, not a 6-screen wizard |
| Aesthetic and minimalist design | Only show relevant information | 186 raw alerts displayed equally is not information — it is noise |
| Help users recognise and recover from errors | Clear error messages and recovery paths | If a patient was triaged green but later deteriorates, the system must resurface them |
| Help and documentation | Provide contextual help | Reasoning text on each card serves as inline documentation — the system explains itself |

#### Norman's Design Principles

Don Norman's framework from *The Design of Everyday Things* (1988, revised 2013) provides six principles particularly relevant to clinical interfaces:

- **Affordances**: What actions does the interface make possible? A triage card should afford approval, override, or escalation — and nothing else.
- **Signifiers**: How does the user know what to do? Colour coding (green/amber/red) is a signifier. But it only works if the mapping is consistent and culturally unambiguous.
- **Feedback**: Every action needs confirmation. When a clinician approves a referral, they need to see it move from "pending" to "sent" immediately.
- **Constraints**: Limit possible actions to prevent errors. A green patient shouldn't have a "refer to SDEC" button — that action is only meaningful for red cases.
- **Mapping**: The relationship between controls and outcomes should be natural. "Swipe right to approve, left to escalate" maps poorly. Explicit labelled buttons map well.
- **Conceptual model**: The user's mental model of how the system works must match what the system actually does. If a clinician thinks "amber means I have 48 hours" but the system means "amber means declining trend detected," there is a dangerous mismatch.

#### Cognitive Load Theory

Sweller's cognitive load theory (1988) identifies three types of load on working memory:

- **Intrinsic load**: The inherent complexity of the task. Clinical decision-making is intrinsically complex — this load is appropriate and unavoidable.
- **Extraneous load**: Load imposed by poor design. Navigating between 4 systems, reading 186 undifferentiated alerts, manually drafting referral letters — this is all extraneous load that current RPM tools impose.
- **Germane load**: The cognitive effort devoted to learning and schema formation. When a nurse recognises a heart failure decompensation pattern from experience, that's germane load — the valuable kind.

The design goal: minimise extraneous load so clinicians can direct their finite working memory toward intrinsic clinical reasoning and germane pattern recognition.

#### Fitts's Law

Fitts's Law (1954) states that the time to reach a target is a function of the distance to and size of the target. In a high-throughput triage interface where a nurse processes 12 action cards in 5 minutes, the "approve" button needs to be large, close to the card content, and reachable without scrolling. Every additional click or mouse movement costs seconds that compound across 30+ patients.

### 1.2 HCI in Safety-Critical Systems

Healthcare interfaces operate under constraints that consumer software does not face. Several additional frameworks apply:

#### Reason's Swiss Cheese Model

James Reason's model (1990) describes how accidents occur when holes in multiple defensive layers align. In RPM:
- Layer 1: Device data collection (hole: sensor malfunction)
- Layer 2: Alert generation (hole: threshold too broad, generating false positives)
- Layer 3: Clinician triage (hole: alert fatigue causes missed genuine alert)
- Layer 4: Clinical action (hole: referral delayed by admin burden)

A well-designed co-pilot adds defensive layers (pattern detection, clustering, reasoning transparency) rather than replacing existing ones.

#### Automation and Human Error

Parasuraman, Sheridan & Wickens (2000) describe a spectrum of automation from fully manual to fully autonomous. The critical insight: **intermediate levels of automation** — where the system recommends and the human approves — are the most common in healthcare but also the most prone to failure through:

- **Automation bias**: Accepting the system's recommendation without critical evaluation
- **Complacency**: Reduced vigilance because "the system is watching"
- **Skill degradation**: Over time, clinicians lose the ability to triage manually if the system is unavailable

#### Trust Calibration

Lee & See (2004) identify three dimensions of trust in automation:

- **Performance trust**: Does the system produce correct outputs? (Earned through accuracy over time)
- **Process trust**: Do I understand how the system reaches its conclusions? (Earned through transparency)
- **Purpose trust**: Does the system share my goals? (Earned through alignment with clinical values — patient safety over efficiency)

Miscalibrated trust manifests as:
- **Overtrust**: Rubber-stamping recommendations without review (the bigger danger once trust is established)
- **Undertrust**: Ignoring the system entirely, reverting to manual triage (wastes the tool's value)
- **Appropriate trust**: Critically reviewing recommendations, overriding when clinical judgement disagrees, trusting patterns the system detects that a human would miss

### 1.3 Design Thinking Methodology

The RPM Triage Co-Pilot concept follows the five-phase design thinking framework (Stanford d.school):

1. **Empathise**: Understand clinician workflows, pain points, and the emotional toll of alert fatigue through user research
2. **Define**: Frame the problem — not "too many alerts" but "clinicians spend cognitive effort on noise instead of clinical judgement"
3. **Ideate**: Explore solution approaches — filtering, clustering, AI triage, redesigned dashboards
4. **Prototype**: Build a functional demo showing the 200 → 12 transformation
5. **Test**: Evaluate against HCI heuristics, measure time-on-task, assess trust calibration

---

## 2. The Problem Space: Telemedicine & Remote Monitoring

### 2.1 Rapid Expansion of Remote Care

COVID-19 compressed a decade of digital adoption into months. The NHS Long Term Plan targeted 50% of outpatient appointments as virtual by 2024. The technology arrived — video consultations, wearable devices, remote monitoring platforms — but the workflows didn't catch up. Digital care was bolted onto paper-era processes rather than redesigned from first principles.

The result: clinicians now manage patients through screens instead of wards, but with tools designed for data collection rather than clinical decision-making.

### 2.2 Care Delivery Bottlenecks

Four systemic failures define the current state of remote care:

**1. Poor triage**
Patients enter digital pathways but there is no intelligent routing. A heart failure patient reporting mild breathlessness and a post-surgical patient with a slightly elevated temperature arrive in the same inbox, same format, same priority. The clinician is the sorting algorithm.

**2. Fragmented follow-up**
A patient gets discharged with an RPM device. They submit daily readings. The data arrives at a dashboard. But the dashboard doesn't connect to the care plan, doesn't trigger pathway-appropriate actions, and doesn't close the loop between monitoring and intervention. Data flows in but clinical action doesn't flow out.

**3. Weak interoperability**
NHS EPR systems (SystmOne, EMIS, Epic) don't talk to RPM platforms. Clinicians enter data in the RPM dashboard, then re-enter it in the EPR for the official record. This duplication doesn't just waste time — it introduces transcription errors and means the patient record is split across systems that don't share context.

**4. Admin burden**
The BMA estimates NHS GPs spend 11 hours per week on administrative tasks. For virtual ward nurses, the burden is worse: drafting referral letters from scratch, manually booking GP appointments, logging actions across multiple systems, chasing colleagues by phone for decisions that should be routing logic. Clinicians spend more time documenting and navigating systems than making clinical decisions.

### 2.3 The Alert Fatigue Crisis

Alert fatigue is the central HCI problem in remote patient monitoring.

**The scale:**
- A single RPM patient with a wearable can generate 50-100 data points per day
- A community nurse managing 30 RPM patients faces 1,500-3,000 data points daily
- In acute settings, studies have measured 187 alerts per patient per day (AHRQ)
- Physiologic monitors in a 66-bed ICU generated over 2 million alerts in a single month

**The behavioural consequence:**
Research shows alert override rates of 90-96% in clinical decision support systems (van der Sijs et al., 2006). When clinicians encounter hundreds of low-value alerts daily, they develop what JMIR (2026) describes as "cognitive disengagement" — defaulting to rapid override as a strategy to avoid further mental effort. This is not negligence; it is a rational human response to a poorly designed system.

**The danger:**
When everything is flagged as urgent, nothing is effectively urgent. Genuine deterioration signals get buried in noise. The alert system designed to prevent harm becomes, through poor HCI design, a contributor to harm.

**The frustration profile:**
Clinicians report that frustration peaks not with alert volume alone, but specifically with alerts that are ambiguous, time-consuming to investigate, or difficult to action (JMIR, 2025). An alert that says "SpO2: 91%" without context, trend, or recommended action forces the clinician to do all the cognitive work — the system adds a notification without adding intelligence.

### 2.4 NHS-Specific Context

**Virtual wards** are now established infrastructure — over 10,000 beds nationally — but the referral logic into them remains largely manual. A GP or A&E clinician deciding whether a patient is suitable for a virtual ward does so through phone calls and professional judgement, not through structured digital pathways.

**Integrated Care Boards (ICBs)** are tasked with shifting care from hospitals into the community, but lack the digital infrastructure to manage population-level remote monitoring effectively.

**Workforce crisis**: The NHS has approximately 40,000 nursing vacancies and 8,000 GP vacancies (2024 figures). Any technology solution that adds to clinician workload — even marginally — will fail. The bar is not "useful" but "saves more time than it costs to learn and operate."

**Staff experience**: Research into NHS remote monitoring services found that nurses doing RPM often carried it as additional work alongside existing community duties, sometimes during evenings and weekends. Staff reported feeling unsupported and distressed. Training was ad-hoc and on-the-job rather than structured (PMC, 2023). This emotional and logistical context means the co-pilot must be immediately usable without significant training overhead.

---

## 3. HCI Analysis of Current RPM Workflows

### 3.1 Heuristic Failures in Current Tools

Applying Nielsen's heuristics to existing RPM dashboards reveals systematic design failures:

**Visibility of system status — FAILS**: Most dashboards show raw data streams. A clinician sees "SpO2: 91%" but not "this is a downward trend over 3 days for a COPD patient on home oxygen." There is data visibility but no status visibility. The clinician must synthesise status from raw numbers.

**Error prevention — FAILS**: Systems alert on single-point thresholds (heart rate > 100, SpO2 < 92) rather than multi-signal patterns. This generates massive false-positive volumes that train clinicians to ignore alerts — the system actively creates the conditions for its own failure.

**Flexibility and efficiency of use — FAILS**: No shortcuts for expert users. A Band 6 nurse who has triaged 10,000 alerts clicks through the same workflow as a first-week starter. The system treats every user as a novice and every alert as requiring the same investigation depth.

**Aesthetic and minimalist design — FAILS**: Dashboards display every data point with equal visual weight. A missed blood pressure reading and a critically low SpO2 trend arrive in the same inbox, same format, same priority. There is no information hierarchy.

### 3.2 Cognitive Load Failure

Current RPM tools maximise extraneous load:

- **Context switching**: Clinician checks alert in RPM dashboard → opens EPR to find patient history → opens a separate system to check medication list → returns to RPM to interpret the alert with context. Each switch costs 20-30 seconds and disrupts working memory.
- **Mental clustering**: The system presents alerts individually. The clinician must mentally group "Mrs. Begum SpO2 alert at 02:14, Mrs. Begum SpO2 alert at 02:47, Mrs. Begum SpO2 alert at 03:22..." into "Mrs. Begum had repeated SpO2 drops overnight." This clustering is cognitive work the system should do.
- **Manual composition**: After deciding to act, the clinician drafts a referral letter from scratch — re-typing patient details, describing the concern, specifying the request. This is pure extraneous load; the information already exists in the system.

The result: by the time a nurse has triaged her inbox, she has spent 60-90 minutes on work that is 80% system navigation and 20% clinical judgement. The ratio should be inverted.

### 3.3 The Signal-to-Noise Problem

Current systems treat all data equally because they lack:

- **Temporal reasoning**: They don't understand that "slightly elevated weight + slightly elevated BP + slightly increased breathlessness over 5 days" is a heart failure decompensation pattern. Each data point is evaluated in isolation.
- **Cross-signal correlation**: A sudden SpO2 drop that doesn't correlate with heart rate or respiratory rate changes is almost certainly a sensor issue. Current systems don't make this inference.
- **Condition-specific context**: A resting heart rate of 95 means different things for a heart failure patient (possible decompensation) and a post-surgical patient (expected recovery response). Current alert thresholds are generic.

### 3.4 Information Asymmetry

Remote care creates an asymmetry that in-person care avoids:

- **The patient** knows how they feel — their breathlessness, their energy level, their daily activities — but cannot interpret device data or recognise clinical patterns.
- **The clinician** has device data — numbers, trends, thresholds — but no context on the patient's daily experience, adherence challenges, or home environment.

Current RPM tools create a data bridge (device readings arrive at the clinician's dashboard) but not a meaning bridge. The patient's subjective experience and the clinician's objective data remain disconnected.

---

## 4. The Concept: RPM Triage Co-Pilot

### 4.1 Vision and Value Proposition

The RPM Triage Co-Pilot is an intelligence layer between RPM devices and the clinician inbox. It does not replace clinical judgement — it removes the cognitive overhead that prevents clinicians from exercising it.

**Core transformation**: A nurse's inbox of 200 raw alerts collapses into ~12 triaged, patient-level action cards, each with visible reasoning and a pre-drafted clinical action ready for one-click approval.

**Value proposition**: Reduce clinician admin time per patient per day from 15-20 minutes to 2-3 minutes while maintaining or improving deterioration detection rates.

### 4.2 User Personas

#### Primary Persona: Nurse Priya Sharma

- **Role**: Band 6 community nurse, virtual ward team at an NHS Integrated Care Board
- **Experience**: 8 years in community nursing, transitioned to virtual ward 18 months ago — still adapting to digital-first workflows
- **Caseload**: 32 RPM patients across heart failure, COPD, and post-surgical recovery
- **Daily workflow**:
  - 08:00 — Opens RPM dashboard. Flat list of overnight alerts. No prioritisation.
  - 08:00-09:30 — Manually reads every alert to determine who needs attention. Mental triage.
  - 09:30-10:30 — Drafts referral letters, books GP appointments, updates EPR separately (systems don't sync).
  - 10:30-12:30 — Telephone rounds with flagged patients.
  - 12:30-15:00 — Complex patient calls, care plan updates.
  - 15:00-17:00 — Documentation, handover notes.
- **Workarounds**: Maintains a personal colour-coded spreadsheet and sticky notes because the RPM tool doesn't prioritise for her.
- **Emotional context**: Has missed lunch 3 days this week because a batch of low-SpO2 alerts turned out to be a sensor issue, but she had to investigate each individually. Feels unsupported. Worried she'll miss something real buried in the noise.
- **Grounding**: Research confirms NHS nurses doing RPM often carry it alongside existing duties, feel under-trained, and describe the emotional toll of alert fatigue as "cognitive disengagement" progressing toward burnout (JMIR 2026, PMC 2023).

#### Secondary Persona: Dr. James Holloway

- **Role**: GP partner at a mid-size urban practice, 15 years experience
- **Relationship to co-pilot**: Receives referrals and medication review requests from 3 virtual ward teams in his ICB
- **Current experience**: Gets referral letters via email — inconsistent format, often missing key vitals, sometimes just a phone message. Spends time re-looking up patients in EMIS because referrals lack context.
- **Attitude to AI**: Sceptical. He has been burned by EHR alerts that cry wolf. Trust needs to be earned through consistent accuracy, not assumed.

#### Secondary Persona: Sister Aisha Mensah

- **Role**: Band 7 clinical lead, manages 6 virtual ward nurses across the ICB
- **Responsibilities**: Governance, patient safety, workforce planning, outcomes reporting to ICB board
- **Current experience**: No aggregated view. Relies on weekly team huddles where each nurse reports verbally. Pieces together a caseload picture manually. Quarterly board reports take a full week to compile from scattered sources.
- **Needs**: Team-level visibility, governance flags, and exportable outcomes data.

### 4.3 User Stories

#### Nurse Priya Sharma

**US-1: Morning triage**
> As Nurse Priya, I start my shift and open the dashboard. Overnight, 47 patients generated 186 alerts. I need to know within 5 minutes: who is deteriorating, who needs a nudge, and who is fine. Currently I read every alert individually. With the co-pilot, I want to see 186 alerts collapsed into ~12 patient-level action cards, sorted by urgency, with the reasoning visible so I can trust it.

**US-2: False alarm drain**
> As Nurse Priya, I spent 40 minutes yesterday investigating 23 low-SpO2 alerts from Mrs. Begum. Her pulse oximeter was on the wrong finger and giving noisy readings. The co-pilot should recognise device-artefact patterns — sudden drops that don't correlate with other vitals — and flag them as "likely sensor issue: recommend patient call to check device placement" rather than escalating each one individually. I want those 23 alerts to become 1 card that says "device check needed" so I can make a single 2-minute call instead of 40 minutes of investigation.

**US-3: Slow deterioration catch**
> As Nurse Priya, Mr. Okonkwo is a 71-year-old heart failure patient. His weight has crept up 0.3kg each day for 4 days. His SpO2 dropped from 96% to 94%. He reported "a bit more breathless than usual" in yesterday's check-in. None of these individually breach an alert threshold — the system shows all green. But taken together, this is textbook fluid retention leading to decompensation. The co-pilot should detect multi-signal drift patterns across days, surface an amber card that says "possible HF decompensation — weight trend +1.2kg over 4 days, declining SpO2, increased breathlessness" and recommend: auto-book a GP medication review within 48 hours. Currently I would only catch this if I happened to scroll through his individual readings and mentally connect the dots.

**US-4: One-click action**
> As Nurse Priya, the co-pilot has flagged Mr. Okonkwo as amber. I agree with the assessment. Now I need to act — currently that means: open SystmOne, find his record, write a referral letter to his GP explaining the concern, call the GP surgery to book a slot, log the action back in the RPM system. That's 15-20 minutes of admin for one patient. With the co-pilot, I want to see a pre-drafted GP referral letter already populated with Mr. Okonkwo's vitals trend, medication list, and the co-pilot's reasoning. I click "approve and send." The system books the next available GP slot and logs the action. One click, 30 seconds.

**US-5: Red escalation**
> As Nurse Priya, Mrs. Patel is a COPD patient whose SpO2 has dropped to 88% and her respiratory rate is 28. She reported "can't catch my breath" in her morning check-in. This is red — not a GP review, she needs Same Day Emergency Care or a virtual ward step-up now. The co-pilot should show a red card with "COPD exacerbation — immediate escalation recommended" and offer two actions: (1) auto-generate an SDEC referral to her local acute trust with vitals summary attached, or (2) escalate to the virtual ward consultant for a video assessment within the hour. I need to make that routing decision — the co-pilot shouldn't send it automatically — but the referral letter and booking should be ready for me to approve. The system must never auto-escalate without my sign-off because I carry the clinical accountability.

**US-6: Patient nudge**
> As Nurse Priya, 8 of my patients didn't submit their morning readings today. Currently I have no way to tell if they forgot, if their device is broken, or if they're too unwell to engage. I'd normally call each one — that's 8 calls at 5 minutes each, 40 minutes. The co-pilot should categorise the missed readings: patients with stable 7-day trends get an automated SMS nudge ("Hi Joan, we haven't received your readings today — please take your measurements when you can"). Patients with recent amber/red history who miss readings get flagged to me as "missed readings — priority call" because silence from an unstable patient is itself a warning sign. I want the co-pilot to handle the routine nudges automatically so I only make 2-3 calls instead of 8.

#### Dr. James Holloway

**US-7: Incoming referral**
> As Dr. Holloway, I receive 4-6 RPM-generated referral requests per day alongside my 30+ regular appointments. Currently each one requires me to open the letter, cross-reference EMIS for medication history, chase the nurse for clarification on what they actually want me to do. With the co-pilot, I receive a structured referral card: patient summary, the specific vitals trend that triggered concern (with a small chart), current medications, and a clear ask — "medication review recommended: consider diuretic dose increase for fluid retention." I can see the reasoning, I can see the data, I can approve or modify the recommendation in 2 minutes instead of 10.

**US-8: Trust and override**
> As Dr. Holloway, the co-pilot recommended increasing Mr. Okonkwo's furosemide. But I know from his last face-to-face that his kidney function is borderline — something the RPM data doesn't capture. I need to override the recommendation easily, add my clinical rationale ("hold diuretic increase — eGFR declining, book renal bloods first"), and have that flow back to Nurse Priya's dashboard so she knows the plan changed and why. The system must make overriding as easy as approving — no extra clicks, no friction — because if it's harder to disagree than agree, clinicians will rubber-stamp.

#### Sister Aisha Mensah

**US-9: Team oversight view**
> As Sister Mensah, I need to know at a glance: across all 180 patients in my team's caseload, how many are green/amber/red right now? Which nurses have the heaviest triage burden today? Are any patients consistently amber for more than 3 days without a clear action plan — because that's a governance risk? Currently I rely on individual nurses telling me during huddles. With the co-pilot, I want a team dashboard that shows patient risk distribution, nurse workload balance, and a "stuck patients" list — patients in amber with no action logged in 48 hours. I don't need to triage individual patients, but I need to spot systemic problems before they become incidents.

**US-10: Outcomes report**
> As Sister Mensah, every quarter I present to the ICB board. They want to know: is the virtual ward saving money and keeping patients safe? I currently compile this manually from discharge summaries and nurse notes — it takes a full week. The co-pilot should generate an outcomes report: number of escalations caught at amber that would have been A&E admissions, average response time from alert to clinical action, false-positive rate over time, and patient engagement scores (% submitting readings). I need this as an exportable PDF I can drop into my board pack.

### 4.4 System Architecture (Conceptual)

The co-pilot operates as three logical layers:

#### Layer 1: Ingestion

Receives raw data from RPM devices (SpO2, weight, blood pressure, heart rate, respiratory rate) plus patient self-reported symptoms from daily check-in forms. Normalises data across device types and manufacturers. Handles missing readings (a reading gap is itself a data point).

#### Layer 2: Intelligence

Two-stage triage engine:

**Rule-based engine:**
- Known clinical thresholds: SpO2 < 90% = red, systolic BP > 180 = red
- Device artefact detection: sudden drops uncorrelated with other vitals flagged as sensor issue
- Missed reading classification: stable patient missed reading = nudge; unstable patient missed reading = priority flag

**Pattern engine:**
- Temporal drift detection across 3-7 day windows (the Mr. Okonkwo scenario)
- Multi-signal correlation (weight + SpO2 + symptoms = decompensation pattern)
- Condition-specific decompensation signatures (heart failure fluid retention, COPD exacerbation trajectory)

#### Layer 3: Action

Generates patient-level action cards containing:
- Risk classification: green / amber / red
- Reasoning summary: why this classification, what data supports it
- Recommended action: nudge patient / book GP review / escalate to SDEC
- Pre-drafted communication: referral letter, SMS nudge, or escalation note — populated with patient data and reasoning

Routes to the appropriate clinician based on severity:
- Green: autonomous handling (automated nudges, no clinician action needed)
- Amber: routed to primary nurse for review and one-click action
- Red: routed to primary nurse with escalation options to consultant/SDEC

#### Key Architecture Decisions Grounded in HCI

- **Reasoning is always visible**: Transparency builds appropriate trust (Lee & See). Clinicians can see why the system classified a patient as amber, not just that it did.
- **Override is as easy as approve**: Equal friction for agreement and disagreement prevents automation bias (Parasuraman & Riley). The override button is the same size, same position, same number of clicks as the approve button.
- **Amber/red actions are never auto-sent**: The system pre-drafts but the clinician approves. This preserves human authority in safety-critical decisions (Reason's model — the clinician is a defensive layer, not a rubber stamp).
- **Green patients handled autonomously**: Automated nudges for stable patients reduce alert volume without removing clinical oversight. The nurse can always inspect green patients if she chooses.

---

## 5. HCI Evaluation

### 5.1 Where the Design Succeeds

The co-pilot addresses the most critical heuristic failures identified in Section 3:

- **Visibility of system status**: Traffic-light risk colours give instant caseload status. Each card shows the reasoning behind its classification.
- **Error prevention**: Multi-signal pattern detection catches deterioration that single-threshold alerts miss. Amber patients unactioned for 48 hours resurface as governance flags.
- **Recognition over recall**: Patient context (history, medications, trend chart) surfaced on the card. Clinicians don't search — the information comes to them.
- **Aesthetic and minimalist design**: 186 raw alerts become 12 action cards. Information hierarchy: colour, patient name, reasoning, action.
- **Flexibility and efficiency**: Priya processes 12 cards in 5 minutes. Dr. Holloway approves referrals in 2 minutes. Sister Mensah gets a team view without asking each nurse individually.

### 5.2 Where the Design Has Unresolved Tensions

A rigorous HCI evaluation must identify where the design creates new problems or fails to solve existing ones. The following tensions are genuine and unresolved.

#### The Ironies of Automation (Bainbridge, 1983)

The most important HCI concept for an AI triage tool. Bainbridge's central irony: the more reliable the automation, the less capable humans become at detecting its failures.

If the co-pilot is right 95% of the time, Priya will gradually stop critically evaluating its recommendations. The day it miscategorises a deteriorating patient as green, she will miss it — not through negligence, but because the system has trained her to trust it. "Easy override" does not solve this. Research consistently shows clinicians rubber-stamp even when override is frictionless, if the system is usually right.

**Design implications**: The system may need deliberate friction for high-stakes classifications — perhaps requiring Priya to confirm she reviewed the underlying data for amber cases, not just the summary card. This trades efficiency for safety. The tension between speed and vigilance is not resolvable through interface design alone; it requires organisational protocols (regular manual triage exercises, spot-checking co-pilot classifications).

#### Cognitive Deskilling

Related to automation irony but distinct: as the co-pilot handles pattern detection, Priya's own pattern-recognition skills may atrophy over time. If the system goes down for a day, can she revert to manual triage effectively? The current design assumes the co-pilot is always available. A robust design would include a "manual mode" that preserves the clinician's ability to work without the system — not as a fallback, but as a regular practice to maintain skills.

#### The Hidden Information Problem

Collapsing 186 alerts into 12 cards means 174 alerts were classified as noise and hidden. What if a critical signal was among them? The design shows a "view all alerts" option, but in practice, the whole point of the co-pilot is that clinicians don't look at the raw feed. The system's filtering decisions are effectively invisible clinical decisions made by software.

**Design implication**: The co-pilot should log every filtering decision with reasoning, and these logs should be auditable. Sister Mensah's governance view should include a "filtered alerts" audit trail. This doesn't solve the real-time risk, but it enables retrospective safety review.

#### Trust Calibration Failure Modes

Lee & See's trust framework identifies three dimensions (performance, process, purpose), but the design primarily addresses process trust (show reasoning). Performance trust requires time and track record. Purpose trust requires alignment with clinical values that the system cannot demonstrate through interface design alone.

Specific failure modes:
- **Dr. Holloway's scepticism is healthy**: He should not be persuaded to trust faster. The system needs to earn trust through consistent accuracy over weeks, not through persuasive UI.
- **Automation bias after trust is established**: Once Priya trusts the system, overtrust becomes the dominant risk. The interface cannot solve this alone — it requires training, organisational culture, and periodic calibration exercises.
- **Trust transfer**: If the system performs well for heart failure patients but poorly for COPD patients (different data patterns, different decompensation signatures), clinicians may not distinguish — they'll trust it equally for both. Condition-specific confidence scores could mitigate this.

#### The Explainability Ceiling

If the pattern engine uses any machine learning, the displayed reasoning may be a post-hoc rationalisation rather than the actual decision path. "Weight +1.2kg over 4 days + declining SpO2" sounds like transparent reasoning, but it might be a simplified narrative the system generates to justify a decision made on 50 features. This is the core XAI (explainable AI) problem.

**Design implication**: The system should distinguish between rule-based classifications (where the reasoning IS the decision logic) and ML-assisted classifications (where the reasoning is an approximation). Clinicians deserve to know the difference. A small label — "rule-based" vs "pattern-detected" — would help calibrate appropriate trust for each card.

### 5.3 Distributed Cognition Gaps

The co-pilot is not a single-user tool. It operates within a sociotechnical system spanning multiple actors, roles, and organisational structures. Hutchins' distributed cognition framework (1995) reveals coordination gaps the current design doesn't address:

- **Shift handover**: If Priya triages a patient as amber at 09:00 and her colleague takes over at 17:00, does the next nurse inherit Priya's assessment? If Priya overrode the co-pilot's classification, is that override visible and the reasoning preserved?
- **Cross-role communication**: Dr. Holloway's override reason ("hold diuretic — eGFR declining") needs to flow back to Priya's view. The design addresses this for direct overrides, but what about implicit information — context Dr. Holloway has from a face-to-face visit that never enters the digital system?
- **Organisational context**: The co-pilot doesn't account for NHS operational realities like bed availability, staffing levels, or local pathway variations. An SDEC referral is only useful if the SDEC has capacity. The system routes patients into pathways it doesn't monitor.
- **Temporal coordination**: The co-pilot shows a snapshot, but clinical care is a continuous process. How does the system handle a patient whose status changes between Priya's morning triage and her afternoon telephone round?

### 5.4 Ethical Dimensions

#### Algorithmic Bias

If the pattern engine is trained on historical data, it inherits the biases of that data. Heart failure decompensation presents differently across demographics — fluid retention patterns, symptom reporting, and device adherence all vary by age, ethnicity, and socioeconomic status. A model trained predominantly on data from white patients may perform differently for Black or South Asian patients.

**Design implication**: The system should report per-demographic performance metrics. If detection accuracy differs significantly across patient groups, this must be surfaced, not hidden.

#### Accountability Gap

If the co-pilot classifies a patient as green and the patient subsequently deteriorates, who bears accountability? The nurse who trusted the classification? The clinical lead who approved the system's deployment? The development team that built the model?

This is not solely a legal question — it is an HCI question about how the system frames responsibility. If the interface presents "green" as a definitive assessment rather than a recommendation, it implicitly shifts accountability from clinician to system. The language matters: "co-pilot suggests: low risk" is different from "status: green."

#### Patient Consent and Transparency

Do patients know an AI system is triaging their data and influencing routing decisions? The NHS duty of candour and GDPR requirements around automated decision-making (Article 22) create obligations that the system design must accommodate. Patients should understand, in accessible language, that their readings are processed by an intelligent system as well as reviewed by their nurse.

### 5.5 Evaluation Methodology

A rigorous HCI evaluation of the co-pilot would include the following methods, even if hackathon scope limits what can be executed:

**Cognitive walkthrough**: Step through each user story with a clinical participant, identifying where the interface creates confusion, hesitation, or error.

**Heuristic evaluation**: Independent evaluators (not the design team) assess the interface against Nielsen's heuristics and flag violations.

**Think-aloud protocol**: Observe Priya-equivalent nurses using the prototype while verbalising their thought process. Identify where the system's model diverges from the clinician's mental model.

**Time-on-task measurement**: Quantify triage time (current manual workflow vs. co-pilot assisted) across a standardised caseload.

**Error rate analysis**: Seed test datasets with known deterioration cases and measure detection sensitivity (false-negative rate) and specificity (false-positive rate).

**Longitudinal trust calibration**: Over weeks/months, measure whether clinicians' trust in the system converges toward appropriate calibration or drifts toward overtrust/undertrust.

**Distributed cognition analysis**: Map information flow across shift handovers, cross-role communication, and organisational boundaries to identify where clinical context is lost.

---

## 6. Demo Strategy & Measurable Outcomes

### 6.1 The Demo Hook: "200 Alerts to 12 Actions"

Live walkthrough simulating Nurse Priya's Monday morning:

**Opening screen**: Raw alert inbox with 200+ items scrolling — visually overwhelming. Let the audience feel the problem.

**Click "Triage"**: The co-pilot clusters, analyses, and produces 12 action cards in under 3 seconds. The visual transformation is the demo's centrepiece.

**Walk through 3 representative cards:**

1. **Green — sensor noise collapse**: Mrs. Begum's 23 overnight SpO2 alerts collapsed into a single "device check needed" card. Show the reasoning: "SpO2 drops uncorrelated with heart rate or respiratory rate — likely sensor artefact." One action: auto-SMS nudge to check device placement.

2. **Amber — slow deterioration catch**: Mr. Okonkwo's 4-day weight drift surfaced as "possible HF decompensation." Show the multi-signal trend chart. One action: approve pre-drafted GP referral letter — click, sent, logged.

3. **Red — COPD exacerbation**: Mrs. Patel's SpO2 88%, respiratory rate 28, self-reported breathlessness. Show the escalation options: SDEC referral or virtual ward consultant video assessment. Demonstrate the pre-drafted SDEC referral letter with vitals summary.

### 6.2 Measurable Outcomes

| Metric | Current State | With Co-Pilot | Measurement Method |
|--------|--------------|---------------|-------------------|
| Morning triage time | 60-90 minutes | 5-10 minutes | Time-on-task in demo simulation |
| Alert-to-action ratio | 200 alerts : ~15 actions | 12 cards : 12 actions | Count in demo dataset |
| Noise reduction | 0% (all alerts shown) | ~94% (collapsed/filtered) | Alerts hidden vs. shown |
| False-negative rate | Unknown (no system tracking) | 0% on seeded test set | 3 genuine deterioration cases seeded; all must surface as amber/red |
| Admin per referral | 15-20 minutes | 30 seconds (one-click approve) | Time-on-task in demo |
| Governance visibility | Weekly verbal huddle | Real-time team dashboard | Qualitative comparison |
| Board report compilation | 1 week manual effort | Auto-generated PDF | Qualitative comparison |

### 6.3 Hackathon Presentation Narrative

1. **Open with the problem**: Priya's 186-alert Monday morning. Make it visceral. Show the raw inbox. Let judges feel the overwhelm.
2. **The HCI insight**: Alert fatigue isn't a data problem — it's a design problem. Current systems maximise cognitive load instead of reducing it. Reference the 90-96% override rate statistic.
3. **The solution**: Demo the 200 → 12 transformation live. Walk through the three card types. Show one-click action.
4. **The rigour**: Demonstrate awareness of the risks. Mention automation irony, trust calibration, the explainability ceiling, ethical dimensions. This separates a thoughtful design from a naive prototype.
5. **The outcomes**: Numbers. Minutes saved. Deterioration cases caught. Admissions avoided. The NHS virtual ward context makes this directly relevant to national health policy.

---

## References

### HCI Theory
- Nielsen, J. (1994). *10 Usability Heuristics for User Interface Design*. Nielsen Norman Group.
- Norman, D. (1988, revised 2013). *The Design of Everyday Things*. Basic Books.
- Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. *Cognitive Science*, 12(2), 257-285.
- Fitts, P. M. (1954). The information capacity of the human motor system. *Journal of Experimental Psychology*, 47(6), 381-391.
- Hutchins, E. (1995). *Cognition in the Wild*. MIT Press.

### Safety-Critical Systems
- Reason, J. (1990). *Human Error*. Cambridge University Press.
- Bainbridge, L. (1983). Ironies of automation. *Automatica*, 19(6), 775-779.
- Parasuraman, R., Sheridan, T. B., & Wickens, C. D. (2000). A model for types and levels of human interaction with automation. *IEEE Transactions on Systems, Man, and Cybernetics*, 30(3), 286-297.
- Lee, J. D., & See, K. A. (2004). Trust in automation: Designing for appropriate reliance. *Human Factors*, 46(1), 50-80.
- Parasuraman, R., & Riley, V. (1997). Humans and automation: Use, misuse, disuse, abuse. *Human Factors*, 39(2), 230-253.

### Alert Fatigue and RPM
- van der Sijs, H., Aarts, J., Vulto, A., & Berg, M. (2006). Overriding of drug safety alerts in computerized physician order entry. *JAMIA*, 13(2), 138-147.
- JMIR (2025). Understanding "Alert Fatigue" in Primary Care: Qualitative Systematic Review. https://www.jmir.org/2025/1/e62763
- JMIR (2026). Experiences of Alert Fatigue and Its Contributing Factors in Hospitals: Qualitative Study. https://www.jmir.org/2026/1/e78676
- PMC. Alarm fatigue in healthcare: a scoping review. https://pmc.ncbi.nlm.nih.gov/articles/PMC12181921/
- AHRQ. Alert Fatigue Primer. https://psnet.ahrq.gov/primer/alert-fatigue

### NHS Context
- NHS England. Virtual Wards Operational Framework. https://www.england.nhs.uk/long-read/virtual-wards-operational-framework/
- PMC (2023). Staff experiences of training and delivery of remote home monitoring services. https://pmc.ncbi.nlm.nih.gov/articles/PMC10300624/
- PMC. Factors Influencing Implementation of Virtual Ward Programs in the UK. https://pmc.ncbi.nlm.nih.gov/articles/PMC12226784/
