import { Browser, BrowserContext, chromium, firefox, Page } from 'playwright';
import { environment } from '../environment';

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
        // const sleep = (ms: number | undefined) => new Promise(r => setTimeout(r, ms));
       
        this.context = await Basepage.browser.newContext({
            viewport: {width: 1920, height: 1080},
        });
        this.page = await this.context.newPage();
        await this.page.goto(environment.baseurl);
        //await sleep(30000);
        await this.page.waitForLoadState("domcontentloaded");
        return this.page;
    }

    public async closeBrowser() {
        await this.context.clearCookies();
        Basepage.browser.close();
    }

    public async navigateToSection(section: string) {
        const sectionElement = this.page.getByText(section);
        await sectionElement.click();
    }
}