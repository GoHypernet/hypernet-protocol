import { BigNumber } from 'ethers';
export interface DepositedEvent {
    destination: string;
    amountDeposited: BigNumber;
    destinationHoldings: BigNumber;
}
export interface AssetTransferredEvent {
    channelId: string;
    destination: string;
    amount: BigNumber;
}
export declare function getDepositedEvent(eventResult: any[]): DepositedEvent;
export declare function getAssetTransferredEvent(eventResult: any[]): AssetTransferredEvent;
export declare function convertBytes32ToAddress(bytes32: string): string;
export declare function convertAddressToBytes32(address: string): string;
//# sourceMappingURL=asset-holder.d.ts.map