import CeramicClient from "@ceramicnetwork/http-client";
import { DIDDataStore } from "@glazed/did-datastore";
import {
  PersistenceError,
  EthereumAccountAddress,
  BlockchainUnavailableError,
  VectorError,
} from "@hypernetlabs/objects";
import {
  ResultUtils,
  ILogUtils,
  ILogUtilsType,
  CryptoUtils,
} from "@hypernetlabs/utils";
import { DID } from "dids";
import { inject, injectable } from "inversify";
import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyDidResolver from "key-did-resolver";
import { okAsync, ResultAsync } from "neverthrow";

import {
  IDIDDataStoreProvider,
  IConfigProvider,
  IContextProvider,
  IBrowserNodeProvider,
  IConfigProviderType,
  IContextProviderType,
  IBrowserNodeProviderType,
} from "@interfaces/utilities";

@injectable()
export class DIDDataStoreProvider implements IDIDDataStoreProvider {
  protected didDataStore: DIDDataStore | null = null;

  constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IBrowserNodeProviderType)
    protected browserNodeProvider: IBrowserNodeProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public initializeDIDDataStoreProvider(
    accountAddress?: EthereumAccountAddress,
  ): ResultAsync<
    DIDDataStore,
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
      accountAddress
        ? okAsync(CryptoUtils.randomBytes(32, accountAddress))
        : this.getProviderSeed(),
    ]).andThen((vals) => {
      const [config, context, seed] = vals;

      // Create the CeramicClient
      const ceramic = new CeramicClient(config.ceramicNodeUrl);

      // Create a KeyDID provider
      const didAuthProvider = new Ed25519Provider(seed);

      // Set DID instance on the client
      ceramic.did = new DID({
        provider: didAuthProvider,
        resolver: KeyDidResolver.getResolver(),
      });

      return ResultAsync.fromPromise(ceramic.did.authenticate(), (e) => {
        return new PersistenceError("Could not authenticate with Ceramic", e);
      }).andThen(() => {
        context.onCeramicAuthenticationSucceeded.next();

        return okAsync(
          new DIDDataStore({
            ceramic: ceramic!,
            model: config.ceramicDataModel,
          }),
        );
      });
    });
  }

  private getProviderSeed(): ResultAsync<
    Uint8Array,
    VectorError | BlockchainUnavailableError
  > {
    return this.browserNodeProvider
      .getBrowserNode()
      .andThen((browserNode) => {
        // We will sign a utility message with the browser node to get a fixed key signature
        return browserNode.signUtilityMessage("Hypernet Protocol Persistence");
      })
      .map((signature) => {
        return CryptoUtils.randomBytes(32, signature);
      });
  }
}
