export enum ELinkStatus {
  STAKED = 0, // [RUNNING, CLOSED]
  RUNNING = 1, // [DISPUTED, CLOSING]
  DISPUTED = 2, // [CLOSED]
  CLOSING = 3, // [CLOSED]
  CLOSED = 4,
  DENIED = 5,
}
