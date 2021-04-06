import { providers, ethers } from "ethers";
import { MockProvider } from "ethereum-waffle";
import Ganache from "ganache-core";
import { EthereumAddress } from "@objects/EthereumAddress";
import { PublicIdentifier } from "@objects/PublicIdentifier";
import { PaymentId } from "@objects/PaymentId";
var randomstring = require("randomstring");

class MockUtils {
  public generateRandomAccounts(
    options = {
      mnemonic: this.defaultMnemonic,
      total_accounts: 1,
      default_balance_ether: 100,
    },
  ): any {
    return [...new Array(options.total_accounts)].map((el, idx) => ({
      balance: `${options.default_balance_ether}000000000000000000`,
      secretKey: ethers.Wallet.fromMnemonic(options.mnemonic, `m/44'/60'/0'/0/${idx}`).privateKey,
    }));
  }

  public defaultMnemonic: string = "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";

  public generateRandomEtherAdress(): EthereumAddress {
    return EthereumAddress("0x" + randomstring.generate({ length: 40, charset: "hex" }));
  }

  public generateRandomPublicIdentifier(): PublicIdentifier {
    return PublicIdentifier("vector" + randomstring.generate({ length: 50, charset: "hex" }));
  }

  public generateRandomPaymentId(): PaymentId {
    return PaymentId("0x" + randomstring.generate({ length: 64, charset: "hex" }));
  }

  public generateRandomPaymentToken(): EthereumAddress {
    return EthereumAddress("0x" + randomstring.generate({ length: 40, charset: "hex" }));
  }

  public generateMockProvider(options?: Ganache.IProviderOptions): providers.Web3Provider {
    return new MockProvider(
      options
        ? {
            ganacheOptions: options,
          }
        : {
            ganacheOptions: {
              accounts: this.generateRandomAccounts({
                mnemonic: this.defaultMnemonic,
                default_balance_ether: 100,
                total_accounts: 1,
              }),
            },
          },
    );
  }
}

export default new MockUtils();
