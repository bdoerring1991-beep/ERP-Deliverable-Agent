import { useState, useEffect, useRef, useCallback } from "react";
import * as mammoth from "mammoth";

// ─────────────────────────────────────────────────────────────
// ERP CONFIG — FULL MODULE LIBRARIES
// ─────────────────────────────────────────────────────────────
const ERP_CONFIG = {
  netsuite: {
    label: "Oracle NetSuite", short: "NetSuite", color: "#E8590C",
    tech: "SuiteScript 2.x, SuiteFlow, SuiteTalk REST/SOAP, custom record types, saved searches, workflow actions, Advanced PDF/HTML templates, SuiteAnalytics Connect, SuiteCommerce, SuitePeople",
    modules: [
      { id:"otc",    label:"Order to Cash",              sub:"Quote, SO, fulfillment, invoicing, cash application" },
      { id:"ptp",    label:"Procure to Pay",              sub:"Req, PO, receipt, vendor bill, payment run" },
      { id:"wms",    label:"Warehouse Management",        sub:"Receive, putaway, pick/pack/ship, cycle count, RF scanning" },
      { id:"inv",    label:"Inventory Management",        sub:"Multi-location inventory, lot/serial, bin tracking, transfers" },
      { id:"mfg",    label:"Manufacturing",               sub:"Work orders, BOM, routing, production scheduling, MRP" },
      { id:"ap",     label:"AP Automation",               sub:"Invoice capture, 3-way match, approval workflows, payment runs" },
      { id:"ar",     label:"AR & Collections",            sub:"Invoicing, cash application, dunning, dispute management" },
      { id:"rev",    label:"Revenue Recognition",         sub:"ASC 606, multi-element arrangements, rev schedules, VSOE" },
      { id:"fa",     label:"Fixed Assets",                sub:"Asset lifecycle, depreciation, disposal, revaluation" },
      { id:"gl",     label:"Financial Management",        sub:"GL, consolidation, budgeting, financial close, reporting" },
      { id:"proj",   label:"Project Management",          sub:"Project tracking, time/expense, project billing, WBS" },
      { id:"crm",    label:"CRM & Sales Force",           sub:"Leads, opportunities, forecasting, customer portal" },
      { id:"ecom",   label:"SuiteCommerce",               sub:"B2B/B2C storefront, catalog, pricing, checkout, My Account" },
      { id:"hr",     label:"HR & Payroll (SuitePeople)",  sub:"Employee records, payroll, time tracking, benefits" },
      { id:"plan",   label:"Demand Planning",             sub:"Demand sensing, safety stock, reorder planning, reports" },
    ],
  },
  qad: {
    label: "QAD ERP", short: "QAD", color: "#0F5DBE",
    tech: "QAD Adaptive ERP / QAD EE, Progress OpenEdge, QAD Automation Solutions, QAD Cloud ERP, .NET UI / Activity-Based Nav, QAD BI & Analytics, QAD Supplier Portal, QAD DynaSys",
    modules: [
      { id:"mfg",    label:"Discrete Manufacturing",      sub:"BOM, routing, work orders, standard/actual costing" },
      { id:"mrp",    label:"MRP & Production Planning",   sub:"Demand, MPS, capacity planning, finite scheduling" },
      { id:"sfc",    label:"Shop Floor Control",          sub:"Work centers, operations, labor reporting, WIP tracking" },
      { id:"qm",     label:"Quality Management",          sub:"Inspection plans, NCRs, CAPA, CoC, supplier quality" },
      { id:"sup",    label:"Supplier Management",         sub:"Supplier portal, scorecards, EDI, ASN, blanket POs" },
      { id:"fin",    label:"Financial Management",        sub:"GL, AP, AR, multi-entity, consolidation, close management" },
      { id:"dist",   label:"Distribution & Inventory",   sub:"Multi-site inventory, transfers, bin management, 3PL" },
      { id:"lean",   label:"Lean Manufacturing",          sub:"Kanban, flow scheduling, pull-based production" },
      { id:"pm",     label:"Plant Maintenance",           sub:"Preventive maintenance, work orders, asset tracking" },
      { id:"cust",   label:"Customer Management",         sub:"Customer orders, pricing, credit, returns (RMA)" },
      { id:"srvc",   label:"Service & Support",           sub:"Field service, service contracts, depot repair" },
      { id:"reg",    label:"Regulatory & Compliance",     sub:"FDA 21 CFR Part 11, AS9100, ISO, ITAR, DFARS traceability" },
      { id:"edi",    label:"EDI & Integration",           sub:"Trading partner EDI, API integration, QAD Automation Solutions" },
      { id:"bi",     label:"Analytics & BI",              sub:"QAD BI, operational reports, KPI dashboards" },
      { id:"pacc",   label:"Project Accounting",          sub:"Project costing, WIP, milestone billing, project P&L" },
    ],
  },
  dynamics: {
    label: "Microsoft Dynamics 365", short: "D365", color: "#0078D4",
    tech: "Power Platform, Power Automate, Dataverse, D365 Finance & Operations, D365 Business Central, AL extensions, Azure Integration Services, Power BI Embedded, Microsoft Copilot, LCS, Azure DevOps",
    modules: [
      { id:"fin",    label:"Finance & Accounting",        sub:"GL, AP, AR, fixed assets, budgeting, financial close" },
      { id:"scm",    label:"Supply Chain Management",     sub:"Procurement, inventory, cost management, quality orders" },
      { id:"whs",    label:"Warehouse Management",        sub:"WMS, mobile device, license plating, wave/cluster picking" },
      { id:"mfg",    label:"Manufacturing",               sub:"Production orders, BOM, MRP, job scheduling, shop floor" },
      { id:"sales",  label:"Sales & CRM",                 sub:"Leads, opportunities, quotes, account management" },
      { id:"cs",     label:"Customer Service",            sub:"Case management, SLA, knowledge base, omnichannel" },
      { id:"fs",     label:"Field Service",               sub:"Work orders, scheduling board, mobile, IoT alerts, assets" },
      { id:"proj",   label:"Project Operations",          sub:"Project accounting, resource mgmt, T&M/fixed-fee billing" },
      { id:"hr",     label:"Human Resources",             sub:"Employee lifecycle, compensation, leave, benefits" },
      { id:"mkt",    label:"Marketing",                   sub:"Campaign mgmt, journeys, segments, Customer Insights" },
      { id:"comm",   label:"Commerce",                    sub:"B2B/B2C eCommerce, POS, channel management, omnichannel" },
      { id:"am",     label:"Asset Management",            sub:"Enterprise assets, maintenance plans, work orders, IoT" },
      { id:"pbi",    label:"Power BI & Analytics",        sub:"Embedded analytics, Power BI dashboards, Azure Synapse" },
      { id:"bc",     label:"Business Central (SMB)",      sub:"Finance, sales, purchase, inventory, projects for SMB" },
      { id:"pp",     label:"Power Platform",              sub:"Power Automate flows, Power Apps, custom connectors" },
    ],
  },
  acumatica: {
    label: "Acumatica Cloud ERP", short: "Acumatica", color: "#7B3FE4",
    tech: "Acumatica xRP platform, Generic Inquiries, Push Notifications, customization project framework, OData/REST/SOAP APIs, Acumatica DevOps, Report Designer, Acumatica Marketplace, Velixo",
    modules: [
      { id:"fin",    label:"Financial Management",        sub:"GL, AP, AR, cash management, consolidation, multi-currency" },
      { id:"dist",   label:"Distribution",                sub:"Purchasing, inventory, order management, shipping, 3PL" },
      { id:"mfg",    label:"Manufacturing",               sub:"BOM, MRP, production orders, estimating, costing" },
      { id:"proj",   label:"Project Accounting",          sub:"Job costing, project billing, T&M, fixed-fee, WIP" },
      { id:"const",  label:"Construction",                sub:"Job cost, subcontracts, retainage, compliance, AIA billing" },
      { id:"comm",   label:"Commerce",                    sub:"B2B/B2C storefront, omnichannel, marketplace connectors" },
      { id:"fs",     label:"Field Service",               sub:"Appointments, dispatching, equipment, SLA contracts, mobile" },
      { id:"crm",    label:"CRM",                         sub:"Leads, opportunities, contacts, marketing campaigns" },
      { id:"pay",    label:"Payroll",                     sub:"Multi-state payroll, direct deposit, tax filing, time entry" },
      { id:"te",     label:"Time & Expenses",             sub:"Time tracking, expense reports, approvals, project billing" },
      { id:"inv",    label:"Inventory & WMS",             sub:"Multi-warehouse, bins, lot/serial, cycle counting, RF" },
      { id:"srvc",   label:"Service Management",          sub:"Service contracts, warranties, repair orders, scheduling" },
      { id:"eq",     label:"Equipment Management",        sub:"Asset lifecycle, preventive maintenance, meter readings" },
      { id:"rpt",    label:"Reporting & Analytics",       sub:"Generic Inquiries, Velixo Excel reporting, dashboards" },
      { id:"int",    label:"Integration & API",           sub:"REST/OData APIs, Acumatica DevOps, marketplace connectors" },
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// PROMPTS
// ─────────────────────────────────────────────────────────────
const buildFDDPrompt = (erpKey, modules) => {
  const e = ERP_CONFIG[erpKey];
  const modList = modules.map(id => {
    const m = e.modules.find(x => x.id === id);
    return m ? `  - ${m.label}: ${m.sub}` : "";
  }).filter(Boolean).join("\n");
  return `You are a senior ${e.label} implementation consultant at Logan Consulting, a top-tier ERP consulting firm.

Platform: ${e.label}
Technologies: ${e.tech}
Modules in Scope:
${modList}

Produce a comprehensive, professional Function Design Document (FDD). Use ${e.short}-specific terminology, record types, object names, and module names throughout. Every section must be specific to the modules in scope.

Format your response as clean markdown following this exact structure:

# Function Design Document

## Document Control
| Field | Value |
|---|---|
| Project | [from source material] |
| ERP Platform | ${e.label} |
| Modules in Scope | ${modules.map(id => e.modules.find(x=>x.id===id)?.label).filter(Boolean).join(", ")} |
| Version | 1.0 |
| Status | Draft |
| Prepared By | Logan Consulting |
| Date | ${new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})} |
| Confidentiality | Confidential — Client Use Only |

## Executive Summary
3–4 sentences summarizing the business context, the modules being implemented, and the expected outcomes.

## Scope Overview
Brief narrative defining what is in scope and explicitly what is out of scope.

## Business Requirements
For each requirement use: **BR-[###]** — [Clear requirement statement]. _(Source: [stakeholder name or document])_
Organize by module if multiple modules are in scope.

## Functional Requirements
| ID | Requirement Statement | Priority | ${e.short} Module / Object | Acceptance Criteria |
|---|---|---|---|---|
Use priorities: Critical, High, Medium, Low. Be specific about ${e.short} objects (record types, forms, lists, scripts, workflows).

## Technical Design & Specifications
Organize by module. For each module describe:
- ${e.short} configuration objects and settings
- Custom fields, forms, sublists
- Workflow / SuiteFlow / script logic
- Specific setup steps with technical detail

## Integration Architecture
| Integration | Source System | Target System | Method | Data Objects | Trigger | Frequency |
|---|---|---|---|---|---|---|

## Data Mapping
| Source Field | Source System | Target Field | ${e.short} Record / Object | Data Type | Transformation Logic | Required |
|---|---|---|---|---|---|---|

## Security & Access Control
| Role | Module Access | Record Permissions | Notes |
|---|---|---|---|

## Assumptions & Constraints
- [Each assumption on its own line, clearly stated]

## Risks & Mitigations
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|

## Open Items & Action Items
| ID | Description | Owner | Due Date | Status |
|---|---|---|---|---|

Be exhaustive and technically precise. A ${e.short} consultant must be able to configure the system from this document without ambiguity.`;
};

const buildBPFNPrompt = (erpKey, modules) => {
  const e = ERP_CONFIG[erpKey];
  const modNames = modules.map(id => e.modules.find(x=>x.id===id)?.label).filter(Boolean).join(", ");
  return `You are a senior ${e.label} business process analyst at Logan Consulting.

Modules in Scope: ${modNames}

From the FDD provided, generate a comprehensive Business Process Flow Narrative and a Mermaid flowchart diagram. Return EXACTLY this structure with no deviations:

===NARRATIVE_START===
# Business Process Flow Narrative

## Process Overview
Comprehensive end-to-end narrative of the process using ${e.short} terminology.

## Roles & Responsibilities
| Role | System Role / Permission | Key Responsibilities | ${e.short} Access Level |
|---|---|---|---|

## Process Flow — Step by Step

### [Phase Name for each major phase]
**Step [N] — [Role]:** Detailed description of the action taken, the ${e.short} screen or record used, any system logic triggered, and the output or next step.
[Continue for all steps across all phases]

## ${e.short} System Touchpoints
| Step | Module | Record / Transaction | Screen / Form | Trigger |
|---|---|---|---|---|

## Business Rules & Decision Logic
| Rule ID | Condition | Logic | Outcome |
|---|---|---|---|

## Exception Handling & Error Paths
For each exception: describe the condition, who handles it, what happens in ${e.short}, and the resolution path.

## KPIs & Success Metrics
| Metric | Definition | Target | Measurement Method |
|---|---|---|---|
===NARRATIVE_END===

===DIAGRAM_START===
flowchart TD
[Complete Mermaid TD flowchart. Requirements:
- NO backticks, NO mermaid label — raw code only
- Use subgraph blocks for each major phase/module
- Use diamond {} shapes for all decision points
- Use stadium shapes ([[ ]]) for start/end
- Use real ${e.short} transaction and record names as node labels
- Keep node labels concise (max 6 words)
- Cover all steps and decisions from the narrative
- Connect all paths including exceptions]
===DIAGRAM_END===`;
};

const buildTestPrompt = (erpKey, modules) => {
  const e = ERP_CONFIG[erpKey];
  const modNames = modules.map(id => e.modules.find(x=>x.id===id)?.label).filter(Boolean).join(", ");
  return `You are a senior ${e.label} QA and UAT consultant at Logan Consulting.

Modules in Scope: ${modNames}

From the FDD and Business Process Flow Narrative provided, generate a complete, professional test documentation package. Cover all modules in scope.

Format as clean markdown:

# Test Documentation

## Document Control
| Field | Value |
|---|---|
| Project | [from FDD] |
| ERP Platform | ${e.label} |
| Modules Tested | ${modNames} |
| Version | 1.0 |
| Prepared By | Logan Consulting |
| Date | ${new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})} |

## Test Strategy Overview
Brief description of the testing approach, environments, and entry/exit criteria.

## Test Scenario Summary
| Scenario ID | Scenario Name | Module | Test Type | Priority | Estimated Duration |
|---|---|---|---|---|---|
[Generate 10–15 scenarios covering: happy path per module, negative/error cases, cross-module integration, edge cases, UAT scenarios]

## Detailed Test Scripts

[For EVERY scenario in the summary table, generate a complete script:]

---

### [TS-001]: [Full Scenario Name]

| Field | Value |
|---|---|
| Objective | [What this test validates] |
| Module(s) | [${e.short} module names] |
| Test Type | Unit / Integration / UAT / Regression / Performance |
| Priority | Critical / High / Medium / Low |
| Estimated Duration | [X minutes] |

**Prerequisites**
- [${e.short} configuration that must be complete]
- [Master data records that must exist — be specific]
- [User roles and permissions required]
- [Prior test cases that must pass first, if any]

**Test Data**
| Field | Value |
|---|---|
| [Specific field names relevant to ${e.short}] | [Realistic sample values] |

**Test Execution Steps**
| Step | Actor | ${e.short} Navigation Path | Action | Input Data | Expected Result | Pass ☐ Fail ☐ |
|---|---|---|---|---|---|---|

**Pass Criteria**
[Specific, measurable, unambiguous definition of pass]

**Fail Criteria & Defect Severity**
[What constitutes a failure and how it should be classified]

**Rollback / Cleanup Steps**
[Exactly how to undo this test case]

**Notes / Defect Log**
| Defect ID | Description | Severity | Status | Assigned To |
|---|---|---|---|---|
| | | | | |

---

[Repeat for all scenarios]`;
};

// ─────────────────────────────────────────────────────────────
// API
// ─────────────────────────────────────────────────────────────
async function callClaude(system, userText, pdfFiles = []) {
  const content = [];
  pdfFiles.forEach(f => content.push({ type:"document", source:{ type:"base64", media_type:"application/pdf", data:f.data } }));
  content.push({ type:"text", text:userText });
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:8096, system, messages:[{ role:"user", content }] })
  });
  const d = await res.json();
  if (d.error) throw new Error(d.error.message);
  return d.content.find(b => b.type==="text")?.text ?? "";
}

// ─────────────────────────────────────────────────────────────
// WORD EXPORT — PROFESSIONAL QUALITY
// ─────────────────────────────────────────────────────────────
function buildWordDoc(sections, meta) {
  // sections: [{title, content (markdown)}]
  // meta: {project, erp, modules, docType}
  const today = new Date().toLocaleDateString("en-US",{ year:"numeric", month:"long", day:"numeric" });

  const parseMd = (md) => {
    if (!md) return "";
    let h = md
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
      .replace(/^#### (.+)$/gm, s => `<h4>${s.slice(5)}</h4>`)
      .replace(/^### (.+)$/gm,  s => `<h3>${s.slice(4)}</h3>`)
      .replace(/^## (.+)$/gm,   s => `<h2>${s.slice(3)}</h2>`)
      .replace(/^# (.+)$/gm,    s => `<h1>${s.slice(2)}</h1>`)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g,     "<em>$1</em>")
      .replace(/_\((.+?)\)_/g,   "<em>($1)</em>")
      .replace(/`([^`]+)`/g,     "<code>$1</code>")
      .replace(/^---+$/gm,       "<hr/>")
      .replace(/^- (.+)$/gm,     "<li>$1</li>")
      .replace(/^(\d+)\. (.+)$/gm, "<li>$1. $2</li>");

    // Tables
    h = h.replace(/((\|[^\n]+\|\n?)+)/g, block => {
      const rows = block.trim().split("\n").filter(r => r.trim() && !/^\|[-| :]+\|$/.test(r));
      if (!rows.length) return block;
      let t = '<table>';
      rows.forEach((row, i) => {
        const cells = row.split("|").slice(1,-1).map(c => c.trim());
        if (i === 0) t += `<thead><tr>${cells.map(c => `<th>${c}</th>`).join("")}</tr></thead><tbody>`;
        else t += `<tr class="${i%2===0?"even":""}">${cells.map(c => `<td>${c}</td>`).join("")}</tr>`;
      });
      return t + "</tbody></table>";
    });

    h = h.replace(/(<li>[\s\S]*?<\/li>\s*)+/g, m => `<ul>${m}</ul>`);
    h = h.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br/>");
    return `<p>${h}</p>`;
  };

  const coverPage = `
    <div class="cover">
      <div class="cover-logo">
        <span class="cover-logo-name">Logan Consulting</span>
      </div>
      <div class="cover-content">
        <div class="cover-doc-type">${meta.docType}</div>
        <div class="cover-project">${meta.project || "ERP Implementation"}</div>
        <div class="cover-sub">${meta.erp}</div>
        ${meta.modules ? `<div class="cover-modules">${meta.modules}</div>` : ""}
      </div>
      <div class="cover-footer">
        <div class="cover-footer-row">
          <span>Prepared by Logan Consulting</span>
          <span>${today}</span>
        </div>
        <div class="cover-footer-row confidential">Confidential — For Client Use Only</div>
      </div>
    </div>
    <br style="page-break-after:always"/>`;

  const toc = sections.length > 1 ? `
    <div class="toc-section">
      <h2>Table of Contents</h2>
      <table class="toc-table">
        ${sections.map((s,i) => `<tr><td class="toc-num">${i+1}</td><td class="toc-title">${s.title}</td></tr>`).join("")}
      </table>
    </div>
    <br style="page-break-after:always"/>` : "";

  const body = sections.map((s, i) => `
    <div class="doc-section">
      ${parseMd(s.content)}
    </div>
    ${i < sections.length-1 ? '<br style="page-break-after:always"/>' : ""}
  `).join("");

  return `<html xmlns:o='urn:schemas-microsoft-com:office:office'
               xmlns:w='urn:schemas-microsoft-com:office:word'
               xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>${meta.docType} — ${meta.project}</title>
<style>
  /* Page */
  @page { margin: 1in 1.1in 1in 1.1in; }
  @page :first { margin: 0; }
  body { font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 10.5pt; color: #1a1a1a; line-height: 1.55; margin: 0; padding: 0; }

  /* Cover */
  .cover { width: 100%; min-height: 9in; display: flex; flex-direction: column; justify-content: space-between; padding: 0.8in 1.1in; background: #ffffff; }
  .cover-logo { border-bottom: 3px solid #1a1a1a; padding-bottom: 16pt; margin-bottom: 0; }
  .cover-logo-name { font-size: 20pt; font-weight: 700; color: #1a1a1a; letter-spacing: -0.5pt; }
  .cover-content { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 60pt 0; }
  .cover-doc-type { font-size: 11pt; font-weight: 400; color: #6b7280; letter-spacing: 1pt; text-transform: uppercase; margin-bottom: 14pt; }
  .cover-project { font-size: 28pt; font-weight: 700; color: #1a1a1a; line-height: 1.15; margin-bottom: 10pt; letter-spacing: -0.5pt; }
  .cover-sub { font-size: 13pt; color: #4b5563; margin-bottom: 8pt; }
  .cover-modules { font-size: 10pt; color: #6b7280; margin-top: 6pt; line-height: 1.7; }
  .cover-footer { border-top: 1px solid #e5e7eb; padding-top: 12pt; }
  .cover-footer-row { font-size: 9pt; color: #9ca3af; display: flex; justify-content: space-between; margin-bottom: 4pt; }
  .cover-footer-row.confidential { color: #6b7280; font-weight: 600; display: block; margin-top: 4pt; }

  /* TOC */
  .toc-section { padding: 0.6in 0 0.3in; }
  .toc-section h2 { font-size: 18pt; font-weight: 700; color: #1a1a1a; margin: 0 0 20pt; padding-bottom: 8pt; border-bottom: 2px solid #1a1a1a; }
  .toc-table { width: 100%; border-collapse: collapse; }
  .toc-table td { padding: 7pt 0; border-bottom: 1px solid #f3f4f6; font-size: 11pt; }
  .toc-num { width: 28pt; color: #9ca3af; font-weight: 400; }
  .toc-title { color: #1a1a1a; font-weight: 500; }

  /* Headings */
  h1 { font-size: 20pt; font-weight: 700; color: #1a1a1a; margin: 0 0 18pt; padding-bottom: 8pt; border-bottom: 2px solid #1a1a1a; page-break-after: avoid; }
  h2 { font-size: 13pt; font-weight: 700; color: #1a1a1a; margin: 20pt 0 8pt; padding-bottom: 5pt; border-bottom: 1px solid #e5e7eb; page-break-after: avoid; }
  h3 { font-size: 11.5pt; font-weight: 700; color: #374151; margin: 16pt 0 6pt; page-break-after: avoid; }
  h4 { font-size: 10.5pt; font-weight: 700; color: #4b5563; margin: 12pt 0 4pt; page-break-after: avoid; }
  h1, h2, h3, h4 { font-family: Calibri, 'Segoe UI', Arial, sans-serif; }

  /* Body text */
  p { margin: 0 0 8pt; font-size: 10.5pt; color: #1a1a1a; }
  strong { font-weight: 700; color: #111827; }
  em { font-style: italic; color: #4b5563; }
  code { font-family: 'Courier New', Courier, monospace; font-size: 9.5pt; background: #f9fafb; padding: 1pt 4pt; border: 1px solid #e5e7eb; }
  hr { border: none; border-top: 1px solid #e5e7eb; margin: 14pt 0; }
  ul { margin: 6pt 0 10pt 18pt; padding: 0; }
  li { margin: 3pt 0; font-size: 10.5pt; color: #1a1a1a; line-height: 1.5; }

  /* Tables */
  table { border-collapse: collapse; width: 100%; margin: 10pt 0 14pt; font-size: 9.5pt; page-break-inside: avoid; }
  thead tr { background: #111827; }
  thead th { color: #ffffff; font-weight: 600; padding: 7pt 9pt; text-align: left; border: 1px solid #1f2937; font-size: 9.5pt; line-height: 1.4; }
  tbody td { padding: 6pt 9pt; border: 1px solid #e5e7eb; vertical-align: top; line-height: 1.5; color: #1a1a1a; }
  tbody tr.even td { background: #f9fafb; }
  tbody tr:hover td { background: #f3f4f6; }

  /* Section wrapper */
  .doc-section { padding: 0.5in 0 0.3in; }
</style>
</head>
<body>
${coverPage}
${toc}
${body}
</body>
</html>`;
}

function downloadWord(markdown, filename, meta) {
  try {
    const html = buildWordDoc([{ title: meta.docType, content: markdown }], meta);
    const blob = new Blob(["\ufeff", html], { type:"application/msword" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `${filename}.doc`; a.style.display = "none";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  } catch(e) {
    try {
      const html = buildWordDoc([{ title: meta.docType, content: markdown }], meta);
      const w = window.open("about:blank","_blank");
      if (w) { w.document.open(); w.document.write(html); w.document.close(); }
    } catch(e2) { console.error("Download failed:", e2); }
  }
}

function downloadAllWord(fdd, bpfn, tests, filename, meta) {
  try {
    const sections = [
      { title:"Function Design Document",          content:fdd   },
      { title:"Business Process Flow Narrative",   content:bpfn  },
      { title:"Test Scenarios & Scripts",          content:tests },
    ];
    const html = buildWordDoc(sections, { ...meta, docType:"Full Deliverable Package" });
    const blob = new Blob(["\ufeff", html], { type:"application/msword" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `${filename}.doc`; a.style.display = "none";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  } catch(e) { console.error("Download failed:", e); }
}

// ─────────────────────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────────────────────
async function saveVersion(data) {
  try {
    let idx = [];
    try { const r = await window.storage.get("lc:idx3"); if (r) idx = JSON.parse(r.value); } catch {}
    const id = Date.now().toString();
    idx.unshift({ id, erp:data.erp, project:data.project, modules:data.modules, date:new Date().toLocaleDateString() });
    if (idx.length > 30) idx = idx.slice(0, 30);
    await window.storage.set("lc:idx3", JSON.stringify(idx));
    await window.storage.set(`lc:p3:${id}`, JSON.stringify(data));
  } catch(e) { console.warn("Storage:", e); }
}
async function loadHistory() { try { const r = await window.storage.get("lc:idx3"); return r ? JSON.parse(r.value) : []; } catch { return []; } }
async function loadVersion(id) { try { const r = await window.storage.get(`lc:p3:${id}`); return r ? JSON.parse(r.value) : null; } catch { return null; } }

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const STAGES = ["intake","fdd","bpfn","tests"];
const STAGE_META = [
  { id:"intake", n:1, label:"Setup" },
  { id:"fdd",    n:2, label:"FDD"   },
  { id:"bpfn",   n:3, label:"BPFN"  },
  { id:"tests",  n:4, label:"Tests" },
];

// ─────────────────────────────────────────────────────────────
// UI COMPONENTS
// ─────────────────────────────────────────────────────────────
const T = {
  label: { display:"block", fontSize:11, fontWeight:600, color:"#6b7280", letterSpacing:"0.05em", textTransform:"uppercase", marginBottom:6 },
  input: { width:"100%", border:"1px solid #e5e7eb", borderRadius:6, fontSize:14, padding:"9px 12px", color:"#111827", background:"#fff", outline:"none", fontFamily:"inherit" },
  mono:  { fontFamily:"'SF Mono','Fira Code','Consolas',monospace" },
};

function Lbl({ children }) { return <span style={T.label}>{children}</span>; }

function Tag({ children, color, onRemove }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, fontWeight:500,
      padding:"3px 9px", borderRadius:4, background:`${color}12`, color:color,
      border:`1px solid ${color}30`, whiteSpace:"nowrap" }}>
      {children}
      {onRemove && <span onClick={onRemove} style={{ cursor:"pointer", opacity:.6, fontSize:13, lineHeight:1 }}>×</span>}
    </span>
  );
}

function Btn({ children, onClick, disabled, variant="ghost", small }) {
  const base = { display:"inline-flex", alignItems:"center", gap:5, borderRadius:6,
    fontSize:small?11:13, fontWeight:variant==="primary"?600:400, cursor:disabled?"not-allowed":"pointer",
    whiteSpace:"nowrap", padding:small?"5px 10px":"8px 16px", fontFamily:"inherit",
    opacity:disabled?.35:1, border:"none", transition:"background .12s" };
  const v = {
    primary: { background:"#111827", color:"#fff" },
    ghost:   { background:"transparent", color:"#6b7280", border:"1px solid #e5e7eb" },
    success: { background:"#f0fdf4", color:"#166534", border:"1px solid #bbf7d0" },
  };
  return <button style={{ ...base, ...v[variant] }} onClick={onClick} disabled={disabled}>{children}</button>;
}

function StatusPill({ children, ready }) {
  return <span style={{ fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:20,
    background:ready?"#f0fdf4":"#f9fafb", color:ready?"#166534":"#6b7280",
    border:`1px solid ${ready?"#bbf7d0":"#e5e7eb"}` }}>{children}</span>;
}

function Steps({ stage, onJump }) {
  const si = STAGES.indexOf(stage);
  return (
    <div style={{ display:"flex", alignItems:"center", marginBottom:28 }}>
      {STAGE_META.map((s, i) => {
        const done = i < si, active = i === si;
        return (
          <div key={s.id} style={{ display:"flex", alignItems:"center" }}>
            <div onClick={() => done && onJump(s.id)} style={{ display:"flex", alignItems:"center", gap:7, cursor:done?"pointer":"default" }}>
              <div style={{ width:24, height:24, borderRadius:"50%", flexShrink:0, display:"flex",
                alignItems:"center", justifyContent:"center", transition:"all .2s",
                border:`1.5px solid ${(done||active)?"#111827":"#d1d5db"}`,
                background:(done||active)?"#111827":"transparent" }}>
                {done
                  ? <svg width="10" height="10" viewBox="0 0 10 10"><path d="M1.5 5l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
                  : <span style={{ fontSize:11, fontWeight:600, color:active?"#fff":"#9ca3af", lineHeight:1 }}>{s.n}</span>}
              </div>
              <span style={{ fontSize:13, fontWeight:active?600:400, color:done?"#9ca3af":active?"#111827":"#9ca3af" }}>{s.label}</span>
            </div>
            {i < 3 && <div style={{ width:24, height:1, background:"#e5e7eb", margin:"0 10px", flexShrink:0 }}/>}
          </div>
        );
      })}
    </div>
  );
}

function DocViewer({ content }) {
  return (
    <div style={{ background:"#fafafa", border:"1px solid #e5e7eb", borderRadius:6,
      padding:"16px 18px", maxHeight:540, overflowY:"auto",
      ...T.mono, fontSize:12, lineHeight:1.85, color:"#374151",
      whiteSpace:"pre-wrap", wordBreak:"break-word" }}>
      {content || ""}
    </div>
  );
}

function ActionBar({ left, right }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
      marginTop:14, paddingTop:14, borderTop:"1px solid #f3f4f6", flexWrap:"wrap", gap:8 }}>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>{left}</div>
      <div>{right}</div>
    </div>
  );
}

function FileDropZone({ onFiles }) {
  const [drag, setDrag] = useState(false);
  const ref = useRef();
  const process = async (fileList) => {
    const results = await Promise.all(Array.from(fileList).map(async f => {
      const ext = f.name.split(".").pop().toLowerCase();
      if (ext==="txt")  return { name:f.name, type:"text", text:await f.text() };
      if (ext==="pdf")  { const ab=await f.arrayBuffer(); return { name:f.name, type:"pdf", data:btoa(String.fromCharCode(...new Uint8Array(ab))) }; }
      if (ext==="docx") { const ab=await f.arrayBuffer(); const r=await mammoth.extractRawText({arrayBuffer:ab}); return { name:f.name, type:"text", text:r.value }; }
      return null;
    }));
    onFiles(results.filter(Boolean));
  };
  return (
    <div onClick={() => ref.current?.click()}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); process(e.dataTransfer.files); }}
      style={{ border:`1px dashed ${drag?"#6b7280":"#d1d5db"}`, borderRadius:6, padding:"13px 16px",
        cursor:"pointer", display:"flex", alignItems:"center", gap:12,
        background:drag?"#f9fafb":"#fff", transition:"all .15s" }}>
      <input ref={ref} type="file" multiple accept=".txt,.pdf,.docx" style={{ display:"none" }} onChange={e => process(e.target.files)}/>
      <div style={{ width:32, height:32, borderRadius:6, background:"#f3f4f6", display:"flex",
        alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 10V4M7 4L4.5 6.5M7 4L9.5 6.5" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M2 11h10" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <div>
        <div style={{ fontSize:13, color:"#374151", fontWeight:500 }}>Drop files or click to upload</div>
        <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>.txt · .pdf · .docx</div>
      </div>
    </div>
  );
}

function HistoryModal({ onLoad, onClose }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);
  useEffect(() => { loadHistory().then(h => { setItems(h); setReady(true); }); }, []);
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.2)", zIndex:999,
      display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:"#fff", border:"1px solid #e5e7eb",
        borderRadius:10, width:"100%", maxWidth:480, maxHeight:"72vh", overflowY:"auto",
        boxShadow:"0 20px 60px rgba(0,0,0,0.1)" }}>
        <div style={{ padding:"16px 20px", borderBottom:"1px solid #f3f4f6",
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:14, fontWeight:600, color:"#111827" }}>Saved Projects</span>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", fontSize:20, lineHeight:1 }}>×</button>
        </div>
        <div>
          {!ready && <p style={{ padding:"20px", color:"#9ca3af", fontSize:13 }}>Loading…</p>}
          {ready && items.length===0 && <p style={{ padding:"20px", color:"#9ca3af", fontSize:13 }}>No saved projects yet.</p>}
          {items.map(item => (
            <div key={item.id} onClick={() => onLoad(item.id)}
              style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 20px",
                cursor:"pointer", borderBottom:"1px solid #f9fafb" }}
              onMouseEnter={e => e.currentTarget.style.background="#f9fafb"}
              onMouseLeave={e => e.currentTarget.style.background="transparent"}>
              <div style={{ width:7, height:7, borderRadius:"50%", flexShrink:0, background:ERP_CONFIG[item.erp]?.color||"#9ca3af" }}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:500, color:"#111827", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.project||"Untitled"}</div>
                <div style={{ fontSize:11, color:"#9ca3af", marginTop:1 }}>{ERP_CONFIG[item.erp]?.short} · {(item.modules||[]).length} module(s)</div>
              </div>
              <div style={{ fontSize:11, color:"#d1d5db", flexShrink:0 }}>{item.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MODULE SELECTOR — multi-select with search
// ─────────────────────────────────────────────────────────────
function ModuleSelector({ erpKey, selected, onChange }) {
  const [search, setSearch] = useState("");
  const erp = ERP_CONFIG[erpKey];
  const filtered = erp.modules.filter(m =>
    m.label.toLowerCase().includes(search.toLowerCase()) ||
    m.sub.toLowerCase().includes(search.toLowerCase())
  );
  const toggle = (id) => {
    onChange(selected.includes(id) ? selected.filter(x => x!==id) : [...selected, id]);
  };
  const allSelected = filtered.every(m => selected.includes(m.id));
  const toggleAll = () => onChange(allSelected ? selected.filter(id => !filtered.find(m=>m.id===id)) : [...new Set([...selected, ...filtered.map(m=>m.id)])]);

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
        <Lbl>Modules in Scope</Lbl>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {selected.length > 0 && <span style={{ fontSize:11, color:"#6b7280" }}>{selected.length} selected</span>}
          <button onClick={toggleAll} style={{ background:"none", border:"none", cursor:"pointer",
            fontSize:11, color:"#6b7280", padding:0, fontFamily:"inherit" }}>
            {allSelected ? "Deselect all" : "Select all"}
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ position:"relative", marginBottom:10 }}>
        <svg style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)" }} width="13" height="13" viewBox="0 0 13 13" fill="none">
          <circle cx="5.5" cy="5.5" r="4" stroke="#9ca3af" strokeWidth="1.3"/>
          <path d="M9 9l2.5 2.5" stroke="#9ca3af" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter modules…"
          style={{ ...T.input, paddingLeft:30, fontSize:13, background:"#fafafa" }}/>
      </div>

      {/* Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, maxHeight:320, overflowY:"auto",
        paddingRight:4, scrollbarWidth:"thin" }}>
        {filtered.map(m => {
          const isOn = selected.includes(m.id);
          return (
            <div key={m.id} onClick={() => toggle(m.id)}
              style={{ border:`1.5px solid ${isOn?"#111827":"#e5e7eb"}`, borderRadius:7, padding:"9px 11px",
                cursor:"pointer", background:isOn?"#111827":"#fff", transition:"all .12s",
                display:"flex", flexDirection:"column", gap:3 }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:4 }}>
                <span style={{ fontSize:12, fontWeight:600, color:isOn?"#fff":"#111827", lineHeight:1.3 }}>{m.label}</span>
                <div style={{ width:14, height:14, borderRadius:3, flexShrink:0, marginTop:1,
                  border:`1.5px solid ${isOn?"#fff":"#d1d5db"}`,
                  background:isOn?"#fff":"transparent",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {isOn && <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 4l2 2 4-4" stroke="#111827" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
                </div>
              </div>
              <span style={{ fontSize:10, color:isOn?"#9ca3af":"#9ca3af", lineHeight:1.4 }}>{m.sub}</span>
            </div>
          );
        })}
      </div>

      {/* Selected chips */}
      {selected.length > 0 && (
        <div style={{ marginTop:10, display:"flex", flexWrap:"wrap", gap:5 }}>
          {selected.map(id => {
            const m = erp.modules.find(x => x.id===id);
            return m ? (
              <Tag key={id} color={erp.color} onRemove={() => toggle(id)}>{m.label}</Tag>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [erpKey,   setErpKey]   = useState("netsuite");
  const [project,  setProject]  = useState("");
  const [client,   setClient]   = useState("");
  const [modules,  setModules]  = useState([]);
  const [source,   setSource]   = useState("");
  const [pdfs,     setPdfs]     = useState([]);
  const [attached, setAttached] = useState([]);
  const [showHist, setShowHist] = useState(false);
  const [stage,    setStage]    = useState("intake");
  const [fdd,      setFdd]      = useState("");
  const [bpfn,     setBpfn]     = useState("");
  const [diagram,  setDiagram]  = useState("");
  const [diagSvg,  setDiagSvg]  = useState("");
  const [tests,    setTests]    = useState("");
  const [bpTab,    setBpTab]    = useState("narrative");
  const [loading,  setLoading]  = useState(false);
  const [loadMsg,  setLoadMsg]  = useState("");
  const [copied,   setCopied]   = useState("");
  const [error,    setError]    = useState("");
  const mermaidOk = useRef(false);
  const cycleRef  = useRef([]);

  const erp = ERP_CONFIG[erpKey];

  // Load Mermaid
  useEffect(() => {
    if (window.mermaid) { initMermaid(); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.6.1/mermaid.min.js";
    s.onload = initMermaid;
    document.head.appendChild(s);
  }, []);

  function initMermaid() {
    try {
      window.mermaid.initialize({ startOnLoad:false, theme:"neutral",
        themeVariables:{ primaryColor:"#f9fafb", primaryTextColor:"#111827", primaryBorderColor:"#d1d5db",
          lineColor:"#9ca3af", mainBkg:"#fff", nodeBorder:"#d1d5db", clusterBkg:"#f9fafb",
          titleColor:"#111827", edgeLabelBackground:"#fff" } });
      mermaidOk.current = true;
    } catch(e) { console.warn("Mermaid:", e); }
  }

  useEffect(() => {
    if (!diagram) return;
    const go = async () => {
      if (!mermaidOk.current) { setTimeout(go, 600); return; }
      try { const { svg } = await window.mermaid.render(`m${Date.now()}`, diagram); setDiagSvg(svg); }
      catch(e) { setDiagSvg(""); }
    };
    go();
  }, [diagram]);

  const cycle = (msgs) => {
    cycleRef.current.forEach(clearTimeout); cycleRef.current = [];
    setLoadMsg(msgs[0]);
    msgs.slice(1).forEach((m,i) => { cycleRef.current.push(setTimeout(() => setLoadMsg(m), (i+1)*3000)); });
  };

  const copy = async (text, id) => {
    await navigator.clipboard.writeText(text);
    setCopied(id); setTimeout(() => setCopied(""), 2000);
  };

  const onFiles = useCallback((files) => {
    const text = files.filter(f => f.type==="text");
    const pdf  = files.filter(f => f.type==="pdf");
    if (text.length) setSource(p => p+(p?"\n\n":"")+text.map(f=>`--- ${f.name} ---\n${f.text}`).join("\n\n"));
    if (pdf.length)  { setPdfs(p=>[...p,...pdf]); setAttached(p=>[...p,...pdf.map(f=>f.name)]); }
  }, []);

  const slug = s => (s||"doc").replace(/\s+/g,"_").replace(/[^a-zA-Z0-9_]/g,"");

  const getMeta = (docType) => ({
    project: project || "ERP Implementation",
    client:  client  || "",
    erp:     erp.label,
    modules: modules.map(id => erp.modules.find(x=>x.id===id)?.label).filter(Boolean).join(", "),
    docType,
  });

  const genFDD = async () => {
    if (!source.trim() && !pdfs.length) { setError("Add source material or upload files first."); return; }
    if (modules.length === 0) { setError("Select at least one module before generating."); return; }
    setError(""); setLoading(true);
    cycle(["Parsing source material…", "Extracting requirements…", "Mapping functional specs…", "Structuring technical design…", "Finalizing FDD…"]);
    try {
      const userText = `ERP: ${erp.label}\nProject: ${project||"ERP Implementation"}\nClient: ${client||"Client"}\nModules: ${modules.map(id=>erp.modules.find(x=>x.id===id)?.label).filter(Boolean).join(", ")}\n\nSource Material:\n${source}`;
      const r = await callClaude(buildFDDPrompt(erpKey, modules), userText, pdfs);
      setFdd(r); setStage("fdd");
    } catch(e) { setError(e.message); }
    setLoading(false);
  };

  const genBPFN = async () => {
    setError(""); setLoading(true);
    cycle(["Mapping process flows…", "Defining roles and touchpoints…", "Building flow diagram…", "Writing step narrative…", "Finalizing BPFN…"]);
    try {
      const r = await callClaude(buildBPFNPrompt(erpKey, modules), `ERP: ${erp.label}\nModules: ${modules.map(id=>erp.modules.find(x=>x.id===id)?.label).filter(Boolean).join(", ")}\n\nFDD:\n${fdd}`);
      const nm = r.match(/===NARRATIVE_START===([\s\S]*?)===NARRATIVE_END===/);
      const dm = r.match(/===DIAGRAM_START===([\s\S]*?)===DIAGRAM_END===/);
      setBpfn(nm ? nm[1].trim() : r);
      if (dm) setDiagram(dm[1].trim().replace(/```mermaid|```/g,"").trim());
      setStage("bpfn");
    } catch(e) { setError(e.message); }
    setLoading(false);
  };

  const genTests = async () => {
    setError(""); setLoading(true);
    cycle(["Analyzing requirements coverage…", "Designing test scenarios…", "Writing test scripts…", "Adding edge cases and UAT…", "Finalizing test suite…"]);
    try {
      const r = await callClaude(buildTestPrompt(erpKey, modules),
        `ERP: ${erp.label}\nModules: ${modules.map(id=>erp.modules.find(x=>x.id===id)?.label).filter(Boolean).join(", ")}\n\nFDD:\n${fdd}\n\nBusiness Process Flow Narrative:\n${bpfn}`);
      setTests(r); setStage("tests");
      await saveVersion({ erp:erpKey, project, client, modules, fdd, bpfn, diagram, tests:r });
    } catch(e) { setError(e.message); }
    setLoading(false);
  };

  const loadFromHist = async (id) => {
    const d = await loadVersion(id);
    if (!d) return;
    setErpKey(d.erp||"netsuite"); setProject(d.project||""); setClient(d.client||"");
    setModules(d.modules||[]); setFdd(d.fdd||""); setBpfn(d.bpfn||"");
    setDiagram(d.diagram||""); setTests(d.tests||"");
    setStage("tests"); setShowHist(false);
  };

  const reset = () => {
    setStage("intake"); setProject(""); setClient(""); setModules([]); setSource("");
    setPdfs([]); setAttached([]); setFdd(""); setBpfn(""); setDiagram("");
    setDiagSvg(""); setTests(""); setError("");
  };

  return (
    <div style={{ minHeight:"100vh", background:"#fff", fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif",
      color:"#111827", padding:"36px 32px", maxWidth:900, margin:"0 auto" }}>
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        input:focus, textarea:focus { border-color:#6b7280 !important; outline:none; }
        button { font-family:inherit; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-thumb { background:#e5e7eb; border-radius:2px; }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      {showHist && <HistoryModal onLoad={loadFromHist} onClose={() => setShowHist(false)}/>}

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:32 }}>
        <div style={{ display:"flex", alignItems:"baseline", gap:10 }}>
          <span style={{ fontSize:15, fontWeight:700, color:"#111827", letterSpacing:"-0.02em" }}>Logan Consulting</span>
          <span style={{ fontSize:13, color:"#9ca3af" }}>ERP Deliverable Agent</span>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          <Btn onClick={() => setShowHist(true)}>History</Btn>
          <Btn onClick={reset}>Reset</Btn>
        </div>
      </div>

      {/* Pipeline */}
      <Steps stage={stage} onJump={setStage}/>

      {/* Error */}
      {error && (
        <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:6,
          padding:"10px 14px", fontSize:13, color:"#b91c1c", marginBottom:14 }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ border:"1px solid #e5e7eb", borderRadius:8, padding:"56px 24px",
          display:"flex", flexDirection:"column", alignItems:"center", gap:14, marginBottom:12 }}>
          <div style={{ width:22, height:22, border:"2px solid #e5e7eb",
            borderTopColor:"#111827", borderRadius:"50%", animation:"spin .65s linear infinite" }}/>
          <span style={{ fontSize:13, color:"#9ca3af" }}>{loadMsg}</span>
        </div>
      )}

      {/* ── INTAKE ── */}
      {!loading && stage==="intake" && (
        <div style={{ border:"1px solid #e5e7eb", borderRadius:8, padding:"24px 26px" }}>

          {/* ERP platform selector */}
          <Lbl>Platform</Lbl>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:24 }}>
            {Object.entries(ERP_CONFIG).map(([key, cfg]) => (
              <div key={key} onClick={() => { setErpKey(key); setModules([]); }}
                style={{ border:`1.5px solid ${erpKey===key?"#111827":"#e5e7eb"}`, borderRadius:7,
                  padding:"11px 13px", cursor:"pointer", transition:"all .13s",
                  background:erpKey===key?"#111827":"#fff" }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:cfg.color, marginBottom:8, opacity:erpKey===key?1:.4 }}/>
                <div style={{ fontSize:12, fontWeight:700, color:erpKey===key?"#fff":"#111827", marginBottom:2 }}>{cfg.short}</div>
                <div style={{ fontSize:10, color:erpKey===key?"#6b7280":"#9ca3af", lineHeight:1.3 }}>{cfg.label}</div>
              </div>
            ))}
          </div>

          {/* Project fields */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:22 }}>
            <div>
              <Lbl>Project Name</Lbl>
              <input style={T.input} value={project} onChange={e => setProject(e.target.value)} placeholder="Acme Manufacturing — Phase 1"/>
            </div>
            <div>
              <Lbl>Client Name</Lbl>
              <input style={T.input} value={client} onChange={e => setClient(e.target.value)} placeholder="Acme Manufacturing Corp."/>
            </div>
          </div>

          {/* Module multi-select */}
          <div style={{ background:"#fafafa", border:"1px solid #f3f4f6", borderRadius:8, padding:"16px 18px", marginBottom:22 }}>
            <ModuleSelector erpKey={erpKey} selected={modules} onChange={setModules}/>
          </div>

          {/* Divider */}
          <div style={{ height:1, background:"#f3f4f6", marginBottom:20 }}/>

          {/* File upload */}
          <Lbl>Upload Source Documents</Lbl>
          <FileDropZone onFiles={onFiles}/>
          {attached.length > 0 && (
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:8 }}>
              {attached.map((n,i) => (
                <span key={i} style={{ fontSize:11, background:"#f3f4f6", border:"1px solid #e5e7eb",
                  borderRadius:4, padding:"3px 9px", color:"#374151",
                  display:"inline-flex", alignItems:"center", gap:5 }}>
                  {n}
                  <span onClick={() => { setAttached(p=>p.filter((_,j)=>j!==i)); setPdfs(p=>p.filter((_,j)=>j!==i)); }}
                    style={{ cursor:"pointer", color:"#9ca3af", fontSize:15, lineHeight:1 }}>×</span>
                </span>
              ))}
            </div>
          )}

          {/* Paste area */}
          <div style={{ marginTop:16 }}>
            <Lbl>Paste Source Material</Lbl>
            <textarea
              style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:6, fontSize:12.5,
                padding:"11px 13px", color:"#374151", background:"#fafafa", outline:"none",
                ...T.mono, lineHeight:1.75, resize:"none", height:200 }}
              value={source} onChange={e => setSource(e.target.value)}
              placeholder={"Paste call transcripts, discovery notes, client requirements, email threads, current-state process documentation…\n\nThe agent will generate:\n  FDD  →  Business Process Flow Narrative + Diagram  →  Test Scenarios & Scripts"}/>
          </div>

          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:14 }}>
            <span style={{ fontSize:12, color:"#9ca3af", ...T.mono }}>
              {source.trim() ? `${source.trim().split(/\s+/).length.toLocaleString()} words` : attached.length ? `${attached.length} file(s) attached` : ""}
            </span>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              {modules.length === 0 && <span style={{ fontSize:12, color:"#f59e0b" }}>Select at least one module</span>}
              <Btn variant="primary" onClick={genFDD} disabled={(!source.trim() && !pdfs.length) || modules.length === 0}>
                Generate FDD →
              </Btn>
            </div>
          </div>
        </div>
      )}

      {/* ── FDD ── */}
      {!loading && stage==="fdd" && (
        <div style={{ border:"1px solid #e5e7eb", borderRadius:8, padding:"24px 26px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
            <div>
              <Lbl>Function Design Document · {erp.short}</Lbl>
              <div style={{ fontSize:17, fontWeight:700, color:"#111827" }}>{project||"ERP Implementation"}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginTop:8 }}>
                {modules.map(id => { const m=erp.modules.find(x=>x.id===id); return m?<Tag key={id} color={erp.color}>{m.label}</Tag>:null; })}
              </div>
            </div>
            <StatusPill ready>Generated</StatusPill>
          </div>
          <DocViewer content={fdd}/>
          <ActionBar
            left={<>
              <Btn variant={copied==="fdd"?"success":"ghost"} onClick={() => copy(fdd,"fdd")}>{copied==="fdd"?"✓ Copied":"Copy"}</Btn>
              <Btn variant="ghost" onClick={() => downloadWord(fdd, `${slug(project)}_FDD`, getMeta("Function Design Document"))}>↓ Download (.doc)</Btn>
            </>}
            right={<Btn variant="primary" onClick={genBPFN}>Generate BPFN →</Btn>}
          />
        </div>
      )}

      {/* ── BPFN ── */}
      {!loading && stage==="bpfn" && (
        <div style={{ border:"1px solid #e5e7eb", borderRadius:8, padding:"24px 26px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
            <div>
              <Lbl>Business Process Flow Narrative · {erp.short}</Lbl>
              <div style={{ fontSize:17, fontWeight:700, color:"#111827" }}>{project||"ERP Implementation"}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginTop:8 }}>
                {modules.map(id => { const m=erp.modules.find(x=>x.id===id); return m?<Tag key={id} color={erp.color}>{m.label}</Tag>:null; })}
              </div>
            </div>
            <StatusPill ready>Generated</StatusPill>
          </div>
          <div style={{ display:"flex", borderBottom:"1px solid #f3f4f6", marginBottom:16 }}>
            {[{id:"narrative",label:"Narrative"},{id:"diagram",label:"Flow Diagram"}].map(t => (
              <button key={t.id} onClick={() => setBpTab(t.id)} style={{
                background:"none", border:"none", borderBottom:`2px solid ${bpTab===t.id?"#111827":"transparent"}`,
                padding:"6px 14px", marginBottom:-1, fontSize:13, cursor:"pointer",
                fontWeight:bpTab===t.id?600:400, color:bpTab===t.id?"#111827":"#9ca3af", transition:"all .15s" }}>
                {t.label}
              </button>
            ))}
          </div>
          {bpTab==="narrative" && <DocViewer content={bpfn}/>}
          {bpTab==="diagram" && (
            <div style={{ background:"#fafafa", border:"1px solid #e5e7eb", borderRadius:6, padding:20, minHeight:80, overflowX:"auto" }}>
              {diagSvg
                ? <div dangerouslySetInnerHTML={{ __html:diagSvg }}/>
                : diagram
                  ? <><div style={{ fontSize:11, color:"#9ca3af", marginBottom:10 }}>Paste at mermaid.live to preview</div><DocViewer content={diagram}/></>
                  : <div style={{ fontSize:12, color:"#9ca3af" }}>Rendering…</div>}
            </div>
          )}
          <ActionBar
            left={<>
              <Btn variant={copied==="bpfn"?"success":"ghost"} onClick={() => copy(bpfn,"bpfn")}>{copied==="bpfn"?"✓ Copied":"Copy Narrative"}</Btn>
              {diagram && <Btn variant={copied==="diag"?"success":"ghost"} onClick={() => copy(diagram,"diag")}>{copied==="diag"?"✓ Copied":"Copy Diagram"}</Btn>}
              <Btn variant="ghost" onClick={() => downloadWord(bpfn, `${slug(project)}_BPFN`, getMeta("Business Process Flow Narrative"))}>↓ Download (.doc)</Btn>
            </>}
            right={<Btn variant="primary" onClick={genTests}>Generate Tests →</Btn>}
          />
        </div>
      )}

      {/* ── TESTS ── */}
      {!loading && stage==="tests" && (
        <div style={{ border:"1px solid #e5e7eb", borderRadius:8, padding:"24px 26px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
            <div>
              <Lbl>Test Scenarios & Scripts · {erp.short}</Lbl>
              <div style={{ fontSize:17, fontWeight:700, color:"#111827" }}>{project||"ERP Implementation"}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginTop:8 }}>
                {modules.map(id => { const m=erp.modules.find(x=>x.id===id); return m?<Tag key={id} color={erp.color}>{m.label}</Tag>:null; })}
              </div>
            </div>
            <StatusPill ready>Generated</StatusPill>
          </div>
          <DocViewer content={tests}/>
          <ActionBar
            left={<>
              <Btn variant={copied==="tests"?"success":"ghost"} onClick={() => copy(tests,"tests")}>{copied==="tests"?"✓ Copied":"Copy"}</Btn>
              <Btn variant="ghost" onClick={() => downloadWord(tests, `${slug(project)}_Tests`, getMeta("Test Scenarios & Scripts"))}>↓ Download Tests (.doc)</Btn>
              <Btn variant="ghost" onClick={() => downloadAllWord(fdd, bpfn, tests, `${slug(project)}_Full_Package`, getMeta("Full Deliverable Package"))}>↓ Full Package (.doc)</Btn>
            </>}
            right={<Btn variant="primary" onClick={reset}>New Project</Btn>}
          />
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop:28, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:11, color:"#e5e7eb" }}>Logan Consulting · ERP Deliverable Agent</span>
        <div style={{ display:"flex", gap:12 }}>
          {Object.values(ERP_CONFIG).map(c => (
            <span key={c.short} style={{ fontSize:11, color:"#e5e7eb" }}>{c.short}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
