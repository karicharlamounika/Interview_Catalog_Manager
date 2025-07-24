import { Browser, BrowserContext, chromium, Page } from 'playwright';
import { environment } from '../environment.js';

export default class Basepage {
    public page: Page;
    public static browser: Browser;
    public context: BrowserContext;
    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        Basepage.browser = await chromium.launch({
          headless: true,
        });
       
        this.context = await Basepage.browser.newContext({
            viewport: {width: 1920, height: 1080},
        });
        this.page = await this.context.newPage();
        await this.page.goto(environment.baseurl);
        await this.page.waitForLoadState("domcontentloaded");
        return this.page;
    }

    public async closeBrowser() {
        await this.context.clearCookies();
        Basepage.browser.close();
    }
}