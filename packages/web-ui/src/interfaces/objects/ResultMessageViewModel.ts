export enum EResultStatus {
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
  IDLE = "IDLE",
}

export class ResultMessage {
  constructor(public status: EResultStatus, public message: string) {}
}
