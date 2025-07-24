import { test, expect, Page} from '@playwright/test';
import Basepage from '../pages/base.page';
import * as data from '../testData.json';
import LoginPage from '../pages/login.page';
import CatalogPage from '../pages/catalog.page'; 


test.describe("As a logged in User I can add, update and delete an item", ()=>{
  let page1: Page;
  let basePage: Basepage;
  let loginPage: LoginPage;
  let catalogPage: CatalogPage;

  test.beforeEach(async () => {
    basePage = new Basepage(page1);
    page1 = await basePage.navigate();
    });

   test("E2EFlow2_Verify user is able to add, updated and delete a item in catalog", async()=>{
    loginPage = new LoginPage(page1);
    await loginPage.login();
    catalogPage = new CatalogPage(page1);
    await catalogPage.addItem();
    expect(await catalogPage.validateItemAdded()).toBeTruthy();
    await catalogPage.updateItem();
    expect(await catalogPage.validateItemUpdated()).toBeTruthy();
    const itemsListBeforeDelete = await catalogPage.getItemNameList();
    await catalogPage.deleteItem();
    const itemsListAfterDelete = await catalogPage.getItemNameList();
    expect(itemsListBeforeDelete.length).toBeGreaterThan(itemsListAfterDelete.length);
    expect(itemsListAfterDelete).not.toContain(data.NameToBeUpdated);
   });

   
  test.afterEach(async () => {
    await catalogPage.logout();
    await basePage.closeBrowser();
  })

  });
  
  