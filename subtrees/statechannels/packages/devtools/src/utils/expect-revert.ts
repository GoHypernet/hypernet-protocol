/* global expect */

export async function expectRevert(fn: () => void, pattern?: string | RegExp) {
  // Where is expect coming from?
  await expect(fn()).rejects.toThrowError(pattern);
}
