import expect from "expect";
import {
  AVERAGE_TIMEOUT,
  MERCHANT_URL_INPUT_DATA_BIND,
  AUTHORIZE_MERCHANT_BUTTON_ID,
  REQUEST_TIMEOUT,
} from "@integration-tests/constants";
import PageUtils from "@integration-tests/utils/PageUtils";
import { binding, given, then, when } from "cucumber-tsflow";

@binding([PageUtils])
class MerchantAuthorization {
  constructor(protected pageUtils: PageUtils) {}

  @given("MerchantUserA has hypernet account and has the developer UI opened", undefined, AVERAGE_TIMEOUT)
  public async givenUserAHasHypernetAccountAndDeveloperUIOpened() {
    this.pageUtils.openPage("http://localhost:5015");
    return this.pageUtils.waitForCoreInitialization();
  }

  @when("MerchantUserA authorize merchant url of {string}", undefined, AVERAGE_TIMEOUT)
  public async whenUserAAuthorizeMerchantUrl(merchantUrl: string) {
    await this.pageUtils.clearInput(MERCHANT_URL_INPUT_DATA_BIND);
    await this.pageUtils.fillInput(MERCHANT_URL_INPUT_DATA_BIND, merchantUrl);
    await this.pageUtils.buttonClick(AUTHORIZE_MERCHANT_BUTTON_ID);
    return this.pageUtils.page.waitForTimeout(REQUEST_TIMEOUT);
  }

  @then("MerchantUserA has merchant of {string} authorized", undefined, AVERAGE_TIMEOUT)
  public async thenUserABalancedecreases(merchantUrl: string) {
    const merchantUrlText = await this.pageUtils.getElementInnerText(`[data-merchant-url="${merchantUrl}"]`);

    expect(merchantUrlText).toBe(merchantUrl);
  }
}

export = MerchantAuthorization;
