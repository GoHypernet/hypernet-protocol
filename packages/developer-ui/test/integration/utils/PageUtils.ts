import { CORE_INITIALIZATION_TIMEOUT, PUBLIC_IDENTIFIER_DATA_BIND } from "@integration-tests/constants";
import puppeteer, { Page, Browser } from "puppeteer";

class PageUtils {
  public page: Page = {} as Page;
  public browser: Browser = {} as Browser;
  public isReady: boolean = false;

  public async getPageUtilsReady(): Promise<void> {
    this.browser = await puppeteer.launch({ headless: false });
    this.page = await this.browser.newPage();
    this.isReady = true;
  }

  public async openPage(url: string) {
    await this.page.goto(url);
  }

  public async waitForCoreInitialization() {
    await this.page.waitForSelector(PUBLIC_IDENTIFIER_DATA_BIND);
    await this.page.waitForTimeout(CORE_INITIALIZATION_TIMEOUT);

    const publicIdentifier = await this.getElementInnerText(PUBLIC_IDENTIFIER_DATA_BIND);
    return new Promise((resolve, reject) =>
      publicIdentifier ? resolve(null) : reject("failed to initialize the core"),
    );
  }

  public async fillInput(fieldSelector: string, value: string) {
    const field = await this.page.$(fieldSelector);
    await field?.focus();
    await field?.type(value);
  }

  public async clearInput(fieldSelector: string) {
    const field = await this.page.$(fieldSelector);
    const valueLength = await field?.evaluate((el) => el?.value?.length);

    await field?.focus();
    await this.page.keyboard.press("End");

    for (let i = 0; i <= valueLength; i++) {
      await this.page.keyboard.press("Backspace");
      await this.page.waitForTimeout(25);
    }
  }

  public async isElementExist(selector: string) {
    const element = await this.page.$(selector);

    return !!element;
  }

  public async getElementInnerText(selector: string) {
    const element = await this.getElement(selector);
    const elementInnerText = await this.page.evaluate((el) => el.textContent, element);

    return elementInnerText;
  }

  public async getElementClassName(selector: string) {
    const element = await this.page.$(selector);
    const className = await this.page.evaluate((el) => el.className, element);

    return className;
  }

  public async getElementValue(selector: string, delay: number) {
    !!delay && (await this.page.waitForTimeout(delay));
    const element = await this.getElement(selector);
    const elementValue = await this.page.evaluate((el) => el.value, element);

    if (elementValue === "true" /* || element.value === "false" */) {
      return JSON.parse(elementValue);
    }

    return elementValue;
  }

  public async getElement(selector: string) {
    const isXPath = selector[1] === "/";
    const element = isXPath ? (await this.page.$x(selector))[0] : await this.page.$(selector);
    return element;
  }

  public async buttonClick(buttonSelector: string, delay?: number) {
    !!delay && (await this.page.waitForTimeout(delay));
    const buttonElement = await this.getElement(buttonSelector);
    await buttonElement?.click();
  }
}

export default PageUtils;
