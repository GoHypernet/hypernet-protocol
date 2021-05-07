import { binding, given, then, when } from "cucumber-tsflow";
import expect from "expect";

import {
  AVERAGE_TIMEOUT,
  PUBLIC_IDENTIFIER_DATA_BIND,
} from "@integration-tests/constants";
import PageUtils from "@integration-tests/utils/PageUtils";

@binding([PageUtils])
class CoreInitialization {
  constructor(protected pageUtils: PageUtils) {}

  @given(/CoreUserA has a registered ETH account using a mnemonic/)
  public givenUserAHasRegisteredMnemonic() {}

  @when(/CoreUserA visits developer ui/, undefined, AVERAGE_TIMEOUT)
  public whenUserAVisitsDeveloperUi() {
    this.pageUtils.openPage("http://localhost:5015/");
    return this.pageUtils.waitForCoreInitialization();
  }

  @then(
    /CoreUserA ether account is now associated with HypernetCore instance and publicIdentifier is initiated/,
    undefined,
    AVERAGE_TIMEOUT,
  )
  public async thenUserAAccountIsAssociated() {
    await this.pageUtils.page.waitForSelector(PUBLIC_IDENTIFIER_DATA_BIND);
    const publicIdentifier = await this.pageUtils.getElementInnerText(
      PUBLIC_IDENTIFIER_DATA_BIND,
    );

    expect(!!publicIdentifier).toBeTruthy();
  }
}

export = CoreInitialization;
