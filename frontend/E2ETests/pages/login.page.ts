import { Page } from 'playwright';
import CommonWaits from '../utils/commonWait.ts';
import CommonReusableFunctions from '../utils/commonReusableFunctions.ts';
import data from '../testData.json' with { type: "json" };

export default class Login{

    private page : Page;
    private waits : CommonWaits
    private reusableFunctions: CommonReusableFunctions;
    private emailTxt = "[test-id='useremail']";
    private passwordTxt = "[test-id='password']";
    private loginbtn = "[test-id='login']";
    private registerLink = "[test-id='registerHere']";

    constructor(page : Page){
        this.page = page;
        this.waits = new CommonWaits(page);
        this.reusableFunctions = new CommonReusableFunctions(page);
    }

    public async enterEmail(){
        await this.reusableFunctions.fillText(this.emailTxt,data.email);
    }

    public async enterPassword(){
        await this.reusableFunctions.fillText(this.passwordTxt,data.password);
    }

    public async clickLogin(){
        await this.reusableFunctions.clickOn(this.loginbtn);
        await this.waits.waitforLoadState();
    }

    public async login(){
        await this.enterEmail();
        await this.enterPassword();
        await this.clickLogin();
        await this.waits.waitforPageToBeLoaded();
    }

    public async clickOnRegister(){
        await this.reusableFunctions.clickOn(this.registerLink);
        await this.waits.waitforLoadState;
    }
}