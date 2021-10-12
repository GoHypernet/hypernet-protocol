const { BN, expectRevert } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Registry", function () {
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
        const UpgradableRegistry = await ethers.getContractFactory("NonFungibleRegistryUpgradeable");
        registry = await upgrades.deployProxy(UpgradableRegistry, ["Gateways", "G", owner.address, owner.address]);
        await registry.deployed();
	});

    it("Test gateway registration.", async function () {
         // construct some realistic registration data
        let testTokenAddress = 0x0;
        let hyperTokenAddress = 0x0;
        let routerPublicIdentifier = "vector8AXWmo3dFpK1drnjeWPyi9KTy9Fy3SkCydWx8waQrxhnW4KPmR";
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

        let tx = await registry.register(
            addr1.address,
            label,
            registrationData,
        );
        tx.wait();

        await expectRevert(
            registry.register(
              addr2.address,
              label,
              registrationData,
            ),
            "NonFungibleRegistry: label is already registered.",
          );
    });

    it("Check token owner burn permissions", async function () {
        const label = "dummy";
        const registrationData = "dummy";

        let tx = await registry.register( addr1.address, label, registrationData);
        tx.wait();

        expect(await registry.balanceOf(addr1.address)).to.equal(1);

        // only owner or approved address can burn
        await expectRevert(
            registry.connect(addr2).burn(1),
            "NonFungibleRegistry: caller is not owner nor approved nor registrar.",
        );

        // owner can burn their own tokens
        tx = await registry.connect(addr1).burn(1);
        tx.wait();

        expect(await registry.balanceOf(addr1.address)).to.equal(0);
    });

    it("Check registrar burn permissions", async function () {
        const label = "dummy";
        const registrationData = "dummy";

        let tx = await registry.register( addr1.address, label, registrationData);
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

    it("Check permissions on registry parameter, label, and storage updating.", async function () {
        const label1 = "dummy1";
        const registrationData1 = "dummy1";
        const label2 = "dummy2";
        const registrationData2 = "dummy2";

        let tx = await registry.register( addr1.address, label1, registrationData1);
        tx.wait();

        tx = await registry.register( addr1.address, label2, registrationData2);
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

        // only REGISTRAR_ROLE can update registry parameters
        await expectRevert(
            registry.connect(addr1).setRegistryParameters([], [], [], [true], [], [], [], [], []),
            "NonFungibleRegistry: must be registrar.",
        );

        // enable label updating
        tx = await registry.setRegistryParameters([], [], [], [true], [], [], [], [], []);
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

    it("Check transfer permissions.", async function () {
        const label = "dummy";
        const registrationData = "dummy";

        let tx = await registry.register( addr1.address, label, registrationData);
        tx.wait();
        expect(await registry.balanceOf(addr1.address)).to.equal(1);

        // registrar disables transfers in the registry
        tx = await registry.setRegistryParameters([], [], [], [], [false], [], [], [], []);
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
        let tx = await hypertoken.transfer(addr2.address, ethers.utils.parseEther("2"));
        tx.wait();
        expect(await hypertoken.balanceOf(addr2.address)).to.equal(ethers.utils.parseEther("2"));

        let regFee =  await registry.registrationFee();
        let burnFee = await registry.burnFee();
       
        // approve the registry to pull hypertoken from the users wallet
        tx = await hypertoken.connect(addr2).approve(registry.address, regFee);
        tx.wait();

        // registration by token is currently disabled
        await expectRevert(
            registry.connect(addr2).registerByToken(addr2.address, "username", "myprofile"),
            "NonFungibleRegistry: registration by token not enabled.",
        )

        // registrar now sets the registration token to enable token-based registration
        tx = await registry.setRegistryParameters([], [], [], [], [], [hypertoken.address], [], [], []);
        tx.wait();

        // then they can submit a transaction to register
        tx = await registry.connect(addr2).registerByToken(addr2.address, "username1", "myprofile1");
        tx.wait();

        let stakeTokenId = await registry.registryMap("username1");
        let tokenStake = await registry.identityStakes(stakeTokenId);
        expect(tokenStake[1]).to.equal(ethers.utils.parseEther("0.95"));
        expect(await hypertoken.balanceOf(addr2.address)).to.equal(ethers.utils.parseEther("1"));

        tx = await registry.connect(addr2).burn(stakeTokenId);
        tx.wait();
        expect(await hypertoken.balanceOf(addr2.address)).to.equal(ethers.utils.parseEther("1.95"));
    });

    it("Test batch minting function.", async function () {

      // minting many tokens in a single transaction can save gas:
      const batchSize = 150;
      const recipients = [];
      const labels = [];
      const emptyLabels = [];
      const datas = [];
      for (let i = 0; i < batchSize; i++) {
          recipients.push(owner.address);
          labels.push(`tokenLabel${i}`);
          emptyLabels.push("");
          datas.push(`tokenusername${i}`)
      }

      let tx = await registry.batchRegister(recipients, labels, datas);
      tx.wait();
      expect(await registry.totalSupply()).to.equal(batchSize);

      tx = await registry.batchRegister(recipients, emptyLabels, datas);
      tx.wait();
      expect(await registry.totalSupply()).to.equal(2*batchSize);

      tx = await registry.register(recipients[0], emptyLabels[0], datas[1]);
      tx.wait();
      expect(await registry.totalSupply()).to.equal(2*batchSize+1);
  });
  
  it("Test lazy minting.", async function () {
      let label = "dummylabel";
      let registrationData = "dummyRegistrationData";

      var hash = ethers.utils.solidityKeccak256(
          ["address", "string", "string"],
          [addr1.address, label, registrationData]
      ).toString('hex');
      
      let sig = await owner.signMessage(ethers.utils.arrayify(hash));
      let fakesig = await addr2.signMessage(ethers.utils.arrayify(hash));
      
      await expectRevert(
        registry.connect(addr1).lazyRegister(addr1.address, label, registrationData, sig),
        "NonFungibleRegistry: Lazy registration is disabled.",
      )

      // registrar now sets the registration token to enable token-based registration
      tx = await registry.setRegistryParameters([], [true], [], [], [], [], [], [], []);
      tx.wait();

      await expectRevert(
        registry.connect(addr1).lazyRegister(addr1.address, "", registrationData, fakesig),
        "NonFungibleRegistry: label field must not be blank.",
      )

      await expectRevert(
        registry.connect(addr1).lazyRegister(addr1.address, label, registrationData, fakesig),
        "NonFungibleRegistry: signature failure.",
      )

      await expectRevert(
        registry.connect(addr2).lazyRegister(addr1.address, label, registrationData, sig),
        "NonFungibleRegistry: Caller is not recipient.",
      )

      tx = await registry.connect(addr1).lazyRegister(addr1.address, label, registrationData, sig);
      tx.wait();
      expect(await registry.totalSupply()).to.equal(1);

      await expectRevert(
        registry.connect(addr1).lazyRegister(addr1.address, label, registrationData, sig),
        "NonFungibleRegistry: Registration label already exists.",
      )
  });
});
