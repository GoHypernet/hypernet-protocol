import { Address } from "@interfaces/objects";

export class Message {
  constructor(public sourceAddress: Address, public destinationAddress: Address, public content: string) {}
}
