# Prompt Engineering Design Notes
## ERP Deliverable Agent

This document explains the prompting strategy behind the three-stage deliverable pipeline.

---

## Design Principles

### 1. Platform specificity over generality
The prompts inject the ERP platform's full technology stack string directly into the system prompt. This is the single biggest quality lever. A consultant reviewing NetSuite output knows immediately whether the AI understands the platform — if it references `SuiteScript 2.x`, `SuiteFlow`, and `SuiteTalk REST`, it passes the smell test. If it says "custom scripts and workflows" generically, it fails.

### 2. Chained context, not repeated generation
Each stage receives the previous stage's output as input context. The BPFN prompt receives the full FDD. The test prompt receives both the FDD and the BPFN. This means:
- Test scripts reference the exact process steps defined in the BPFN
- The BPFN process flows are grounded in the requirements structure of the FDD
- Hallucination risk decreases at each stage because the model is referencing its own prior structured output

### 3. Structured output contracts
The BPFN prompt uses explicit delimiters to separate two distinct outputs in one API call:
```
===NARRATIVE_START=== ... ===NARRATIVE_END===
===DIAGRAM_START=== ... ===DIAGRAM_END===
```
This avoids a second API call to generate the diagram separately, and makes parsing deterministic. The diagram block specifies Mermaid syntax requirements inline (no backticks, TD direction, subgraph blocks for phases, diamond shapes for decisions).

### 4. Role + firm framing
Every system prompt opens with:
> "You are a senior [Platform] implementation consultant at Logan Consulting, a top-tier ERP consulting firm."

This isn't decorative. It sets the register, vocabulary, and level of assumed expertise for the output. Output written "as a senior consultant" uses more precise terminology, assumes platform knowledge in the reader, and avoids over-explaining basics.

---

## Prompt Structure by Stage

### Stage 1: FDD Prompt

**System prompt components:**
1. Role + firm framing
2. Platform name + full tech stack string
3. Modules in scope (label + description for each selected module)
4. Exact output structure specification (section by section, including table schemas)
5. Closing instruction: "Be exhaustive and technically precise. A [platform] consultant must be able to configure the system from this document without ambiguity."

**User message:**
- ERP platform, project name, client name, module list
- Full source material (pasted text + any PDF documents as base64)

**Key design choice:** The section structure in the prompt is prescriptive down to column names in tables. This prevents the model from improvising structure, which produces inconsistent output that's harder to edit.

---

### Stage 2: BPFN Prompt

**System prompt components:**
1. Role framing (business process analyst variant)
2. Modules in scope
3. Delimiter contract for split output
4. Narrative structure specification
5. Mermaid diagram requirements (explicit syntax rules to prevent rendering failures)

**User message:**
- Platform, modules
- Full FDD from Stage 1

**Key design choice:** The Mermaid block requirements are injected as a comment within the diagram section specification:
```
[Complete Mermaid TD flowchart. Requirements:
- NO backticks, NO mermaid label — raw code only
- Use subgraph blocks for each major phase/module
- Use diamond {} shapes for all decision points...]
```
Without these constraints, the model commonly wraps diagram code in markdown fences, breaking the parser, or omits decision diamonds, producing linear diagrams that don't reflect actual process logic.

---

### Stage 3: Test Prompt

**System prompt components:**
1. Role framing (QA and UAT consultant variant)
2. Modules in scope
3. Test documentation structure specification
4. Per-scenario script template (with explicit table column names)
5. Instruction to generate 10–15 scenarios covering: happy path, negative/error cases, cross-module integration, edge cases, UAT

**User message:**
- Platform, modules
- Full FDD from Stage 1
- Full BPFN narrative from Stage 2

**Key design choice:** The prompt specifies that each scenario in the summary table must have a corresponding full script below. Without this explicit instruction, the model tends to generate the summary table and then write abbreviated scripts for only a subset of scenarios.

---

## What Doesn't Work Well (Known Limitations)

| Issue | Observed behavior | Workaround |
|---|---|---|
| Thin source material | With only a few sentences of input, FDDs become generic and fill sections with placeholder-like content | Document: encourage users to paste full transcripts or upload documents |
| Very large scope (8+ modules) | Token pressure causes later sections (risks, open items) to be truncated or abbreviated | Recommend scoping to ≤5 modules per generation; run separate passes for large implementations |
| Mermaid rendering failures | Complex diagrams with many nodes occasionally produce syntax errors | Fallback: surface raw diagram code with a link to mermaid.live |
| Cross-module integration specificity | Integration architecture table can be generic when source material doesn't describe integrations | Prompt improvement opportunity: explicitly ask model to infer likely integrations from module combination |
