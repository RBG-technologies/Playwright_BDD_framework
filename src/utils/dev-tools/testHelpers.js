import { spawnSync, spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../../..");

export function dryRun() {
    console.log("\n🔍 Starting Dry Run...");
    spawnSync("npm", ["run", "test:raw", "--", "--dry-run"], { stdio: "inherit", shell: true, cwd: ROOT });
}

export function runSingle() {
    // Logic from original runSingleTest.js
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const action = process.argv[2];
    if (action === "dry") dryRun();
    else if (action === "single") runSingle();
}
