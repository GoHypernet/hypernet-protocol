import puppeteer, { Page, Browser } from "puppeteer";

class PageUtils {
  public page: Page = {} as Page;
  public browser: Browser = {} as Browser;
  public isReady: boolean = false;

  public getPageUtilsReady(): Promise<any> {
    return new Promise((resolve, reject) => {
      puppeteer.launch({ headless: false }).then((browser) => {
        this.browser = browser;
        browser.newPage().then((page: Page) => {
          this.page = page;
          this.isReady = true;
          resolve(page);
        });
      });
    });
  }

  public async openPage(url: string) {
    await this.page.goto(url);
  }

  public async fillInput(fieldSelector: string, value: string) {
    const field = await this.page.$(fieldSelector);
    await field?.focus();
    await field?.type(value);
  }

  public async clearInput(fieldSelector: string) {
    const field = await this.page.$(fieldSelector);
    const valueLength = 10; //await this.page.$eval(fieldSelector, (el) => el.value.length);

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
}

export default PageUtils;
