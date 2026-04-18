import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frameworkRoot = path.resolve(__dirname, "../..");

import { archiveReports } from "./archiveReports.js";

const dirsToClean = [
  path.join(frameworkRoot, "allure-results"),
  path.join(frameworkRoot, "allure-report"),
  path.join(frameworkRoot, "reports")
];

// Archive before cleaning
try {
  archiveReports();
} catch (e) {
  console.warn("Could not archive previous reports:", e.message);
}

console.log("\n🧹 Cleaning old test results and reports...");

dirsToClean.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  // Re-create the empty directories to prevent 'directory missing' errors in some tools
  fs.mkdirSync(dir, { recursive: true });
});

console.log("✅ Old reports cleaned successfully!\n");
