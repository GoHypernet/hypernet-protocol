import { Given, When, Then } from "@cucumber/cucumber";
import { ExternalProviderUtils } from "@hypernetlabs/utils";
import { IHypernetCore, HypernetCore, EBlockchainNetwork } from "@hypernetlabs/hypernet-core";

class CoreInitialization {
  protected coreUserA: IHypernetCore = {} as HypernetCore;

  constructor() {
    const externalProviderUtils = new ExternalProviderUtils();
    const externalProvider = externalProviderUtils.getExternalProviderForDevelopment();

    Given("coreUserA has an instance of the core", () => {
      this.coreUserA = new HypernetCore(EBlockchainNetwork.Localhost, undefined, externalProvider);
    });

    When("coreUserA initializes the protocol with one of his accounts", { timeout: 4 * 5000 }, (done: any) => {
      this.coreUserA
        .getEthereumAccounts()
        .andThen((accounts) => {
          return this.coreUserA.initialize(accounts[0]);
        })
        .map(() => {
          done();
        });
    });

    Then(
      "coreUserA ether account is now associated with HypernetCore instance and coreUserA publicIdentifier is initiated",
      () => {
        this.coreUserA.getPublicIdentifier().map((publicIdentifier) => {
          expect(!!publicIdentifier).toBeTruthy();
        });
      },
    );
  }
}

new CoreInitialization();
