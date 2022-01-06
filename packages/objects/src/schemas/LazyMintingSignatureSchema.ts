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
          registrarAddress: {
            type: "string",
            title: "registrarAddress",
            maxLength: 500,
          },
          mintingSignature: {
            type: "string",
            title: "mintingSignature",
            maxLength: 1000,
          },
          accountAddress: {
            type: "string",
            title: "accountAddress",
            maxLength: 500,
          },
        },
      },
    },
  },
  required: ["data"],
};
