/**
 * Archive Reports Utility
 *
 * Copies the current Allure and Cucumber HTML reports into a timestamped
 * folder under `report-history/` before new reports are generated.
 *
 * Usage:  import { archiveReports } from "./archiveReports.js";
 *         archiveReports();   // call before report generation
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateDashboard } from "./generateDashboard.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frameworkRoot = path.resolve(__dirname, "../..");

const ALLURE_REPORT_DIR = path.join(frameworkRoot, "allure-report");
const CUCUMBER_REPORT_DIR = path.join(frameworkRoot, "reports", "html-report");
const HISTORY_DIR = path.join(frameworkRoot, "report-history");

/**
 * Recursively copy a directory.
 */
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Check if a directory exists and has at least one file.
 */
function hasContent(dir) {
  if (!fs.existsSync(dir)) return false;
  return fs.readdirSync(dir).length > 0;
}

/**
 * Generate a filesystem-safe, sortable timestamp string.
 * Example: "2026-04-04_12-24-42"
 */
function getTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return [
    now.getFullYear(),
    "-", pad(now.getMonth() + 1),
    "-", pad(now.getDate()),
    "_",
    pad(now.getHours()),
    "-", pad(now.getMinutes()),
    "-", pad(now.getSeconds())
  ].join("");
}

/**
 * Derive a descriptive run name from the environment context.
 *
 * Priority:
 *   1. TAGS env var  →  "@smoke" becomes "smoke", "@smoke and @login" becomes "smoke-login"
 *   2. FEATURE_PATH  →  "src/tests/features/basicControls.feature" becomes "basicControls"
 *   3. Falls back to "test-run"
 *
 * The result is sanitised for use as a directory name.
 */
function getRunName() {
  // First, attempt to extract actual executed tags from cucumber-report.json
  const reportJSON = path.join(frameworkRoot, "reports", "cucumber-report.json");
  if (fs.existsSync(reportJSON)) {
    try {
      const data = JSON.parse(fs.readFileSync(reportJSON, "utf-8"));
      const allTags = new Set();
      
      data.forEach(feature => {
        if (feature.tags) {
          feature.tags.forEach(t => allTags.add(t.name));
        }
      });
      
      if (allTags.size > 0) {
        const tagStr = Array.from(allTags).join("-");
        const name = tagStr
          .replace(/@/g, "")
          .replace(/[^a-zA-Z0-9_-]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");
        if (name) return name;
      }
      
      // If no tags but we ran exactly 1 feature, use its name
      if (data.length === 1 && data[0].name) {
          const featureName = data[0].name.replace(/[^a-zA-Z0-9_-]/g, " ").trim().replace(/\s+/g, "-");
          if (featureName) return featureName;
      }
    } catch (e) {
      // Ignore JSON parse errors and fall back
    }
  }

  const tags = process.env.TAGS;
  if (tags) {
    // Strip @, replace logical operators and whitespace with hyphens
    const name = tags
      .replace(/@/g, "")
      .replace(/\s+(and|or|not)\s+/gi, "-")
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    if (name) return name;
  }

  const featurePath = process.env.FEATURE_PATH;
  if (featurePath) {
    const basename = path.basename(featurePath, ".feature");
    const name = basename.replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    if (name) return name;
  }

  return "test-run";
}

/**
 * Archive existing reports into a named + timestamped history folder.
 * Folder format:  <name>_<YYYY-MM-DD_HH-mm-ss>
 * Returns the archive path if anything was archived, or null otherwise.
 */
export function archiveReports() {
  const hasAllure = hasContent(ALLURE_REPORT_DIR);
  const hasCucumber = hasContent(CUCUMBER_REPORT_DIR);

  if (!hasAllure && !hasCucumber) {
    console.log("\n📂 No existing reports to archive.\n");
    return null;
  }

  const runName = getRunName();
  const timestamp = getTimestamp();
  const folderName = `${runName}_${timestamp}`;
  const archiveDir = path.join(HISTORY_DIR, folderName);
  fs.mkdirSync(archiveDir, { recursive: true });

  let archived = [];

  if (hasAllure) {
    const dest = path.join(archiveDir, "allure");
    copyDirSync(ALLURE_REPORT_DIR, dest);
    archived.push("Allure");
  }

  if (hasCucumber) {
    const dest = path.join(archiveDir, "cucumber");
    copyDirSync(CUCUMBER_REPORT_DIR, dest);
    archived.push("Cucumber");
  }

  console.log("\n══════════════════════════════════════════════════════");
  console.log("  📦 REPORT HISTORY — Archived Previous Reports");
  console.log("══════════════════════════════════════════════════════");
  console.log(`  Run Name  : ${runName}`);
  console.log(`  Timestamp : ${timestamp}`);
  console.log(`  Archived  : ${archived.join(", ")}`);
  console.log(`  Location  : ${archiveDir}`);
  console.log("══════════════════════════════════════════════════════\n");

  generateDashboard({ openBrowser: false });

  return archiveDir;
}
