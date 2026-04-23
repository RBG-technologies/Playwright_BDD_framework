import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "chai";
import { ApiActions } from "../../utils/automation/apiActions.ts";
import type { CustomWorld } from "../support/customWorld.ts";
import type { APIResponse } from "playwright";

Given("user prepares a GET request to {string}", function (this: CustomWorld, url: string) {
  this.formData["apiMethod"] = "GET";
  this.formData["apiUrl"] = url;
});

Given("user prepares a POST request to {string} with data:", function (this: CustomWorld, url: string, data: string) {
  this.formData["apiMethod"] = "POST";
  this.formData["apiUrl"] = url;
  this.formData["apiData"] = JSON.parse(data);
});

When("user sends the API request", async function (this: CustomWorld) {
  try {
    const api = new ApiActions(this.apiRequest, this.runtime);
    const method = this.formData["apiMethod"] as string;
    const url = this.formData["apiUrl"] as string;
    const data = this.formData["apiData"];

    console.log(`  -> Sending ${method} request to ${url}...`);
    let response: APIResponse;

    if (method === "GET") {
      response = await api.get(url);
    } else {
      response = await api.post(url, { data });
    }

    this.formData["lastApiResponse"] = response;

    // Attach response for debugging in report
    const bodyText = await response.text();
    await this.attach(JSON.stringify({
      status: response.status(),
      statusText: response.statusText(),
      body: bodyText.length > 1000 ? bodyText.substring(0, 1000) + "..." : bodyText
    }, null, 2), "application/json");

  } catch (error) {
    console.error(`  -> API Request Failed: ${error}`);
    await this.attach(`API Request Error: ${error}\nURL: ${this.formData["apiUrl"]}`, "text/plain");
    throw error;
  }
});

Then("the response status code should be {int}", async function (this: CustomWorld, expectedStatus: number) {
  const response = this.formData["lastApiResponse"] as APIResponse;
  await ApiActions.expectStatus(response, expectedStatus);
});

Then("the response should contain post details", async function (this: CustomWorld) {
  const response = this.formData["lastApiResponse"] as APIResponse;
  const body = await ApiActions.getJson(response);
  expect(body).to.have.property("id");
  expect(body).to.have.property("title");
});

Then("the response should contain the created post ID", async function (this: CustomWorld) {
  const response = this.formData["lastApiResponse"] as APIResponse;
  const body = await ApiActions.getJson(response);
  expect(body).to.have.property("id");
  // JSONPlaceholder returns id: 101 for new posts
  expect(body.id).to.equal(101);
});

Then("the response should contain a list of users", async function (this: CustomWorld) {
  const response = this.formData["lastApiResponse"] as APIResponse;
  const body = await ApiActions.getJson(response);
  expect(body).to.be.an("array");
  expect(body.length).to.be.greaterThan(0);
  expect(body[0]).to.have.property("id");
  expect(body[0]).to.have.property("username");
});
