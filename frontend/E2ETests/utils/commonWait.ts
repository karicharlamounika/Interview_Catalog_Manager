import { Page } from "playwright";

export default class CommonWaits {
    private page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    public async waitforPageToBeLoaded() {
        await this.page.waitForResponse(response => {
            return response.request().resourceType() === "xhr" ||
                response.request().resourceType() === "fetch";
        })
    }
    public async waitforElementVisible(selector: string) {
        await this.page.waitForSelector(selector, { timeout: 120000 });
    }

    public async waitforLoadState() {
        await this.page.waitForLoadState('domcontentloaded', { timeout: 60000 });
    }

    public async waitforElement(selector: string) {
        for (let i = 0; i < 10; i++) {
            await new Promise(f => setTimeout(f, 10000));
            if (await this.page.isVisible(selector)) {
                break;
            }
        }
    }

    public async waitforSpecifiedTime(seconds: number) {
        await new Promise(f => setTimeout(f, seconds));
    }
}