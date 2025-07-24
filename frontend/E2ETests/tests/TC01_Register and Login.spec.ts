import { test, expect, Page} from '@playwright/test';
import Basepage from '../pages/base.page.ts';
import LoginPage from '../pages/login.page.ts';
import CatalogPage from '../pages/catalog.page.ts';
import RegisterUserPage from '../pages/registeruser.page.ts';

test.describe("As a new user I can register and login", () => {
  let page1: Page;
  let basePage: Basepage;
  let loginPage: LoginPage;
  let registerUserPage: RegisterUserPage;
  let catalogPage: CatalogPage;

  test.beforeEach(async () => {
    basePage = new Basepage(page1);
    page1 = await basePage.navigate();
  });

  test("E2EFlow1_Verify user is able to register and login", async () => {
    loginPage = new LoginPage(page1);
    loginPage.clickOnRegister();
    registerUserPage = new RegisterUserPage(page1);
    expect(await registerUserPage.registerUser()).toContain("Registration successful! Please login.");
    await loginPage.login();
    catalogPage = new CatalogPage(page1);
    expect(await catalogPage.validateLogoutBtnIsVisible()).toBeTruthy();
    await catalogPage.logout();
  });

  test.afterEach(async () => {
    await basePage.closeBrowser();
  });
});
