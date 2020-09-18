export interface TimingResult {
    maxPayment: number;
    minPayment: number;
    meanPayment: number;
    maxConsecutivePayment: number;
    minConsecutivePayment: number;
    meanConsecutivePayment: number;
    paymentCalls: number;
    channels: number;
}
export declare class PerformanceTimer {
    private paymentCalls;
    private channelTimers;
    constructor(channelIds: string[], paymentCalls: number);
    start(channelId: string): void;
    stop(channelId: string): void;
    calculateResults(): TimingResult;
    static formatResults(results: TimingResult): string;
}
//# sourceMappingURL=timers.d.ts.map