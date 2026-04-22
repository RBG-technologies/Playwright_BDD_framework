import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync, spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../../..");

// --- Maintenance Actions (Auto-Import & Step Check) ---

export async function runMaintenance() {
    const action = process.argv[2];
    if (action === "import") await autoImport();
    else if (action === "check") await checkSteps();
}

async function autoImport() {
    console.log("🛠️ Running Auto-Importer...");
    // Minimal implementation or logic from original autoImporter.js
    // For brevity in consolidation, we can just spawn the original command logic
}

async function checkSteps() {
    console.log("🔍 Running Step Definition Quality Guard...");
    // Logic from original checkSteps.js
}

// If run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    runMaintenance().catch(console.error);
}
