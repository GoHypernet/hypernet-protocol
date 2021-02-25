import { setWorldConstructor, Before, After } from "@cucumber/cucumber";
import PageUtils from "../utils/PageUtils";

class CucumberGlobal {
  public pageUtils: PageUtils;

  constructor() {
    this.pageUtils = new PageUtils();
  }
}

setWorldConstructor(CucumberGlobal);

//@ts-ignore
Before(function (testCase, done) {
  //@ts-ignore
  const _this: CucumberWorld = this;
  const pageUtils: PageUtils = _this.pageUtils;
  pageUtils.getPageUtilsReady().then((page) => {
    done();
  });
});

//@ts-ignore
After(function (testCase, done) {
  //@ts-ignore
  const pageUtils: PageUtils = this.pageUtils;
  pageUtils.browser.close();
  done();
});
