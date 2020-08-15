export class NewToken {
  constructor(
    public tokenAddress: string,
    public capacity: number,
    public symbol: string,
    public decimals: number,
    public name: string,
  ) {}
}

export class Token extends NewToken {
  constructor(
    public id: number,
    public tokenAddress: string,
    public capacity: number,
    public symbol: string,
    public decimals: number,
    public name: string,
  ) {
    super(tokenAddress, capacity, symbol, decimals, name);
  }
}
