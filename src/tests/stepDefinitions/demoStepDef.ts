import { Given, When, Then } from '@cucumber/cucumber';
import { demoPages } from '../../pages/demoPages.ts';
import { CustomWorld } from '../support/customWorld.ts';


Given('user navigates to "RBG" application', async function (this: CustomWorld) {
    this.pages.demo = new demoPages(this.page, this.runtime);
    await this.pages.demo.navigate();
});
