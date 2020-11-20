import { Subject } from "rxjs";
import { ControlClaim } from "./ControlClaim";
import { EthereumAddress } from "3box";
import { PublicIdentifier } from "./PublicIdentifier";

export class HypernetContext {
  constructor(
    public account: EthereumAddress | null,
    public privateKey: string | null,
    public publicIdentifier: PublicIdentifier | null,
    public inControl: boolean,
    public onControlClaimed: Subject<ControlClaim>,
    public onControlYielded: Subject<ControlClaim>,
  ) {}
}

export class InitializedHypernetContext {
  constructor(
    public account: EthereumAddress,
    public privateKey: string,
    public publicIdentifier: PublicIdentifier,
    public inControl: boolean,
    public onControlClaimed: Subject<ControlClaim>,
    public onControlYielded: Subject<ControlClaim>,
  ) {}
}