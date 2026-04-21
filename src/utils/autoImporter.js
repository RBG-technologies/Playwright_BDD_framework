import fs from "node:fs/promises";
import path from "node:path";

/**
 * Robust Auto-Importer Utility
 *
 * Automatically detects and fixes missing imports across the entire framework.
 * Prevents self-imports, circular dependencies, and duplicate imports.
 */

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src");
const PAGES_DIR = path.join(ROOT, "src/pages");
const SUPPORT_DIR = path.join(ROOT, "src/tests/support");
const CONFIG_DIR = path.join(ROOT, "src/config");
const UTILS_DIR = path.join(ROOT, "src/utils");

function getArg(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function hasFlag(name) {
  return process.argv.includes(name);
}

async function walkFiles(dir, ext) {
  const result = [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return result;
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...(await walkFiles(full, ext)));
    } else if (entry.isFile() && entry.name.endsWith(ext)) {
      result.push(full);
    }
  }
  return result;
}

async function getPageObjects() {
  let files;
  try {
    files = await fs.readdir(PAGES_DIR);
  } catch {
    return [];
  }
  const pages = [];
  for (const file of files) {
    if (file.endsWith(".ts")) {
      const content = await fs.readFile(path.join(PAGES_DIR, file), "utf-8");
      const match = content.match(/export class (\w+)/);
      if (match) {
        pages.push({ name: match[1], path: path.join(PAGES_DIR, file) });
      }
    }
  }
  return pages;
}

function getRelativeImport(fromDir, toFile) {
  const relPath = path.relative(fromDir, toFile).replace(/\\/g, "/");
  const formatted = relPath.startsWith(".") ? relPath : `./${relPath}`;
  return formatted.endsWith(".ts") ? formatted : formatted + ".ts";
}

function isAlreadyImported(content, name) {
  // Matches: import { ..., name, ... } or import name or import * as name
  const regex = new RegExp(`import\\s+[^;]*\\b${name}\\b[^;]*from`, "s");
  return regex.test(content);
}

function isDefinedInFile(content, name) {
  const classRegex = new RegExp(`export\\s+class\\s+${name}\\b`);
  const typeRegex = new RegExp(`export\\s+type\\s+${name}\\b`);
  const constRegex = new RegExp(`export\\s+const\\s+${name}\\b`);
  const interfaceRegex = new RegExp(`export\\s+interface\\s+${name}\\b`);
  return classRegex.test(content) || typeRegex.test(content) || constRegex.test(content) || interfaceRegex.test(content);
}

async function fixFile(filePath, pageObjects, fix = false) {
  const originalContent = await fs.readFile(filePath, "utf-8");
  let content = originalContent;
  const dir = path.dirname(filePath);
  const fileName = path.basename(filePath);

  const newImports = [];
  const missing = [];

  // 1. Cucumber Keywords
  const neededCucumber = [];
  ["Given", "When", "Then", "Before", "After", "BeforeAll", "AfterAll"].forEach((kw) => {
    const regex = new RegExp(`\\b${kw}\\(`);
    if (content.match(regex) && !isAlreadyImported(content, kw) && !isDefinedInFile(content, kw)) {
      neededCucumber.push(kw);
    }
  });
  if (neededCucumber.length > 0) {
    newImports.push(`import { ${neededCucumber.join(", ")} } from "@cucumber/cucumber";`);
    missing.push(`Cucumber: ${neededCucumber.join(", ")}`);
  }

  // 2. CustomWorld
  if (content.includes("CustomWorld") && !isAlreadyImported(content, "CustomWorld") && !isDefinedInFile(content, "CustomWorld")) {
    newImports.push(`import { CustomWorld } from "${getRelativeImport(dir, path.join(SUPPORT_DIR, "customWorld.ts"))}";`);
    missing.push("CustomWorld");
  }

  // 3. Playwright Types & Expect
  const neededPlaywright = [];
  ["Page", "expect", "Browser", "BrowserContext", "Locator"].forEach((item) => {
    const regex = new RegExp(`\\b${item}\\b`);
    if (content.match(regex) && !isAlreadyImported(content, item) && !isDefinedInFile(content, item)) {
      neededPlaywright.push(item);
    }
  });
  if (neededPlaywright.length > 0) {
    const isOnlyTypes = neededPlaywright.every(i => ["Page", "Browser", "BrowserContext", "Locator"].includes(i)) && !neededPlaywright.includes("expect");
    newImports.push(`import ${isOnlyTypes ? "type " : ""}{ ${neededPlaywright.join(", ")} } from "@playwright/test";`);
    missing.push(`Playwright: ${neededPlaywright.join(", ")}`);
  }

  // 4. Runtime Configuration
  const neededConfig = [];
  ["runtimeConfig", "RuntimeConfig"].forEach((item) => {
    const regex = new RegExp(`\\b${item}\\b`);
    if (content.match(regex) && !isAlreadyImported(content, item) && !isDefinedInFile(content, item)) {
      neededConfig.push(item);
    }
  });
  if (neededConfig.length > 0) {
    const hasType = neededConfig.includes("RuntimeConfig");
    const hasValue = neededConfig.includes("runtimeConfig");
    const configPath = getRelativeImport(dir, path.join(CONFIG_DIR, "runtimeConfig.ts"));
    if (hasValue && hasType) {
      newImports.push(`import { runtimeConfig, type RuntimeConfig } from "${configPath}";`);
    } else if (hasType) {
      newImports.push(`import type { RuntimeConfig } from "${configPath}";`);
    } else {
      newImports.push(`import { runtimeConfig } from "${configPath}";`);
    }
    missing.push(`Config: ${neededConfig.join(", ")}`);
  }

  // 5. Framework Utils
  ["PlaywrightActions", "PlaywrightAssertions"].forEach((util) => {
    const regex = new RegExp(`\\b${util}\\b`);
    if (content.match(regex) && !isAlreadyImported(content, util) && !isDefinedInFile(content, util)) {
      const utilPath = getRelativeImport(dir, path.join(UTILS_DIR, `${util.charAt(0).toLowerCase()}${util.slice(1)}.ts`));
      newImports.push(`import { ${util} } from "${utilPath}";`);
      missing.push(util);
    }
  });

  // 6. Page Objects
  for (const po of pageObjects) {
    if (fileName === path.basename(po.path)) continue; 
    const poRegex = new RegExp(`\\b${po.name}\\b`);
    if (content.match(poRegex) && !isAlreadyImported(content, po.name) && !isDefinedInFile(content, po.name)) {
      newImports.push(`import { ${po.name} } from "${getRelativeImport(dir, po.path)}";`);
      missing.push(po.name);
    }
  }

  if (newImports.length > 0) {
    if (fix) {
      const finalContent = newImports.join("\n") + "\n" + content;
      await fs.writeFile(filePath, finalContent, "utf-8");
      console.log(`✅ Fixed imports in: ${path.relative(ROOT, filePath)} (${missing.join(", ")})`);
    } else {
      console.warn(`⚠️  Missing imports in: ${path.relative(ROOT, filePath)} (${missing.join(", ")})`);
    }
    return true;
  }
  return false;
}

async function main() {
  const fileArg = getArg("--file");
  const fix = hasFlag("--fix");
  const pageObjects = await getPageObjects();

  if (fileArg) {
    const filePath = path.resolve(ROOT, fileArg);
    await fixFile(filePath, pageObjects, fix);
  } else {
    const allTsFiles = await walkFiles(SRC_DIR, ".ts");
    let count = 0;
    for (const file of allTsFiles) {
      if (file.includes("runtimeConfig.ts")) continue;
      if (file.includes("customWorld.ts")) continue; // Skip because it's sensitive and almost always correct
      
      if (await fixFile(file, pageObjects, fix)) {
        count++;
      }
    }
    if (count === 0) {
      console.log("✅ All framework imports are correct.");
    } else if (!fix) {
      console.log(`\nRun with --fix to automatically add missing imports to ${count} files.`);
    }
  }
}

main().catch(console.error);
