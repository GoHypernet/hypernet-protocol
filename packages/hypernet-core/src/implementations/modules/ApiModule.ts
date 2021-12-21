import { ContainerModule, interfaces } from "inversify";

import {
  BlockchainListener,
  GatewayConnectorListener,
  NatsMessagingListener,
  VectorAPIListener,
} from "@implementations/api";

import {
  IBlockchainListener,
  IBlockchainListenerType,
  IGatewayConnectorListener,
  IGatewayConnectorListenerType,
  IMessagingListener,
  IMessagingListenerType,
  IVectorListener,
  IVectorListenerType,
} from "@interfaces/api";

export const apiModule = new ContainerModule(
  (
    bind: interfaces.Bind,
    _unbind: interfaces.Unbind,
    _isBound: interfaces.IsBound,
    _rebind: interfaces.Rebind,
  ) => {
    bind<IBlockchainListener>(IBlockchainListenerType)
      .to(BlockchainListener)
      .inRequestScope();
    bind<IGatewayConnectorListener>(IGatewayConnectorListenerType)
      .to(GatewayConnectorListener)
      .inRequestScope();
    bind<IMessagingListener>(IMessagingListenerType)
      .to(NatsMessagingListener)
      .inRequestScope();
    bind<IVectorListener>(IVectorListenerType)
      .to(VectorAPIListener)
      .inRequestScope();
  },
);
