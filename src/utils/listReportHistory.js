/**
 * List Report History
 *
 * Displays all archived report runs stored in `report-history/`,
 * sorted newest-first, with folder paths for easy access.
 *
 * Usage:  npm run report:history
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frameworkRoot = path.resolve(__dirname, "../..");
const HISTORY_DIR = path.join(frameworkRoot, "report-history");

function main() {
  if (!fs.existsSync(HISTORY_DIR)) {
    console.log("\n📂 No report history found yet. Run tests to generate reports.\n");
    return;
  }

  const entries = fs.readdirSync(HISTORY_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort((a, b) => {
      const tsA = a.match(/(\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2})$/)?.[1] || "";
      const tsB = b.match(/(\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2})$/)?.[1] || "";
      return tsB.localeCompare(tsA);
    });

  if (entries.length === 0) {
    console.log("\n📂 Report history folder is empty.\n");
    return;
  }

  console.log("\n══════════════════════════════════════════════════════════════════");
  console.log("  📋 REPORT HISTORY");
  console.log("══════════════════════════════════════════════════════════════════");
  console.log(`  Total archived runs: ${entries.length}\n`);

  for (let i = 0; i < entries.length; i++) {
    const folder = entries[i];
    const archivePath = path.join(HISTORY_DIR, folder);

    // Parse folder name:  <name>_YYYY-MM-DD_HH-mm-ss  or  YYYY-MM-DD_HH-mm-ss
    // The timestamp portion always matches \d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}
    const tsMatch = folder.match(/(\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2})$/);
    let runName = "unknown";
    let displayDate = folder;

    if (tsMatch) {
      const tsStr = tsMatch[1];                        // "2026-04-04_12-24-42"
      const prefix = folder.slice(0, folder.length - tsStr.length).replace(/_$/, "");
      runName = prefix || "test-run";

      const [datePart, timePart] = tsStr.split("_");
      displayDate = `${datePart} ${timePart.replace(/-/g, ":")}`;
    }

    const hasAllure = fs.existsSync(path.join(archivePath, "allure", "index.html"));
    const hasCucumber = fs.existsSync(path.join(archivePath, "cucumber", "index.html"));

    const reports = [];
    if (hasAllure) reports.push("Allure");
    if (hasCucumber) reports.push("Cucumber");

    const label = i === 0 ? " (latest)" : "";

    console.log(`  ${String(i + 1).padStart(3)}. 🕐 ${displayDate}${label}`);
    console.log(`       Name    : ${runName}`);
    console.log(`       Reports : ${reports.length > 0 ? reports.join(", ") : "unknown"}`);
    console.log(`       Path    : ${archivePath}`);
    console.log();
  }

  console.log("══════════════════════════════════════════════════════════════════");
  console.log("  💡 Tip: Open any archived allure/index.html in your browser.");
  console.log("══════════════════════════════════════════════════════════════════\n");
}

main();
