import expect from "expect";
import {
  AVERAGE_TIMEOUT,
  TOKEN_SELECTOR_ID,
  DEPOSIT_BUTTON_ID,
  ETHER_ASSET_TOTAL_AMOUNT_ID,
  HYPER_TOKEN_ASSET_TOTAL_AMOUNT_ID,
  REQUEST_TIMEOUT,
} from "@integration-tests/constants";
import PageUtils from "@integration-tests/utils/PageUtils";
import { binding, given, then, when } from "cucumber-tsflow";
import { utils } from "ethers";

@binding([PageUtils])
class Deposit {
  private initialETHTotalAmount: string = "";
  private initialHNTTotalAmount: string = "";

  constructor(protected pageUtils: PageUtils) {}

  @given(/DepositUserA has a registered ethereum account using a mnemonic/)
  public givenUserAHasRegisteredMnemonic() {}

  @when(/DepositUserA visits developer ui/, undefined, AVERAGE_TIMEOUT)
  public whenUserAVisitsDeveloperUi() {
    this.pageUtils.openPage("http://localhost:5015/");
    return this.pageUtils.waitForCoreInitialization();
  }

  @when(/DepositUserA deposit '(\d*)' amount of ETH from his ETH account to HNP account/, undefined, AVERAGE_TIMEOUT)
  public async whenUserADepositEthereum(amount: string) {
    if (await this.pageUtils.isElementExist(ETHER_ASSET_TOTAL_AMOUNT_ID)) {
      this.initialETHTotalAmount = await this.pageUtils.getElementInnerText(ETHER_ASSET_TOTAL_AMOUNT_ID);
    }
    await this.pageUtils.page.select(TOKEN_SELECTOR_ID, "ETH");
    await this.pageUtils.buttonClick(DEPOSIT_BUTTON_ID);
    return this.pageUtils.page.waitForTimeout(REQUEST_TIMEOUT);
  }

  @when(/DepositUserA deposit '(\d*)' amount of HNT from his ETH account to HNP account/, undefined, AVERAGE_TIMEOUT)
  public async whenUserADepositHyperToken(amount: string) {
    if (await this.pageUtils.isElementExist(HYPER_TOKEN_ASSET_TOTAL_AMOUNT_ID)) {
      this.initialHNTTotalAmount = await this.pageUtils.getElementInnerText(HYPER_TOKEN_ASSET_TOTAL_AMOUNT_ID);
    }
    await this.pageUtils.page.select(TOKEN_SELECTOR_ID, "HyperToken");
    await this.pageUtils.buttonClick(DEPOSIT_BUTTON_ID);
    return this.pageUtils.page.waitForTimeout(REQUEST_TIMEOUT);
  }

  @then(
    /DepositUserA HNP balance increases by '(\d*)' ETH and '(\d*)' HNT amount calculated in wei/,
    undefined,
    AVERAGE_TIMEOUT,
  )
  public async thenUserAEtherBalanceIncreases(addedETHAmount: string, addedHPTAmount: string) {
    const totalETHAmount = await this.pageUtils.getElementInnerText(ETHER_ASSET_TOTAL_AMOUNT_ID);
    const addedETHAmountInWei = utils.parseEther(addedETHAmount).toString();
    const totalETHAmountInWei = Number(this.initialETHTotalAmount) + Number(addedETHAmountInWei);

    expect(Number(totalETHAmount)).toBe(totalETHAmountInWei);

    const totalHPTAmount = await this.pageUtils.getElementInnerText(HYPER_TOKEN_ASSET_TOTAL_AMOUNT_ID);
    const addedHPTAmountInWei = utils.parseEther(addedHPTAmount).toString();
    const totalHPTAmountInWei = Number(this.initialHNTTotalAmount) + Number(addedHPTAmountInWei);

    expect(Number(totalHPTAmount)).toBe(totalHPTAmountInWei);
  }
}

export = Deposit;
