import { ContainerModule, interfaces } from "inversify";

import {
  AccountsRepository,
  GatewayConnectorRepository,
  NatsMessagingRepository,
  PaymentRepository,
  RouterRepository,
  LinkRepository,
  GovernanceRepository,
  RegistryRepository,
  GatewayRegistrationRepository,
} from "@implementations/data";

import {
  IAccountsRepository,
  IAccountsRepositoryType,
  ILinkRepository,
  ILinkRepositoryType,
  IGatewayConnectorRepository,
  IGatewayConnectorRepositoryType,
  IMessagingRepository,
  IMessagingRepositoryType,
  IPaymentRepository,
  IPaymentRepositoryType,
  IRouterRepository,
  IRouterRepositoryType,
  IGatewayRegistrationRepository,
  IGatewayRegistrationRepositoryType,
  IGovernanceRepository,
  IGovernanceRepositoryType,
  IRegistryRepository,
  IRegistryRepositoryType,
} from "@interfaces/data";

export const dataModule = new ContainerModule(
  (
    bind: interfaces.Bind,
    _unbind: interfaces.Unbind,
    _isBound: interfaces.IsBound,
    _rebind: interfaces.Rebind,
  ) => {
    bind<IAccountsRepository>(IAccountsRepositoryType)
      .to(AccountsRepository)
      .inRequestScope();
    bind<IGatewayConnectorRepository>(IGatewayConnectorRepositoryType)
      .to(GatewayConnectorRepository)
      .inRequestScope();
    bind<IMessagingRepository>(IMessagingRepositoryType)
      .to(NatsMessagingRepository)
      .inRequestScope();
    bind<IPaymentRepository>(IPaymentRepositoryType)
      .to(PaymentRepository)
      .inRequestScope();
    bind<IRouterRepository>(IRouterRepositoryType)
      .to(RouterRepository)
      .inRequestScope();
    bind<ILinkRepository>(ILinkRepositoryType)
      .to(LinkRepository)
      .inRequestScope();
    bind<IGovernanceRepository>(IGovernanceRepositoryType)
      .to(GovernanceRepository)
      .inRequestScope();
    bind<IRegistryRepository>(IRegistryRepositoryType)
      .to(RegistryRepository)
      .inRequestScope();
    bind<IGatewayRegistrationRepository>(IGatewayRegistrationRepositoryType)
      .to(GatewayRegistrationRepository)
      .inRequestScope();
  },
);
