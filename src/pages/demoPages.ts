import { Page, expect } from "@playwright/test";
import type { RuntimeConfig } from "../config/runtimeConfig.ts";
import { WebActions } from "../utils/automation/webActions.ts";

export class PlaygroundPage extends WebActions {
    constructor(page: Page, runtime: RuntimeConfig) {
        super(page, runtime);
    }

    // Locators
    nameInput = '#text-input';
    passwordInput = '#password-input';
    emailInput = '#email-input';
    phoneInput = '#mobile-input';
    textInput = '#textarea-input';
    submitBtn = '#submit-btn';
    message = '#s1-msg';

    // Actions
    async navigate() {
        await this.page.goto(this.runtime.urls.rbgwebsiteUrl);
    }

    async enterAllBasicDetails() {
        await this.enterName("John Doe");
        await this.enterEmail("john@example.com");
        await this.enterPassword("password123");
        await this.enterPhone("1234567890");
        await this.enterText("Some long text here...");
    }

    async enterName(name: string) {
        await this.fillText(this.nameInput, name);
    }

    async enterPassword(pwd: string) {
        await this.fillText(this.passwordInput, pwd);
    }

    async clickSubmit() {
        await this.click(this.submitBtn);
    }

    async validateMessage(expected: string) {
        await expect(this.page.locator(this.message)).toHaveText(expected);
    }

    async enterEmail(email: string) {
        await this.fillText(this.emailInput, email);
    }

    async enterPhone(phone: string) {
        await this.fillText(this.phoneInput, phone);
    }

    async enterText(text: string) {
        await this.fillText(this.textInput, text);
    }

}
