# Product Requirements Document
## ERP Deliverable Agent — v1.0

**Author:** [Your Name]  
**Status:** Shipped  
**Last Updated:** March 2026

---

## Problem Statement

ERP implementation consultants at mid-size consulting firms spend a disproportionate amount of their billable hours on structured document creation rather than strategic advisory work.

**Specific pain points identified:**

- A single NetSuite Order-to-Cash FDD takes an experienced consultant **6–10 hours** to produce from discovery notes
- A Business Process Flow Narrative for a multi-module engagement can take **8–12 hours**
- Test script packages for UAT are routinely **15–25 hours** of work
- This documentation work is largely formulaic — the structure is standardized, the terminology is platform-specific, and the content derives directly from discovery source material

**Total estimated hours lost per engagement:** 30–50 hours of senior consultant time on documentation alone.

At a blended billing rate of $175–$250/hr, that represents **$5,000–$12,500 per engagement** in labor cost tied to work that can be substantially automated.

---

## Goals

| Goal | Metric | Target |
|---|---|---|
| Reduce FDD drafting time | Hours spent vs. baseline | < 1 hour (from 6–10) |
| Produce usable output | % of output accepted with minor edits | > 70% |
| Cover the major ERP platforms | Platforms supported at launch | 4 (NetSuite, D365, QAD, Acumatica) |
| Support end-to-end deliverable chain | Stages completable in one session | 3 (FDD → BPFN → Tests) |

---

## Non-Goals (v1.0)

- This does not replace the consultant — it accelerates their documentation work
- This does not connect to live ERP systems or read configuration data
- This does not generate SOW (Statement of Work) or project plan documents
- This does not support SAP, Sage, or Epicor at launch

---

## User Personas

### Primary: Mid-Level ERP Consultant (2–6 years experience)
- Knows the platform well enough to review and correct AI output
- Spends significant time on deliverable production, especially early in their career
- Motivated to use AI to reclaim hours for higher-value work
- **Needs:** Fast, accurate, platform-specific output they can edit rather than write from scratch

### Secondary: Engagement Manager / Practice Lead
- Oversees multiple active engagements
- Reviews deliverables before client submission
- Cares about consistency and professional formatting across the team
- **Needs:** Confidence that output meets the firm's quality standards

---

## User Journey

```
1. Consultant finishes discovery calls / receives client documents
2. Opens the agent and selects ERP platform + modules in scope
3. Uploads PDFs or pastes transcript/notes into the source field
4. Clicks "Generate FDD" — reviews output, copies or downloads
5. Clicks "Generate BPFN" — reviews narrative, checks flow diagram
6. Clicks "Generate Tests" — reviews test scripts, downloads full package
7. Makes edits in Word, submits to client or internal review
```

**Key insight:** The consultant is always the editor and owner of the output. The agent produces a strong first draft, not a final document.

---

## Feature Requirements

### F-01: ERP Platform Selection
- Support Oracle NetSuite, Microsoft Dynamics 365, QAD ERP, Acumatica
- Each platform has its own technology stack string and module library
- Platform selection resets module selection (modules differ per platform)
- **Priority:** Critical

### F-02: Module Scoping
- Multi-select from 15 platform-specific modules per ERP
- Each module has an ID, display label, and sub-description
- Search/filter within the module list
- Selected modules shown as removable tags
- **Priority:** Critical

### F-03: Source Material Ingestion
- Accept free-text paste (transcripts, notes, emails)
- Upload .txt, .pdf, .docx files
- Multiple files can be attached simultaneously
- Word count display for pasted text
- **Priority:** Critical

### F-04: FDD Generation
- Prompt dynamically constructed with platform tech stack + scoped modules
- Output follows a fixed professional structure (Document Control, Exec Summary, Business Requirements, Functional Requirements table, Technical Design, Integration Architecture, Data Mapping, Security, Risks, Open Items)
- **Priority:** Critical

### F-05: BPFN Generation
- Takes FDD as input context
- Uses delimiter-based output parsing to split narrative from diagram code
- Renders Mermaid.js flow diagram inline
- Falls back to raw diagram code if rendering fails
- **Priority:** Critical

### F-06: Test Script Generation
- Takes FDD + BPFN as input context
- Produces 10–15 test scenarios with full scripts
- Each script includes prerequisites, test data, execution steps table, pass/fail criteria, rollback steps, defect log
- **Priority:** Critical

### F-07: Export
- Copy to clipboard for each deliverable
- Download individual deliverable as .doc
- Download full package (all 3 deliverables) as .doc with cover page and TOC
- **Priority:** High

### F-08: Session Persistence
- Auto-save completed projects to persistent storage
- History modal with list of saved projects
- Load any previous project and resume from Tests stage
- **Priority:** Medium

---

## Out of Scope — Future Versions

| Feature | Rationale for Deferral |
|---|---|
| Iteration / regeneration of individual sections | Adds significant UX complexity; v1 focuses on first-draft quality |
| SAP S/4HANA support | Module taxonomy and terminology research needed; high value, not trivial |
| Real-time collaboration | Requires backend infrastructure |
| Client-facing portal | Separate product surface; out of scope for internal tool v1 |

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Output quality varies with source material quality | High | High | Document input best practices; add guidance text in UI |
| Consultants over-trust AI output without review | Medium | High | Framing in UI: "first draft" language, not "final document" |
| Platform terminology drifts (ERP updates) | Low | Medium | Modular prompt config allows targeted updates per platform |
| Token limits on large source documents | Medium | Medium | Encourage focused, scoped input; document limit in UI |
