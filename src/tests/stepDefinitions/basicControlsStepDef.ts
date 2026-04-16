import { When, Then, Given, Before } from "@cucumber/cucumber";
import type { CustomWorld } from "../support/customWorld.js";
import { basicControls_Page } from "../../pages/basicControlsPage.ts";



// let basicControlsPage: basicControls_Page;

// Intentionally empty for fresh framework template.

// Initialize basicControlsPage before steps
Before(async function (this: CustomWorld) {
  this.pages.basicControlsPage = new basicControls_Page(this.page, this.runtime);
});


// Auto-generated step definitions from basicControls.feature
Given("user is on the registration page", async function (this: CustomWorld) {
  await this.pages.basicControlsPage.navigate();
});

When("user enters first name {string}", async function (this: CustomWorld, arg1: string) {
  await this.pages.basicControlsPage.enterFirstname(arg1);

});

When("user enters last name {string}", async function (this: CustomWorld, arg1: string) {
  await this.pages.basicControlsPage.enterlastName(arg1);
});

When("user selects gender {string}", async function (this: CustomWorld, arg1: string) {
  await this.pages.basicControlsPage.selectGender(arg1);
});

When("user selects languages {string} and {string}", async function (this: CustomWorld, arg1: string, arg2: string) {
  await this.pages.basicControlsPage.selectLanguages([arg1, arg2]);
});

When("user enters email {string}", async function (this: CustomWorld, arg1: string) {
  await this.pages.basicControlsPage.enterEmail(arg1);
});

When("user enters password {string}", async function (this: CustomWorld, arg1: string) {
  await this.pages.basicControlsPage.enterPassword(arg1);
});

When("user clicks on Register button", async function (this: CustomWorld) {
  await this.pages.basicControlsPage.registerbutton();

});


Then("user should be successfully registered", async function (this: CustomWorld) {

});
