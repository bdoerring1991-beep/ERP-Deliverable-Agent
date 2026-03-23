# ERP Deliverable Agent

> An AI-powered tool that transforms raw consulting input — call transcripts, discovery notes, and client requirements — into professional ERP implementation deliverables in minutes.

**Built for:** ERP implementation consultants at firms like Logan Consulting  
**Problem solved:** Consultants spend 8–20 hours per engagement manually drafting FDDs, process narratives, and test scripts from source material  
**Solution:** A structured AI agent that ingests that material and produces three client-ready deliverables in a single workflow

---

## The Problem

ERP consulting engagements (NetSuite, Microsoft Dynamics 365, QAD, Acumatica) follow a predictable deliverable pattern:

1. Discovery calls and workshops are held with the client
2. Consultants review transcripts, emails, and provided documents
3. They manually produce structured deliverables that can take **days of writing time per engagement**

This is high-cost, low-leverage work. A senior consultant spending 15 hours drafting an FDD is not doing the strategic advisory work clients are actually paying for.

---

## The Solution

A three-stage AI agent that takes raw source material and produces:

| Stage | Deliverable | Description |
|---|---|---|
| 1 | **FDD** — Function Design Document | Requirements mapping, technical design, integration architecture, data mapping, and open items |
| 2 | **BPFN** — Business Process Flow Narrative | End-to-end process narrative with role/responsibility matrix, system touchpoints, exception handling, and an auto-rendered Mermaid flow diagram |
| 3 | **Test Scenarios & Test Scripts** | 10–15 complete UAT scripts with prerequisites, test data, step-by-step execution tables, pass/fail criteria, and defect logging |

All output is ERP-platform-aware — prompts, terminology, record names, and module references are specific to whichever platform is selected.

---

## Supported Platforms & Modules

| Platform | Modules Available |
|---|---|
| Oracle NetSuite | 15 modules (OTC, PTP, WMS, Manufacturing, Revenue Rec, SuitePeople, and more) |
| Microsoft Dynamics 365 | 15 modules (Finance, SCM, WHS, Field Service, Power Platform, and more) |
| QAD ERP | 15 modules (Discrete Mfg, MRP, Shop Floor Control, Regulatory, and more) |
| Acumatica Cloud ERP | 15 modules (Construction, Field Service, Project Accounting, and more) |

---

## How It Works

```
Source Material (transcripts, docs, PDFs)
        ↓
   [Stage 1] AI generates FDD
        ↓
   [Stage 2] AI generates BPFN + Mermaid flow diagram
        ↓
   [Stage 3] AI generates Test Scenarios & Scripts
        ↓
   Download as .doc or Full Package
```

The agent uses a **chained prompting architecture** — each stage feeds its output as context into the next, so the test scripts are grounded in the specific process flows defined in the BPFN, which are grounded in the requirements captured in the FDD.

---

## Key Product Decisions

### Why chained prompts instead of one big prompt?
Each deliverable has a distinct audience and structure. FDDs are read by solution architects. BPFNs are read by process owners and change managers. Test scripts are executed by QA analysts. Keeping them separate allows each prompt to be deeply specialized for its output format and reader, producing significantly better output than a single combined prompt.

### Why platform-specific prompts?
Generic ERP prompts produce generic output. A NetSuite FDD should reference SuiteScript, SuiteFlow, and SuiteTalk. A QAD FDD should reference Progress OpenEdge and Activity-Based Navigation. Consultants cannot use output that doesn't speak their platform's language — it would require more editing than starting from scratch.

### Why Word export instead of PDF?
Consulting deliverables are living documents. Clients and internal teams need to make edits, add comments, and track changes. Word is the actual format used in professional services workflows.

### Why module-scoped generation?
Generating an FDD for all 15 modules when only 3 are in scope adds noise and reduces precision. Scoping to selected modules keeps every generated section relevant and actionable.

---

## Technical Overview

Built as a single-file React component deployed via Claude Artifacts.

**Stack:**
- React (hooks-based, no external state library)
- Anthropic Claude API (`claude-sonnet-4-20250514`) via direct fetch
- Mermaid.js for flow diagram rendering
- Mammoth.js for .docx file ingestion
- Persistent storage via Claude Artifacts storage API
- Word export via HTML → `.doc` blob generation

**Architecture pattern:** Multi-stage chained completion with structured prompt templates per ERP platform and deliverable type.

---

## Prompt Engineering Approach

Each of the three deliverable prompts is constructed dynamically using:
- The selected ERP platform's technology stack string
- The specific modules in scope (label + description)
- Today's date for document control headers
- Platform-specific terminology injected throughout

The BPFN prompt uses a delimiter-based output format (`===NARRATIVE_START===` / `===DIAGRAM_START===`) to reliably split narrative content from Mermaid diagram code in a single API response.

---

## Product Metrics I Would Track

| Metric | Why It Matters |
|---|---|
| Time-to-first-deliverable | Core value prop — measures speed vs. manual baseline |
| Deliverable acceptance rate | % of generated docs used with minimal edits |
| Module selection distribution | Which modules drive the most usage |
| Stage completion rate | Are users completing all 3 stages or dropping off? |
| Download format preference | Word vs. copy-paste — informs future export features |

---

## Future Roadmap Ideas

- **Iteration mode** — allow consultants to provide feedback on a generated section and regenerate with revisions
- **Template library** — save and reuse prompts for recurring client types (e.g., "mid-market manufacturing on NetSuite")
- **Change order generation** — detect scope changes between versions and auto-draft a change order document
- **Client portal view** — read-only shareable link for clients to review deliverables without needing agent access
- **SAP S/4HANA and Sage Intacct** — expand platform coverage to the two largest underserved segments

---

## About This Project

Built to demonstrate the application of AI to a real, high-friction workflow in the ERP consulting industry. The core insight is that consulting deliverables are highly structured and formulaic — which makes them an ideal target for AI generation when given the right source material and platform context.

The problem is real: ERP implementations routinely run over budget on labor hours, and a significant portion of that overrun is documentation work, not strategic advisory work. Tools like this shift where consultants spend their time.
