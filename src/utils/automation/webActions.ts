import { expect } from "@playwright/test";
import type { Locator, Page } from "playwright";
import type { RuntimeConfig } from "../../config/runtimeConfig.ts";

export type LocatorTarget = string | Locator;
type SelectOptionInput = Parameters<Locator["selectOption"]>[0];

/**
 * WebActions — base class for browser interactions.
 */
export class WebActions {
  protected readonly page: Page;
  protected readonly runtime: RuntimeConfig;

  constructor(page: Page, runtime: RuntimeConfig) {
    this.page = page;
    this.runtime = runtime;
  }

  protected locator(target: LocatorTarget): Locator {
    return typeof target === "string" ? this.page.locator(target) : target;
  }

  protected async highlight(target: LocatorTarget): Promise<void> {
    const loc = this.locator(target);
    await this.page.evaluate(() => {
      document.querySelectorAll(".automation-target").forEach((el) => el.classList.remove("automation-target"));
    }).catch(() => { });

    await loc.evaluate((el: HTMLElement) => {
      el.classList.add("automation-target");
      el.style.border = "3px solid red";
      el.style.backgroundColor = "yellow";
    }).catch(() => { });

    if (!this.runtime.highlightElements) return;
  }

  async goto(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
  }

  async waitForHidden(target: LocatorTarget, timeout = this.runtime.actionTimeoutMs): Promise<void> {
    await this.locator(target).waitFor({ state: "hidden", timeout });
  }

  async waitForEnabled(target: LocatorTarget, timeout = this.runtime.actionTimeoutMs): Promise<void> {
    const locator = this.locator(target);
    await locator.waitFor({ state: "visible", timeout });
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      if (await locator.isEnabled().catch(() => false)) return;
      await this.page.waitForTimeout(200);
    }
  }

  async checkEnabled(target: LocatorTarget): Promise<boolean> {
    return await this.locator(target).isEnabled();
  }

  async waitForTimeout(timeoutMs: number): Promise<void> {
    await this.page.waitForTimeout(timeoutMs);
  }

  /**
   * Pause execution for a specific number of seconds.
   * @param seconds Number of seconds to wait.
   */
  async wait(seconds: number): Promise<void> {
    await this.page.waitForTimeout(seconds * 1000);
  }

  async waitForUrl(url: string | RegExp, timeout = this.runtime.navigationTimeoutMs): Promise<void> {
    await this.page.waitForURL(url, { timeout });
  }

  async waitForLoadState(state: "load" | "domcontentloaded" | "networkidle" = "load"): Promise<void> {
    await this.page.waitForLoadState(state);
  }

  async click(target: LocatorTarget): Promise<void> {
    await this.highlight(target);
    await this.locator(target).click();
  }

  async dblclick(target: LocatorTarget): Promise<void> {
    await this.highlight(target);
    await this.locator(target).dblclick();
  }

  async rightclick(target: LocatorTarget): Promise<void> {
    await this.highlight(target);
    await this.locator(target).click({ button: "right" });
  }

  async tap(target: LocatorTarget): Promise<void> {
    await this.highlight(target);
    await this.locator(target).tap();
  }

  async focus(target: LocatorTarget): Promise<void> {
    await this.highlight(target);
    await this.locator(target).focus();
  }

  async blur(target: LocatorTarget): Promise<void> {
    await this.locator(target).blur();
  }

  async pressSequentially(target: LocatorTarget, text: string, delay?: number): Promise<void> {
    await this.highlight(target);
    await this.locator(target).pressSequentially(text, { delay });
  }

  async getAttribute(target: LocatorTarget, name: string): Promise<string | null> {
    return this.locator(target).getAttribute(name);
  }

  async count(target: LocatorTarget): Promise<number> {
    return this.locator(target).count();
  }

  async evaluate<R>(
    target: LocatorTarget,
    pageFunction: (el: HTMLElement | SVGElement, arg: unknown) => R | Promise<R>,
    arg?: unknown
  ): Promise<R> {
    return this.locator(target).evaluate(pageFunction, arg);
  }

  async fillText(target: LocatorTarget, value: string): Promise<void> {
    await this.highlight(target);
    await this.locator(target).fill(value);
  }

  async clear(target: LocatorTarget): Promise<void> {
    await this.highlight(target);
    await this.locator(target).clear();
  }

  async dragAndDrop(source: LocatorTarget, target: LocatorTarget): Promise<void> {
    await this.highlight(source);
    await this.locator(source).dragTo(this.locator(target));
  }

  async dispatchEvent(target: LocatorTarget, type: string, eventInit?: Record<string, unknown>): Promise<void> {
    await this.locator(target).dispatchEvent(type, eventInit);
  }

  async typeSequentially(target: LocatorTarget, value: string, delay?: number): Promise<void> {
    await this.highlight(target);
    await this.locator(target).fill("");
    await this.locator(target).pressSequentially(value, { delay });
  }

  async press(target: LocatorTarget, key: string): Promise<void> {
    await this.highlight(target);
    await this.locator(target).press(key);
  }

  async check(target: LocatorTarget): Promise<void> {
    await this.highlight(target);
    await this.locator(target).check();
  }

  async uncheck(target: LocatorTarget): Promise<void> {
    await this.highlight(target);
    await this.locator(target).uncheck();
  }

  async select(target: LocatorTarget, option: SelectOptionInput): Promise<void> {
    await this.highlight(target);
    await this.locator(target).selectOption(option);
  }

  async hover(target: LocatorTarget): Promise<void> {
    await this.highlight(target);
    await this.locator(target).hover();
  }

  async scrollIntoView(target: LocatorTarget): Promise<void> {
    await this.locator(target).scrollIntoViewIfNeeded();
  }

  async uploadFile(target: LocatorTarget, filePaths: string | string[]): Promise<void> {
    await this.highlight(target);
    await this.locator(target).setInputFiles(filePaths);
  }

  async getText(target: LocatorTarget): Promise<string> {
    return (await this.locator(target).innerText()).trim();
  }

  async getInputValue(target: LocatorTarget): Promise<string> {
    return this.locator(target).inputValue();
  }

  async isChecked(target: LocatorTarget): Promise<boolean> {
    return this.locator(target).isChecked();
  }

  async isVisible(target: LocatorTarget): Promise<boolean> {
    return this.locator(target).isVisible();
  }

  async screenshot(filePath: string, fullPage = true): Promise<void> {
    await this.page.screenshot({ path: filePath, fullPage });
  }
}

/**
 * WebAssertions extends WebActions with typed, named assertion methods.
 */
export class WebAssertions extends WebActions {
  /** Assert element is visible on the page */
  async expectVisible(target: LocatorTarget, message?: string): Promise<void> {
    await expect(this.locator(target), message).toBeVisible({ timeout: this.runtime.actionTimeoutMs });
  }

  /** Assert element is NOT visible */
  async expectNotVisible(target: LocatorTarget, message?: string): Promise<void> {
    await expect(this.locator(target), message).toBeHidden({ timeout: this.runtime.actionTimeoutMs });
  }

  /** Assert element has exact inner text */
  async expectText(target: LocatorTarget, text: string, message?: string): Promise<void> {
    await expect(this.locator(target), message).toHaveText(text, { timeout: this.runtime.actionTimeoutMs });
  }

  /** Assert element contains the given substring */
  async expectContainsText(target: LocatorTarget, text: string, message?: string): Promise<void> {
    await expect(this.locator(target), message).toContainText(text, { timeout: this.runtime.actionTimeoutMs });
  }

  /** Assert input/textarea has the given value */
  async expectInputValue(target: LocatorTarget, value: string, message?: string): Promise<void> {
    await expect(this.locator(target), message).toHaveValue(value, { timeout: this.runtime.actionTimeoutMs });
  }

  /** Assert checkbox or radio button is checked */
  async expectChecked(target: LocatorTarget, message?: string): Promise<void> {
    await expect(this.locator(target), message).toBeChecked({ timeout: this.runtime.actionTimeoutMs });
  }

  /** Assert checkbox or radio button is NOT checked */
  async expectNotChecked(target: LocatorTarget, message?: string): Promise<void> {
    await expect(this.locator(target), message).not.toBeChecked({ timeout: this.runtime.actionTimeoutMs });
  }

  /** Assert element is enabled */
  async expectEnabled(target: LocatorTarget, message?: string): Promise<void> {
    await expect(this.locator(target), message).toBeEnabled({ timeout: this.runtime.actionTimeoutMs });
  }

  /** Assert element is disabled */
  async expectDisabled(target: LocatorTarget, message?: string): Promise<void> {
    await expect(this.locator(target), message).toBeDisabled({ timeout: this.runtime.actionTimeoutMs });
  }

  /** Assert element attribute equals value */
  async expectAttribute(target: LocatorTarget, attr: string, value: string, message?: string): Promise<void> {
    await expect(this.locator(target), message).toHaveAttribute(attr, value, { timeout: this.runtime.actionTimeoutMs });
  }

  /** Assert element attribute contains substring */
  async expectAttributeContains(target: LocatorTarget, attr: string, substring: string): Promise<void> {
    const actual = await this.locator(target).getAttribute(attr);
    expect(actual, `Expected attribute "${attr}" to contain "${substring}", got "${actual}"`).toContain(substring);
  }

  /** Assert the number of matching elements */
  async expectCount(target: LocatorTarget, count: number, message?: string): Promise<void> {
    await expect(this.locator(target), message).toHaveCount(count, { timeout: this.runtime.actionTimeoutMs });
  }

  /** Assert current page URL contains the given substring */
  async expectUrlContains(substring: string, message?: string): Promise<void> {
    await expect(this.page, message).toHaveURL(new RegExp(substring.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), {
      timeout: this.runtime.navigationTimeoutMs,
    });
  }

  /** Assert current page URL matches exactly */
  async expectUrl(url: string | RegExp, message?: string): Promise<void> {
    await expect(this.page, message).toHaveURL(url, { timeout: this.runtime.navigationTimeoutMs });
  }

  /** Assert page title matches */
  async expectTitle(title: string | RegExp, message?: string): Promise<void> {
    await expect(this.page, message).toHaveTitle(title, { timeout: this.runtime.navigationTimeoutMs });
  }
}
