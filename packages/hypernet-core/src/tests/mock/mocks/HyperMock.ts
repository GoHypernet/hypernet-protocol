import { okAsync } from "neverthrow";
import { MockCall } from "@mock/mocks/MockedCall";
import { ResultAsync } from "@interfaces/objects";

export class HyperMock {
  public calls: Map<string, MockCall[]>;
  constructor() {
    this.calls = new Map();
  }

  protected recordCall(callName: string, args: IArguments) {
    let callArray = this.calls.get(callName);

    if (callArray == null) {
      callArray = [];
      this.calls.set(callName, callArray);
    }
    callArray.push(new MockCall(args));
  }

  protected voidResult<E>(): ResultAsync<void, E> {
    return okAsync<null, E>(null).map(() => {});
  }
}
