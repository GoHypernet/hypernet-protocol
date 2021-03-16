import { binding, before, after } from "cucumber-tsflow";
import PageUtils from "@integration-tests/utils/PageUtils";

@binding([PageUtils])
class Hooks {
  constructor(protected pageUtils: PageUtils) {}
  @before()
  public beforeAllScenarios() {
    return this.pageUtils.getPageUtilsReady();
  }

  @after()
  public afterAllScenarios() {
    return this.pageUtils.browser.close();
  }
}

export = Hooks;
