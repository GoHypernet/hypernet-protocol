import { ContainerModule, interfaces } from "inversify";

import {
  BrowserNodeProvider,
  ConfigProvider,
  ContextProvider,
  BlockchainProvider,
  LinkUtils,
  PaymentUtils,
  PaymentIdUtils,
  VectorUtils,
  EthersBlockchainUtils,
  CeramicUtils,
  MessagingProvider,
  BlockchainTimeUtils,
} from "@implementations/utilities";

import {
  IBlockchainProvider,
  IBlockchainUtils,
  IBlockchainUtilsType,
  IBrowserNodeProvider,
  IBrowserNodeProviderType,
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
  IBlockchainProviderType,
  ILinkUtils,
  ILinkUtilsType,
  IPaymentIdUtils,
  IPaymentIdUtilsType,
  IPaymentUtils,
  IPaymentUtilsType,
  IVectorUtils,
  IVectorUtilsType,
  ICeramicUtils,
  ICeramicUtilsType,
  IMessagingProvider,
  IMessagingProviderType,
  IBlockchainTimeUtils,
  IBlockchainTimeUtilsType,
} from "@interfaces/utilities";

export const utilitiesModule = new ContainerModule(
  (
    bind: interfaces.Bind,
    _unbind: interfaces.Unbind,
    _isBound: interfaces.IsBound,
    _rebind: interfaces.Rebind,
  ) => {
    bind<IBrowserNodeProvider>(IBrowserNodeProviderType)
      .to(BrowserNodeProvider)
      .inRequestScope();
    bind<IConfigProvider>(IConfigProviderType)
      .to(ConfigProvider)
      .inRequestScope();
    bind<IContextProvider>(IContextProviderType)
      .to(ContextProvider)
      .inRequestScope();
    bind<IBlockchainProvider>(IBlockchainProviderType)
      .to(BlockchainProvider)
      .inRequestScope();
    bind<ILinkUtils>(ILinkUtilsType).to(LinkUtils).inRequestScope();
    bind<IPaymentUtils>(IPaymentUtilsType).to(PaymentUtils).inRequestScope();
    bind<IPaymentIdUtils>(IPaymentIdUtilsType)
      .to(PaymentIdUtils)
      .inRequestScope();
    bind<IVectorUtils>(IVectorUtilsType).to(VectorUtils).inRequestScope();
    bind<IBlockchainUtils>(IBlockchainUtilsType)
      .to(EthersBlockchainUtils)
      .inRequestScope();
    bind<ICeramicUtils>(ICeramicUtilsType).to(CeramicUtils).inRequestScope();
    bind<IMessagingProvider>(IMessagingProviderType)
      .to(MessagingProvider)
      .inRequestScope();
    bind<IBlockchainTimeUtils>(IBlockchainTimeUtilsType)
      .to(BlockchainTimeUtils)
      .inRequestScope();
  },
);
