const { expectRevert } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const tokens = require('./tokens.json');

function hashToken(tokenId, account, label, registrationData) {
    return Buffer.from(ethers.utils.solidityKeccak256(['address', 'string', 'string', 'uint256'], [account, label, registrationData, tokenId]).slice(2), 'hex')
}

describe("Enumerated Registry", function () {
  let UpgradableRegistry; 
  let hypertoken;
  let registry;
  let owner;
  let addr1;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();

    const Hypertoken = await ethers.getContractFactory("Hypertoken");
    hypertoken = await Hypertoken.deploy();
    await hypertoken.deployTransaction.wait();

    // deploy registry contract
    UpgradableRegistry = await ethers.getContractFactory(
      "NonFungibleRegistryEnumerableUpgradeable",
    );
    registry = await upgrades.deployProxy(UpgradableRegistry, [
      "Hypernet Profiles",
      "HPs",
      "0x0000000000000000000000000000000000000000",
      owner.address,
      owner.address,
    ]);
    await registry.deployed();
  });

  it("Test gateway registration.", async function () {
    // construct some realistic registration data
    let testTokenAddress = 0x0;
    let hyperTokenAddress = 0x0;
    let routerPublicIdentifier =
      "vector8AXWmo3dFpK1drnjeWPyi9KTy9Fy3SkCydWx8waQrxhnW4KPmR";
    let registryEntry = {
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
    let tx = await registry.register(
      addr1.address,
      routerPublicIdentifier,
      JSON.stringify(registryEntry),
      1,
    );
    tx.wait();

    // check that registration occured properly
    expect(await registry.registryMap(routerPublicIdentifier)).to.equal(1);
    expect(await registry.tokenURI(1)).to.equal(JSON.stringify(registryEntry));
    expect(await registry.totalSupply()).to.equal(1);
    expect(await registry.ownerOf(1)).to.equal(addr1.address);
  });

  it("Ensure labels cannot be duplicated.", async function () {
    const label = "dummy";
    const registrationData = "dummy";

    let tx = await registry.register(addr1.address, label, registrationData, 1);
    tx.wait();

    await expectRevert(
      registry.register(addr2.address, label, registrationData, 2),
      "NonFungibleRegistry: label is already registered.",
    );
  });

  it("Check for Royalties Interface (EIP-2981).", async function () {
    const Test = await ethers.getContractFactory("Test");
    test = await Test.deploy();
    await test.deployTransaction.wait();

    expect(await test.checkForEIP2981(registry.address)).to.equal(true);
    const royaltyInfo = await registry.royaltyInfo(1, hre.ethers.utils.parseUnits("1.0", 18));
    const royaltyReciever = await registry.burnAddress();
    expect(royaltyInfo[0]).to.equal(royaltyReciever);
    expect(royaltyInfo[1]).to.equal(hre.ethers.utils.parseUnits("0.00", 18));
  });

  it("Check token owner burn permissions", async function () {
    const label = "dummy";
    const registrationData = "dummy";

    let tx = await registry.register(addr1.address, label, registrationData, 1);
    tx.wait();

    expect(await registry.balanceOf(addr1.address)).to.equal(1);
    expect(await registry.totalSupply()).to.equal(1);

    // only owner or approved address can burn
    await expectRevert(
      registry.connect(addr2).burn(1),
      "NonFungibleRegistry: caller is not owner nor approved nor registrar.",
    );

    // owner can burn their own tokens
    tx = await registry.connect(addr1).burn(1);
    tx.wait();

    expect(await registry.balanceOf(addr1.address)).to.equal(0);
    expect(await registry.totalSupply()).to.equal(0);
  });

  it("Check registrar burn permissions", async function () {
    const label = "dummy";
    const registrationData = "dummy";

    let tx = await registry.register(addr1.address, label, registrationData, 1);
    tx.wait();

    expect(await registry.balanceOf(addr1.address)).to.equal(1);

    // only owner or approved address can burn
    await expectRevert(
      registry.connect(addr2).burn(1),
      "NonFungibleRegistry: caller is not owner nor approved nor registrar.",
    );

    // REGISTRAR_ROLE can burn any token
    tx = await registry.burn(1);
    tx.wait();

    expect(await registry.balanceOf(addr1.address)).to.equal(0);
  });

  it("Check primary registry settings", async function () {
    const abiCoder = ethers.utils.defaultAbiCoder;

    // construct call data via ABI encoding
    let nofunctiondefintion = hypertoken.address;

    let noncontractaddress = owner.address;

    let disableprimaryregistry = "0x0000000000000000000000000000000000000000";

    // primary registry must implement the ERC721 interface
    await expectRevert(
      registry.setPrimaryRegistry(nofunctiondefintion),
      "Transaction reverted: function selector was not recognized and there's no fallback function",
    );

    await expectRevert(
      registry.setPrimaryRegistry(noncontractaddress),
      "Transaction reverted: function call to a non-contract account",
    );

    await expectRevert(
      registry.connect(addr1).setPrimaryRegistry(noncontractaddress),
      "NonFungibleRegistry: must be admin.",
    );

    let tx = await registry.setPrimaryRegistry(disableprimaryregistry);
    tx.wait();

    // now deploy a new registry with registry.address set as primary registry
    gatedregistry = await upgrades.deployProxy(UpgradableRegistry, [
        "Hypernet.ID",
        "HID",
        registry.address,
        owner.address,
        owner.address,
      ]);
    await registry.deployed();

    await expectRevert(
        gatedregistry.register(addr1.address, "dummy", "stuff", 4),
        "NonFungibleRegistry: recipient must have non-zero balance in primary registry."
    )

    tx = await registry.register(addr1.address, "galileo", "", 4);
    tx.wait();
    
    tx = await gatedregistry.register(addr1.address, "dummy", "stuff", 4);
    tx.wait();

    expect(await registry.balanceOf(addr1.address)).to.equal(1);
  });

  it("Check burn fee bounds", async function () {
    const abiCoder = ethers.utils.defaultAbiCoder;

    // construct call data via ABI encoding
    let tooBig = abiCoder.encode(
      [
        "tuple(string[], bool[], bool[], bool[], address[], uint256[], address[], uint256[], string[])",
      ],
      [[[], [], [], [], [], [], [], [10001], []]],
    );

    // primary registry must implement the ERC721 interface
    await expectRevert(
      registry.setRegistryParameters(tooBig),
      "NonFungibleRegistry: burnFee must be le 10000.",
    );
  });

  it("Check permissions on registry parameter, label, and storage updating.", async function () {
    const label1 = "dummy1";
    const registrationData1 = "dummy1";
    const label2 = "dummy2";
    const registrationData2 = "dummy2";

    let tx = await registry.register(
      addr1.address,
      label1,
      registrationData1,
      1,
    );
    tx.wait();

    tx = await registry.register(addr1.address, label2, registrationData2, 2);
    tx.wait();

    // only owner or approved address can update
    await expectRevert(
      registry.connect(addr2).updateRegistration(1, "new URI"),
      "NonFungibleRegistry: caller is not owner nor approved nor registrar.",
    );

    tx = await registry.updateRegistration(1, "new URI");
    tx.wait();
    expect(await registry.tokenURI(1)).to.equal("new URI");

    // can't update label if updating is disabled
    await expectRevert(
      registry.connect(addr1).updateLabel(2, "newDummyString"),
      "NonFungibleRegistry: Label updating is disabled.",
    );

    const abiCoder = ethers.utils.defaultAbiCoder;

    // construct call data via ABI encoding
    let params = abiCoder.encode(
      [
        "tuple(string[], bool[], bool[], bool[], address[], uint256[], address[], uint256[], string[])",
      ],
      [[[], [], [true], [], [], [], [], [], []]],
    );

    // only REGISTRAR_ROLE can update registry parameters
    await expectRevert(
      registry.connect(addr1).setRegistryParameters(params),
      "NonFungibleRegistry: must be registrar.",
    );

    // enable label updating
    tx = await registry.setRegistryParameters(params);
    tx.wait();

    // update the label on the NFI that has none
    tx = await registry.connect(addr1).updateLabel(1, "newDummyString");
    tx.wait();

    // can't add label that already exists in the registry
    await expectRevert(
      registry.connect(addr1).updateLabel(2, label2),
      "NonFungibleRegistry: label is already registered.",
    );
  });

  it("Check baseURI functionality.", async function () {
    const label = "logo";
    const registrationData = "QmcSagSyQEjs1DhBkvLestLe2HZ2F9dWccdJW1fQCFTYcw";
    const baseURI = "ipfs://"

    let tx = await registry.register(
      addr1.address,
      label,
      registrationData,
      1,
    );
    tx.wait();

    // when baseURI is not set, the tokenURI is just the registration data
    tx.wait();
    expect(await registry.tokenURI(1)).to.equal(
        registrationData,
    );

    const abiCoder = ethers.utils.defaultAbiCoder;

    // construct call data via ABI encoding
    let params = abiCoder.encode(
      [
        "tuple(string[], bool[], bool[], bool[], address[], uint256[], address[], uint256[], string[])",
      ],
      [[[], [], [], [], [], [], [], [], [baseURI]]],
    );

    // enable label updating
    tx = await registry.setRegistryParameters(params);
    tx.wait();

    // when baseURI is set, the tokenURI is the baseURI + registration data
    expect(await registry.tokenURI(1)).to.equal(
        `${baseURI}${registrationData}`,
    );

    // now check that we can strip the baseURI from the tokenURI
    expect(await registry.tokenURINoBase(1)).to.equal(
        registrationData,
    );
  });

  it("Check transfer permissions.", async function () {
    const label = "dummy";
    const registrationData = "dummy";

    let tx = await registry.register(addr1.address, label, registrationData, 1);
    tx.wait();
    expect(await registry.balanceOf(addr1.address)).to.equal(1);

    const abiCoder = ethers.utils.defaultAbiCoder;

    // construct call data via ABI encoding
    let params = abiCoder.encode(
      [
        "tuple(string[], bool[], bool[], bool[], address[], uint256[], address[], uint256[], string[])",
      ],
      [[[], [], [], [false], [], [], [], [], []]],
    );

    // registrar disables transfers in the registry
    tx = await registry.setRegistryParameters(params);
    tx.wait();

    // ensure that noone without REGISTRAR_ROLE can transfer tokens
    await expectRevert(
      registry.connect(addr1).transferFrom(addr1.address, owner.address, 1),
      "NonFungibleRegistry: transfers are disabled.",
    );

    // registrar can transfer NFIs in any circumstance to enable account recovery etc.
    tx = await registry.transferFrom(addr1.address, owner.address, 1);
    tx.wait();
    expect(await registry.balanceOf(owner.address)).to.equal(1);
    expect(await registry.balanceOf(addr1.address)).to.equal(0);

    tx = await registry.transferFrom(owner.address, addr1.address, 1);
    tx.wait();
    expect(await registry.balanceOf(addr1.address)).to.equal(1);
  });

  it("Test ERC20 token-based registration.", async function () {
    // give some tokens to the addr2
    let tx = await hypertoken.transfer(
      addr2.address,
      ethers.utils.parseEther("2"),
    );
    tx.wait();
    expect(await hypertoken.balanceOf(addr2.address)).to.equal(
      ethers.utils.parseEther("2"),
    );

    let regFee = await registry.registrationFee();
    let burnFee = await registry.burnFee();

    // approve the registry to pull hypertoken from the users wallet
    tx = await hypertoken.connect(addr2).approve(registry.address, regFee);
    tx.wait();

    // registration by token is currently disabled
    await expectRevert(
      registry
        .connect(addr2)
        .registerByToken(addr2.address, "username", "myprofile", 1),
      "NonFungibleRegistry: registration by token not enabled.",
    );

    const abiCoder = ethers.utils.defaultAbiCoder;

    // construct call data via ABI encoding
    let params = abiCoder.encode(
      [
        "tuple(string[], bool[], bool[], bool[], address[], uint256[], address[], uint256[], string[])",
      ],
      [[[], [], [], [], [hypertoken.address], [], [], [], []]],
    );

    // registrar now sets the registration token to enable token-based registration
    tx = await registry.setRegistryParameters(params);
    tx.wait();

    // then they can submit a transaction to register
    tx = await registry
      .connect(addr2)
      .registerByToken(addr2.address, "username1", "myprofile1", 1);
    tx.wait();

    let stakeTokenId = await registry.registryMap("username1");
    let tokenStake = await registry.identityStakes(stakeTokenId);
    expect(tokenStake[1]).to.equal(ethers.utils.parseEther("0.95"));
    expect(await hypertoken.balanceOf(addr2.address)).to.equal(
      ethers.utils.parseEther("1"),
    );

    expect(await hypertoken.balanceOf(registry.address)).to.equal(ethers.utils.parseEther("0.95"));

    tx = await registry.connect(addr2).burn(stakeTokenId);
    tx.wait();
    expect(await hypertoken.balanceOf(addr2.address)).to.equal(
      ethers.utils.parseEther("1.95"),
    );

    expect(await hypertoken.balanceOf(registry.address)).to.equal(0);

    // approve the registry to pull hypertoken from the users wallet
    tx = await hypertoken.connect(addr2).approve(registry.address, regFee);
    tx.wait();

    // then they can submit a transaction to register
    tx = await registry
      .connect(addr2)
      .registerByToken(addr2.address, "username2", "myprofile2", 2);
    tx.wait();
  });

it("Test batch minting function.", async function () {
    // first deploy the batch minting contract
    const BatchModule = await ethers.getContractFactory("BatchModule");
    batchmodule = await BatchModule.deploy("Batch Minting");
    await batchmodule.deployTransaction.wait();

    // minting many tokens in a single transaction can save gas:
    const batchSize = 120;
    const recipients = [];
    const labels = [];
    const emptyLabels = [];
    const datas = [];
    const tokenIds = [];
    const tokenIds2 = [];
    for (let i = 0; i < batchSize; i++) {
      recipients.push(owner.address);
      labels.push(`tokenLabel${i}`);
      emptyLabels.push("");
      datas.push(`00000000000000030000000061672e7d`);
      tokenIds.push(i + 1);
      tokenIds2.push(i + 1 + batchSize);
    }

    // then add the module as a REGISTRAR
    const REGISTRAR_ROLE = await registry.REGISTRAR_ROLE();
    let tx = await registry.grantRole(REGISTRAR_ROLE, batchmodule.address);
    tx.wait();

    tx = await batchmodule.batchRegister(
      recipients,
      labels,
      datas,
      tokenIds,
      registry.address,
    );
    tx.wait();

    tx = await batchmodule.batchRegister(
      recipients,
      emptyLabels,
      datas,
      tokenIds2,
      registry.address,
    );
    tx.wait();

    tx = await registry.register(
      recipients[0],
      emptyLabels[0],
      datas[1],
      42069,
    );
    tx.wait();
  });

it("Test bulk transfer function.", async function () {
    // first deploy the bulk transfer function
    const BulkTransfer = await ethers.getContractFactory("BulkTransferModule");
    bulktransfer = await BulkTransfer.deploy("Bulk Transfer");
    await bulktransfer.deployTransaction.wait();

    // second, deploy batch minting for convenience 
    const BatchModule = await ethers.getContractFactory("BatchModule");
    batchmodule = await BatchModule.deploy("Batch Minting");
    await batchmodule.deployTransaction.wait();

    // minting many tokens in a single transaction can save gas:
    const batchSize = 120;
    const owners = [];
    const recipients = [];
    const labels = [];
    const datas = [];
    const tokenIds = [];
    for (let i = 0; i < batchSize; i++) {
      owners.push(owner.address);
      recipients.push(addr1.address);
      labels.push(`tokenLabel${i}`);
      datas.push(`00000000000000030000000061672e7d`);
      tokenIds.push(i + 1);
    }

    // add the bulk transfer module as a REGISTRAR
    const REGISTRAR_ROLE = await registry.REGISTRAR_ROLE();
    let tx = await registry.grantRole(REGISTRAR_ROLE, bulktransfer.address);
    tx.wait();

    // add the batch mint module as a REGISTRAR
    tx = await registry.grantRole(REGISTRAR_ROLE, batchmodule.address);
    tx.wait();

    // create a series of NFIs to one account
    tx = await batchmodule.batchRegister(
      owners,
      labels,
      datas,
      tokenIds,
      registry.address,
    );
    tx.wait();

    // if an account is not approved, bulk transfer will fail
    await expectRevert(bulktransfer.connect(addr1).bulkTransfer(
        owners[0],
        recipients,
        tokenIds,
        registry.address,
    ), "BulkTransferModule: msgSender is not approved for all.");

    tx = await registry.setApprovalForAll(addr1.address, true);
    tx.wait();

    // bulk transfer them away after approved
    tx = await bulktransfer.connect(addr1).bulkTransfer(
        owners[0],
        recipients,
        tokenIds,
        registry.address,
    );
    tx.wait();
    expect(await registry.balanceOf(addr1.address)).to.equal(batchSize);

    // registrars can transfer with implicit approval
    tx = await bulktransfer.bulkTransfer(
        recipients[0],
        owners,
        tokenIds,
        registry.address,
    );
    tx.wait();
    expect(await registry.balanceOf(owner.address)).to.equal(batchSize);
  });

it("Test Buy Module.", async function () {
    // first deploy the BuyModule
    const BuyModule = await ethers.getContractFactory("BuyModule");
    buyModule = await BuyModule.deploy("Buy Module");
    await buyModule.deployTransaction.wait();

    // Add a token to purchase
    tx = await registry.register(
      owner.address,
      "DummyLabel",
      "ipfs://QmeztCtCmeDg2jj2wcSKa9nwKdqLsSkZq3zfVMG84pocf6",
      42069,
    );
    tx.wait();

    const abiCoder = ethers.utils.defaultAbiCoder;

    // set purchase token to hypertoken and set price to 0
    let params = abiCoder.encode(
      [
        "tuple(string[], bool[], bool[], bool[], address[], uint256[], address[], uint256[], string[])",
      ],
      [[[], [], [], [], [hypertoken.address], [0], [], [], []]],
    );

    registry.setRegistryParameters(params);

    // can't buy the NFI if the price (registrationFee) is set to zero
    await expectRevert(buyModule.connect(addr1).buyNFI(42069, registry.address), "BuyModule: purchase price must be greater than 0.");

    // set registrationFee to 10 tokens
    params = abiCoder.encode(
        [
          "tuple(string[], bool[], bool[], bool[], address[], uint256[], address[], uint256[], string[])",
        ],
        [[[], [], [], [], [], [hre.ethers.utils.parseUnits("10.0")], [], [], []]],
      );
  
    registry.setRegistryParameters(params);

    // can't buy the NFI if you don't have any registrationToken in your account
    await expectRevert(buyModule.connect(addr1).buyNFI(42069, registry.address), "ERC20: transfer amount exceeds balance");

    tx = await hypertoken.transfer(addr1.address, await registry.registrationFee());
    tx.wait();
    tx = await hypertoken.transfer(addr2.address, await registry.registrationFee());
    tx.wait();
    // can't buy the NFI without calling approve
    await expectRevert(buyModule.connect(addr1).buyNFI(42069, registry.address), "ERC20: transfer amount exceeds allowance");

    tx = await hypertoken.connect(addr1).approve(buyModule.address, await registry.registrationFee());
    tx.wait();
    tx = await hypertoken.connect(addr2).approve(buyModule.address, await registry.registrationFee());
    tx.wait();
    // can't sell the token if the Buy Module does not have the REGISTRAR_ROLE
    await expectRevert(buyModule.connect(addr1).buyNFI(42069, registry.address), "NonFungibleRegistry: caller is not owner nor approved nor registrar.");

    // add the module as a REGISTRAR
    const REGISTRAR_ROLE = await registry.REGISTRAR_ROLE();
    tx = await registry.grantRole(REGISTRAR_ROLE, buyModule.address);
    tx.wait();

    // now you can sell the NFI
    expect(await registry.ownerOf(42069)).to.equal(owner.address);
    tx = await buyModule.connect(addr1).buyNFI(42069, registry.address);
    tx.wait();
    expect(await registry.ownerOf(42069)).to.equal(addr1.address);

    // can't buy it once its already been bought
    await expectRevert(buyModule.connect(addr2).buyNFI(42069, registry.address), "BuyModule: token not for sale.");
  });

it("Test lazy minting.", async function () {
    // first deploy the LazyMintModule
    const LazyMintModule = await ethers.getContractFactory("LazyMintModule");
    lazymintmodule = await LazyMintModule.deploy("Lazy Registration");
    await lazymintmodule.deployTransaction.wait();

    let label = "";
    let registrationData = "00000000000000030000000061672e7d";
    let tokenId = 007;

    // Get current chain id:

    let chainId = hre.network.config.chainId;
    
    // hash the data
    var hash = ethers.utils
      .solidityKeccak256(
        ["address", "string", "string", "uint256", "uint256"],
        [addr1.address, label, registrationData, tokenId, chainId],
      )
      .toString("hex");

    let sig = await owner.signMessage(ethers.utils.arrayify(hash));
    let fakesig = await addr2.signMessage(ethers.utils.arrayify(hash));

    // Lazy minting module wont work without REGISTRAR ROLE permission
    await expectRevert(
      lazymintmodule
        .connect(addr1)
        .lazyRegister(
          addr1.address,
          label,
          registrationData,
          tokenId,
          sig,
          registry.address,
        ),
      "NonFungibleRegistry: must have registrar role to register.",
    );

    // then add the module as a REGISTRAR
    const REGISTRAR_ROLE = await registry.REGISTRAR_ROLE();
    let tx = await registry.grantRole(REGISTRAR_ROLE, lazymintmodule.address);
    tx.wait();

    // invalid signatures also won't work
    await expectRevert(
      lazymintmodule
        .connect(addr1)
        .lazyRegister(
          addr1.address,
          label,
          registrationData,
          tokenId,
          fakesig,
          registry.address,
        ),
      "LazyMintModule: signature failure.",
    );

    // only the recipient can call the lazy mint function
    await expectRevert(
      lazymintmodule
        .connect(addr2)
        .lazyRegister(
          addr1.address,
          label,
          registrationData,
          tokenId,
          sig,
          registry.address,
        ),
      "LazyMintModule: Caller is not recipient.",
    );

    tx = await lazymintmodule
      .connect(addr1)
      .lazyRegister(
        addr1.address,
        label,
        registrationData,
        tokenId,
        sig,
        registry.address,
      );
    tx.wait();
    expect(await registry.totalSupply()).to.equal(1);

    // tokenIds cannot be reused
    await expectRevert(
      lazymintmodule
        .connect(addr1)
        .lazyRegister(
          addr1.address,
          label,
          registrationData,
          tokenId,
          sig,
          registry.address,
        ),
      "ERC721: token already minted",
    )
  });

  it("Test merkle drop.", async function () {
    // first deploy the LazyMintModule
    const MerkleModule = await ethers.getContractFactory("MerkleModule");
    merklemodule = await MerkleModule.deploy("Merkle Drop");
    await merklemodule.deployTransaction.wait();

    // then get the merkle tree
    merkleTree = new MerkleTree(Object.entries(tokens).map(([tokenId, tokenData]) => hashToken(tokenId, tokenData.account, tokenData.label, tokenData.registrationData)), keccak256, { sortPairs: true });

    // update the merkle root in the registry and freeze it
    let tx = await registry.setMerkleRoot(merkleTree.getHexRoot(), true);
    tx.wait(); 
    
    // once froze, merkle Root cannot be updated
    await expectRevert(
        registry.setMerkleRoot(merkleTree.getHexRoot(), true),
        "NonFungibleRegistry: merkleRoot has been frozen.",
    )

    // then add the merkle module as a REGISTRAR
    const REGISTRAR_ROLE = await registry.REGISTRAR_ROLE();
    tx = await registry.grantRole(REGISTRAR_ROLE, merklemodule.address);
    tx.wait();

    // mint the tokens from the tokens.json file
    for (const [tokenId, tokenData] of Object.entries(tokens)) {
        /**
         * Create merkle proof (anyone with knowledge of the merkle tree)
         */
        const proof = merkleTree.getHexProof(hashToken(tokenId, tokenData.account, tokenData.label, tokenData.registrationData));
        /**
         * Redeems token using merkle proof (anyone with the proof can call)
         */
        await expect(merklemodule.redeem(tokenData.account, tokenData.label, tokenData.registrationData, tokenId, proof, registry.address))
          .to.emit(registry, 'Transfer')
          .withArgs(ethers.constants.AddressZero, tokenData.account, tokenId);
    }

    // replay attack is prevented by tokenId uniqueness 
    for (const [tokenId, tokenData] of Object.entries(tokens)) {
        /**
         * Create merkle proof (anyone with knowledge of the merkle tree)
         */
        const proof = merkleTree.getHexProof(hashToken(tokenId, tokenData.account, tokenData.label, tokenData.registrationData));
        /**
         * Redeems token using merkle proof (anyone with the proof can call)
         */
        await expectRevert(
            merklemodule.redeem(tokenData.account, tokenData.label, tokenData.registrationData, tokenId, proof, registry.address),
            "ERC721: token already minted"
            )
    }

    // frontrun/mint manipulation attack is prevented 
    for (const [tokenId, tokenData] of Object.entries(tokens)) {
        /**
         * Create merkle proof (anyone with knowledge of the merkle tree)
         */
        const proof = merkleTree.getHexProof(hashToken(tokenId, tokenData.account, tokenData.label, tokenData.registrationData));
        /**
         * Redeems token using merkle proof (anyone with the proof can call)
         */
        await expectRevert(
            merklemodule.redeem(tokenData.account, "dummy", tokenData.registrationData, tokenId, proof, registry.address),
            "MerkleModule: Invalid merkle proof"
            )
    }

  });
});
