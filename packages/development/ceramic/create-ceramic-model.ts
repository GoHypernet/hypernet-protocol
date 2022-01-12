import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyDidResolver from "key-did-resolver";
import { DID } from "dids";
import CeramicClient from "@ceramicnetwork/http-client";
import { ModelManager } from "@glazed/devtools";
import { CryptoUtils } from "@hypernetlabs/utils";
import {
  AuthorizedGatewaysSchema,
  LazyMintingSignatureSchema,
} from "@hypernetlabs/objects";

const providerSeed = CryptoUtils.randomBytes(
  32,
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", // etheruem public address
);
console.log("providerSeed", providerSeed);

const ceramic = new CeramicClient("https://clay.ceramic.hypernet.foundation");

const authProvider = new Ed25519Provider(providerSeed);

ceramic.did = new DID({
  provider: authProvider,
  resolver: KeyDidResolver.getResolver(),
});

const manager = new ModelManager(ceramic);

const authenticateDid = async () => {
  await ceramic.did?.authenticate();
  console.log("did", ceramic.did);
};

const createSchemaAndDefinition = async () => {
  const schemas = [AuthorizedGatewaysSchema, LazyMintingSignatureSchema];

  for (let index = 0; index < schemas.length; index++) {
    const schema = schemas[index];

    const schemaID = await manager.createSchema(schema.title, schema as any);

    await manager.createDefinition(schema.title, {
      name: schema.title,
      description: schema.title,
      schema: manager.getSchemaURL(schemaID) as string,
    });
  }
};

const initialize = async () => {
  await authenticateDid();
  await createSchemaAndDefinition();
  const model = await manager.toPublished();
  console.log("model", model);
  /* // example of model data, need to be put in the proper config 
  const model = {
    definitions: {
      AuthorizedGateways: 'kjzl6cwe1jw147a5aukx01zmfie1o0siwaa43dq5hqju3cdi5qnam1cqf008xr9'
    },
    schemas: {
      AuthorizedGateways: 'ceramic://k3y52l7qbv1frxoqn6pkell5l0m5zfvpb2ml3vbtdi2gfty79aepmrhnuw3te7lkw'
    },
  } */
};

initialize();
