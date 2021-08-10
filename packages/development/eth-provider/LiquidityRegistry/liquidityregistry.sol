//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.6;


contract LiquidityRegistry {

  // Create mapping structre for retrieving gateways
  mapping (string => string) private registry;

  constructor() {}

  function getLiquidity(string memory _publicidentifier) external view returns (string memory) {
    return registry[_publicidentifier];
  }

  function setLiquidity(string memory _publicidentifier, string memory _text) public {
    registry[_publicidentifier] = _text;
  }
}
