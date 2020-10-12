import fastify from "fastify";
import fastifyCors from "fastify-cors";
import pino from "pino";

import { MessagingAuthService } from "./auth/messaging-auth-service";
import { config } from "./config";
import {
  getNonceParamsSchema,
  GetNonceRequestParams,
  getNonceResponseSchema,
  postAuthBodySchema,
  PostAuthRequestBody,
  postAuthResponseSchema,
} from "./schemas";

const logger = pino({ level: "debug" });

const server = fastify({ logger });

server.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "PUT", "POST", "OPTIONS"],
  preflightContinue: true,
});

const messagingService = new MessagingAuthService(
  {
    messagingUrl: config.messagingUrl,
    privateKey: config.privateKey!,
    publicKey: config.publicKey!,
  },
  logger.child({ module: "MessagingAuthService" }),
  config.adminToken,
);

// Used during startup to monitor whether this service is awake & responsive
server.get("/ping", async () => {
  return "pong\n";
});

server.get<{ Params: GetNonceRequestParams }>(
  "/auth/:userIdentifier",
  { schema: { params: getNonceParamsSchema, response: getNonceResponseSchema } },
  async (request, reply) => {
    const nonce = await messagingService.getNonce(request.params.userIdentifier);
    return reply.status(200).send(nonce);
  },
);

server.post<{ Body: PostAuthRequestBody }>(
  "/auth",
  { schema: { body: postAuthBodySchema, response: postAuthResponseSchema } },
  async (request, reply) => {
    const token = await messagingService.verifyAndVend(
      request.body.sig,
      request.body.userIdentifier,
      request.body.adminToken,
    );
    return reply.status(200).send(token);
  },
);

server.listen(config.port, "0.0.0.0", err => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
