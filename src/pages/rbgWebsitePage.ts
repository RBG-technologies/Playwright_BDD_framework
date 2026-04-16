import { Page, expect } from '@playwright/test';
import type { RuntimeConfig } from "../config/runtimeConfig.ts";
import { PlaywrightActions } from "../utils/playwrightActions.ts";


export class PlaygroundPage extends PlaywrightActions {
  constructor(page: Page, runtime: RuntimeConfig) {
    super(page, runtime);
  }

  // Locators
  nameInput = this.page.locator('#text-input');
  passwordInput = this.page.locator('#password-input');
  emailInput = this.page.locator('#email-input');
  phoneInput = this.page.locator('#mobile-input');
  textInput = this.page.locator('#textarea-input');
  submitBtn = this.page.locator('#submit-btn');
  message = this.page.locator('#s1-msg');

  // Section 2: Buttons
  normalBtn = this.page.locator('#click-btn');
  doubleClickBtn = this.page.locator('#dblclick-btn');
  rightClickBtn = this.page.locator('#rightclick-btn');
  buttonMessages = this.page.locator('#s2-msg');

  // Section 3: Checkbox & Radio
  selectAllCheckbox = this.page.locator('#check-all');
  checkboxes = this.page.locator('.multi-cb');
  radioOptionA = this.page.locator('#radio-op1');

  // Section 4: Dropdowns
  dropdown = this.page.locator('#std-dropdown');
  multiDropdown = this.page.locator('#multi-dropdown');
  customDropdown = this.page.locator('#custom-dropdown-btn');

  // Section 6: Dynamic Content
  appearBtn = this.page.locator('text=Appear after 2s');
  dynAppear = this.page.locator('#dyn-appear');
  changeTextBtn = this.page.locator('#change-text');
  counterBtn = this.page.locator('#counter-btn');
  counterVal = this.page.locator('#counter-val');

  // Section 7: Waits
  spinnerTrigger = this.page.locator('#spinner-trigger');
  spinner = this.page.locator('#spinner');
  dataLoaded = this.page.locator('#data-loaded');

  // Section 8: Table
  search = this.page.locator('#table-search');
  tableRows = this.page.locator('#data-table tbody tr');

  // SECTION 9
  alertBtn = this.page.locator('#alert-btn');

  // Section 10: Modal
  openModalBtn = this.page.locator('#open-modal');
  closeModalBtn = this.page.locator('#close-modal');
  modal = this.page.locator('#modal-container');

  // Section 11: Iframe
  iframe = this.page.frameLocator('#form-iframe');
  iframeSubmit = this.iframe.locator('#iframe-submit');

  // Section 12: Shadow DOM
  shadowHost = this.page.locator('#shadow-host');
  shadowInput = this.shadowHost.locator('#shadow-input');
  shadowBtn = this.shadowHost.locator('#shadow-btn');

  // Section 13: Drag and Drop
  dragEl = this.page.locator('#draggable');
  dropZone = this.page.locator('#droppable');

  // Section 14: Hover
  menu = this.page.locator('#main-menu');
  submenu = this.page.locator('#sub-menu');

  // Section 15: Tooltip
  tooltipEl = this.page.locator('#tooltip-el');
  tooltipText = this.page.locator('.tooltip-inner');

  // Section 16: File Upload
  fileUploadInput = this.page.locator('#file-upload');
  uploadedFileName = this.page.locator('#uploaded-file');

  // Section 17: Download
  downloadBtn = this.page.locator('#download-btn');

  // Section 18: Hidden Elements
  revealBtn = this.page.locator('#reveal-btn');
  hiddenBtn = this.page.locator('#hidden-btn');

  // Section 20: New Tab
  newTabBtn = this.page.locator('#new-tab');

  // Section 21: Auth
  usernameInput = this.page.locator('#username');
  loginBtn = this.page.locator('#login-btn');
  dashboard = this.page.locator('#dashboard');

  // Section 22: Stale Element
  staleBtn = this.page.locator('#stale-btn');
  newElement = this.page.locator('#new-element');

  // Section 23: Dynamic List
  addItemBtn = this.page.locator('#add-item');
  removeItemBtn = this.page.locator('.remove-item').first();
  listItems = this.page.locator('.list-item');

  // Section 24: API Delay
  apiBtn = this.page.locator('#api-btn');
  apiMsg = this.page.locator('#api-msg');

  // Section 26: Keyboard
  keyboardInput = this.page.locator('#keyboard-input');
  keyMsg = this.page.locator('#key-msg');

  // Section 27: Slider
  slider = this.page.locator('#range-slider');
  sliderVal = this.page.locator('#slider-val');

  // Section 28: Date Picker
  datePicker = this.page.locator('#date-picker');

  // Section 29: Resizable
  resizableEl = this.page.locator('#resizable');

  // Section 30: Nested
  nestedBtn = this.page.locator('#nested-btn');

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
    await expect(this.message).toHaveText(expected);
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

  async performNormalClick() {
    await this.click(this.normalBtn);
  }

  async performDoubleClick() {
    await this.dblclick(this.doubleClickBtn);
  }

  async performRightClick() {
    await this.rightclick(this.rightClickBtn);
  }

  async validateBtnMessages() {
    await expect(this.buttonMessages).toHaveCount(3);
  }

  async selectAll() {
    await this.check(this.selectAllCheckbox);
  }

  async selectRadioA() {
    await this.check(this.radioOptionA);
  }

  async validateCheckboxes() {
    const counts = await this.count(this.checkboxes);
    for (let i = 0; i < counts; i++) {
      await expect(this.checkboxes.nth(i)).toBeChecked();
    }
  }

  async selectFromDropdown(opt: string) {
    await this.select(this.dropdown, opt);
  }

  async selectMultiValues() {
    await this.select(this.multiDropdown, ['Option 1', 'Option 2']);
  }

  async selectCustomDropdown() {
    await this.click(this.customDropdown);
    await this.click(this.page.locator('.custom-opt').first());
  }

  async triggerSpinner() {
    await this.click(this.spinnerTrigger);
  }

  async waitForCompletion() {
    await this.waitForHidden(this.spinner);
  }

  async searchTable(text: string) {
    await this.fillText(this.search, text);
  }

  async sortTable() {
    await this.click(this.tableRows);
  }

  async handleAlert() {
    this.page.once('dialog', dialog => dialog.accept());
    await this.click('#simple-alert');
  }

  async handleConfirm() {
    this.page.once('dialog', dialog => dialog.accept());
    await this.click('#confirm-alert');
  }

  async handlePrompt() {
    this.page.once('dialog', dialog => dialog.accept('Test input'));
    await this.click('#prompt-alert');
  }

  async openModal() {
    await this.click(this.openModalBtn);
  }

  async closeModal() {
    await this.click(this.closeModalBtn);
  }

  async switchToIframeAndSubmit() {
    await this.click(this.iframeSubmit);
  }

  async interactWithShadowDOM() {
    await this.fillText(this.shadowInput, 'Shadow input');
    await this.click(this.shadowBtn);
  }

  async clickAppearAfter() {
    await this.click(this.appearBtn);
  }

  async clickChangeText() {
    await this.click(this.changeTextBtn);
  }

  async clickCounter() {
    await this.click(this.counterBtn);
  }

  async clickStale() {
    await this.click(this.staleBtn);
  }

  async pressEnter() {
    await this.press(this.keyboardInput, 'Enter');
  }

  async dragAndDropAction() {
    await this.dragAndDrop(this.dragEl, this.dropZone);
  }

  async hoverMenuAndClickSub() {
    await this.hover(this.menu);
    await this.click(this.submenu);
  }

  async uploadFileAction() {
    await this.uploadFile(this.fileUploadInput, 'package.json');
  }

  async downloadFile() {
    const downloadPromise = this.page.waitForEvent('download');
    await this.click(this.downloadBtn);
    const download = await downloadPromise;
    await download.path();
  }

  async revealHidden() {
    await this.click(this.revealBtn);
  }

  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async openNewTab() {
    const pagePromise = this.page.context().waitForEvent('page');
    await this.click(this.newTabBtn);
    const newPage = await pagePromise;
    await newPage.waitForLoadState();
  }

  async login(u: string, p: string) {
    await this.fillText(this.usernameInput, u);
    await this.fillText(this.passwordInput, p);
    await this.click(this.loginBtn);
  }

  async addListItem() {
    await this.click(this.addItemBtn);
  }

  async removeListItem() {
    await this.click(this.removeItemBtn);
  }

  async triggerApi() {
    await this.click(this.apiBtn);
  }

  async moveSlider() {
    await this.fillText(this.slider, '50');
  }

  async selectDate() {
    await this.fillText(this.datePicker, '2024-05-15');
  }

  async resizeElement() {
    const boundingBox = await this.resizableEl.boundingBox();
    if (boundingBox) {
      await this.page.mouse.move(boundingBox.x + boundingBox.width, boundingBox.y + boundingBox.height);
      await this.page.mouse.down();
      await this.page.mouse.move(boundingBox.x + boundingBox.width + 50, boundingBox.y + boundingBox.height + 50);
      await this.page.mouse.up();
    }
  }

  async clickNested() {
    await this.click(this.nestedBtn);
  }
} 
