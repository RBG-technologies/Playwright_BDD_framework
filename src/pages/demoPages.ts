import type { Page } from "@playwright/test";

import type { RuntimeConfig } from "../config/runtimeConfig.ts";
import { PlaywrightAssertions } from "../utils/playwrightAssertions.ts";

export class demoPages extends PlaywrightAssertions {

    constructor(page: Page, runtime: RuntimeConfig) {
        super(page, runtime);
    }
}