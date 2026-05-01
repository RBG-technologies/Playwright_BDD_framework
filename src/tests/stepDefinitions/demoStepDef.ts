import { Given, When, Then } from "@cucumber/cucumber";
import * as allure from "allure-js-commons";
import { PlaygroundPage } from "../../pages/demoPages.ts";
import { CustomWorld } from "../support/customWorld.js";
import { DataReader } from "../../utils/automation/dataReader.ts";
import { sharedBrowser, getContextOptions, initContext } from "../hooks/hooks.js";

// let playground: PlaygroundPage;

Given('user navigates to "RBG" application', async function (this: CustomWorld) {
  this.pages.playground = new PlaygroundPage(this.page, this.runtime);
  await this.pages.playground.navigate();
});

When("user enters \"RBG\" name {string}", async function (this: CustomWorld, arg1: string) {
  await this.pages.playground.enterName(arg1);
});

When("user enters \"RBG\" password {string}", async function (this: CustomWorld, arg1: string) {
  await this.pages.playground.enterPassword(arg1);
});

When("user enters \"RBG\" email {string}", async function (this: CustomWorld, arg1: string) {
  await this.pages.playground.enterEmail(arg1);
});

When("user enters \"RBG\" phone {string}", async function (this: CustomWorld, arg1: string) {
  await this.pages.playground.enterPhone(arg1);
});

When("user enters \"RBG\" text {string}", async function (this: CustomWorld, arg1: string) {
  await this.pages.playground.enterText(arg1);
});

When("user clicks \"RBG\" submit button", async function (this: CustomWorld) {
  await this.pages.playground.clickSubmit();
});

Then("user should see \"RBG\" message {string}", async function (this: CustomWorld, arg1: string) {
  await this.pages.playground.validateMessage(arg1);
});

Given("user loads demo data from {string}", async function (this: CustomWorld, fileName: string) {
  const data = DataReader.readCsv(fileName);
  this.formData["loadedDemoData"] = data;
  console.log(`Loaded ${data.length} demo records from ${fileName}`);
});

/**
 * Optimized form submission loop that treats each CSV row as a fresh run.
 * This is achieved by resetting the browser context programmatically.
 */
When("user submits the form with loaded demo data", async function (this: CustomWorld) {
  const records = this.formData["loadedDemoData"] as any[];

  await DataReader.runDDT(records, this, async (record: any, i: number) => {
    // For every record after the first one, we reset the context to "open freshly"
    if (i > 0) {
      console.log(`\n♻ Resetting context for record ${i + 1} (${record.name})...`);

      // Close old context/page
      await this.context?.close();

      // Initialize fresh context/page using the shared helper
      await initContext(this);

      // Re-initialize page object and navigate
      this.pages.playground = new PlaygroundPage(this.page, this.runtime);
      await this.pages.playground.navigate();
    }

    console.log(`Submitting form for: ${record.name}`);
    await this.pages.playground.enterName(record.name);
    await this.pages.playground.enterEmail(record.email);
    await this.pages.playground.enterPassword(record.password);
    await this.pages.playground.enterPhone(record.phone);
    await this.pages.playground.enterText(record.text);
    await this.pages.playground.clickSubmit();
    await this.pages.playground.validateMessage("Submitted");
  });
});
