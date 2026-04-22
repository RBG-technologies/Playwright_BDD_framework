import dotenv from "dotenv";
import { spawnSync, spawn, exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { 
    cleanResults, 
    generateCucumberReport, 
    archiveReports, 
    printSummary, 
    ALLURE_RESULTS_DIR, 
    ALLURE_REPORT_DIR 
} from "./reportManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frameworkRoot = path.resolve(__dirname, "../../..");

// Explicitly load .env from framework root
dotenv.config({ path: path.join(frameworkRoot, ".env") });

const shouldOpen = process.argv.includes("--open") || process.env.AUTO_OPEN_REPORT === "true";

function runNpmScript(scriptName, extraArgs = []) {
  const npmCli = process.env.npm_execpath;
  const result = spawnSync(process.execPath, [npmCli, "run", scriptName, "--", ...extraArgs], {
    cwd: frameworkRoot,
    stdio: "inherit"
  });
  return result.status ?? 1;
}

// 1. Clean
cleanResults();

// 2. Run Tests
console.log("🚀 Running tests...");
const extraArgs = process.argv.filter(arg => !arg.startsWith("--") || ["--tags", "--file", "--tag"].some(p => arg.startsWith(p)));
// Simplification: just forward everything that isn't our internal flags
const internalFlags = ["--open", "--only-report"];
const forwardedArgs = process.argv.slice(2).filter(arg => !internalFlags.includes(arg));

const testExitCode = runNpmScript("test:raw", forwardedArgs);

// 3. Generate Reports
if (fs.existsSync(ALLURE_RESULTS_DIR) && fs.readdirSync(ALLURE_RESULTS_DIR).length > 0) {
    console.log("📊 Generating Allure report...");
    runNpmScript("report:generate");
}

generateCucumberReport();

// 4. Archive (handled inside report:generate if Allure exists, but we call it here for Cucumber-only runs)
// archiveReports is now idempotent and fast.
archiveReports();

// 5. Summary
printSummary();

// 6. Open if requested
if (shouldOpen) {
    const allureBin = path.join(frameworkRoot, "node_modules", ".bin", process.platform === "win32" ? "allure.cmd" : "allure");
    console.log(`👐 Attempting to open Allure report...`);
    
    // Use exec with a quiet redirection for Allure
    const allureCmd = `"${allureBin}" open allure-report`;
    exec(allureCmd, { cwd: frameworkRoot }, (err) => {
        if (err) console.error(`❌ Failed to start Allure server: ${err.message}`);
    });

    // Also open the Cucumber HTML report (static file)
    const cucumberHtml = path.resolve(frameworkRoot, "reports", "html-report", "index.html");
    if (fs.existsSync(cucumberHtml)) {
        console.log(`🥒 Opening Cucumber report: ${cucumberHtml}`);
        const openCmd = process.platform === "win32" ? `start "" "${cucumberHtml}"` : 
                        process.platform === "darwin" ? `open "${cucumberHtml}"` : 
                        `xdg-open "${cucumberHtml}"`;
        exec(openCmd, (err) => {
            if (err) console.error(`❌ Failed to open Cucumber report: ${err.message}`);
        });
    }
}

// Give a tiny bit of time for the exec calls to fire before process exits
setTimeout(() => {
    process.exit(testExitCode);
}, 2000);
