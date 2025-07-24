import { Page } from 'playwright';
import CommonWaits from '../utils/commonWait.ts';
import CommonReusableFunctions from '../utils/commonReusableFunctions.ts';
import data from '../testData.json' with { type: "json" };

export default class Catalog {

    private page: Page;
    private waits: CommonWaits
    private reusableFunctions: CommonReusableFunctions;
    private addNewItemBtn = "[test-id='addNewItem']";
    private editItemBtn = "[test-id='editItem']";
    private deleteItemBtn = "[test-id='deleteItem']";
    private itemNameTxt = "[test-id='Name']";
    private itemQuantityTxt = "[test-id='quantity']";
    private addBtn = "[test-id='add']";
    private editSaveBtn = "[test-id='editSave']";
    private editNameTxt = "[test-id='editName']";
    private editQuantityTxt = "[test-id='editQuantity']";
    private itemList = "//tbody/tr";
    private itemNameList = "[test-id='itemName']";
    private logoutBtn = "[test-id='logoutBtn']";
    private expectedAddedItemList: any[];
    private actualLastItemList: any[]
    private expectedUpdatedItemList: any[];
    private actualItemNameList: any[];

    constructor(page: Page) {
        this.page = page;
        this.waits = new CommonWaits(page);
        this.reusableFunctions = new CommonReusableFunctions(page);
        this.expectedAddedItemList = [];
        this.actualLastItemList = [];
        this.expectedUpdatedItemList = [];
        this.actualItemNameList = [];
    }

    public async clickOnAddNewITem() {
        await this.reusableFunctions.clickOn(this.addNewItemBtn);
        await this.waits.waitforLoadState();
    }

    public async enterNameAndQuantity() {
        await this.reusableFunctions.fillText(this.itemNameTxt, data.NametoBeAdded);
        await this.reusableFunctions.fillText(this.itemQuantityTxt, data.QuantitytoBeAdded);
    }


    public async clickOnAdd() {
        await this.reusableFunctions.clickOn(this.addBtn);
        await this.waits.waitforPageToBeLoaded();
    }

    public async clickOnEditItem() {
        (await this.getEditActions()).locator(this.editItemBtn).click();
    }

    public async enterNewNameAndQuantity() {
        await this.reusableFunctions.fillText(this.editNameTxt, data.NameToBeUpdated);
        await this.reusableFunctions.fillText(this.editQuantityTxt, data.QuantityToBeUpdated);
    }

    public async clickOnSaveEdit() {
        (await this.getEditActions()).locator(this.editSaveBtn).click();
        await this.waits.waitforPageToBeLoaded();
    }

    public async deleteItem() {
        (await this.getEditActions()).locator(this.deleteItemBtn).click();
        await this.waits.waitforPageToBeLoaded();
    }

    public async getEditActions() {
        const lastItemRow = this.page.locator(this.itemList).last();
        const editActions = lastItemRow.locator("[test-id='editActions']");
        return editActions;
    }

    public async addItem() {
        await this.clickOnAddNewITem();
        await this.enterNameAndQuantity();
        await this.clickOnAdd();
    }

    public async getactualLastItemDetails() {
        this.actualLastItemList = [];
        const itemadded = this.page.locator(this.itemList).last();
        this.actualLastItemList.push(await itemadded.locator('td').nth(0).innerText());
        this.actualLastItemList.push(await itemadded.locator('td').nth(1).innerText());
        return this.actualLastItemList;
    }

    public async getExpectedAddedItemDetails() {
        this.expectedAddedItemList = [];
        this.expectedAddedItemList.push(data.NametoBeAdded);
        this.expectedAddedItemList.push(data.QuantitytoBeAdded);
        return this.expectedAddedItemList;

    }

    public async validateItemAdded() {
        const flag = await this.reusableFunctions.compareArrays(await this.getactualLastItemDetails(), await this.getExpectedAddedItemDetails());
        return flag;
    }

    public async updateItem() {
        await this.clickOnEditItem();
        await this.enterNewNameAndQuantity();
        await this.clickOnSaveEdit();
    }

    public async getExpectedUpdatedItemDetails() {
        this.expectedUpdatedItemList = [];
        this.expectedUpdatedItemList.push(data.NameToBeUpdated);
        this.expectedUpdatedItemList.push(data.QuantityToBeUpdated);
        return this.expectedUpdatedItemList;
    }

    public async validateItemUpdated() {
        const flag = await this.reusableFunctions.compareArrays(await this.getactualLastItemDetails(), await this.getExpectedUpdatedItemDetails());
        return flag;
    }

    public async getItemNameList() {
        this.actualItemNameList = [];
        const rows = await this.page.locator(this.itemNameList).elementHandles();
        if ((rows).length > 0) {
            for (let i = 0; i < rows.length; i++) {
                const elementText = rows[i].innerText();
                this.actualItemNameList.push(elementText);
            }
        }
        return this.actualItemNameList;
    }

    public async logout() {
        await this.reusableFunctions.clickOn(this.logoutBtn);
    }

}