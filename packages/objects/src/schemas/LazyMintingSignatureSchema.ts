export const LazyMintingSignatureSchema = {
  $schema: "http://json-schema.org/draft-07/schema",
  title: "LazyMintingSignature",
  type: "object",
  properties: {
    data: {
      type: "array",
      title: "data",
      items: {
        type: "object",
        title: "RegistrarSignatureItem",
        properties: {
          registryAddress: {
            type: "string",
            title: "registryAddress",
            maxLength: 500,
          },
          mintingSignature: {
            type: "string",
            title: "mintingSignature",
            maxLength: 1000,
          },
          tokenId: {
            type: "number",
            title: "tokenId",
            maxLength: 500,
          },
          ownerAccountAddress: {
            type: "string",
            title: "ownerAccountAddress",
            maxLength: 500,
          },
          registrationData: {
            type: "string",
            title: "registrationData",
            maxLength: 500,
          },
          registrarAddress: {
            type: "string",
            title: "registrarAddress",
            maxLength: 500,
          },
          tokenClaimed: {
            type: "boolean",
            title: "tokenClaimed",
            maxLength: 500,
          },
        },
      },
    },
  },
  required: ["data"],
};
