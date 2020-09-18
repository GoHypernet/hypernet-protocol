import Knex from 'knex';
export declare function setupMetrics(knex: Knex, metricsOutputFile: string): void;
export declare const timerFactory: (timingMetrics: boolean, prefix: string) => <T>(label: string, cb: () => Promise<T>) => Promise<T>;
export declare function recordFunctionMetrics<T>(objectOrFunction: T, timingMetrics?: boolean): T;
//# sourceMappingURL=metrics.d.ts.map