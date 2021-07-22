//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;


contract MocRegistry {

  // Create mapping structre for retrieving gateways
  mapping (string => string) private registry;

  constructor() {}

  function getGateway(string memory _gatewayurl) external view returns (string memory) {
    return registry[_gatewayurl];
  }

  function setGateway(string memory _gatewayurl, string memory _text) public {
    registry[_gatewayurl] = _text;
  }
}
