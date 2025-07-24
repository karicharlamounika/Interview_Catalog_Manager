import { Page } from 'playwright';
import CommonWaits from '../utils/commonWait.ts';
import CommonReusableFunctions from '../utils/commonReusableFunctions.ts';
import data from '../testData.json' with { type: "json" };

export default class RegisterUserPage {

    private page: Page;
    private waits: CommonWaits;
    private reusableFunctions: CommonReusableFunctions;
    private firstNameTxt = "[test-id='firstName']";
    private lastNameTxt = "[test-id='lastName']";
    private emailTxt = "[test-id='email']";
    private passwordTxt = "[test-id='password']";
    private registerBtn = "[test-id='register']";

    constructor(page: Page) {
        this.page = page;
        this.waits = new CommonWaits(page);
        this.reusableFunctions = new CommonReusableFunctions(page);
    }

    public async fillRegistrationForm() {
        await this.reusableFunctions.fillText(this.firstNameTxt, data.firstName);
        await this.reusableFunctions.fillText(this.lastNameTxt, data.lastName);
        await this.reusableFunctions.fillText(this.emailTxt, data.email);
        await this.reusableFunctions.fillText(this.passwordTxt, data.password);
    }

    public async clickRegister() {
        await this.reusableFunctions.clickOn(this.registerBtn);
    }

    public async registerUser() {
        await this.fillRegistrationForm();
        await this.clickRegister();
        const alertMessage = await this.handleUserRegisterationAlert();
        return alertMessage;
    }

    public async handleUserRegisterationAlert() {
        const dialog = await this.page.waitForEvent('dialog');
        if (dialog.type() === 'alert') {
            const message = dialog.message();
            await dialog.accept();
            return message;
        }

    }
}