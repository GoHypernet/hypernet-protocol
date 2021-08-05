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
class GatewayAuthorization {
  constructor(protected pageUtils: PageUtils) {}

  @given("GatewayUserA has hypernet account and has the developer UI opened", undefined, AVERAGE_TIMEOUT)
  public async givenUserAHasHypernetAccountAndDeveloperUIOpened() {
    this.pageUtils.openPage("http://localhost:5015");
    return this.pageUtils.waitForCoreInitialization();
  }

  @when("GatewayUserA authorize gateway url of {string}", undefined, AVERAGE_TIMEOUT)
  public async whenUserAAuthorizeGatewayUrl(gatewayUrl: string) {
    await this.pageUtils.clearInput(MERCHANT_URL_INPUT_DATA_BIND);
    await this.pageUtils.fillInput(MERCHANT_URL_INPUT_DATA_BIND, gatewayUrl);
    await this.pageUtils.buttonClick(AUTHORIZE_MERCHANT_BUTTON_ID);
    return this.pageUtils.page.waitForTimeout(REQUEST_TIMEOUT);
  }

  @then("GatewayUserA has gateway of {string} authorized", undefined, AVERAGE_TIMEOUT)
  public async thenUserABalancedecreases(gatewayUrl: string) {
    const gatewayUrlText = await this.pageUtils.getElementInnerText(`[data-gateway-url="${gatewayUrl}"]`);

    expect(gatewayUrlText).toBe(gatewayUrl);
  }
}

export = GatewayAuthorization;
