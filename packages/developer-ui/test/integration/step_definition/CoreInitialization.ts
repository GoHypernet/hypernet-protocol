import expect from "expect";
import {
  AVERAGE_TIMEOUT,
  CORE_INITIALIZATION_TIMEOUT,
  PUBLIC_IDENTIFIER_DATA_BIND,
} from "@integration-tests/constants";
import PageUtils from "@integration-tests/utils/PageUtils";
import { binding, given, then, when } from "cucumber-tsflow";

@binding([PageUtils])
class CoreInitialization {
  constructor(protected pageUtils: PageUtils) { }

  @given(/userA has registered mnemonic in hypernet protocol/)
  public givenUserAHasRegisteredMnemonic() { }

  @when(/userA visits developer ui web page/, undefined, AVERAGE_TIMEOUT)
  public wwhenUserAVisitsDeveloperUi() {
    return this.pageUtils.openPage("http://localhost:8080/");
  }

  @then(/userA ether account is now associated with HypernetCore instance and publicIdentifier is initiated/, undefined, AVERAGE_TIMEOUT)
  public async thenUserAAccountIsAssociated() {
    await this.pageUtils.page.waitForSelector(PUBLIC_IDENTIFIER_DATA_BIND);
    await this.pageUtils.page.waitForTimeout(CORE_INITIALIZATION_TIMEOUT);
    const publicIdentifier = await this.pageUtils.getElementInnerText(PUBLIC_IDENTIFIER_DATA_BIND);

    expect(!!publicIdentifier).toBeTruthy();
  }
}

export = CoreInitialization;
