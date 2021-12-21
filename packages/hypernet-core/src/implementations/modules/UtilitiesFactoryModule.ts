import { ContainerModule, interfaces } from "inversify";

import {
  GatewayConnectorProxyFactory,
  BrowserNodeFactory,
  InternalProviderFactory,
  NonFungibleRegistryContractFactory,
} from "@implementations/utilities/factory";

import {
  IBrowserNodeFactory,
  IBrowserNodeFactoryType,
  IInternalProviderFactory,
  IInternalProviderFactoryType,
  IGatewayConnectorProxyFactory,
  IGatewayConnectorProxyFactoryType,
  INonFungibleRegistryContractFactory,
  INonFungibleRegistryContractFactoryType,
} from "@interfaces/utilities/factory";

export const utilitiesFactoryModule = new ContainerModule(
  (
    bind: interfaces.Bind,
    _unbind: interfaces.Unbind,
    _isBound: interfaces.IsBound,
    _rebind: interfaces.Rebind,
  ) => {
    bind<IGatewayConnectorProxyFactory>(IGatewayConnectorProxyFactoryType)
      .to(GatewayConnectorProxyFactory)
      .inRequestScope();
    bind<IBrowserNodeFactory>(IBrowserNodeFactoryType)
      .to(BrowserNodeFactory)
      .inRequestScope();
    bind<IInternalProviderFactory>(IInternalProviderFactoryType)
      .to(InternalProviderFactory)
      .inRequestScope();
    bind<INonFungibleRegistryContractFactory>(
      INonFungibleRegistryContractFactoryType,
    )
      .to(NonFungibleRegistryContractFactory)
      .inRequestScope();
  },
);
