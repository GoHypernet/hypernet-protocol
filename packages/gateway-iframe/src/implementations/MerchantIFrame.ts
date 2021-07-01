import { GatewayUrl } from "@hypernetlabs/objects";
import {
  IAjaxUtils,
  AxiosAjaxUtils,
  LocalStorageUtils,
  ILocalStorageUtils,
  ILogUtils,
  LogUtils,
} from "@hypernetlabs/utils";
import {
  HypernetCoreListener,
  MerchantConnectorListener,
} from "@gateway-iframe/implementations/api";
import {
  DisplayService,
  MerchantService,
  PaymentService,
} from "@gateway-iframe/implementations/business";
import {
  HypernetCoreRepository,
  MerchantConnectorRepository,
  PersistenceRepository,
} from "@gateway-iframe/implementations/data";
import {
  IMerchantConnectorListener,
  IHypernetCoreListener,
} from "@gateway-iframe/interfaces/api";
import {
  IDisplayService,
  IMerchantService,
  IPaymentService,
} from "@gateway-iframe/interfaces/business";
import {
  IHypernetCoreRepository,
  IMerchantConnectorRepository,
  IPersistenceRepository,
} from "@gateway-iframe/interfaces/data";
import { okAsync } from "neverthrow";

import { ContextProvider } from "@gateway-iframe/implementations/utils";
import { IContextProvider } from "@gateway-iframe/interfaces/utils";

export class MerchantIframe {
  protected contextProvider: IContextProvider;
  protected ajaxUtils: IAjaxUtils;
  protected localStorageUtils: ILocalStorageUtils;
  protected logUtils: ILogUtils;

  protected merchantConnectorRepository: IMerchantConnectorRepository;
  protected persistenceRepository: IPersistenceRepository;
  protected hypernetCoreRepository: IHypernetCoreRepository;

  protected displayService: IDisplayService;
  protected merchantService: IMerchantService;
  protected paymentService: IPaymentService;

  protected hypernetCoreListener: IHypernetCoreListener;
  protected merchantConnectorListener: IMerchantConnectorListener;

  constructor() {
    // Instantiate all the pieces
    this.contextProvider = new ContextProvider(GatewayUrl(""));
    this.ajaxUtils = new AxiosAjaxUtils();
    this.localStorageUtils = new LocalStorageUtils();
    this.logUtils = new LogUtils();

    this.merchantConnectorRepository = new MerchantConnectorRepository(
      this.ajaxUtils,
    );
    this.persistenceRepository = new PersistenceRepository(
      this.localStorageUtils,
    );
    this.hypernetCoreRepository = new HypernetCoreRepository(
      this.contextProvider,
    );

    this.merchantService = new MerchantService(
      this.merchantConnectorRepository,
      this.persistenceRepository,
      this.hypernetCoreRepository,
      this.contextProvider,
    );
    this.paymentService = new PaymentService(this.hypernetCoreRepository);
    this.displayService = new DisplayService(this.hypernetCoreRepository);

    this.hypernetCoreListener = new HypernetCoreListener(
      this.merchantService,
      this.contextProvider,
    );
    this.merchantConnectorListener = new MerchantConnectorListener(
      this.contextProvider,
      this.merchantService,
      this.paymentService,
      this.displayService,
      this.logUtils,
    );

    this.merchantConnectorListener
      .initialize()
      .andThen(() => {
        return this.merchantService.getMerchantUrl();
      })
      .andThen((gatewayUrl) => {
        // Set the merchant url
        const context = this.contextProvider.getMerchantContext();
        context.gatewayUrl = gatewayUrl;
        this.contextProvider.setMerchantContext(context);

        // Start the Hypernet Core listener API up
        return this.hypernetCoreListener.activateModel();
      })
      .andThen(() => {
        // Now that we have a merchant URL, let's validate the merchant's connector
        return this.merchantService.validateMerchantConnector();
      })
      .andThen(() => {
        // Regardless of validation, we will try to auto-activate
        // the connector if it's eligible.
        return this.merchantService.autoActivateMerchantConnector();
      })
      .orElse((e) => {
        this.logUtils.error("Failure during merchant iframe initialization");
        this.logUtils.error(e);
        return okAsync(null);
      });
  }
}
