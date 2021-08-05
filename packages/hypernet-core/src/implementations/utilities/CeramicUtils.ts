import {
  ThreeIdConnect,
  EthereumAuthProvider,
  DidProviderProxy,
} from "@3id/connect";
import ThreeIdResolver from "@ceramicnetwork/3id-did-resolver";
import { CeramicApi } from "@ceramicnetwork/common";
import CeramicClient from "@ceramicnetwork/http-client";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { IDX } from "@ceramicstudio/idx";
import { createDefinition, publishSchema } from "@ceramicstudio/idx-tools";
import {
  PersistenceError,
  BlockchainUnavailableError,
  EthereumAddress,
  AuthorizedGatewaysSchema,
  HypernetConfig,
} from "@hypernetlabs/objects";
import { ResultUtils, ILogUtils } from "@hypernetlabs/utils";
import { Resolver, ResolverRegistry } from "did-resolver";
import { DID } from "dids";
import { okAsync, ResultAsync, errAsync } from "neverthrow";

import {
  ICeramicUtils,
  IBlockchainProvider,
  IConfigProvider,
  IContextProvider,
  ISchemaWithName,
  IRecordWithDataKey,
} from "@interfaces/utilities";

export class CeramicUtils implements ICeramicUtils {
  protected ceramic: CeramicApi | null = null;
  protected threeIdConnect: ThreeIdConnect | null = null;
  protected authProvider: EthereumAuthProvider | null = null;
  protected threeIdResolver: ResolverRegistry | null = null;
  protected didResolver: Resolver | null = null;
  protected idx: IDX | null = null;
  protected isAuthenticated = false;

  constructor(
    protected configProvider: IConfigProvider,
    protected contextProvider: IContextProvider,
    protected blockchainProvider: IBlockchainProvider,
    protected logUtils: ILogUtils,
  ) {}

  private _initialize(): ResultAsync<
    void,
    PersistenceError | BlockchainUnavailableError
  > {
    if (this.isAuthenticated === true) {
      return okAsync(undefined);
    }
    return this._authenticateUser();
  }

  private _authenticateUser(): ResultAsync<
    void,
    PersistenceError | BlockchainUnavailableError
  > {
    return this.contextProvider.getInitializedContext().andThen((context) => {
      return this._setup().andThen(({ config, ceramic, threeIdResolver }) => {
        return this._getDidProvider().andThen((didProvider) => {
          ceramic.setDID(
            new DID({
              provider: didProvider,
              resolver: threeIdResolver,
            }),
          );

          if (!ceramic.did) {
            return errAsync(new PersistenceError("did is undefined"));
          }

          context.onCeramicAuthenticationStarted.next();

          return ResultAsync.fromPromise(
            ceramic.did?.authenticate(),
            (e) =>
              new PersistenceError("Could not authenticate with Ceramic", e),
          )
            .andThen(() => {
              this.logUtils.info(
                `ceramic logged in, ceramic did id: ${this.ceramic?.did?.id.toString()}`,
              );
              context.onCeramicAuthenticationSucceeded.next();

              const aliases: Record<string, string> = {};
              for (const [key, value] of config.storageAliases) {
                aliases[key] = value;
              }

              this.idx = new IDX({
                ceramic: ceramic,
                aliases: aliases,
              });
              this.isAuthenticated = true;
              return okAsync(undefined);
            })
            .mapErr((e) => {
              const error = new PersistenceError(
                "Storage authentication failed",
                e,
              );
              context.onCeramicFailed.next(error);
              return new PersistenceError("Storage authentication failed", e);
            });
        });
      });
    });
  }

  // This is used to create a difinition derived from a schema, and it shouldn't be called in run time
  public initiateDefinitions(): ResultAsync<
    TileDocument[],
    PersistenceError | BlockchainUnavailableError
  > {
    return this._initialize().andThen(() => {
      if (this.ceramic == null || this.idx == null) {
        throw new Error("Something went wrong while initializing Ceramic!");
      }

      const promisesOfPublishSchema: ResultAsync<
        ISchemaWithName,
        PersistenceError
      >[] = [];

      const promisesOfCreateDifnition: ResultAsync<
        TileDocument,
        PersistenceError
      >[] = [];

      const schemas = [AuthorizedGatewaysSchema];
      for (const schema of schemas) {
        promisesOfPublishSchema.push(
          ResultAsync.fromPromise(
            publishSchema(this.ceramic, {
              content: schema,
              name: schema.title,
            }),
            (e) => new PersistenceError("publishSchema failed", e),
          ).map((res) => {
            return {
              name: schema.title,
              schema: res,
            };
          }),
        );
      }

      return ResultUtils.combine(promisesOfPublishSchema).andThen(
        (publishedSchemas) => {
          for (const publishedSchema of publishedSchemas) {
            promisesOfCreateDifnition.push(
              ResultAsync.fromPromise(
                createDefinition(this.ceramic as CeramicApi, {
                  name: publishedSchema.name,
                  description: publishedSchema.name,
                  schema: publishedSchema.schema.commitId.toUrl(),
                }),
                (e) => new PersistenceError("createDefinition failed", e),
              ),
            );
          }

          return ResultUtils.combine(promisesOfCreateDifnition);
        },
      );
    });
  }

  public writeRecord<T>(
    aliasName: string,
    content: T,
  ): ResultAsync<void, PersistenceError> {
    return this._initialize().andThen(() => {
      if (this.idx == null) {
        throw new Error("Something went wrong while initializing Ceramic!");
      }

      return ResultAsync.fromPromise(
        this.idx.set(aliasName, { data: content }),
        (e) => new PersistenceError("idx.set failed", e),
      ).map(() => {});
    });
  }

  public readRecord<T>(
    aliasName: string,
  ): ResultAsync<T | null, PersistenceError> {
    return this._initialize().andThen(() => {
      if (this.idx == null) {
        throw new Error("Something went wrong while initializing Ceramic!");
      }

      return ResultAsync.fromPromise(
        this.idx.get<IRecordWithDataKey<T>>(aliasName),
        (e) => new PersistenceError("idx.get failed", e),
      ).map((record) => {
        return record?.data || null;
      });
    });
  }

  public removeRecord(aliasName: string): ResultAsync<void, PersistenceError> {
    return this._initialize().andThen(() => {
      if (this.idx == null) {
        throw new Error("Something went wrong while initializing Ceramic!");
      }

      return ResultAsync.fromPromise(
        this.idx.remove(aliasName),
        (e) => new PersistenceError("idx.remove failed", e),
      );
    });
  }

  private _setup(): ResultAsync<
    {
      config: HypernetConfig;
      ceramic: CeramicApi;
      threeIdResolver: ResolverRegistry;
    },
    PersistenceError
  > {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.blockchainProvider.getEIP1193Provider(),
      this._getAdresses(),
    ]).andThen((vals) => {
      const [config, provider, addresses] = vals;

      this.ceramic = new CeramicClient(config.ceramicNodeUrl);
      // this.authProvider = new EthereumAuthProvider(provider, addresses[0]);
      this.authProvider = new EthereumAuthProvider(
        window.ethereum,
        addresses[0],
      );
      this.threeIdConnect = new ThreeIdConnect();
      this.threeIdResolver = ThreeIdResolver.getResolver(this.ceramic);
      this.didResolver = new Resolver(this.threeIdResolver);
      return okAsync({
        config,
        ceramic: this.ceramic,
        threeIdResolver: this.threeIdResolver,
      });
    });
  }

  private _getAdresses(): ResultAsync<
    EthereumAddress[],
    BlockchainUnavailableError
  > {
    return this.blockchainProvider.getProvider().andThen((provider) => {
      return ResultAsync.fromPromise(provider.listAccounts(), (e) => {
        return e as BlockchainUnavailableError;
      }).map(async (addresses) => {
        return addresses.map((val) => EthereumAddress(val));
      });
    });
  }

  private _getDidProvider(): ResultAsync<DidProviderProxy, PersistenceError> {
    if (this.authProvider == null || this.threeIdConnect == null) {
      throw new Error("Something went wrong while initializing Ceramic!");
    }
    const authProvider = this.authProvider;
    const threeIdConnect = this.threeIdConnect;

    return ResultAsync.fromPromise(
      threeIdConnect.connect(authProvider),
      (e) => new PersistenceError("threeIdConnect.connect failed", e),
    ).andThen(() => {
      const result = ResultUtils.fromThrowableResult<
        DidProviderProxy,
        PersistenceError
      >(() => {
        return threeIdConnect.getDidProvider();
      });

      if (result.isErr()) {
        return errAsync(result.error);
      }
      return okAsync(result.value);
    });
  }
}
