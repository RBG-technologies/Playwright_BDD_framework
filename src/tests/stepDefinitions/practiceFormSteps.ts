import { When, Then, Given } from "@cucumber/cucumber";
import { faker } from "@faker-js/faker";
import path from "path";
import type { CustomWorld } from "../support/customWorld.js";
import { TestDataFactory as TDF } from "../../factories/dataFactory.ts";
import { PracticeFormPage } from "../../pages/practiceFormPage.ts";

// let formPage: PracticeFormPage;

type PracticeFormData = {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  mobile: string;
  address: string;
};

const PRACTICE_FORM_DATA_KEY = "practiceForm";

function createPracticeFormData(): PracticeFormData {
  const gender = faker.helpers.arrayElement(["Male", "Female"]);
  const firstName = TDF.firstName(gender.toLowerCase() as "male" | "female");

  return {
    firstName,
    lastName: TDF.lastName(),
    email: TDF.email(firstName.toLowerCase()),
    gender,
    mobile: faker.string.numeric(10),
    address: TDF.street(),
  };
}

function getPracticeFormData(world: CustomWorld): PracticeFormData {
  const existingData = world.formData[PRACTICE_FORM_DATA_KEY] as PracticeFormData | undefined;

  if (existingData) {
    return existingData;
  }

  const newData = createPracticeFormData();
  world.formData[PRACTICE_FORM_DATA_KEY] = newData;
  return newData;
}

// Auto-generated step definitions from practiceForm.feature
Given("user navigates to practice form page", async function (this: CustomWorld) {
  this.pages.practiceFormPage = new PracticeFormPage(this.page, this.runtime);
  await this.pages.practiceFormPage.navigate();
});

When("user enters student first name {string}", async function (this: CustomWorld, arg1: string) {
  const value = arg1.toLowerCase() === "faker" ? getPracticeFormData(this).firstName : arg1;
  await this.pages.practiceFormPage.enterFirstName(value);
});

When("user enters student last name {string}", async function (this: CustomWorld, arg1: string) {
  const value = arg1.toLowerCase() === "faker" ? getPracticeFormData(this).lastName : arg1;
  await this.pages.practiceFormPage.enterLastName(value);
});

When("user enters student email {string}", async function (this: CustomWorld, arg1: string) {
  const value = arg1.toLowerCase() === "faker" ? getPracticeFormData(this).email : arg1;
  await this.pages.practiceFormPage.enterEmail(value);
});

When("user selects student gender {string}", async function (this: CustomWorld, arg1: string) {
  const normalizedValue = arg1.toLowerCase();
  const value =
    normalizedValue === "faker" || normalizedValue === "random" ? getPracticeFormData(this).gender : arg1;
  await this.pages.practiceFormPage.selectGender(value);
});

When("user enters mobile number {string}", async function (this: CustomWorld, arg1: string) {
  const value = arg1.toLowerCase() === "faker" ? getPracticeFormData(this).mobile : arg1;
  await this.pages.practiceFormPage.enterMobile(value);
});

When("user selects date of birth", async function (this: CustomWorld) {
  await this.pages.practiceFormPage.selectDOB();
});

When("user enters subject {string}", async function (this: CustomWorld, arg1: string) {
  await this.pages.practiceFormPage.enterSubject(arg1);
});

When("user selects hobby {string}", async function (this: CustomWorld, arg1: string) {
  await this.pages.practiceFormPage.selectHobby(arg1);
});

When("user uploads picture", async function (this: CustomWorld) {
  const picturePath = path.resolve(process.cwd(), "test-assets", "picture.png");
  await this.pages.practiceFormPage.uploadPicture(picturePath);
});

When("user enters address {string}", async function (this: CustomWorld, arg1: string) {
  const value = arg1.toLowerCase() === "faker" ? getPracticeFormData(this).address : arg1;
  await this.pages.practiceFormPage.enterAddress(value);
});

When("user selects state {string}", async function (this: CustomWorld, arg1: string) {
  await this.pages.practiceFormPage.selectState(arg1);
});

When("user selects city {string}", async function (this: CustomWorld, arg1: string) {
  await this.pages.practiceFormPage.selectCity(arg1);
});

When("user clicks submit button", async function (this: CustomWorld) {
  await this.pages.practiceFormPage.clickSubmit();
});

Then("registration should be successful", async function (this: CustomWorld) {
  await this.pages.practiceFormPage.verifySubmission();
});
