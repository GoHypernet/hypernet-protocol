import {BigNumber} from 'ethers';

export function addHex(a: string, b: string): string {
  return BigNumber.from(a)
    .add(BigNumber.from(b))
    .toHexString();
}
export function subHex(a: string, b: string): string {
  return BigNumber.from(a)
    .sub(BigNumber.from(b))
    .toHexString();
}

export function eqHex(a: string, b: string) {
  return BigNumber.from(a).eq(b);
}

export function eqHexArray(a: string[], b: string[]): boolean {
  return (
    a.length === b.length &&
    a.reduce((equalsSoFar, aVal, idx) => equalsSoFar && eqHex(aVal, b[idx]), true)
  );
}

export function toHex(a: number): string {
  return BigNumber.from(a).toHexString();
}

export function fromHex(a: string): number {
  return BigNumber.from(a).toNumber();
}
