import {
  After,
  AfterAll,
  AfterStep,
  Before,
  BeforeAll,
  setDefaultTimeout,
  Status
} from "@cucumber/cucumber";
import { chromium, firefox, webkit } from "playwright";
import type { Browser } from "playwright";
import fs from "fs";
import path from "path";
import { runtimeConfig } from "../../config/runtimeConfig.ts";
import type { CustomWorld } from "../support/customWorld.ts";

setDefaultTimeout(runtimeConfig.timeoutMs);

let sharedBrowser: Browser;

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

Before(async function (this: CustomWorld) {
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

  this.context = await sharedBrowser.newContext(contextOptions);
  this.context.setDefaultTimeout(runtimeConfig.actionTimeoutMs);
  this.context.setDefaultNavigationTimeout(runtimeConfig.navigationTimeoutMs);

  if (runtimeConfig.trace) {
    await this.context.tracing.start({ screenshots: true, snapshots: true });
  }

  this.page = await this.context.newPage();
  this.formData = {};
});

AfterStep(async function (this: CustomWorld, { result }) {
  // Screenshots are handled in the After hook (on failure) or via configuration.
  // Removed per-step screenshots as requested by the user.
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