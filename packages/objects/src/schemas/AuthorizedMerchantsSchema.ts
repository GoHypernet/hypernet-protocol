export const AuthorizedMerchantsSchema = {
  $schema: "http://json-schema.org/draft-07/schema",
  title: "AuthorizedMerchants",
  type: "object",
  properties: {
    authorizedMerchants: {
      type: "array",
      title: "AuthorizedMerchants",
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
  required: ["authorizedMerchants"],
};
