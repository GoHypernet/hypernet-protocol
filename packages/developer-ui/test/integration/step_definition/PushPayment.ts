import expect from "expect";
import {
  AVERAGE_TIMEOUT,
  TOKEN_SELECTOR_ID,
  DEPOSIT_BUTTON_ID,
  MERCHANT_URL_INPUT_DATA_BIND,
  AUTHORIZE_MERCHANT_BUTTON_ID,
  PAYMENT_TYPE_SELECTOR_ID,
  REQUEST_TIMEOUT,
  RENDER_TIMEOUT,
  COUNTER_PARTY_ADDRESS_INPUT_DATA_BIND,
  REQUIED_STAKE_INPUT_DATA_BIND,
  PAYMENT_TOKEN_SELECTOR_ID,
  PAYMENT_AMOUNT_INPUT_DATA_BIND,
  AUTHORIZED_MERCHANT_SELECTOR_ID,
  SUBMIT_PAYMENT_BUTTON,
} from "@integration-tests/constants";
import PageUtils from "@integration-tests/utils/PageUtils";
import { binding, given, then, when } from "cucumber-tsflow";

@binding([PageUtils])
class PushPayment {
  private latestPaymentId: string = "";

  constructor(protected pageUtils: PageUtils) {}

  @given("counterPartyUser of public identifier {string} has hypernet account has the developer UI opened")
  public givenCounterPartyHasHypernetAccount(counterPartyPublicIdentifier: string) {}

  @given("PushPaymentUserA has hypernet account has the developer UI opened", undefined, AVERAGE_TIMEOUT)
  public async givenUserAHasHypernetAccountAndDeveloperUIOpened() {
    this.pageUtils.openPage("http://localhost:5015");
    return this.pageUtils.waitForCoreInitialization();
  }

  @given("PushPaymentUserA has funded his wallet with {string} ETH", undefined, AVERAGE_TIMEOUT)
  public async givenUserAHasFundedHisWallet(amount: string) {
    await this.pageUtils.page.select(TOKEN_SELECTOR_ID, "ETH");
    await this.pageUtils.buttonClick(DEPOSIT_BUTTON_ID);
    return this.pageUtils.page.waitForTimeout(REQUEST_TIMEOUT);
  }

  @given("PushPaymentUserA authorize gateway url of {string}", undefined, AVERAGE_TIMEOUT)
  public async givenUserAAuthorizeGatewayUrl(gatewayUrl: string) {
    await this.pageUtils.clearInput(MERCHANT_URL_INPUT_DATA_BIND);
    await this.pageUtils.fillInput(MERCHANT_URL_INPUT_DATA_BIND, gatewayUrl);
    await this.pageUtils.buttonClick(AUTHORIZE_MERCHANT_BUTTON_ID);
    return this.pageUtils.page.waitForTimeout(REQUEST_TIMEOUT);
  }

  @when(
    "PushPaymentUserA initiate push payment with public identifier of {string}, Required Stake of {string}, token selector of {string}, amount of {string}, gateway url of {string} and click submit payment",
    undefined,
    AVERAGE_TIMEOUT,
  )
  public async whenUserAInitiatePushPaymentAndClickSubmit(
    counterPartyAddress: string,
    stakedAmount: string,
    tokenSelector: string,
    amount: string,
    gatewayUrl: string,
  ) {
    // Enter counter party public identifier
    await this.pageUtils.clearInput(COUNTER_PARTY_ADDRESS_INPUT_DATA_BIND);
    await this.pageUtils.fillInput(COUNTER_PARTY_ADDRESS_INPUT_DATA_BIND, counterPartyAddress);

    // Select Push payment
    await this.pageUtils.page.select(PAYMENT_TYPE_SELECTOR_ID, "Push");

    // Wait a bit
    await this.pageUtils.page.waitForTimeout(RENDER_TIMEOUT);

    // Enter staked amount
    await this.pageUtils.clearInput(REQUIED_STAKE_INPUT_DATA_BIND);
    await this.pageUtils.fillInput(REQUIED_STAKE_INPUT_DATA_BIND, stakedAmount);

    // Select token
    await this.pageUtils.page.select(PAYMENT_TOKEN_SELECTOR_ID, "0x0000000000000000000000000000000000000000");

    // Enter amount
    await this.pageUtils.clearInput(PAYMENT_AMOUNT_INPUT_DATA_BIND);
    await this.pageUtils.fillInput(PAYMENT_AMOUNT_INPUT_DATA_BIND, amount);

    // Select gateway
    await this.pageUtils.page.select(AUTHORIZED_MERCHANT_SELECTOR_ID, gatewayUrl);

    // Get the latest payment id before submitting new payment
    const paymentElements = await this.pageUtils.page.$$(".createdPaymentId");
    const paymentElement = paymentElements[paymentElements.length - 1];
    this.latestPaymentId = await this.pageUtils.page.evaluate((el) => el.textContent, paymentElement);

    // Click submit
    await this.pageUtils.buttonClick(SUBMIT_PAYMENT_BUTTON);

    return this.pageUtils.page.waitForTimeout(REQUEST_TIMEOUT);
  }

  @then(
    "PushPaymentUserA has a push payment payment with status {string}, amount of {string} and required stake amount of {string} sent to counter party with address of {string}",
    undefined,
    AVERAGE_TIMEOUT,
  )
  public async thenUserABalancedecreases(
    paymentStatus: string,
    paymentAmount: string,
    requierdStakeAmount: string,
    counterPartyAddress: string,
  ) {
    // Get newly crated payment id
    const paymentElements = await this.pageUtils.page.$$(".createdPaymentId");
    const paymentElement = paymentElements[paymentElements.length - 1];
    const newlyCresateedPaymentId = await this.pageUtils.page.evaluate((el) => el.textContent, paymentElement);

    // Get new payment info
    const newPaymentCounterPartyAddress = await this.pageUtils.getElementInnerText(
      `[data-payment-to="${newlyCresateedPaymentId}"]`,
    );
    const newPaymentStatus = await this.pageUtils.getElementInnerText(
      `[data-payment-state="${newlyCresateedPaymentId}"]`,
    );
    const newPaymentAmount = Number(
      await this.pageUtils.getElementInnerText(`[data-payment-amount="${newlyCresateedPaymentId}"]`),
    );
    const newPaymentRequierdStakeAmount = Number(
      await this.pageUtils.getElementInnerText(`[data-payment-required-staked="${newlyCresateedPaymentId}"]`),
    );

    // Assert that new payment exists and it's different from previously payment
    expect(!!newlyCresateedPaymentId).toBe(true);
    expect(newlyCresateedPaymentId === this.latestPaymentId).toBe(false);

    // Assert newly created payment info
    expect(newPaymentCounterPartyAddress).toBe(counterPartyAddress);
    expect(newPaymentStatus).toBe(paymentStatus);
    expect(newPaymentAmount).toBe(Number(paymentAmount));
    expect(newPaymentRequierdStakeAmount).toBe(Number(requierdStakeAmount));
  }
}

export = PushPayment;
