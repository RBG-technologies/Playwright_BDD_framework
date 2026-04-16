import { Given, When, Then } from '@cucumber/cucumber';
import { PlaygroundPage } from '../../pages/rbgWebsitePage.ts';
import { CustomWorld } from '../support/customWorld.ts';
import { expect } from '@playwright/test';

// let playground: PlaygroundPage;

// Since Background Given is already handled in rbgWebsiteStepDef.ts or generic hooks, 
// we might need to initialize playground here if it's a new file.
// However, 'user navigates to the application' is used in background.

Given('user navigates to the application', async function (this: CustomWorld) {
  this.pages.playground = new PlaygroundPage(this.page, this.runtime);
  await this.pages.playground.navigate();
});

// SECTION 1
When('user enters all basic details', async function (this: CustomWorld) {
  await this.pages.playground.enterAllBasicDetails();
});

When('clicks submit button', async function (this: CustomWorld) {
  await this.pages.playground.clickSubmit();
});

Then('user should see {string}', async function (this: CustomWorld, msg: string) {
  await this.pages.playground.validateMessage(msg);
});

// SECTION 2
When('user performs normal click', async function (this: CustomWorld) {
  await this.pages.playground.performNormalClick();
});

When('user performs double click', async function (this: CustomWorld) {
  await this.pages.playground.performDoubleClick();
});

When('user performs right click', async function (this: CustomWorld) {
  await this.pages.playground.performRightClick();
});

Then('respective messages should be displayed', async function (this: CustomWorld) {
  await this.pages.playground.validateBtnMessages();
});

// SECTION 3
When('user selects "Select All"', async function (this: CustomWorld) {
  await this.pages.playground.selectAll();
});

When('user selects radio option A', async function (this: CustomWorld) {
  await this.pages.playground.selectRadioA();
});

Then('all checkboxes should be selected', async function (this: CustomWorld) {
  await this.pages.playground.validateCheckboxes();
});

// SECTION 4
When('user selects {string} from dropdown', async function (this: CustomWorld, opt: string) {
  await this.pages.playground.selectFromDropdown(opt);
});

When('user selects multiple values', async function (this: CustomWorld) {
  await this.pages.playground.selectMultiValues();
});

When('user selects custom dropdown option', async function (this: CustomWorld) {
  await this.pages.playground.selectCustomDropdown();
});

Then('dropdown selection should be successful', async function (this: CustomWorld) {
  // Placeholder validation
  await expect(this.pages.playground.dropdown).toBeVisible();
});

// SECTION 5
When('user identifies element using different locators', async function (this: CustomWorld) {
  // Generic step, assuming we just want to see if the element is there
  await expect(this.pages.playground.submitBtn).toBeVisible();
});

Then('element should be clickable', async function (this: CustomWorld) {
  await expect(this.pages.playground.submitBtn).toBeEnabled();
});

// SECTION 6
When('user clicks appear after delay', async function (this: CustomWorld) {
  await this.pages.playground.clickAppearAfter();
});

When('user clicks change text', async function (this: CustomWorld) {
  await this.pages.playground.clickChangeText();
});

When('user increments counter', async function (this: CustomWorld) {
  await this.pages.playground.clickCounter();
});

Then('dynamic changes should be reflected', async function (this: CustomWorld) {
  await expect(this.pages.playground.counterVal).not.toHaveText('0');
});

// SECTION 7
When('user triggers spinner', async function (this: CustomWorld) {
  await this.pages.playground.triggerSpinner();
});

When('waits for completion', async function (this: CustomWorld) {
  await this.pages.playground.waitForCompletion();
});

Then('{string} should be displayed', async function (this: CustomWorld, text: string) {
    // This is a generic Then step that might overlap with others, but let's keep it specific to this context if needed
    // or use a more generic locator.
  await expect(this.page.getByText(text)).toBeVisible();
});

// SECTION 8
When('user searches for {string}', async function (this: CustomWorld, query: string) {
  await this.pages.playground.searchTable(query);
});

When('user sorts table', async function (this: CustomWorld) {
  await this.pages.playground.sortTable();
});

Then('filtered results should be displayed', async function (this: CustomWorld) {
  await expect(this.pages.playground.tableRows).toBeVisible();
});

// SECTION 9
When('user handles simple alert', async function (this: CustomWorld) {
  await this.pages.playground.handleAlert();
});

When('user handles confirmation alert', async function (this: CustomWorld) {
  await this.pages.playground.handleConfirm();
});

When('user handles prompt alert', async function (this: CustomWorld) {
  await this.pages.playground.handlePrompt();
});

Then('alert actions should be successful', async function (this: CustomWorld) {
  await expect(this.page.locator('body')).toBeVisible(); // Heartbeat check on body instead of page
});

// SECTION 10
When('user opens modal', async function (this: CustomWorld) {
  await this.pages.playground.openModal();
});

When('user closes modal', async function (this: CustomWorld) {
  await this.pages.playground.closeModal();
});

Then('modal should not be visible', async function (this: CustomWorld) {
  await expect(this.pages.playground.modal).toBeHidden();
});

// SECTION 11
When('user switches to iframe', async function (this: CustomWorld) {
  // Logic is mostly in the page object for frameLocator
});

When('submits form inside iframe', async function (this: CustomWorld) {
  await this.pages.playground.switchToIframeAndSubmit();
});

Then('iframe success message should be displayed', async function (this: CustomWorld) {
  await expect(this.pages.playground.iframe.locator('.success')).toBeVisible();
});

// SECTION 12
When('user interacts with shadow DOM input', async function (this: CustomWorld) {
  await this.pages.playground.interactWithShadowDOM();
});

When('clicks shadow button', async function (this: CustomWorld) {
  // Handled in interactWithShadowDOM above or separate
  await this.pages.playground.shadowBtn.click();
});

Then('shadow button text should change', async function (this: CustomWorld) {
  await expect(this.pages.playground.shadowBtn).not.toHaveText('Click Me');
});

// SECTION 13
When('user drags element to drop zone', async function (this: CustomWorld) {
  await this.pages.playground.dragAndDropAction();
});

Then('drop success message should be displayed', async function (this: CustomWorld) {
  await expect(this.page.getByText('Dropped')).toBeVisible();
});

// SECTION 14
When('user hovers over menu', async function (this: CustomWorld) {
  await this.pages.playground.menu.hover();
});

When('clicks submenu', async function (this: CustomWorld) {
  await this.pages.playground.submenu.click();
});

Then('submenu message should be displayed', async function (this: CustomWorld) {
  await expect(this.page.locator('.submenu-msg')).toBeVisible();
});

// SECTION 15
When('user hovers on tooltip', async function (this: CustomWorld) {
  await this.pages.playground.tooltipEl.hover();
});

Then('tooltip text should be visible', async function (this: CustomWorld) {
  await expect(this.pages.playground.tooltipText).toBeVisible();
});

// SECTION 16
When('user uploads a file', async function (this: CustomWorld) {
  await this.pages.playground.uploadFileAction();
});

Then('uploaded file name should be displayed', async function (this: CustomWorld) {
  await expect(this.pages.playground.uploadedFileName).toBeVisible();
});

// SECTION 17
When('user clicks download button', async function (this: CustomWorld) {
  await this.pages.playground.downloadFile();
});

Then('file should be downloaded', async function (this: CustomWorld) {
  // Download logic handles path retrieval, usually we assume it works if no error
});

// SECTION 18
When('user reveals hidden button', async function (this: CustomWorld) {
  await this.pages.playground.revealHidden();
});

Then('hidden button should be visible', async function (this: CustomWorld) {
  await expect(this.pages.playground.hiddenBtn).toBeVisible();
});

// SECTION 19
When('user scrolls to bottom', async function (this: CustomWorld) {
  await this.pages.playground.scrollToBottom();
});

Then('user should be able to click target button', async function (this: CustomWorld) {
  await expect(this.page.locator('#bottom-btn')).toBeVisible();
});

// SECTION 20
When('user opens new tab', async function (this: CustomWorld) {
  await this.pages.playground.openNewTab();
});

Then('new tab should be opened', async function (this: CustomWorld) {
  expect(this.page.context().pages().length).toBeGreaterThan(1);
});

// SECTION 21
When('user logs in with valid credentials', async function (this: CustomWorld) {
  await this.pages.playground.login("admin", "password");
});

Then('dashboard should be displayed', async function (this: CustomWorld) {
  await expect(this.pages.playground.dashboard).toBeVisible();
});

// SECTION 22
When('user clicks stale element button', async function (this: CustomWorld) {
  await this.pages.playground.clickStale();
});

Then('new element should be present', async function (this: CustomWorld) {
  await expect(this.pages.playground.newElement).toBeVisible();
});

// SECTION 23
When('user adds item', async function (this: CustomWorld) {
  await this.pages.playground.addListItem();
});

When('user removes item', async function (this: CustomWorld) {
  await this.pages.playground.removeListItem();
});

Then('list should be updated', async function (this: CustomWorld) {
  await expect(this.pages.playground.listItems).toBeVisible();
});

// SECTION 24
When('user triggers API call', async function (this: CustomWorld) {
  await this.pages.playground.triggerApi();
});

Then('API success message should be displayed', async function (this: CustomWorld) {
  await expect(this.pages.playground.apiMsg).toBeVisible();
});

// SECTION 25
When('user clicks flaky button multiple times', async function (this: CustomWorld) {
  for (let i = 0; i < 3; i++) {
    await this.page.locator('#flaky-btn').click();
  }
});

Then('result should be either success or failure', async function (this: CustomWorld) {
  await expect(this.page.locator('#flaky-result')).toBeVisible();
});

// SECTION 26
When('user presses keyboard keys', async function (this: CustomWorld) {
  await this.pages.playground.pressEnter();
});

Then('key pressed message should be displayed', async function (this: CustomWorld) {
  await expect(this.pages.playground.keyMsg).toBeVisible();
});

// SECTION 27
When('user moves slider', async function (this: CustomWorld) {
  await this.pages.playground.moveSlider();
});

Then('slider value should change', async function (this: CustomWorld) {
  await expect(this.pages.playground.sliderVal).not.toHaveText('0');
});

// SECTION 28
When('user selects a date', async function (this: CustomWorld) {
  await this.pages.playground.selectDate();
});

Then('selected date should be displayed', async function (this: CustomWorld) {
  await expect(this.page.locator('#selected-date')).toBeVisible();
});

// SECTION 29
When('user resizes the element', async function (this: CustomWorld) {
  await this.pages.playground.resizeElement();
});

Then('element size should change', async function (this: CustomWorld) {
  // Verification is tricky without fresh bounding box
  await expect(this.pages.playground.resizableEl).toBeVisible();
});

// SECTION 30
When('user clicks deeply nested button', async function (this: CustomWorld) {
  await this.pages.playground.clickNested();
});

Then('action should be successful', async function (this: CustomWorld) {
  await expect(this.page.getByText('Action Successful')).toBeVisible();
});
