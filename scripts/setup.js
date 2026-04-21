import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frameworkRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(frameworkRoot, "..");

const npmCli = process.env.npm_execpath || findNpmCli();

function run(command, args, cwd, title) {
  console.log(`\n=== ${title} ===`);

  const isWin = process.platform === "win32";
  
  // On Windows, if shell: true is used, both the command and every argument 
  // that contains spaces must be explicitly quoted.
  let cmd = command;
  let cmdArgs = [...args];

  if (isWin) {
    if (cmd.includes(" ")) {
      cmd = `"${cmd}"`;
    }
    cmdArgs = cmdArgs.map(arg => 
      (typeof arg === "string" && arg.includes(" ") && !arg.startsWith("\"")) 
        ? `"${arg}"` 
        : arg
    );
  }

  const result = spawnSync(cmd, cmdArgs, {
    cwd,
    stdio: "inherit",
    shell: isWin
  });

  if (result.status !== 0) {
    throw new Error(`${title} failed with exit code ${result.status ?? 1}`);
  }
}

function runNpm(args, cwd, title) {
  if (!npmCli) {
    throw new Error("npm CLI not found. Please ensure npm is installed and in your PATH.");
  }

  // If we have an absolute path to npm-cli.js (from npm_execpath or similar)
  if (npmCli.endsWith(".js")) {
    run(process.execPath, [npmCli, ...args], cwd, title);
  } else {
    // Otherwise run the 'npm' command directly (which is usually a shell script/cmd on Windows)
    run(npmCli, args, cwd, title);
  }
}

/**
 * Attempt to find npm CLI if not provided via environment.
 */
function findNpmCli() {
  const result = spawnSync(process.platform === "win32" ? "where" : "which", ["npm"], {
    shell: process.platform === "win32"
  });

  if (result.status === 0) {
    return "npm";
  }
  return null;
}

function ensureEnvFile() {
  const examplePath = path.join(frameworkRoot, ".env.example");
  const envPath = path.join(frameworkRoot, ".env");

  if (!fs.existsSync(examplePath)) {
    console.warn(".env.example not found. Skipping .env bootstrap.");
    return;
  }

  // 1. Read .env.example (the template)
  const templateLines = fs.readFileSync(examplePath, "utf-8").split(/\r?\n/);

  // 2. Parse existing .env if it exists
  const existingValues = new Map();
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    envContent.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const [key, ...valueParts] = trimmed.split("=");
        existingValues.set(key.trim(), valueParts.join("=").trim());
      }
    });
  }

  // 3. Merge: iterate template, use existing value if present
  const resultLines = [];
  const handledKeys = new Set();

  for (const line of templateLines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key] = trimmed.split("=");
      const keyName = key.trim();
      handledKeys.add(keyName);
      
      if (existingValues.has(keyName)) {
        resultLines.push(`${keyName}=${existingValues.get(keyName)}`);
      } else {
        resultLines.push(line);
      }
    } else {
      // Keep comments, empty lines exactly as they are in the template
      resultLines.push(line);
    }
  }

  // 4. Append custom variables from .env that are NOT in .env.example
  const extras = [];
  for (const [key, value] of existingValues.entries()) {
    if (!handledKeys.has(key)) {
      extras.push(`${key}=${value}`);
    }
  }

  if (extras.length > 0) {
    resultLines.push("");
    resultLines.push("# --- Custom / Dynamic Variables (Preserved from existing .env) ---");
    resultLines.push(...extras);
  }

  // 5. Write back to .env
  fs.writeFileSync(envPath, resultLines.join("\n"), "utf-8");
  
  if (existingValues.size > 0) {
    console.log("Synchronized playwright-bdd-framework/.env with .env.example (preserved your values and comments).");
  } else {
    console.log("Created playwright-bdd-framework/.env from .env.example.");
  }
}

function checkJava() {
  const result = spawnSync("java", ["-version"], {
    cwd: repoRoot,
    stdio: "pipe",
    shell: process.platform === "win32"
  });

  if (result.status !== 0 || result.error) {
    console.warn("\n[Warning] Java is not available in PATH. Allure report commands need Java.");
    console.warn("Install Java 11+ and reopen terminal to use report/open-report commands.\n");
    return;
  }

  console.log("Java detected (required for Allure report generation).");
}

try {
  checkJava();
  console.log("\nSkipping root install inside setup script (avoids npm self-lock conflicts).");
  runNpm(["install"], frameworkRoot, "Install framework dependencies");
  runNpm(["exec", "playwright", "install"], frameworkRoot, "Install Playwright browsers");
  ensureEnvFile();

  console.log("\n✅ Setup completed.");
  console.log("Run tests with: npm run test");
  console.log("Run report with: npm run report");
} catch (error) {
  console.error(`\n❌ Setup failed: ${error.message}`);
  process.exit(1);
}
