import { PostmateApi, MerchantConnectorListener } from "@merchant-iframe/implementations/api";
import { IMerchantConnectorRepository, IPersistenceRepository } from "@merchant-iframe/interfaces/data";
import { IContextProvider } from "@merchant-iframe/interfaces/utils";
import { MerchantConnectorRepository, PersistenceRepository } from "@merchant-iframe/implementations/data";
import { ContextProvider } from "@merchant-iframe/implementations/utils";
import { MerchantService } from "@merchant-iframe/implementations/business";
import { IMerchantService } from "@merchant-iframe/interfaces/business";
import { IMerchantConnectorListener, IMerchantIFrameApi } from "@merchant-iframe/interfaces/api";
import { IAjaxUtils, AxiosAjaxUtils, LocalStorageUtils, ILocalStorageUtils } from "@hypernetlabs/utils";

export class MerchantIframe {
  protected contextProvider: IContextProvider;
  protected ajaxUtils: IAjaxUtils;
  protected localStorageUtils: ILocalStorageUtils;

  protected merchantConnectorRepository: IMerchantConnectorRepository;
  protected persistenceRepository: IPersistenceRepository;

  protected merchantService: IMerchantService;

  protected merchantIframeApi: IMerchantIFrameApi;
  protected merchantConnectorListener: IMerchantConnectorListener;

  constructor() {
    // Instantiate all the pieces
    this.contextProvider = new ContextProvider("");
    this.ajaxUtils = new AxiosAjaxUtils();
    this.localStorageUtils = new LocalStorageUtils();

    this.merchantConnectorRepository = new MerchantConnectorRepository(this.ajaxUtils);
    this.persistenceRepository = new PersistenceRepository(this.localStorageUtils);

    this.merchantService = new MerchantService(
      this.merchantConnectorRepository,
      this.persistenceRepository,
      this.contextProvider,
    );

    this.merchantIframeApi = new PostmateApi(this.merchantService, this.contextProvider);
    this.merchantConnectorListener = new MerchantConnectorListener(this.contextProvider, this.merchantService);

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

        // We're ready to answer questions about the connector, we can activate the API
        // Note, it would be better to have a waitForValidated() function down lower so that the API
        // can be activated immediately.
        return this.merchantIframeApi.activateModel();
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
      .mapErr((e) => {
        console.log(e);
      });
  }
}
