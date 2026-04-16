import { Given, When, Then } from '@cucumber/cucumber';
import { PlaygroundPage } from '../../pages/rbgWebsitePage.ts';
import { CustomWorld } from '../support/customWorld.ts';

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
