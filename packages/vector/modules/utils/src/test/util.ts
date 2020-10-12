export const mkAddress = (prefix = "0x0"): string => {
  return prefix.padEnd(42, "0");
};

export const mkPublicIdentifier = (prefix = "indraA"): string => {
  return prefix.padEnd(55, "0");
};

export const mkHash = (prefix = "0x"): string => {
  return prefix.padEnd(66, "0");
};

export const mkBytes32 = (prefix = "0xa"): string => {
  return prefix.padEnd(66, "0");
};

export const mkSig = (prefix = "0xa"): string => {
  return prefix.padEnd(130, "0");
};