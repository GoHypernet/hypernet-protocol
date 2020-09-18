/// <reference types="node" />
import { ChildProcessWithoutNullStreams, ChildProcess } from 'child_process';
import Knex = require('knex');
import { Participant } from '@statechannels/wallet-core';
import { ServerWalletConfig } from '../src/config';
export declare const payerConfig: ServerWalletConfig;
export declare const receiverConfig: ServerWalletConfig;
export declare type ReceiverServer = {
    url: string;
    server: ChildProcessWithoutNullStreams | ChildProcess;
};
export declare const triggerPayments: (channelIds: string[], numPayments?: number | undefined) => Promise<void>;
export declare const startReceiverServer: () => ReceiverServer;
export declare const waitForServerToStart: (receiverServer: ReceiverServer, pingInterval?: number) => Promise<void>;
export declare const knexPayer: Knex;
export declare const knexReceiver: Knex;
export declare const killServer: ({ server }: ReceiverServer) => Promise<void>;
export declare function seedTestChannels(payer: Participant, payerPrivateKey: string, receiver: Participant, receiverPrivateKey: string, numOfChannels: number, knexPayer: Knex): Promise<string[]>;
export declare function getParticipant(participantId: string, privateKey: string): Participant;
//# sourceMappingURL=e2e-utils.d.ts.map