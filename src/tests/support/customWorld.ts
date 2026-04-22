import type { IWorldOptions } from "@cucumber/cucumber";
import { World, setWorldConstructor } from "@cucumber/cucumber";
import type { APIRequestContext, Browser, BrowserContext, Page } from "playwright";
import { runtimeConfig, type RuntimeConfig } from "../../config/runtimeConfig.ts";

export class CustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page!: Page;
  apiRequest!: APIRequestContext;
  videoPath?: string;
  runtime: RuntimeConfig;
  formData: Record<string, unknown>;
  pages: Record<string, any>;

  constructor(options: IWorldOptions) {
    super(options);
    this.runtime = runtimeConfig;
    this.formData = {};
    this.pages = {};
  }
}

setWorldConstructor(CustomWorld);

//this is fixture class