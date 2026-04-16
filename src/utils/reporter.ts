import type { Locator } from "playwright";

type AttachFn = (data: any, mimeType: string) => void | Promise<void>;

/**
 * Reporter — A simple singleton to mediate attachments from page objects to Cucumber.
 * This avoids passing the 'world' object into every page object/action class.
 */
class Reporter {
  private attachFn?: AttachFn;
  private lastElement?: Locator;

  setAttach(fn: AttachFn) {
    this.attachFn = fn;
  }

  async attach(data: string | Buffer, mimeType: string): Promise<void> {
    if (this.attachFn) {
      await this.attachFn(data, mimeType);
    }
  }

  // Helper for Screenshots
  async screenshot(screenshot: Buffer): Promise<void> {
    await this.attach(screenshot, "image/png");
  }

  setLastElement(loc: Locator) {
    this.lastElement = loc;
  }

  getLastElement(): Locator | undefined {
    return this.lastElement;
  }
}

export const reporter = new Reporter();
