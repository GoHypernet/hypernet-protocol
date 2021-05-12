import { okAsync, ResultAsync, errAsync } from "neverthrow";
import {
  ThreeIdConnect,
  EthereumAuthProvider,
  DidProviderProxy,
} from "@3id/connect";
import CeramicClient from "@ceramicnetwork/http-client";
import { DID } from "dids";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import ThreeIdResolver from "@ceramicnetwork/3id-did-resolver";
import { Resolver, ResolverRegistry } from "did-resolver";
import { IDX } from "@ceramicstudio/idx";
import { createDefinition, publishSchema } from "@ceramicstudio/idx-tools";
import type StreamID from "@ceramicnetwork/streamid";

import {
  CeramicError,
  BlockchainUnavailableError,
} from "@hypernetlabs/objects";
import {
  EthereumAddress,
  AuthorizedMerchantsSchema,
} from "@hypernetlabs/objects";
import { ResultUtils } from "@hypernetlabs/utils";
import {
  ICeramicUtils,
  IBlockchainProvider,
  IConfigProvider,
  IContextProvider,
} from "@interfaces/utilities";
import { ILogUtils } from "@hypernetlabs/utils";

interface ISchemaWithName {
  name: string;
  schema: TileDocument;
}

export class CeramicUtils implements ICeramicUtils {
  protected toCeramicError: (e: unknown) => CeramicError = (e) => {
    console.log("toCeramicError e: ", e);
    return new CeramicError(e as Error);
  };
  protected ceramic: CeramicClient | null = null;
  protected threeIdConnect: ThreeIdConnect | null = null;
  protected authProvider: EthereumAuthProvider | null = null;
  protected threeIdResolver: ResolverRegistry | null = null;
  protected didResolver: Resolver | null = null;
  protected idx: IDX | null = null;
  protected schemas = [AuthorizedMerchantsSchema];

  constructor(
    protected configProvider: IConfigProvider,
    protected contextProvider: IContextProvider,
    protected blockchainProvider: IBlockchainProvider,
    protected logUtils: ILogUtils,
  ) {}

  public authenticateUser(): ResultAsync<
    void,
    CeramicError | BlockchainUnavailableError
  > {
    return this.contextProvider.getInitializedContext().andThen((context) => {
      return this._setup().andThen(() => {
        return this._getDidProvider().andThen((didProvider) => {
          if (!this.ceramic || !this.threeIdResolver) {
            throw new Error("Something went wrong while initializing Ceramic!");
          }

          this.ceramic.setDID(
            new DID({
              provider: didProvider,
              resolver: this.threeIdResolver,
            }),
          );

          if (!this.ceramic.did) {
            return errAsync(this.toCeramicError(new Error("did is undefined")));
          }

          context.onDeStorageAuthenticationStarted.next();

          return ResultAsync.fromPromise(
            this.ceramic.did?.authenticate(),
            this.toCeramicError,
          )
            .andThen(() => {
              context.onDeStorageAuthenticationSucceeded.next();

              this.idx = new IDX({
                ceramic: this.ceramic as CeramicClient,
                aliases: this.schemas.reduce(
                  (acc, schema) => ({
                    [schema.properties.authorizedMerchants.title]:
                      "kjzl6cwe1jw14au7u7ab9y0ynvk2t9uge8iu1hcb46ucproqr7tgn7h7tl5nmlz",
                  }),
                  {},
                ),
              });

              return okAsync(undefined);
            })
            .mapErr((e) => {
              context.onDeStorageAuthenticationFailed.next();
              return e as CeramicError;
            });
        });
      });
    });
  }

  public initiateDefinitions(): ResultAsync<
    TileDocument[],
    CeramicError | BlockchainUnavailableError
  > {
    if (!this.ceramic || !this.idx) {
      throw new Error("Something went wrong while initializing Ceramic!");
    }

    const promisesOfPublishSchema: ResultAsync<
      ISchemaWithName,
      CeramicError
    >[] = [];

    const promisesOfCreateDifnition: ResultAsync<
      TileDocument,
      CeramicError
    >[] = [];

    for (const schema of this.schemas) {
      promisesOfPublishSchema.push(
        ResultAsync.fromPromise(
          publishSchema(this.ceramic, {
            content: schema,
            name: schema.properties.authorizedMerchants.title,
          }),
          this.toCeramicError,
        ).map((res) => {
          return {
            name: schema.properties.authorizedMerchants.title,
            schema: res,
          };
        }),
      );
    }

    return ResultUtils.combine(promisesOfPublishSchema)
      .andThen((publishedSchemas) => {
        for (const publishedSchema of publishedSchemas) {
          promisesOfCreateDifnition.push(
            ResultAsync.fromPromise(
              createDefinition(this.ceramic as CeramicClient, {
                name: publishedSchema.name,
                description: publishedSchema.name,
                schema: publishedSchema.schema.commitId.toUrl(),
              }),
              this.toCeramicError,
            ),
          );
        }

        return ResultUtils.combine(promisesOfCreateDifnition);
      })
      .mapErr((e) => {
        return e as CeramicError;
      });
  }

  public writeRecord<T>(
    aliasName: string,
    content: T,
  ): ResultAsync<StreamID, CeramicError> {
    if (!this.idx) {
      throw new Error("Something went wrong while initializing Ceramic!");
    }

    return ResultAsync.fromPromise(
      this.idx.set(aliasName, content),
      this.toCeramicError,
    );
  }

  public readRecord<T>(aliasName: string): ResultAsync<T | null, CeramicError> {
    if (!this.idx) {
      throw new Error("Something went wrong while initializing Ceramic!");
    }

    return ResultAsync.fromPromise(
      this.idx.get<T>(aliasName),
      this.toCeramicError,
    );
  }

  public removeRecord(aliasName: string): ResultAsync<void, CeramicError> {
    if (!this.idx) {
      throw new Error("Something went wrong while initializing Ceramic!");
    }

    return ResultAsync.fromPromise(
      this.idx.remove(aliasName),
      this.toCeramicError,
    );
  }

  private _setup(): ResultAsync<void, CeramicError> {
    return this.configProvider.getConfig().andThen((config) => {
      return this._getAdresses().andThen((addresses) => {
        this.ceramic = new CeramicClient(config.ceramicNodeUrl);
        this.authProvider = new EthereumAuthProvider(
          window.ethereum,
          addresses[0],
        );
        this.threeIdConnect = new ThreeIdConnect();
        this.threeIdResolver = ThreeIdResolver.getResolver(this.ceramic);
        this.didResolver = new Resolver(this.threeIdResolver);
        return okAsync(undefined);
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

  private _getDidProvider(): ResultAsync<DidProviderProxy, CeramicError> {
    if (!this.authProvider || !this.threeIdConnect) {
      throw new Error("Something went wrong while initializing Ceramic!");
    }

    return ResultAsync.fromPromise(
      this.threeIdConnect.connect(this.authProvider),
      this.toCeramicError,
    ).andThen(() => {
      const didProvider = this.threeIdConnect?.getDidProvider();

      if (!didProvider) {
        return errAsync(
          this.toCeramicError(new Error("Something went wrong with ceramic!")),
        );
      }
      return okAsync(didProvider);
    });
  }
}
