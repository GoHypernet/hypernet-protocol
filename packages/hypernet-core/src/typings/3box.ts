// Type definitions for 3box 1.7
// Project: https://github.com/3box/3box-js
// Definitions by: KuhnChris <https://github.com/kuhnchris>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

// tslint:disable: class-name
// tslint:disable: max-classes-per-file
declare module "3box" {
  import { provider } from "web3-core";

  export interface BoxVerified {
    Verified: () => BoxVerified;
    DID: () => string;
    github: () => any;
    addGithub: (gistUrl: string) => any;
    twitter: () => any;
    addTwitter: (claim: string) => any;
    email: () => any;
    addEmail: (claim: string) => any;
  }
  export interface BoxThreadOpts_getPosts {
    gt?: string;
    gte?: string;
    lt?: string;
    lte?: string;
    limit?: number;
    reverse?: boolean;
  }
  export class BoxThreadPost {
    author: string;
    message: string;
    postId: string;
    timestamp: number;
  }

  export class BoxThread {
    /// Returns the postID of the new post
    post(message: string, to?: string): Promise<string>;
    getPosts(opts?: BoxThreadOpts_getPosts): Promise<BoxThreadPost[]>;
    addMember(address: string): Promise<void>;
    address: string;
    onUpdate(cb: (post: BoxThreadPost) => void): void;
    deletePost(id: string): Promise<void>;
  }
  export interface BoxSpaceOpts_joinThread {
    noAutoSub?: boolean;
  }
  export class BoxSpace {
    public: BoxKeyValueStore;
    private: BoxKeyValueStore;
    joinThread(name: string, opts?: BoxSpaceOpts_joinThread): Promise<BoxThread>;
    joinThreadByAddress(threadAddress: string): Promise<BoxThread>;
    subscribeThread: (name: string) => undefined;
    unsubscribeThread: (name: string) => undefined;
    subscribedThreads: () => string[];
    syncDone: Promise<void>;
    createThread(threadName: string): Promise<BoxThread>;
    createConfidentialThread(threadName: string): Promise<BoxThread>;
  }
  export interface BoxKeyValueStoreMetadata {
    // missing definition
    dummy: boolean;
  }

  export class BoxLogEntry {
    public op: string;
    public key: string;
    public value: string;
    public timestamp: string;
  }

  export class BoxKeyValueStore {
    log(): Promise<BoxLogEntry[]>;
    get(key: string): Promise<string>;
    getMetadata: (key: string) => BoxKeyValueStoreMetadata | undefined;
    set(key: string, value: string): Promise<boolean>;
    setMultiple(keys: string[], values: string[]): Promise<boolean>;
    remove(key: string): Promise<boolean>;
  }

  export interface BoxIsMuportDIDReturn {
    // missing definition
    dummy: boolean;
  }

  export class BoxStaticIdUtils {
    verifyClaim: () => any;
    isMuportDID: (address: any) => BoxIsMuportDIDReturn | boolean;
    isClaim: (claim: any, opts: any) => Promise<boolean>;
  }
  export interface BoxObjectOpts_OpenSpace {
    consentCallback?: () => void;
    onSyncDone?: () => void;
  }
  export interface BoxObjectOpts_GetProfile {
    addressServer?: string;
    ipfs?: any; // ipfs object
    useCacheService?: boolean;
    profileServer?: string;
  }
  export interface BoxObjectOpts_GetProfiles {
    profileServer?: string;
  }
  export interface BoxObjectOpts_GetSpace {
    profileServer?: string;
    metadata?: string;
  }
  export interface BoxObjectOpts_GetThread {
    profileServer?: string;
  }
  export interface BoxObjectOpts_ListSpaces {
    profileServer?: string;
  }
  export interface BoxObjectOpts_profileGraphQL {
    graphqlServer?: string;
  }
  export interface BoxObjectOpts_openBox {
    consentCallback?: () => any;
    pinningNode?: string;
    ipfs?: any; // ipfsobj
    addressServer?: string;
  }

  export interface AuthAddressObject {
    address: string;
  }

  export class BoxInstance {
    public: BoxKeyValueStore;
    private: BoxKeyValueStore;
    verified: BoxVerified;
    spaces: any;
    openSpace(name: string, opts?: BoxObjectOpts_OpenSpace): Promise<BoxSpace>;
    auth(spaces: string[], address: AuthAddressObject): Promise<void>;
    onSyncDone(cb: () => void): void;
    syncDone: Promise<void>;
    logout(): Promise<void>;
    getThread(): Promise<BoxThread>;
    getThreadByAddress(address: string): Promise<BoxThread>;
  }

  export const idUtils: BoxStaticIdUtils;
  export function getProfile(address: any, opts?: BoxObjectOpts_GetProfile): Promise<any>;
  export function getProfiles(address: any[], opts?: BoxObjectOpts_GetProfiles): undefined;
  export function getSpace(address: any, name: any, opts?: BoxObjectOpts_GetSpace): undefined;
  export function getThread(space: any, name: any, opts?: BoxObjectOpts_GetThread): string[];
  export function listSpaces(address: any, opts?: BoxObjectOpts_ListSpaces): undefined;
  export function profileGraphQL(query: any, opts?: BoxObjectOpts_profileGraphQL): undefined;
  export function getVerifiedAccounts(profile: any): undefined;
  export function openBox(
    address: string,
    ethereumProvider: provider,
    opts?: BoxObjectOpts_openBox,
  ): Promise<BoxInstance>;
  export function isLoggedIn(address: any): boolean;
  export function openSpace(spaceName: string, opts?: BoxObjectOpts_OpenSpace): Promise<BoxSpace>;
  export function create(ethereumProvider: provider): Promise<BoxInstance>;
}
