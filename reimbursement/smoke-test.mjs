import { readFileSync, existsSync } from "node:fs";
import assert from "node:assert/strict";

const base = new URL(".", import.meta.url);
const html = readFileSync(new URL("index.html", base), "utf8");
const js = readFileSync(new URL("app.js", base), "utf8");

for (const asset of ["app.css", "app.js"]) {
  assert.ok(existsSync(new URL(asset, base)), `Missing required asset: ${asset}`);
}
const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]));
for (const id of ["recent-body","expenses-body","projects-grid","import-body","expense-form","project-form","toast","filter-month","export-csv"]) {
  assert.ok(ids.has(id), `Required interface element not found: #${id}`);
}
for (const feature of ["renderDashboard","renderExpenses","renderProjects","importCsv","importMultipleFiles","parseCalendar","receiptCandidate","downloadCsv","localStorage"]) {
  assert.ok(js.includes(feature), `Expected app feature is missing: ${feature}`);
}
console.log("Reimbursement app smoke checks passed.");
