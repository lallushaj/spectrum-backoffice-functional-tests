import fs from 'node:fs';
import path from 'node:path';

const jsonFile = path.resolve('reports/cucumber-report.json');
const htmlFile = path.resolve('reports/cucumber-report.html');

if (!fs.existsSync(jsonFile)) {
  throw new Error(`Cucumber JSON report not found: ${jsonFile}`);
}

type CucumberResult = {
  status?: string;
  duration?: number;
  message?: string;
};

type CucumberStep = {
  keyword?: string;
  name?: string;
  hidden?: boolean;
  result?: CucumberResult;
};

type CucumberTag = { name?: string };

type CucumberScenario = {
  name?: string;
  keyword?: string;
  type?: string;
  steps?: CucumberStep[];
  tags?: CucumberTag[];
};

type CucumberFeature = {
  name?: string;
  elements?: CucumberScenario[];
  tags?: CucumberTag[];
};

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function statusOf(scenario: CucumberScenario): 'passed' | 'failed' | 'skipped' {
  const statuses = (scenario.steps ?? []).map((step) => step.result?.status?.toLowerCase());
  if (statuses.includes('failed')) return 'failed';
  if (statuses.includes('undefined')) return 'failed';
  if (statuses.some((status) => status === 'passed')) return 'passed';
  return 'skipped';
}

function durationOf(duration?: number): string {
  return `${((duration ?? 0) / 1_000_000_000).toFixed(2)}s`;
}

const features = JSON.parse(fs.readFileSync(jsonFile, 'utf8')) as CucumberFeature[];
const scenarios = features.flatMap((feature) =>
  (feature.elements ?? [])
    .filter((scenario) => scenario.type === 'scenario' || scenario.keyword === 'Scenario')
    .map((scenario) => ({ feature, scenario, status: statusOf(scenario) }))
);

const allTags = [...new Set(features.flatMap((feature) => [
  ...(feature.tags ?? []).map((tag) => tag.name),
  ...(feature.elements ?? []).flatMap((scenario) => (scenario.tags ?? []).map((tag) => tag.name))
]).filter((tag): tag is string => Boolean(tag)))];
const passed = scenarios.filter((item) => item.status === 'passed').length;
const failed = scenarios.filter((item) => item.status === 'failed').length;
const skipped = scenarios.filter((item) => item.status === 'skipped').length;
const total = scenarios.length;
const passRate = total ? Math.round((passed / total) * 100) : 0;
const executedSteps = scenarios.reduce((count, item) => count + (item.scenario.steps ?? []).filter((step) => !step.hidden).length, 0);
const featureName = features[0]?.name ?? 'Cucumber Test Suite';
const generatedAt = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Europe/Tirane'
}).format(new Date());

const scenarioMarkup = scenarios.map(({ scenario, status }, index) => {
  const tags = (scenario.tags ?? []).map((tag) => `<span class="tag">${escapeHtml(tag.name ?? '')}</span>`).join('');
  const steps = (scenario.steps ?? []).filter((step) => !step.hidden).map((step) => {
    const stepStatus = step.result?.status?.toLowerCase() ?? 'skipped';
    const stepClass = stepStatus === 'passed' ? 'passed' : stepStatus === 'failed' || stepStatus === 'undefined' ? 'failed' : 'skipped';
    const icon = stepClass === 'passed' ? '✓' : stepClass === 'failed' ? '!' : '–';
    const error = step.result?.message ? `<div class="step-error">${escapeHtml(step.result.message)}</div>` : '';
    return `<div class="step ${stepClass}">
      <span class="check">${icon}</span>
      <span class="step-text">${escapeHtml(`${step.keyword ?? ''}${step.name ?? ''}`)}${error}</span>
      <span class="duration">${durationOf(step.result?.duration)}</span>
    </div>`;
  }).join('');
  return `<section class="scenario ${status}">
    <details ${index < 2 ? 'open' : ''}>
      <summary>
        <div class="scenario-main">
          <span class="status-dot"></span>
          <div>
            <div class="scenario-number">Scenario ${String(index + 1).padStart(2, '0')}</div>
            <div class="scenario-title">${escapeHtml(scenario.name ?? 'Unnamed scenario')}</div>
            ${tags ? `<div class="scenario-tags">${tags}</div>` : ''}
          </div>
        </div>
        <div class="scenario-status">${status.toUpperCase()}</div>
      </summary>
      <div class="steps">
        <div class="section-label">Background + Scenario Steps</div>
        ${steps || '<div class="empty">No step details available.</div>'}
      </div>
    </details>
  </section>`;
}).join('\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Spectrum Back Office - Test Report</title>
<style>
:root{--bg:#f4f7fb;--panel:#fff;--text:#172033;--muted:#657089;--line:#e3e8f0;--green:#168a4b;--green-light:#e9f8ef;--red:#bd3340;--red-light:#fff0f1;--amber:#a66a00;--amber-light:#fff7df;--navy:#16233b;--blue:#335cff}
*{box-sizing:border-box}body{margin:0;font-family:Inter,Segoe UI,Arial,sans-serif;background:var(--bg);color:var(--text)}
.header{background:linear-gradient(135deg,#111b2f,#203c69);color:#fff;padding:38px 42px}.header-inner{max-width:1180px;margin:auto}.eyebrow{font-size:12px;letter-spacing:.14em;text-transform:uppercase;opacity:.72;margin-bottom:9px}h1{margin:0;font-size:32px;line-height:1.2}.subtitle{margin-top:10px;color:#dce5f7;font-size:14px}.feature-tags{margin-top:17px;display:flex;gap:7px;flex-wrap:wrap}.feature-tags .tag{background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.18)}
.container{max-width:1180px;margin:26px auto 50px;padding:0 20px}.summary-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px}.metric{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:18px;box-shadow:0 4px 18px rgba(25,40,70,.04)}.metric .label{color:var(--muted);font-size:12px;text-transform:uppercase;letter-spacing:.06em}.metric .value{margin-top:8px;font-size:28px;font-weight:750}.metric .value.green{color:var(--green)}.metric .value.red{color:var(--red)}.overview{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:18px 20px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;gap:20px}.passbar{flex:1;height:10px;background:#edf1f6;border-radius:999px;overflow:hidden}.passbar>div{width:${passRate}%;height:100%;background:${failed ? 'var(--red)' : 'var(--green)'}}.pass-label{font-weight:700;color:${failed ? 'var(--red)' : 'var(--green)'};white-space:nowrap}.feature-title{margin:26px 0 10px;font-size:18px;font-weight:750}
.scenario{background:var(--panel);border:1px solid var(--line);border-radius:12px;margin-bottom:10px;overflow:hidden}.scenario.failed{border-color:#f1c5ca}.scenario.skipped{border-color:#f1dfad}details>summary{list-style:none;cursor:pointer;padding:16px 18px;display:flex;align-items:center;justify-content:space-between;gap:14px}details>summary::-webkit-details-marker{display:none}.scenario-main{display:flex;gap:13px;align-items:flex-start}.status-dot{width:10px;height:10px;border-radius:50%;background:var(--green);box-shadow:0 0 0 4px var(--green-light);margin-top:7px;flex:none}.failed .status-dot{background:var(--red);box-shadow:0 0 0 4px var(--red-light)}.skipped .status-dot{background:var(--amber);box-shadow:0 0 0 4px var(--amber-light)}.scenario-number{font-size:11px;text-transform:uppercase;color:var(--muted);letter-spacing:.08em;margin-bottom:3px}.scenario-title{font-size:15px;font-weight:700;line-height:1.35}.scenario-tags{margin-top:8px;display:flex;gap:6px;flex-wrap:wrap}.tag{display:inline-block;border-radius:999px;padding:3px 8px;font-size:11px;background:#eef2ff;color:#4254a8;border:1px solid #dfe5ff}.scenario-status{background:var(--green-light);color:var(--green);border:1px solid #ccebd8;border-radius:999px;padding:6px 10px;font-size:11px;font-weight:800;letter-spacing:.05em}.failed .scenario-status{background:var(--red-light);color:var(--red);border-color:#f1c5ca}.skipped .scenario-status{background:var(--amber-light);color:var(--amber);border-color:#f1dfad}
.steps{border-top:1px solid var(--line);padding:14px 18px 17px 41px;background:#fbfcfe}.section-label{font-size:11px;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);margin-bottom:8px}.step{display:grid;grid-template-columns:22px 1fr 54px;gap:8px;padding:7px 0;align-items:start;border-bottom:1px dashed #edf0f4}.step:last-child{border-bottom:0}.check{color:var(--green);font-weight:800}.step.failed .check{color:var(--red)}.step.skipped .check{color:var(--amber)}.step-text{font-size:13px;line-height:1.4}.duration{text-align:right;font-size:11px;color:var(--muted)}.step-error{margin-top:5px;padding:8px;background:var(--red-light);color:var(--red);border-radius:6px;font-size:11px;white-space:pre-wrap;word-break:break-word}.empty{font-size:13px;color:var(--muted)}.footer{margin-top:28px;text-align:center;color:var(--muted);font-size:12px}
@media(max-width:800px){.summary-grid{grid-template-columns:1fr 1fr}.header{padding:28px 20px}h1{font-size:25px}.overview{align-items:flex-start;flex-direction:column}.passbar{width:100%;flex:none}}@media(max-width:520px){.summary-grid{grid-template-columns:1fr}details>summary{align-items:flex-start}.scenario-status{font-size:10px;padding:5px 7px}.steps{padding-left:18px}.step{grid-template-columns:20px 1fr}.duration{grid-column:2;text-align:left}}
</style>
</head>
<body>
<header class="header"><div class="header-inner"><div class="eyebrow">Spectrum Back Office · Functional Regression</div><h1>${escapeHtml(featureName)} Test Report</h1><div class="subtitle">Feature: ${escapeHtml(featureName)} · Generated ${escapeHtml(generatedAt)} Europe/Tirane</div><div class="feature-tags">${allTags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join(' ')}</div></div></header>
<main class="container">
<section class="summary-grid"><div class="metric"><div class="label">Scenarios</div><div class="value">${total}</div></div><div class="metric"><div class="label">Passed</div><div class="value green">${passed}</div></div><div class="metric"><div class="label">Failed</div><div class="value red">${failed}</div></div><div class="metric"><div class="label">Pass Rate</div><div class="value ${failed ? 'red' : 'green'}">${passRate}%</div></div></section>
<section class="overview"><div style="min-width:220px"><div style="font-weight:750">Execution Summary</div><div style="font-size:12px;color:var(--muted);margin-top:4px">${executedSteps} executed step entries · ${failed} failures · ${skipped} skipped</div></div><div class="passbar"><div></div></div><div class="pass-label">${passRate}% ${failed ? 'FAILED' : 'PASSED'}</div></section>
<div class="feature-title">Feature scenarios</div>${scenarioMarkup || '<div class="empty">No scenarios found in the JSON report.</div>'}<div class="footer">Generated from Cucumber JSON report · Spectrum Back Office</div>
</main></body></html>`;

fs.writeFileSync(htmlFile, html, 'utf8');
console.log(`HTML report generated at ${htmlFile}`);