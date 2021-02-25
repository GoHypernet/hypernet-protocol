import { Given, When, Then } from "@cucumber/cucumber";
import expect from "expect";
import {
  AVERAGE_TIMEOUT,
  CORE_INITIALIZATION_TIMEOUT,
  PUBLIC_IDENTIFIER_DATA_BIND,
} from "@integration-tests/constants";
import PageUtils from "@integration-tests/utils/PageUtils";

class CoreInitialization {
  constructor() {
    Given("userA has registered mnemonic in hypernet protocol", function () {});

    When("userA visits developer ui web page", async function () {
      //@ts-ignore
      const pageUtils: PageUtils = this.pageUtils;
      await pageUtils.openPage("http://localhost:8080/");
    });

    Then(
      "userA ether account is now associated with HypernetCore instance and publicIdentifier is initiated",
      { timeout: AVERAGE_TIMEOUT },
      async function () {
        //@ts-ignore
        const pageUtils: PageUtils = this.pageUtils;
        await pageUtils.page.waitForSelector(PUBLIC_IDENTIFIER_DATA_BIND);
        await pageUtils.page.waitForTimeout(CORE_INITIALIZATION_TIMEOUT);
        const publicIdentifier = await pageUtils.getElementInnerText(PUBLIC_IDENTIFIER_DATA_BIND);

        expect(!!publicIdentifier).toBeTruthy();
      },
    );
  }
}

new CoreInitialization();
