import { ContainerModule, interfaces } from "inversify";

import {
  AccountService,
  ControlService,
  DevelopmentService,
  LinkService,
  GatewayConnectorService,
  PaymentService,
  GovernanceService,
  RegistryService,
  TokenInformationService,
} from "@implementations/business";

import {
  IAccountService,
  IAccountServiceType,
  IControlService,
  IControlServiceType,
  IDevelopmentService,
  IDevelopmentServiceType,
  ILinkService,
  ILinkServiceType,
  IGatewayConnectorService,
  IGatewayConnectorServiceType,
  IPaymentService,
  IPaymentServiceType,
  IGovernanceService,
  IGovernanceServiceType,
  IRegistryService,
  IRegistryServiceType,
  ITokenInformationService,
  ITokenInformationServiceType,
} from "@interfaces/business";

export const businessModule = new ContainerModule(
  (
    bind: interfaces.Bind,
    _unbind: interfaces.Unbind,
    _isBound: interfaces.IsBound,
    _rebind: interfaces.Rebind,
  ) => {
    bind<IAccountService>(IAccountServiceType)
      .to(AccountService)
      .inRequestScope();
    bind<IControlService>(IControlServiceType)
      .to(ControlService)
      .inRequestScope();
    bind<IDevelopmentService>(IDevelopmentServiceType)
      .to(DevelopmentService)
      .inRequestScope();
    bind<ILinkService>(ILinkServiceType).to(LinkService).inRequestScope();
    bind<IGatewayConnectorService>(IGatewayConnectorServiceType)
      .to(GatewayConnectorService)
      .inRequestScope();
    bind<IPaymentService>(IPaymentServiceType)
      .to(PaymentService)
      .inRequestScope();
    bind<IGovernanceService>(IGovernanceServiceType)
      .to(GovernanceService)
      .inRequestScope();
    bind<IRegistryService>(IRegistryServiceType)
      .to(RegistryService)
      .inRequestScope();
    bind<ITokenInformationService>(ITokenInformationServiceType)
      .to(TokenInformationService)
      .inRequestScope();
  },
);
