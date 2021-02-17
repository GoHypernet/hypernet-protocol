import PostmateApi from "@merchant-iframe/implementations/api/PostmateApi";
import { IMerchantConnectorRepository } from "@merchant-iframe/interfaces/data";
import { IContextProvider } from "@merchant-iframe/interfaces/utils";
import { MerchantConnectorRepository } from "@merchant-iframe/implementations/data";
import { ContextProvider } from "@merchant-iframe/implementations/utils";
import { MerchantService } from "@merchant-iframe/implementations/business/MerchantService";
import { IMerchantService } from "@merchant-iframe/interfaces/business";
import { IMerchantIFrameApi } from "@merchant-iframe/interfaces/api";
import { IAjaxUtils, AxiosAjaxUtils } from "@hypernetlabs/utils";

export class MerchantIframe {
  public contextProvider: IContextProvider;
  public ajaxUtils: IAjaxUtils;

  public merchantConnectorRepository: IMerchantConnectorRepository;

  public merchantService: IMerchantService;

  public merchantIframeApi: IMerchantIFrameApi;

  constructor() {
    // First step, get the mediator URL from the iframe params
    const urlParams = new URLSearchParams(window.location.search);
    const merchantUrl = urlParams.get("merchantUrl");

    if (merchantUrl == null) {
      throw new Error("Must provide merchantURL parameter!");
    }

    // Instantiate all the pieces
    this.contextProvider = new ContextProvider(new URL(merchantUrl));
    this.ajaxUtils = new AxiosAjaxUtils();

    this.merchantConnectorRepository = new MerchantConnectorRepository(this.ajaxUtils);

    this.merchantService = new MerchantService(this.merchantConnectorRepository, this.contextProvider);

    this.merchantIframeApi = new PostmateApi(this.merchantService, this.contextProvider);

    // Since this iframe is supposed to host a merchant connector, first things first, let's validate the merchant's connector
    this.merchantService.validateMerchantConnector();

    this.merchantIframeApi.activateModel();
  }
}
