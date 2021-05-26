import { MerchantUrl } from "@hypernetlabs/objects";
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
} from "@merchant-iframe/implementations/api";
import {
  DisplayService,
  MerchantService,
  PaymentService,
} from "@merchant-iframe/implementations/business";
import {
  HypernetCoreRepository,
  MerchantConnectorRepository,
  PersistenceRepository,
} from "@merchant-iframe/implementations/data";
import {
  IMerchantConnectorListener,
  IHypernetCoreListener,
} from "@merchant-iframe/interfaces/api";
import {
  IDisplayService,
  IMerchantService,
  IPaymentService,
} from "@merchant-iframe/interfaces/business";
import {
  IHypernetCoreRepository,
  IMerchantConnectorRepository,
  IPersistenceRepository,
} from "@merchant-iframe/interfaces/data";
import { okAsync } from "neverthrow";

import { ContextProvider } from "@merchant-iframe/implementations/utils";
import { IContextProvider } from "@merchant-iframe/interfaces/utils";

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
    this.contextProvider = new ContextProvider(MerchantUrl(""));
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
      .andThen((merchantUrl) => {
        // Set the merchant url
        const context = this.contextProvider.getMerchantContext();
        context.merchantUrl = merchantUrl;
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
