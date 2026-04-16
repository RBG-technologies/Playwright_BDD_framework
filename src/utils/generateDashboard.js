/**
 * Generate Report History Dashboard
 *
 * Scans `report-history/` and generates a highly aesthetic, dark-mode
 * HTML dashboard to visually browse all past Allure and Cucumber reports.
 *
 * Usage:  npm run report:dashboard
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frameworkRoot = path.resolve(__dirname, "../..");
const HISTORY_DIR = path.join(frameworkRoot, "report-history");
const DASHBOARD_PATH = path.join(HISTORY_DIR, "index.html");

export function generateDashboard(opts = { openBrowser: false }) {
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

  const runs = entries.map((folder) => {
    const archivePath = path.join(HISTORY_DIR, folder);
    const tsMatch = folder.match(/(\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2})$/);
    let runName = "unknown";
    let displayDate = folder;

    if (tsMatch) {
      const tsStr = tsMatch[1];
      const prefix = folder.slice(0, folder.length - tsStr.length).replace(/_$/, "");
      runName = prefix || "test-run";
      const [datePart, timePart] = tsStr.split("_");
      displayDate = `${datePart} ${timePart.replace(/-/g, ":")}`;
    }

    const hasAllure = fs.existsSync(path.join(archivePath, "allure", "index.html"));
    const hasCucumber = fs.existsSync(path.join(archivePath, "cucumber", "index.html"));

    return { folder, runName, displayDate, hasAllure, hasCucumber };
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Execution History Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #0f172a;
            --card-bg: #1e293b;
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            --accent-allure: #eab308;
            --accent-allure-hover: #ca8a04;
            --accent-cucumber: #22c55e;
            --accent-cucumber-hover: #16a34a;
            --border-color: #334155;
            --glow-color: rgba(99, 102, 241, 0.15);
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-primary);
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1.6;
            background-image: 
                radial-gradient(at 0% 0%, var(--glow-color) 0px, transparent 50%),
                radial-gradient(at 100% 0%, rgba(234, 179, 8, 0.1) 0px, transparent 50%);
            min-height: 100vh;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 3rem 1.5rem;
        }

        header {
            text-align: center;
            margin-bottom: 4rem;
            animation: fadeInDown 0.8s ease-out;
        }

        h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            background: linear-gradient(to right, #38bdf8, #818cf8);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .subtitle {
            color: var(--text-secondary);
            font-size: 1.1rem;
        }

        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 1.5rem;
            animation: fadeIn 1s ease-out;
        }

        .run-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 1rem;
            padding: 1.5rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .run-card::before {
            content: "";
            position: absolute;
            top: 0; left: 0; right: 0; height: 4px;
            background: linear-gradient(to right, #38bdf8, #818cf8);
            opacity: 0;
            transition: opacity 0.3s;
        }

        .run-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
            border-color: #475569;
        }

        .run-card:hover::before {
            opacity: 1;
        }

        .run-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1.5rem;
        }

        .run-info h2 {
            margin: 0;
            font-size: 1.25rem;
            font-weight: 600;
            color: #f1f5f9;
        }

        .run-date {
            font-size: 0.875rem;
            color: var(--text-secondary);
            margin-top: 0.25rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .badge-list {
            display: flex;
            gap: 0.5rem;
        }

        .status-badge {
            font-size: 0.7rem;
            padding: 0.25rem 0.5rem;
            border-radius: 9999px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .badge-latest {
            background-color: rgba(99, 102, 241, 0.2);
            color: #818cf8;
            border: 1px solid rgba(99, 102, 241, 0.4);
        }

        .reports-container {
            margin-top: auto;
            display: flex;
            gap: 1rem;
        }

        .report-btn {
            flex: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            font-weight: 500;
            font-size: 0.875rem;
            text-decoration: none;
            transition: all 0.2s;
            border: none;
            cursor: pointer;
        }

        .btn-allure {
            background-color: rgba(234, 179, 8, 0.1);
            color: var(--accent-allure);
            border: 1px solid rgba(234, 179, 8, 0.2);
        }

        .btn-allure:hover {
            background-color: var(--accent-allure);
            color: #fff;
        }

        .btn-cucumber {
            background-color: rgba(34, 197, 94, 0.1);
            color: var(--accent-cucumber);
            border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .btn-cucumber:hover {
            background-color: var(--accent-cucumber);
            color: #fff;
        }

        .btn-disabled {
            opacity: 0.4;
            cursor: not-allowed;
            background-color: rgba(148, 163, 184, 0.1);
            color: #94a3b8;
            border: 1px solid rgba(148, 163, 184, 0.2);
        }
        
        .btn-disabled:hover {
            background-color: rgba(148, 163, 184, 0.1);
            color: #94a3b8;
        }

        /* Essential Animations */
        @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .fade-in-stagger {
            opacity: 0;
            animation: fadeInDown 0.5s ease-out forwards;
        }

        footer {
            margin-top: 6rem;
            text-align: center;
            padding: 2rem;
            color: var(--text-secondary);
            font-size: 0.875rem;
            border-top: 1px solid var(--border-color);
            animation: fadeIn 1.5s ease-out;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Test Execution History</h1>
            <div class="subtitle">Unified dashboard of all archived automated test runs</div>
        </header>

        <div class="dashboard-grid">
            ${runs.map((run, index) => `
            <div class="run-card fade-in-stagger" style="animation-delay: ${index * 0.05}s">
                <div class="run-header">
                    <div class="run-info">
                        <h2>${run.runName}</h2>
                        <div class="run-date">
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            ${run.displayDate}
                        </div>
                    </div>
                    <div class="badge-list">
                        ${index === 0 ? '<span class="status-badge badge-latest">Latest</span>' : ''}
                    </div>
                </div>
                <div class="reports-container">
                    ${run.hasAllure 
                        ? `<a href="./${run.folder}/allure/index.html" class="report-btn btn-allure" target="_blank">
                             <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                             Allure
                           </a>` 
                        : `<span class="report-btn btn-disabled">No Allure</span>`}
                    ${run.hasCucumber 
                        ? `<a href="./${run.folder}/cucumber/index.html" class="report-btn btn-cucumber" target="_blank">
                             <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                             Cucumber
                           </a>` 
                        : `<span class="report-btn btn-disabled">No Cucumber</span>`}
                </div>
            </div>
            `).join('')}
        </div>
    </div>
    <footer>Generated by TS Playwright Cucumber Framework by RBG technologies | Author: Saiteja Goud</footer>
    <script>
    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll('.run-card').forEach(card => {
            const allureBtn = card.querySelector('.btn-allure:not(.btn-disabled)');
            const cucumberBtn = card.querySelector('.btn-cucumber:not(.btn-disabled)');
            
            let validReports = 0;
            let checkedCount = 0;
            let totalToCheck = 0;
            
            const finalizeCard = () => {
                checkedCount++;
                if (checkedCount === totalToCheck && validReports === 0) {
                    card.style.display = 'none';
                }
            };

            if (allureBtn) {
                totalToCheck++;
                const img = new Image();
                img.onload = () => { validReports++; finalizeCard(); };
                img.onerror = () => {
                    allureBtn.classList.add('btn-disabled');
                    allureBtn.classList.remove('btn-allure');
                    allureBtn.innerHTML = '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg> No Allure';
                    allureBtn.removeAttribute('href');
                    allureBtn.removeAttribute('target');
                    finalizeCard();
                };
                img.src = allureBtn.getAttribute('href').replace('index.html', 'favicon.ico');
            }
            
            if (cucumberBtn) {
                totalToCheck++;
                const img = new Image();
                img.onload = () => { validReports++; finalizeCard(); };
                img.onerror = () => {
                    cucumberBtn.classList.add('btn-disabled');
                    cucumberBtn.classList.remove('btn-cucumber');
                    cucumberBtn.innerHTML = '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> No Cucumber';
                    cucumberBtn.removeAttribute('href');
                    cucumberBtn.removeAttribute('target');
                    finalizeCard();
                };
                img.src = cucumberBtn.getAttribute('href').replace('index.html', 'assets/img/ghost.svg');
            }
        });
    });
    </script>
</body>
</html>`;

  fs.writeFileSync(DASHBOARD_PATH, html, "utf-8");
  console.log("\n✅ Dashboard successfully generated at: " + DASHBOARD_PATH + "\n");

  if (opts.openBrowser) {
    if (process.platform === "win32") {
      exec(`start "" "${DASHBOARD_PATH}"`, (err) => {
        if (err) console.error("Could not automatically open dashboard.", err);
      });
    } else if (process.platform === "darwin") {
      exec(`open "${DASHBOARD_PATH}"`);
    } else {
      exec(`xdg-open "${DASHBOARD_PATH}"`);
    }
  }
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
   const noOpen = process.argv.includes("--no-open");
   generateDashboard({ openBrowser: !noOpen });
}
