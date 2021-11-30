import {
  EPaymentType,
  ETransferType,
  UnixTimestamp,
  IBasicTransferResponse,
  Signature,
  ETransferState,
  BigNumberString,
  IHypernetOfferDetails,
} from "@hypernetlabs/objects";
import {
  activeInsuranceTransfer,
  activeOfferTransfer,
  activeParameterizedTransfer,
  chainId,
  commonAmount,
  commonPaymentId,
  defaultExpirationLength,
  erc20AssetAddress,
  expirationDate,
  gatewayAddress,
  gatewaySignature,
  gatewayUrl,
  governanceChainInformation,
  insuranceTransferId,
  offerTransferId,
  parameterizedTransferId,
  publicIdentifier,
  publicIdentifier2,
  routerChannelAddress,
  routerPublicIdentifier,
  unixNow,
} from "@mock/mocks";
import { okAsync } from "neverthrow";
import td from "testdouble";

import { IVectorUtils } from "@interfaces/utilities";

export class VectorUtilsMockFactory {
  static factoryVectorUtils(): IVectorUtils {
    const vectorUtils = td.object<IVectorUtils>();

    td.when(
      vectorUtils.getTransferTypeWithTransfer(
        td.matchers.contains({ transferId: offerTransferId }),
      ),
    ).thenReturn(
      okAsync({
        transferType: ETransferType.Offer,
        transfer: activeOfferTransfer,
      }),
    );
    td.when(
      vectorUtils.getTransferTypeWithTransfer(
        td.matchers.contains({ transferId: insuranceTransferId }),
      ),
    ).thenReturn(
      okAsync({
        transferType: ETransferType.Insurance,
        transfer: activeInsuranceTransfer,
      }),
    );
    td.when(
      vectorUtils.getTransferTypeWithTransfer(
        td.matchers.contains({ transferId: parameterizedTransferId }),
      ),
    ).thenReturn(
      okAsync({
        transferType: ETransferType.Parameterized,
        transfer: activeParameterizedTransfer,
      }),
    );

    td.when(
      vectorUtils.createOfferTransfer(
        routerChannelAddress,
        publicIdentifier2,
        td.matchers.contains({
          paymentId: commonPaymentId,
          routerPublicIdentifier: routerPublicIdentifier,
          chainId: chainId,
          creationDate: unixNow,
          to: publicIdentifier2,
          from: publicIdentifier,
          requiredStake: commonAmount.toString(),
          paymentAmount: commonAmount.toString(),
          expirationDate,
          paymentToken: erc20AssetAddress,
          gatewayUrl: gatewayUrl,
        } as IHypernetOfferDetails),
      ),
    ).thenReturn(
      okAsync({
        channelAddress: routerChannelAddress,
        transferId: offerTransferId,
      }),
    );

    td.when(
      vectorUtils.resolveParameterizedTransfer(
        parameterizedTransferId,
        commonPaymentId,
        commonAmount,
      ),
    ).thenReturn(
      okAsync({
        channelAddress: routerChannelAddress,
        transferId: parameterizedTransferId,
      }),
    );

    td.when(
      vectorUtils.createInsuranceTransfer(
        routerChannelAddress,
        governanceChainInformation,
        publicIdentifier,
        gatewayAddress,
        commonAmount,
        // This expiration date is not the standard one. PaymentRepository calculates
        // a new expiration date for the payment based on the current blocktime
        // when the new transfer is created.
        UnixTimestamp(unixNow + defaultExpirationLength),
        commonPaymentId,
      ),
    ).thenReturn(
      okAsync({
        channelAddress: routerChannelAddress,
        transferId: insuranceTransferId,
      }),
    );

    td.when(
      vectorUtils.createParameterizedTransfer(
        routerChannelAddress,
        EPaymentType.Push,
        publicIdentifier2,
        commonAmount,
        erc20AssetAddress,
        commonPaymentId,
        UnixTimestamp(unixNow - 1),
        UnixTimestamp(unixNow + defaultExpirationLength),
        undefined,
        undefined,
      ),
    ).thenReturn(
      okAsync({
        channelAddress: routerChannelAddress,
        transferId: parameterizedTransferId,
      }),
    );

    td.when(
      vectorUtils.resolveInsuranceTransfer(
        insuranceTransferId,
        commonPaymentId,
        null,
        BigNumberString("0"),
      ),
    ).thenReturn(okAsync({} as IBasicTransferResponse));

    td.when(
      vectorUtils.resolveInsuranceTransfer(
        insuranceTransferId,
        commonPaymentId,
        Signature(gatewaySignature),
        BigNumberString("1"),
      ),
    ).thenReturn(okAsync({} as IBasicTransferResponse));

    td.when(
      vectorUtils.getTransferStateFromTransfer(
        td.matchers.contains({ transferId: offerTransferId }),
      ),
    ).thenReturn(okAsync(ETransferState.Active));
    td.when(
      vectorUtils.getTransferStateFromTransfer(
        td.matchers.contains({ transferId: insuranceTransferId }),
      ),
    ).thenReturn(okAsync(ETransferState.Active));
    td.when(
      vectorUtils.getTransferStateFromTransfer(
        td.matchers.contains({ transferId: parameterizedTransferId }),
      ),
    ).thenReturn(okAsync(ETransferState.Active));

    td.when(
      vectorUtils.getTransferType(
        td.matchers.contains({ transferId: offerTransferId }),
      ),
    ).thenReturn(okAsync(ETransferType.Offer));
    td.when(
      vectorUtils.getTransferType(
        td.matchers.contains({ transferId: insuranceTransferId }),
      ),
    ).thenReturn(okAsync(ETransferType.Insurance));
    td.when(
      vectorUtils.getTransferType(
        td.matchers.contains({ transferId: parameterizedTransferId }),
      ),
    ).thenReturn(okAsync(ETransferType.Parameterized));

    td.when(
      vectorUtils.getTimestampFromTransfer(
        td.matchers.contains({ transferId: offerTransferId }),
      ),
    ).thenReturn(UnixTimestamp(unixNow - 1) as never);
    td.when(
      vectorUtils.getTimestampFromTransfer(
        td.matchers.contains({ transferId: insuranceTransferId }),
      ),
    ).thenReturn(UnixTimestamp(unixNow - 1) as never);
    td.when(
      vectorUtils.getTimestampFromTransfer(
        td.matchers.contains({ transferId: parameterizedTransferId }),
      ),
    ).thenReturn(UnixTimestamp(unixNow - 1) as never);

    td.when(vectorUtils.getAllActiveTransfers()).thenReturn(
      okAsync([activeOfferTransfer]),
    );

    return vectorUtils;
  }
}
