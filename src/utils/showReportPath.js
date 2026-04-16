import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frameworkRoot = path.resolve(__dirname, "../..");
const allureReportPath = path.resolve(frameworkRoot, "allure-report/index.html");
const cucumberReportPath = path.resolve(frameworkRoot, "reports/html-report/index.html");
const historyDir = path.resolve(frameworkRoot, "report-history");

console.log("\n======================================");
console.log(" Test Execution Completed");
console.log("");
console.log(" 📊 Allure Report:");
console.log("   " + allureReportPath);

if (fs.existsSync(cucumberReportPath)) {
  console.log("");
  console.log(" 🥒 Cucumber HTML Report:");
  console.log("   " + cucumberReportPath);
}

if (fs.existsSync(historyDir)) {
  const archivedRuns = fs.readdirSync(historyDir, { withFileTypes: true })
    .filter((e) => e.isDirectory()).length;
  if (archivedRuns > 0) {
    console.log("");
    console.log(` 📦 Report History: ${archivedRuns} archived run(s)`);
    console.log("   " + historyDir);
    console.log("   Run: npm run report:history");
  }
}

console.log("");
console.log("Framework by Thirumandas Saiteja Goud");
console.log("======================================\n");