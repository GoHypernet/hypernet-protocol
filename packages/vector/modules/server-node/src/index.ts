import fastify from "fastify";
import fastifyCors from "fastify-cors";
import fastifyOas from "fastify-oas";
import pino from "pino";
import { providers } from "ethers";
import {
  ChannelRpcMethods,
  EngineEvent,
  ChainError,
  ServerNodeParams,
  ServerNodeResponses,
  ResolveUpdateDetails,
  EngineEvents,
  CreateUpdateDetails,
} from "@connext/vector-types";
import Axios from "axios";
import { constructRpcRequest } from "@connext/vector-utils";
import { Static, Type } from "@sinclair/typebox";

import { PrismaStore } from "./services/store";
import { config } from "./config";
import { createNode, getChainService, getNode, getNodes } from "./helpers/nodes";

export const logger = pino();
const server = fastify({ logger });
server.register(fastifyOas, {
  swagger: {
    info: {
      title: "Vector Server-Node",
      version: "0.0.1",
    },
  },
  exposeRoute: true,
});
server.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "PUT", "POST", "OPTIONS"],
  preflightContinue: true,
});

export const store = new PrismaStore();

export const _providers: { [chainId: string]: providers.JsonRpcProvider } = Object.fromEntries(
  Object.entries(config.chainProviders).map(([chainId, url]: any) => [chainId, new providers.JsonRpcProvider(url)]),
);

server.get("/ping", async () => {
  return "pong\n";
});

server.get("/config", { schema: { response: ServerNodeResponses.GetConfigSchema } }, async (request, reply) => {
  const nodes = getNodes();
  return reply.status(200).send(
    nodes.map(node => {
      return {
        index: node.index,
        publicIdentifier: node.node.publicIdentifier,
        signerAddress: node.node.signerAddress,
      };
    }),
  );
});

server.get<{ Params: ServerNodeParams.GetChannelState }>(
  "/channel/:channelAddress/:publicIdentifier",
  { schema: { params: ServerNodeParams.GetChannelStateSchema } },
  async (request, reply) => {
    const engine = getNode(request.params.publicIdentifier);
    if (!engine) {
      return reply.status(400).send({ message: "Node not found", publicIdentifier: request.params.publicIdentifier });
    }

    const params = constructRpcRequest(ChannelRpcMethods.chan_getChannelState, request.params);
    try {
      const res = await engine.request<"chan_getChannelState">(params);
      if (!res) {
        return reply.status(404).send({ message: "Channel not found", channelAddress: request.params.channelAddress });
      }
      return reply.status(200).send(res);
    } catch (e) {
      logger.error({ message: e.message, stack: e.stack });
      return reply.status(500).send({ message: e.message });
    }
  },
);

server.get<{ Params: ServerNodeParams.GetChannelState }>(
  "/channel/:channelAddress",
  { schema: { params: ServerNodeParams.GetChannelStateSchema } },
  async (request, reply) => {
    const engine = getNode(request.params.publicIdentifier);
    if (!engine) {
      return reply.status(400).send({ message: "Node not found", publicIdentifier: request.params.publicIdentifier });
    }
    const params = constructRpcRequest(ChannelRpcMethods.chan_getChannelState, request.params);
    try {
      const res = await engine.request<"chan_getChannelState">(params);
      if (!res) {
        return reply.status(404).send({ message: "Channel not found", channelAddress: request.params.channelAddress });
      }
      return reply.status(200).send(res);
    } catch (e) {
      logger.error({ message: e.message, stack: e.stack });
      return reply.status(500).send({ message: e.message });
    }
  },
);

server.get<{ Params: ServerNodeParams.GetChannelStateByParticipants }>(
  "/channel/:alice/:bob/:chainId/:publicIdentifier",
  { schema: { params: ServerNodeParams.GetChannelStateByParticipantsSchema } },
  async (request, reply) => {
    const engine = getNode(request.params.publicIdentifier);
    if (!engine) {
      return reply.status(400).send({ message: "Node not found", publicIdentifier: request.params.publicIdentifier });
    }
    const params = constructRpcRequest(ChannelRpcMethods.chan_getChannelStateByParticipants, request.params);
    try {
      const res = await engine.request<"chan_getChannelStateByParticipants">(params);
      if (!res) {
        return reply.status(404).send({ message: "Channel not found", alice: request.params });
      }
      return reply.status(200).send(res);
    } catch (e) {
      logger.error({ message: e.message, stack: e.stack });
      return reply.status(500).send({ message: e.message });
    }
  },
);

server.get<{ Params: ServerNodeParams.GetChannelStateByParticipants }>(
  "/channel/:alice/:bob/:chainId",
  { schema: { params: ServerNodeParams.GetChannelStateByParticipantsSchema } },
  async (request, reply) => {
    const engine = getNode(request.params.publicIdentifier);
    if (!engine) {
      return reply.status(400).send({ message: "Node not found", publicIdentifier: request.params.publicIdentifier });
    }
    const params = constructRpcRequest(ChannelRpcMethods.chan_getChannelStateByParticipants, request.params);
    try {
      const res = await engine.request<"chan_getChannelStateByParticipants">(params);
      if (!res) {
        return reply.status(404).send({ message: "Channel not found", alice: request.params });
      }
      return reply.status(200).send(res);
    } catch (e) {
      logger.error({ message: e.message, stack: e.stack });
      return reply.status(500).send({ message: e.message });
    }
  },
);

server.get<{ Params: ServerNodeParams.GetTransferStateByRoutingId }>(
  "/channel/:channelAddress/transfer/:routingId/:publicIdentifier",
  { schema: { params: ServerNodeParams.GetTransferStateByRoutingIdSchema } },
  async (request, reply) => {
    const engine = getNode(request.params.publicIdentifier);
    if (!engine) {
      return reply.status(400).send({ message: "Node not found", publicIdentifier: request.params.publicIdentifier });
    }
    const params = constructRpcRequest(ChannelRpcMethods.chan_getTransferStateByRoutingId, request.params);
    try {
      const res = await engine.request<"chan_getTransferStateByRoutingId">(params);
      if (!res) {
        return reply.status(404).send({ message: "Transfer not found", params: request.params });
      }
      return reply.status(200).send(res);
    } catch (e) {
      logger.error({ message: e.message, stack: e.stack });
      return reply.status(500).send({ message: e.message });
    }
  },
);

server.get<{ Params: ServerNodeParams.GetTransferStateByRoutingId }>(
  "/channel/:channelAddress/transfer/:routingId",
  { schema: { params: ServerNodeParams.GetTransferStateByRoutingIdSchema } },
  async (request, reply) => {
    const engine = getNode(request.params.publicIdentifier);
    if (!engine) {
      return reply.status(400).send({ message: "Node not found", publicIdentifier: request.params.publicIdentifier });
    }
    const params = constructRpcRequest(ChannelRpcMethods.chan_getTransferStateByRoutingId, request.params);
    try {
      const res = await engine.request<"chan_getTransferStateByRoutingId">(params);
      if (!res) {
        return reply.status(404).send({ message: "Transfer not found", params: request.params });
      }
      return reply.status(200).send(res);
    } catch (e) {
      logger.error({ message: e.message, stack: e.stack });
      return reply.status(500).send({ message: e.message });
    }
  },
);

server.get<{ Params: ServerNodeParams.GetTransferStateByRoutingId }>(
  "/transfer/:routingId/:publicIdentifier",
  { schema: { params: ServerNodeParams.GetTransferStatesByRoutingIdSchema } },
  async (request, reply) => {
    const engine = getNode(request.params.publicIdentifier);
    if (!engine) {
      return reply.status(400).send({ message: "Node not found", publicIdentifier: request.params.publicIdentifier });
    }
    const params = constructRpcRequest(ChannelRpcMethods.chan_getTransferStatesByRoutingId, request.params);
    try {
      const res = await engine.request<"chan_getTransferStatesByRoutingId">(params);
      if (!res) {
        return reply.status(404).send({ message: "Transfer not found", params: request.params });
      }
      return reply.status(200).send(res);
    } catch (e) {
      logger.error({ message: e.message, stack: e.stack });
      return reply.status(500).send({ message: e.message });
    }
  },
);

server.get<{ Params: ServerNodeParams.GetTransferStateByRoutingId }>(
  "/transfer/:routingId",
  { schema: { params: ServerNodeParams.GetTransferStatesByRoutingIdSchema } },
  async (request, reply) => {
    const engine = getNode(request.params.publicIdentifier);
    if (!engine) {
      return reply.status(400).send({ message: "Node not found", publicIdentifier: request.params.publicIdentifier });
    }
    const params = constructRpcRequest(ChannelRpcMethods.chan_getTransferStatesByRoutingId, request.params);
    try {
      const res = await engine.request<"chan_getTransferStatesByRoutingId">(params);
      if (!res) {
        return reply.status(404).send({ message: "Transfer not found", params: request.params });
      }
      return reply.status(200).send(res);
    } catch (e) {
      logger.error({ message: e.message, stack: e.stack });
      return reply.status(500).send({ message: e.message });
    }
  },
);

server.get("/channel", { schema: { response: ServerNodeResponses.GetChannelStatesSchema } }, async (request, reply) => {
  const engines = getNodes();
  if (engines.length > 1) {
    return reply.status(400).send({ message: "More than one node exists and publicIdentifier was not specified" });
  }
  const engine = engines[0]?.node;
  if (!engine) {
    return reply.status(400).send({ message: "Node not found" });
  }
  const params = constructRpcRequest(ChannelRpcMethods.chan_getChannelStates, undefined);
  try {
    const res = await engine.request<"chan_getChannelStates">(params);
    return reply.status(200).send(res.map(chan => chan.channelAddress));
  } catch (e) {
    logger.error({ message: e.message, stack: e.stack, context: e.context });
    return reply.status(500).send({ message: e.message, context: e.context });
  }
});

server.post<{ Body: ServerNodeParams.Setup }>(
  "/setup",
  { schema: { body: ServerNodeParams.SetupSchema, response: ServerNodeResponses.SetupSchema } },
  async (request, reply) => {
    const engine = getNode(request.body.publicIdentifier);
    if (!engine) {
      return reply.status(400).send({ message: "Node not found", publicIdentifier: request.body.publicIdentifier });
    }
    const rpc = constructRpcRequest(ChannelRpcMethods.chan_setup, {
      chainId: request.body.chainId,
      counterpartyIdentifier: request.body.counterpartyIdentifier,
      timeout: request.body.timeout,
    });
    try {
      const res = await engine.request<"chan_setup">(rpc);
      return reply.status(200).send(res);
    } catch (e) {
      logger.error({ message: e.message, stack: e.stack, context: e.context });
      return reply.status(500).send({ message: e.message, context: e.context });
    }
  },
);

server.post<{ Body: ServerNodeParams.RequestSetup }>(
  "/request-setup",
  { schema: { body: ServerNodeParams.RequestSetupSchema, response: ServerNodeResponses.RequestSetupSchema } },
  async (request, reply) => {
    const engine = getNode(request.body.bobIdentifier);
    if (!engine) {
      return reply.status(400).send({ message: "Node not found", publicIdentifier: request.body.bobIdentifier });
    }
    try {
      const setupPromise = engine.waitFor(
        EngineEvents.SETUP,
        10_000,
        data => data.bobIdentifier === engine.publicIdentifier && data.chainId === request.body.chainId,
      );
      await Axios.post(`${request.body.aliceUrl}/setup`, {
        chainId: request.body.chainId,
        counterpartyIdentifier: engine.publicIdentifier,
        timeout: request.body.timeout,
        meta: request.body.meta,
        publicIdentifier: request.body.aliceIdentifier,
      } as ServerNodeParams.Setup);
      const setup = await setupPromise;
      return reply.status(200).send({ channelAddress: setup.channelAddress } as ServerNodeResponses.RequestSetup);
    } catch (e) {
      logger.error({ message: e.message, stack: e.stack, context: e.context });
      return reply.status(500).send({ message: e.message, context: e.context });
    }
  },
);

server.post<{ Body: ServerNodeParams.SendDepositTx }>(
  "/send-deposit-tx",
  { schema: { body: ServerNodeParams.SendDepositTxSchema, response: ServerNodeResponses.SendDepositTxSchema } },
  async (request, reply) => {
    const chainService = getChainService(request.body.publicIdentifier);
    const engine = getNode(request.body.publicIdentifier);

    if (!engine || !chainService) {
      return reply.status(400).send({ message: "Node not found", publicIdentifier: request.body.publicIdentifier });
    }

    const channelState = await store.getChannelState(request.body.channelAddress);
    if (!channelState) {
      return reply.status(404).send({ message: "Channel not found" });
    }
    const depositRes = await chainService.sendDepositTx(
      channelState,
      engine.signerAddress,
      request.body.amount,
      request.body.assetId,
    );
    if (depositRes.isError) {
      if (depositRes.getError()!.message === ChainError.reasons.NotEnoughFunds) {
        return reply.status(400).send({ message: depositRes.getError()!.message });
      }
      return reply.status(500).send({ message: depositRes.getError()!.message.substring(0, 100) });
    }
    return reply.status(200).send({ txHash: depositRes.getValue().hash });
  },
);

server.post<{ Body: ServerNodeParams.Deposit }>(
  "/deposit",
  { schema: { body: ServerNodeParams.DepositSchema, response: ServerNodeResponses.DepositSchema } },
  async (request, reply) => {
    const engine = getNode(request.body.publicIdentifier);
    if (!engine) {
      return reply.status(400).send({ message: "Node not found", publicIdentifier: request.body.publicIdentifier });
    }

    const rpc = constructRpcRequest(ChannelRpcMethods.chan_deposit, {
      assetId: request.body.assetId,
      channelAddress: request.body.channelAddress,
    });
    try {
      const res = await engine.request<"chan_deposit">(rpc);
      return reply.status(200).send(res);
    } catch (e) {
      logger.error({ message: e.message, stack: e.stack, context: e.context });
      return reply.status(500).send({ message: e.message, context: e.context });
    }
  },
);

server.post<{ Body: ServerNodeParams.ConditionalTransfer }>(
  "/hashlock-transfer/create",
  {
    schema: {
      body: ServerNodeParams.ConditionalTransferSchema,
      response: ServerNodeResponses.ConditionalTransferSchema,
    },
  },
  async (request, reply) => {
    const engine = getNode(request.body.publicIdentifier);
    if (!engine) {
      return reply.status(400).send({ message: "Node not found", publicIdentifier: request.body.publicIdentifier });
    }

    const rpc = constructRpcRequest(ChannelRpcMethods.chan_createTransfer, request.body);
    try {
      const res = await engine.request<"chan_createTransfer">(rpc);
      return reply.status(200).send({
        channelAddress: res.channelAddress,
        transferId: (res.latestUpdate.details as CreateUpdateDetails).transferId,
        routingId: (res.latestUpdate.details as CreateUpdateDetails).meta?.routingId,
      } as ServerNodeResponses.ConditionalTransfer);
    } catch (e) {
      logger.error({ message: e.message, stack: e.stack, context: e.context });
      return reply.status(500).send({ message: e.message, context: e.context });
    }
  },
);

server.post<{ Body: ServerNodeParams.ResolveTransfer }>(
  "/hashlock-transfer/resolve",
  {
    schema: {
      body: ServerNodeParams.ResolveTransferSchema,
      response: ServerNodeResponses.ResolveTransferSchema,
    },
  },
  async (request, reply) => {
    const engine = getNode(request.body.publicIdentifier);
    if (!engine) {
      return reply.status(400).send({ message: "Node not found", publicIdentifier: request.body.publicIdentifier });
    }
    const rpc = constructRpcRequest(ChannelRpcMethods.chan_resolveTransfer, request.body);
    try {
      const res = await engine.request<"chan_resolveTransfer">(rpc);
      return reply.status(200).send({
        channelAddress: res.channelAddress,
        transferId: (res.latestUpdate.details as ResolveUpdateDetails).transferId,
      } as ServerNodeResponses.ResolveTransfer);
    } catch (e) {
      logger.error({ message: e.message, stack: e.stack, context: e.context });
      return reply.status(500).send({ message: e.message, context: e.context });
    }
  },
);

server.post<{ Body: ServerNodeParams.Withdraw }>(
  "/withdraw",
  {
    schema: {
      body: ServerNodeParams.WithdrawSchema,
      response: ServerNodeResponses.WithdrawSchema,
    },
  },
  async (request, reply) => {
    const engine = getNode(request.body.publicIdentifier);
    if (!engine) {
      return reply.status(400).send({ message: "Node not found", publicIdentifier: request.body.publicIdentifier });
    }
    const rpc = constructRpcRequest(ChannelRpcMethods.chan_withdraw, request.body);
    try {
      const { channel, transactionHash } = await engine.request<typeof ChannelRpcMethods.chan_withdraw>(rpc);
      return reply.status(200).send({
        channelAddress: channel.channelAddress,
        transferId: (channel.latestUpdate.details as ResolveUpdateDetails).transferId,
        transactionHash,
      } as ServerNodeResponses.Withdraw);
    } catch (e) {
      logger.error({ message: e.message, stack: e.stack, context: e.context });
      return reply.status(500).send({ message: e.message, context: e.context });
    }
  },
);

server.post<{ Body: ServerNodeParams.RegisterListener }>(
  "/event/subscribe",
  {
    schema: {
      body: ServerNodeParams.RegisterListenerSchema,
      response: ServerNodeResponses.RegisterListenerSchema,
    },
  },
  async (request, reply) => {
    try {
      await Promise.all(
        Object.entries(request.body).map(([eventName, url]) =>
          store.registerSubscription(eventName as EngineEvent, url as string),
        ),
      );
      logger.info({ endpoint: "/event/subscribe", body: request.body }, "Successfully set up subscriptions");
      return reply.status(200).send({ message: "success" });
    } catch (e) {
      return reply.status(500).send({ message: e.message });
    }
  },
);

server.get<{ Params: ServerNodeParams.GetListener }>(
  "/event/:eventName",
  {
    schema: {
      params: ServerNodeParams.GetListenerSchema,
      response: ServerNodeResponses.GetListenerSchema,
    },
  },
  async (request, reply) => {
    const url = await store.getSubscription(request.params.eventName as EngineEvent);
    if (!url) {
      return reply.status(404).send({ message: "Subscription URL not found" });
    }
    return reply.status(200).send({ url });
  },
);

server.get(
  "/event",
  {
    schema: {
      response: ServerNodeResponses.GetListenersSchema,
    },
  },
  async (request, reply) => {
    const subs = await store.getSubscriptions();
    return reply.status(200).send(subs);
  },
);

server.post<{ Body: ServerNodeParams.Admin }>(
  "/clear-store",
  { schema: { body: ServerNodeParams.AdminSchema, response: ServerNodeResponses.AdminSchema } },
  async (request, reply) => {
    if (request.body.adminToken !== config.adminToken) {
      return reply.status(401).send({ message: "Unauthorized" });
    }
    try {
      await store.clear();
      return reply.status(200).send({ message: "success" });
    } catch (e) {
      return reply.status(500).send({ message: e.message });
    }
  },
);

server.post<{ Body: ServerNodeParams.CreateNode }>(
  "/node",
  { schema: { body: ServerNodeParams.CreateNodeSchema, response: ServerNodeResponses.CreateNodeSchema } },
  async (request, reply) => {
    try {
      const newNode = await createNode(request.body.index);
      return reply.status(200).send({
        index: request.body.index,
        publicIdentifier: newNode.publicIdentifier,
        signerAddress: newNode.signerAddress,
      } as ServerNodeResponses.CreateNode);
    } catch (e) {
      return reply.status(500).send({ message: e.message });
    }
  },
);

const JsonRpcRequestSchema = Type.Object({
  method: Type.String(),
  params: Type.Any(),
});
type JsonRpcRequest = Static<typeof JsonRpcRequestSchema>;

server.post<{ Params: { chainId: string }; Body: JsonRpcRequest }>(
  "/ethprovider/:chainId",
  { schema: { body: JsonRpcRequestSchema } },
  async (request, reply) => {
    const provider = _providers[request.params.chainId];
    if (!provider) {
      return reply
        .status(400)
        .send({ message: "Provider not configured for chainId", chainId: request.params.chainId });
    }
    try {
      const result = await provider.send(request.body.method, request.body.params);
      return reply.status(200).send({ result });
    } catch (e) {
      return reply.status(500).send({ message: e.message });
    }
  },
);

server.listen(8000, "0.0.0.0", (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
