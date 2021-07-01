import { GatewayUrl } from "@hypernetlabs/objects";
import {
  IAjaxUtils,
  AxiosAjaxUtils,
  LocalStorageUtils,
  ILocalStorageUtils,
  ILogUtils,
  LogUtils,
} from "@hypernetlabs/utils";
import { okAsync } from "neverthrow";

import {
  HypernetCoreListener,
  GatewayConnectorListener,
} from "@gateway-iframe/implementations/api";
import {
  DisplayService,
  GatewayService,
  PaymentService,
} from "@gateway-iframe/implementations/business";
import {
  HypernetCoreRepository,
  GatewayConnectorRepository,
  PersistenceRepository,
} from "@gateway-iframe/implementations/data";
import { ContextProvider } from "@gateway-iframe/implementations/utils";
import {
  IGatewayConnectorListener,
  IHypernetCoreListener,
} from "@gateway-iframe/interfaces/api";
import {
  IDisplayService,
  IGatewayService,
  IPaymentService,
} from "@gateway-iframe/interfaces/business";
import {
  IHypernetCoreRepository,
  IGatewayConnectorRepository,
  IPersistenceRepository,
} from "@gateway-iframe/interfaces/data";
import { IContextProvider } from "@gateway-iframe/interfaces/utils";

export class GatewayIFrame {
  protected contextProvider: IContextProvider;
  protected ajaxUtils: IAjaxUtils;
  protected localStorageUtils: ILocalStorageUtils;
  protected logUtils: ILogUtils;

  protected gatewayConnectorRepository: IGatewayConnectorRepository;
  protected persistenceRepository: IPersistenceRepository;
  protected hypernetCoreRepository: IHypernetCoreRepository;

  protected displayService: IDisplayService;
  protected gatewayService: IGatewayService;
  protected paymentService: IPaymentService;

  protected hypernetCoreListener: IHypernetCoreListener;
  protected gatewayConnectorListener: IGatewayConnectorListener;

  constructor() {
    // Instantiate all the pieces
    this.contextProvider = new ContextProvider(GatewayUrl(""));
    this.ajaxUtils = new AxiosAjaxUtils();
    this.localStorageUtils = new LocalStorageUtils();
    this.logUtils = new LogUtils();

    this.gatewayConnectorRepository = new GatewayConnectorRepository(
      this.ajaxUtils,
    );
    this.persistenceRepository = new PersistenceRepository(
      this.localStorageUtils,
    );
    this.hypernetCoreRepository = new HypernetCoreRepository(
      this.contextProvider,
    );

    this.gatewayService = new GatewayService(
      this.gatewayConnectorRepository,
      this.persistenceRepository,
      this.hypernetCoreRepository,
      this.contextProvider,
    );
    this.paymentService = new PaymentService(this.hypernetCoreRepository);
    this.displayService = new DisplayService(this.hypernetCoreRepository);

    this.hypernetCoreListener = new HypernetCoreListener(
      this.gatewayService,
      this.contextProvider,
    );
    this.gatewayConnectorListener = new GatewayConnectorListener(
      this.contextProvider,
      this.gatewayService,
      this.paymentService,
      this.displayService,
      this.logUtils,
    );

    this.gatewayConnectorListener
      .initialize()
      .andThen(() => {
        return this.gatewayService.getGatewayUrl();
      })
      .andThen((gatewayUrl) => {
        // Set the gateway url
        const context = this.contextProvider.getGatewayContext();
        context.gatewayUrl = gatewayUrl;
        this.contextProvider.setGatewayContext(context);

        // Start the Hypernet Core listener API up
        return this.hypernetCoreListener.activateModel();
      })
      .andThen(() => {
        // Now that we have a gateway URL, let's validate the gateway's connector
        return this.gatewayService.validateGatewayConnector();
      })
      .andThen(() => {
        // Regardless of validation, we will try to auto-activate
        // the connector if it's eligible.
        return this.gatewayService.autoActivateGatewayConnector();
      })
      .orElse((e) => {
        this.logUtils.error("Failure during gateway iframe initialization");
        this.logUtils.error(e);
        return okAsync(null);
      });
  }
}
