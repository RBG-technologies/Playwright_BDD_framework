import {
  After,
  AfterAll,
  AfterStep,
  Before,
  BeforeAll,
  setDefaultTimeout,
  Status
} from "@cucumber/cucumber";
import { chromium, firefox, request, webkit } from "playwright";
import type { Browser } from "playwright";
import fs from "fs";
import path from "path";
import { runtimeConfig } from "../../config/runtimeConfig.ts";
import type { CustomWorld } from "../support/customWorld.ts";

setDefaultTimeout(runtimeConfig.timeoutMs);

export let sharedBrowser: Browser;

const browserFactory = {
  chromium,
  firefox,
  webkit
};

BeforeAll(async function () {
  const launcher = browserFactory[runtimeConfig.browser] ?? chromium;
  const launchOptions: Parameters<typeof launcher.launch>[0] = {
    headless: runtimeConfig.headless,
    slowMo: runtimeConfig.slowMo
  };
  if (runtimeConfig.maximize) {
    launchOptions.args = ["--start-maximized"];
  }
  sharedBrowser = await launcher.launch(launchOptions);
});

export function getContextOptions() {
  const testResultsDir = path.resolve(process.cwd(), "test-results");
  const videoDir = path.join(testResultsDir, "videos");
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  const contextOptions: Parameters<Browser["newContext"]>[0] = {
    ignoreHTTPSErrors: true,
    viewport: runtimeConfig.maximize ? null : { width: 1366, height: 768 },
    recordVideo: runtimeConfig.recordVideo ? { dir: videoDir } : undefined
  };

  if (runtimeConfig.baseUrl) {
    contextOptions.baseURL = runtimeConfig.baseUrl;
  }
  return contextOptions;
}

export async function initContext(world: CustomWorld) {
  const contextOptions = getContextOptions();

  world.context = await sharedBrowser.newContext(contextOptions);
  world.context.setDefaultTimeout(runtimeConfig.actionTimeoutMs);
  world.context.setDefaultNavigationTimeout(runtimeConfig.navigationTimeoutMs);

  if (runtimeConfig.trace) {
    await world.context.tracing.start({ screenshots: true, snapshots: true });
  }

  world.page = await world.context.newPage();
  return world.page;
}

Before(async function (this: CustomWorld, { pickle }) {
  console.log(`\n🚀 Scenario: ${pickle.name}`);
  await initContext(this);
  this.apiRequest = await request.newContext({
    baseURL: runtimeConfig.apiBaseUrl,
    ignoreHTTPSErrors: true
  });
  this.formData = {};
});

AfterStep(async function (this: CustomWorld, { result, pickleStep }) {
  if (result.status === Status.FAILED) {
    console.log(`  ❌ Step Failed: ${pickleStep.text}`);
    console.log(`     Error: ${result.message}\n`);
  } else if (result.status === Status.PASSED) {
    console.log(`  ✔ Step Passed: ${pickleStep.text}`);
  }
});

After(async function (this: CustomWorld, { result, pickle }) {
  // Always attach screenshot at the end of the scenario
  if (this.page) {
    try {
      const screenshot = await this.page.screenshot({ fullPage: true });
      await this.attach(screenshot, "image/png");
    } catch (error) {
      console.warn("Failed to capture scenario screenshot:", error);
    }
  }

  if (runtimeConfig.trace && this.context && pickle) {
    await this.context.tracing.stop({
      path: `test-results/${pickle.name.replace(/[^a-zA-Z0-9-_]/g, "_")}.zip`
    });
  }

  const recordedVideo = runtimeConfig.recordVideo && this.page ? this.page.video() : null;

  await this.apiRequest?.dispose();
  await this.context?.close();

  // Attach video after context is closed (Playwright finalizes video on close)
  if (recordedVideo) {
    try {
      const videoPath = await recordedVideo.path();
      if (videoPath && fs.existsSync(videoPath)) {
        const videoBuffer = fs.readFileSync(videoPath);
        await this.attach(videoBuffer, "video/webm");
      }
    } catch (error) {
      console.warn("Failed to attach video:", error);
    }
  }
});

AfterAll(async function () {
  await sharedBrowser?.close();
});