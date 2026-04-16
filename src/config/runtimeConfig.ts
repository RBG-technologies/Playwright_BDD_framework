import "dotenv/config";
import { z } from "zod";

// ─── Schema ────────────────────────────────────────────────────────────────────

const boolTrue = (v?: string) => !["false", "0", "no", "n", "off"].includes((v ?? "true").toLowerCase());
const boolFlag = (v?: string) => ["true", "1", "yes", "y", "on"].includes((v ?? "").toLowerCase());

const envSchema = z.object({
  BROWSER: z.enum(["chromium", "firefox", "webkit"]).default("chromium"),
  HEADLESS: z.string().optional().transform(boolTrue),
  SLOW_MO: z.coerce.number().nonnegative().default(0),
  DEFAULT_TIMEOUT_MS: z.coerce.number().positive().default(60_000),
  ACTION_TIMEOUT_MS: z.coerce.number().positive().default(10_000),
  NAVIGATION_TIMEOUT_MS: z.coerce.number().positive().default(30_000),
  MAXIMIZE: z.string().optional().transform(boolFlag),
  BASE_URL: z.string().default(""),
  LOGIN_URL: z.string().default(""),
  BASIC_CONTROLS_URL: z.string().default("https://www.hyrtutorials.com/p/basic-controls.html"),
  NOP_COMMERCE_URL: z.string().default(""),
  APP_USERNAME: z.string().default(""),
  APP_PASSWORD: z.string().default(""),
  ALLOW_MANUAL_VERIFICATION: z.string().optional().transform(boolFlag),
  MANUAL_VERIFICATION_TIMEOUT_MS: z.coerce.number().positive().default(120_000),
  HIGHLIGHT_ELEMENTS: z.string().optional().transform(boolFlag),
  TRACE: z.string().optional().transform(boolFlag),
  SCREENSHOT_ON_FAILURE: z.string().optional().transform(boolTrue),
  ATTACH_SCREENSHOTS: z.string().optional().transform(boolFlag),
  RECORD_VIDEO: z.string().optional().transform(boolFlag),
  ALLURE_RESULTS_DIR: z.string().default("allure-results"),
});

// ─── Validation (fail fast on bad values) ─────────────────────────────────────

const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error("\n❌ Invalid environment configuration:");
  for (const issue of parseResult.error.issues) {
    console.error(`   ${issue.path.join(".")} — ${issue.message}`);
  }
  console.error("\nCheck your .env file against .env.example and fix the above values.\n");
  process.exit(1);
}

const env = parseResult.data;

// ─── Dynamic URL extraction ───────────────────────────────────────────────────
// Extract any *_URL env vars NOT already defined in the schema.
// Converts SCREAMING_SNAKE_CASE to camelCase (e.g. PRACTICE_FORM_URL → practiceFormUrl).

const dynamicUrls: Record<string, string> = {};
const schemaKeys = Object.keys(envSchema.shape);
for (const [key, value] of Object.entries(process.env)) {
  if (key && key.endsWith("_URL") && value && !schemaKeys.includes(key)) {
    const camelKey = key.toLowerCase().replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    dynamicUrls[camelKey] = value.trim();
  }
}

// Merge schema-defined URLs with dynamically discovered ones.
// Dynamic entries take precedence if a key overlaps.
const allUrls: Record<string, string> = {
  baseUrl: env.BASE_URL,
  loginUrl: env.LOGIN_URL,
  basicControlsUrl: env.BASIC_CONTROLS_URL,
  nopCommerceUrl: env.NOP_COMMERCE_URL,
  ...dynamicUrls,
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type SupportedBrowser = "chromium" | "firefox" | "webkit";

export interface RuntimeConfig {
  browser: SupportedBrowser;
  headless: boolean;
  slowMo: number;
  timeoutMs: number;
  actionTimeoutMs: number;
  navigationTimeoutMs: number;
  maximize: boolean;
  baseUrl: string;
  loginUrl: string;
  basicControlsUrl: string;
  nopCommerceUrl: string;
  username: string;
  password: string;
  allowManualVerification: boolean;
  manualVerificationTimeoutMs: number;
  highlightElements: boolean;
  trace: boolean;
  screenshotOnFailure: boolean;
  attachScreenshots: boolean;
  recordVideo: boolean;
  allureResultsDir: string;
  urls: Record<string, string>;
}

// ─── Exported config ──────────────────────────────────────────────────────────

export const runtimeConfig: RuntimeConfig = {
  browser: env.BROWSER,
  headless: env.HEADLESS,
  slowMo: env.SLOW_MO,
  timeoutMs: env.DEFAULT_TIMEOUT_MS,
  actionTimeoutMs: env.ACTION_TIMEOUT_MS,
  navigationTimeoutMs: env.NAVIGATION_TIMEOUT_MS,
  maximize: env.MAXIMIZE,
  baseUrl: env.BASE_URL,
  loginUrl: env.LOGIN_URL,
  basicControlsUrl: env.BASIC_CONTROLS_URL,
  nopCommerceUrl: env.NOP_COMMERCE_URL,
  username: env.APP_USERNAME,
  password: env.APP_PASSWORD,
  allowManualVerification: env.ALLOW_MANUAL_VERIFICATION,
  manualVerificationTimeoutMs: env.MANUAL_VERIFICATION_TIMEOUT_MS,
  highlightElements: env.HIGHLIGHT_ELEMENTS,
  trace: env.TRACE,
  screenshotOnFailure: env.SCREENSHOT_ON_FAILURE,
  attachScreenshots: env.ATTACH_SCREENSHOTS,
  recordVideo: env.RECORD_VIDEO,
  allureResultsDir: env.ALLURE_RESULTS_DIR,
  urls: allUrls,
};
