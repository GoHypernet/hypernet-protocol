const { BN, expectRevert } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Registry", function () {
  it("Test the Registry contract.", async function () {
    // get signers
    const [owner, addr1, addr2] = await ethers.getSigners();

    // deploy registry contract
    const Registry = await ethers.getContractFactory("NonFungibleRegistry");
    const registry = await Registry.deploy("Gateways", "G", owner.address, owner.address);
    registry_reciept = await registry.deployTransaction.wait();
    const totalSupply = await registry.totalSupply();
    console.log("Registry Address:", registry.address);

    // mint a token
    const testTokenAddress = 0x0;
    const hyperTokenAddress = 0x0;
    const routerPublicIdentifier =
      "vector8AXWmo3dFpK1drnjeWPyi9KTy9Fy3SkCydWx8waQrxhnW4KPmR";
    const registryEntry = {
      supportedTokens: [
        {
          chainId: 1337,
          tokenAddress: testTokenAddress,
        },
        {
          chainId: 1337,
          tokenAddress: hyperTokenAddress,
        },
        {
          chainId: 1369,
          tokenAddress: testTokenAddress,
        },
        {
          chainId: 1369,
          tokenAddress: hyperTokenAddress,
        },
      ],
      allowedGateways: [
        "https://localhost:3000/users/v0",
        "http://localhost:5010",
      ],
    };

    // mint a token to the registry
    const tx1 = await registry.register(
      addr1.address,
      routerPublicIdentifier,
      JSON.stringify(registryEntry),
    );
    const tx1_reciept = tx1.wait();

    expect(await registry.registryMap(routerPublicIdentifier)).to.equal(1);
    expect(await registry.tokenURI(1)).to.equal(JSON.stringify(registryEntry));
    expect(await registry.totalSupply()).to.equal(1);
    expect(await registry.ownerOf(1)).to.equal(addr1.address);

    // can't mint a token associated with the same name
    await expectRevert(
      registry.register(
        addr1.address,
        routerPublicIdentifier,
        JSON.stringify(registryEntry),
      ),
      "NonFungibleRegistry: label is already registered.",
    );

    // only owner or approved address can burn
    await expectRevert(
      registry.connect(addr2).burn(1),
      "NonFungibleRegistry: caller is not owner nor approved nor registrar.",
    );

    // update the tokenURI
    // only owner or approved address can update
    await expectRevert(
      registry.connect(addr2).updateRegistration(1, "new URI"),
      "NonFungibleRegistry: caller is not owner nor approved nor registrar.",
    );

    // connect to a new account and try to update and burn
    const newRegistry = registry.connect(addr1);

    const tx2 = await newRegistry.updateRegistration(1, "new URI");
    const tx2_reciept = tx2.wait();
    expect(await newRegistry.tokenURI(1)).to.equal("new URI");

    // mint a token to the registry without a label
    const tx4 = await registry.registerNoLabel(
        addr2.address,
        JSON.stringify(registryEntry),
    );
    const tx4_reciept = tx4.wait();

    const newerRegistry = registry.connect(addr2);

    // can't update label if updating is disabled
    await expectRevert(
        newerRegistry.updateLabel(2, "newDummyString"),
        "NonFungibleRegistry: Label updating is disabled.",
    );

    // only admin can update parameters
    await expectRevert(
        newerRegistry.setLabelUpdate(true),
        "NonFungibleRegistry: must be registrar.",
    );
    
    // update the label on the NFI that has none
    const tx5 = await registry.setLabelUpdate(true);
    const tx5_reciept = tx5.wait();

    // update the label on the NFI that has none
    const tx6 = await newerRegistry.updateLabel(
        2,
        "newDummyString",
    );
    const tx6_reciept = tx6.wait();

    // can't add label that already exists in the registry
    await expectRevert(
        newerRegistry.updateLabel(2, routerPublicIdentifier),
        "NonFungibleRegistry: label is already registered.",
    );

    // let address1 burn their token
    const tx7 = await newRegistry.burn(1);
    const tx7_reciept = tx7.wait();
    expect(await newRegistry.totalSupply()).to.equal(1);

    // let address1 burn their token
    const tx8 = await newerRegistry.burn(2);
    const tx8_reciept = tx8.wait();
    expect(await newRegistry.totalSupply()).to.equal(0);
});
});
