export class Token {
  constructor(
    public id: number,
    public tokenAddress: string,
    public capacity: number,
    public symbol: string,
    public decimals: number,
    public name: string,
  ) {}
}
