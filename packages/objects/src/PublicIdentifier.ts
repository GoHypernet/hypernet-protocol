import {Brand, make} from "ts-brand";

export type PublicIdentifier = Brand<string, "PublicIdentifier">;
export const PublicIdentifier = make<PublicIdentifier>();