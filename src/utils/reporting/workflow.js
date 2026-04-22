import { spawnSync, spawn } from "child_process";
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

const shouldOpen = process.argv.includes("--open");

function runNpmScript(scriptName) {
  const npmCli = process.env.npm_execpath;
  const result = spawnSync(process.execPath, [npmCli, "run", scriptName, "--silent"], {
    cwd: frameworkRoot,
    stdio: "inherit"
  });
  return result.status ?? 1;
}

// 1. Clean
cleanResults();

// 2. Run Tests
console.log("🚀 Running tests...");
const testExitCode = runNpmScript("test:raw");

// 3. Generate Reports
if (fs.existsSync(ALLURE_RESULTS_DIR) && fs.readdirSync(ALLURE_RESULTS_DIR).length > 0) {
    console.log("📊 Generating Allure report...");
    runNpmScript("report:generate");
}

generateCucumberReport();

// 4. Archive
archiveReports();

// 5. Summary
printSummary();

// 6. Open if requested
if (shouldOpen) {
    const allureBin = path.join(frameworkRoot, "node_modules", ".bin", process.platform === "win32" ? "allure.cmd" : "allure");
    spawn(process.platform === "win32" ? "cmd.exe" : allureBin, 
          process.platform === "win32" ? ["/c", allureBin, "open", "allure-report"] : ["open", "allure-report"], 
          { cwd: frameworkRoot, stdio: "inherit" });
}

process.exit(testExitCode);
