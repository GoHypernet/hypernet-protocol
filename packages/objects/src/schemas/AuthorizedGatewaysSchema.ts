export const AuthorizedGatewaysSchema = {
  $schema: "http://json-schema.org/draft-07/schema",
  title: "AuthorizedGateways",
  type: "object",
  properties: {
    data: {
      type: "array",
      title: "data",
      items: {
        type: "object",
        title: "AuthorizedMerchantItem",
        properties: {
          merchantUrl: {
            type: "string",
            title: "merchantUrl",
            maxLength: 500,
          },
          authorizationSignature: {
            type: "string",
            title: "authorizationSignature",
            maxLength: 1000,
          },
        },
      },
    },
  },
  required: ["data"],
};
