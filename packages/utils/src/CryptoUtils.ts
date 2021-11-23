/**
 * Random number and crypto utils, based on https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript and https://github.com/StableLib/stablelib/blob/master/packages/random/source/browser.ts.
 * Created to make a way to generate a repeatable randomBytes() array from a seed.
 */
export class CryptoUtils {
  static xmur3(str: string): () => number {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      (h = Math.imul(h ^ str.charCodeAt(i), 3432918353)),
        (h = (h << 13) | (h >>> 19));
    }

    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return (h ^= h >>> 16) >>> 0;
    };
  }

  static sfc32(a: number, b: number, c: number, d: number): () => number {
    return function () {
      a >>>= 0;
      b >>>= 0;
      c >>>= 0;
      d >>>= 0;
      let t = (a + b) | 0;
      a = b ^ (b >>> 9);
      b = (c + (c << 3)) | 0;
      c = (c << 21) | (c >>> 11);
      d = (d + 1) | 0;
      t = (t + d) | 0;
      c = (c + t) | 0;
      return (t >>> 0) / 4294967296;
    };
  }

  static randomInt(
    randomFunc: () => number,
    low: number,
    high: number,
  ): number {
    return Math.floor(randomFunc() * (high - low) + low);
  }

  static randomBytes(length: number, seed: string): Uint8Array {
    // The seed is any string, we can use that to seed the hash method.
    const hash = this.xmur3(seed);

    // Output four 32-bit hashes to provide the seed for sfc32
    const randFunc = this.sfc32(hash(), hash(), hash(), hash());

    const out = new Uint8Array(length);
    for (let i = 0; i < out.length; i++) {
      out[i] = CryptoUtils.randomInt(randFunc, 0, 256);
    }
    return out;
  }
}
