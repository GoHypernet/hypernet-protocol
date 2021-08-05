import { IBasicMessaging } from "@connext/vector-types";
import { NatsBasicMessagingService } from "@connext/vector-utils";
import { JsonWebToken, MessagingError } from "@hypernetlabs/objects";
import { ResultUtils } from "@hypernetlabs/utils";
import {
  IAjaxUtils,
  IAjaxUtilsType,
} from "@web-integration/../../utils/src/IAjaxUtils";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import {
  IBrowserNodeProvider,
  IConfigProvider,
  IConfigProviderType,
  IMessagingProvider,
  IBrowserNodeProviderType,
  IContextProviderType,
  IContextProvider,
} from "@interfaces/utilities";

@injectable()
export class MessagingProvider implements IMessagingProvider {
  protected initializeResult:
    | ResultAsync<IBasicMessaging, MessagingError>
    | undefined;

  constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IBrowserNodeProviderType)
    protected browserNodeProvider: IBrowserNodeProvider,
    @inject(IAjaxUtilsType) protected ajaxUtils: IAjaxUtils,
  ) {}

  public getBasicMessaging(): ResultAsync<IBasicMessaging, MessagingError> {
    if (this.initializeResult != null) {
      return this.initializeResult;
    }

    this.initializeResult = ResultUtils.combine([
      this.configProvider.getConfig(),
      this.getBearerToken(),
    ]).andThen((vals) => {
      const [config, bearerToken] = vals;
      const basicMessaging = new NatsBasicMessagingService({
        authUrl: config.authUrl,
        natsUrl: config.natsUrl,
        bearerToken: bearerToken,
      });

      return ResultAsync.fromPromise(basicMessaging.connect(), (e) => {
        return new MessagingError("Unable to connect to NATS", e);
      }).map(() => {
        return basicMessaging;
      });
    });

    return this.initializeResult;
  }

  protected getBearerToken(): ResultAsync<JsonWebToken, never> {
    //         return this.ajaxUtils.get(`${authUrl}/auth/${signer.publicIdentifier}`)
    //         const nonceResponse = await axios.get(`${authUrl}/auth/${signer.publicIdentifier}`);
    //   const nonce = nonceResponse.data;
    //   const sig = await signer.signMessage(nonce);
    //   const verifyResponse: AxiosResponse<string> = await axios.post(`${authUrl}/auth`, {
    //     sig,
    //     userIdentifier: signer.publicIdentifier,
    //   });
    //   return verifyResponse.data;

    //         return this.browserNodeProvider.getBrowserNode().andThen((browserNode) => {
    //             return browserNode.signChannelMessage(message);
    //           });
    return okAsync(JsonWebToken(""));
  }
}
