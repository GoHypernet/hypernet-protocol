/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CeramicApi } from "@ceramicnetwork/common";
import CeramicClient from "@ceramicnetwork/http-client";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { IDX } from "@ceramicstudio/idx";
import { createDefinition, publishSchema } from "@ceramicstudio/idx-tools";
import {
  PersistenceError,
  BlockchainUnavailableError,
  AuthorizedGatewaysSchema,
  VectorError,
} from "@hypernetlabs/objects";
import {
  ResultUtils,
  ILogUtils,
  ILogUtilsType,
  CryptoUtils,
} from "@hypernetlabs/utils";
import { Resolver } from "did-resolver";
import { DID } from "dids";
import { inject, injectable } from "inversify";
import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyDidResolver from "key-did-resolver";
import { okAsync, ResultAsync } from "neverthrow";

import {
  ICeramicUtils,
  IConfigProvider,
  IContextProvider,
  ISchemaWithName,
  IRecordWithDataKey,
  IBrowserNodeProvider,
  IConfigProviderType,
  IContextProviderType,
  IBrowserNodeProviderType,
} from "@interfaces/utilities";

@injectable()
export class CeramicUtils implements ICeramicUtils {
  protected ceramic: CeramicApi | null = null;
  protected authProvider: Ed25519Provider | null = null;
  protected didResolver: Resolver | null = null;
  protected idx: IDX | null = null;
  protected initializeResult: ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  > | null = null;

  constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IBrowserNodeProviderType)
    protected browserNodeProvider: IBrowserNodeProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public initialize(): ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    if (this.initializeResult == null) {
      this.initializeResult = this._authenticateUser();
    }

    return this.initializeResult;
  }

  // This is used to create a difinition derived from a schema, and it shouldn't be called in run time
  public initiateDefinitions(): ResultAsync<
    TileDocument[],
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    return this.initialize().andThen(() => {
      if (this.ceramic == null || this.idx == null) {
        throw new Error("Something went wrong while initializing Ceramic!");
      }

      const promisesOfPublishSchema: ResultAsync<
        ISchemaWithName,
        PersistenceError | VectorError | BlockchainUnavailableError
      >[] = [];

      const promisesOfCreateDifnition: ResultAsync<
        TileDocument,
        PersistenceError | VectorError | BlockchainUnavailableError
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
  ): ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    if (this.initializeResult == null) {
      throw new Error("Must call CeramicUtils.initialize() first");
    }
    return this.initializeResult.andThen(() => {
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
  ): ResultAsync<
    T | null,
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    if (this.initializeResult == null) {
      throw new Error("Must call CeramicUtils.initialize() first");
    }
    return this.initializeResult.andThen(() => {
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

  public removeRecord(
    aliasName: string,
  ): ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    if (this.initializeResult == null) {
      throw new Error("Must call CeramicUtils.initialize() first");
    }
    return this.initializeResult.andThen(() => {
      if (this.idx == null) {
        throw new Error("Something went wrong while initializing Ceramic!");
      }

      return ResultAsync.fromPromise(
        this.idx.remove(aliasName),
        (e) => new PersistenceError("idx.remove failed", e),
      );
    });
  }

  private _authenticateUser(): ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    this.logUtils.debug(`Authenticating user with Ceramic`);
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
      this.getProviderSeed(),
    ]).andThen((vals) => {
      const [config, context, providerSeed] = vals;

      if (context.account == null) {
        throw new Error(
          "Must have established account before trying to setup Ceramic!",
        );
      }

      this.logUtils.debug(
        `Setting up Ceramic client for account ${context.account}`,
      );

      // Create the CeramicClient
      this.ceramic = new CeramicClient(config.ceramicNodeUrl);

      // Create a KeyDID provider
      this.authProvider = new Ed25519Provider(providerSeed);

      // Set DID instance on the client
      this.ceramic.did = new DID({
        provider: this.authProvider,
        resolver: KeyDidResolver.getResolver(),
      });

      this.logUtils.debug(`Starting Ceramic authentication`);
      context.onCeramicAuthenticationStarted.next();
      return ResultAsync.fromPromise(this.ceramic.did.authenticate(), (e) => {
        return new PersistenceError("Could not authenticate with Ceramic", e);
      })
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
            ceramic: this.ceramic!,
            aliases: aliases,
          });
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
