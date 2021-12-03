const {  HT, HG, RF, NFR, govAddress, timelockAddress, factoryAddress, hAddress}  = require("./constants.js");

task("delegateVote", "Delegate your voting power")
  .addParam("delegate", "Address of the delegate (can be self)")
  .setAction(async (taskArgs) => {
    const [owner] = await hre.ethers.getSigners();

    const hypertoken = new hre.ethers.Contract(hAddress(), HT.abi, owner);
    const delegate = taskArgs.delegate;
    const amount = taskArgs.amount;
    const tx = await hypertoken.delegate(delegate);
    await tx.wait();
    const votePowerDelegate = await hypertoken.getVotes(delegate)
    const votePowerOwner = await hypertoken.getVotes(owner.address)

    console.log("Voting power of Owner:", votePowerOwner.toString());
    console.log("Voting power of Delegate:", votePowerDelegate.toString());
});

task("governanceParameters", "Prints Governance parameters.")
.setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();

    const govHandle = new hre.ethers.Contract(govAddress(), HG.abi, accounts[0]);

    let name = await govHandle.name();
    let votingDelay = await govHandle.votingDelay();
    let votingPeriod = await govHandle.votingPeriod();
    let proposalThreshold = await govHandle.proposalThreshold();
    let proposalCount = await govHandle._proposalIdTracker();
    let mostRecentProposalId = await govHandle._proposalMap(proposalCount)
    let proposalDescription = await govHandle.proposalDescriptions(mostRecentProposalId)
    console.log("Governance Name:", name);
    console.log("Voting Delay (blocks):", votingDelay.toString());
    console.log("Voting Period (blocks):", votingPeriod.toString());
    console.log("Proposal Quorum (vote threshold):", proposalThreshold.toString());
    console.log("Proposal Count:", proposalCount.toString());
    console.log("Most Recent Proposal:", mostRecentProposalId.toString());
    console.log("Most Recent Proposal Description:", proposalDescription);
});

task("proposalState", "Check the state of an existing proposal")
  .addParam("id", "ID of an existing proposal.")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();

    const govHandle = new hre.ethers.Contract(govAddress(), HG.abi, accounts[0]);

    const proposalID = taskArgs.id;
    const proposalState = await govHandle.state(proposalID);
    const proposalStart = await govHandle.proposalSnapshot(proposalID);
    const proposalDeadline = await govHandle.proposalDeadline(proposalID);
    const proposal = await govHandle.proposals(proposalID);

    console.log("Proposal ID:", proposalID.toString());
    console.log("Proposal State:", proposalState.toString());
    console.log("Proposal Start Block:", proposalStart.toString());
    console.log("Proposal Deadline Block:", proposalDeadline.toString());

    console.log("Proposal Originator:", proposal[1]);
    console.log("Proposal ETA:", proposal[2].toString());
    console.log("Proposal Votes For:", proposal[5].toString());
    console.log("Proposal Votes Against:", proposal[6].toString());
    console.log("Proposal Canceled:", proposal[8]);
    console.log("Proposal Executed:", proposal[9]);
});

task("castVote", "Cast a vote for an existing proposal")
  .addParam("id", "ID of an existing proposal.")
  .addParam("support", "Against (0), For (1), Abstain (2)")
  .setAction(async (taskArgs) => {

    const accounts = await hre.ethers.getSigners();
    const govHandle = new hre.ethers.Contract(govAddress(), HG.abi, accounts[0]);

    const proposalID = taskArgs.id;
    const support = taskArgs.support;
    const tx = await govHandle.castVote(proposalID, support);
    const tx_rcpt = await tx.wait();
    const proposal = await govHandle.proposals(proposalID);

    console.log("Proposal Originator:", proposal[1]);
    console.log("Proposal ETA:", proposal[2].toString());
    console.log("Proposal Votes For:", proposal[5].toString());
    console.log("Proposal Votes Against:", proposal[6].toString());
    console.log("Proposal Executed:", proposal[8]);
});

task("queueProposal", "queue a proposal that has been successfully passed.")
  .addParam("id", "ID of an existing proposal.")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();

    const govHandle = new hre.ethers.Contract(govAddress(), HG.abi, accounts[0]);

    const proposalID = taskArgs.id;
    const { targets, values, signatures, calldatas } =
      await govHandle.getActions(proposalID);
    console.log("Queueing Proposal:", proposalID);
    console.log("Target Addresses:", targets);
    console.log("Proposal Values:", values);
    console.log("Proposal Signatures:", signatures);
    console.log("Call Datas:", calldatas);
    const tx = await govHandle["queue(uint256)"](proposalID);
    const tx_rcp = await tx.wait();
});

task("executeProposal", "Execute a proposal that has been successfully passed.")
  .addParam("id", "ID of an existing proposal.")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();

    const govHandle = new hre.ethers.Contract(govAddress(), HG.abi, accounts[0]);

    const proposalID = taskArgs.id;
    const descriptionHash = taskArgs.hash;
    const { targets, values, signatures, calldatas } =
      await govHandle.getActions(proposalID);
    console.log("Executing Proposal:", proposalID);
    console.log("Target Addresses:", targets);
    const tx = await govHandle["execute(uint256)"](proposalID);
    const tx_rcp = await tx.wait();
});

task("cancelProposal", "Cancel a proposal if it is your or if proposer is below proposal threshold.")
  .addParam("id", "ID of an existing proposal.")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();

    const govHandle = new hre.ethers.Contract(govAddress(), HG.abi, accounts[0]);

    const proposalID = taskArgs.id;
    console.log("Cancelling Proposal:", proposalID);
    const tx = await govHandle["cancel(uint256)"](proposalID);
    const tx_rcp = await tx.wait();
});

task("proposeDAOProfileRegistry", "Propose a registry to serve as profile accounts for the DAO.")
  .addParam("address", "Address of the proposed profile registry.")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();
    const address = taskArgs.address;

    const govHandle = new hre.ethers.Contract(govAddress(), HG.abi, accounts[0]);

    const proposalDescription = `DAO Profile Registry: ${address}`;
    console.log("Proposal Description:", proposalDescription);
    const descriptionHash = hre.ethers.utils.id(proposalDescription);
    const transferCalldata = govHandle.interface.encodeFunctionData(
      "setProfileRegistry",
      [address],
    );

    const proposalID = await govHandle.hashProposal(
      [govHandle.address],
      [0],
      [transferCalldata],
      descriptionHash,
    );

    const tx = await govHandle["propose(address[],uint256[],bytes[],string)"](
      [govHandle.address],
      [0],
      [transferCalldata],
      proposalDescription,
    );
    const tx_reciept = await tx.wait();
    console.log("Proposal ID:", proposalID.toString());
    console.log("Description Hash:", descriptionHash.toString());
});

task("proposeVotingPeriod", "Propose a new voting period (in blocks) for the DAO.")
  .addParam("blocks", "Number of blocks a proposal should stand for.")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();
    const blocks = taskArgs.blocks;

    const govHandle = new hre.ethers.Contract(govAddress(), HG.abi, accounts[0]);

    const proposalDescription = `New Voting Period: ${blocks} blocks`;
    console.log("Proposal Description:", proposalDescription);
    const descriptionHash = hre.ethers.utils.id(proposalDescription);
    const transferCalldata = govHandle.interface.encodeFunctionData(
      "setVotingPeriod",
      [blocks],
    );

    const proposalID = await govHandle.hashProposal(
      [govHandle.address],
      [0],
      [transferCalldata],
      descriptionHash,
    );

    const tx = await govHandle["propose(address[],uint256[],bytes[],string)"](
      [govHandle.address],
      [0],
      [transferCalldata],
      proposalDescription,
    );
    const tx_reciept = await tx.wait();
    console.log("Proposal ID:", proposalID.toString());
    console.log("Description Hash:", descriptionHash.toString());
});

task("proposeVotingThreshold", "Propose a new voting threshold (in tokens) for the DAO.")
  .addParam("threshold", "Minimum number of tokens needed to make a proposal.")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();
    const threshold = ethers.utils.parseEther(taskArgs.threshold);

    const govHandle = new hre.ethers.Contract(govAddress(), HG.abi, accounts[0]);

    const proposalDescription = `New threshold: ${threshold} tokens`;
    console.log("Proposal Description:", proposalDescription);
    const descriptionHash = hre.ethers.utils.id(proposalDescription);
    const transferCalldata = govHandle.interface.encodeFunctionData(
      "setProposalThreshold",
      [threshold],
    );

    const proposalID = await govHandle.hashProposal(
      [govHandle.address],
      [0],
      [transferCalldata],
      descriptionHash,
    );

    const tx = await govHandle["propose(address[],uint256[],bytes[],string)"](
      [govHandle.address],
      [0],
      [transferCalldata],
      proposalDescription,
    );
    const tx_reciept = await tx.wait();
    console.log("Proposal ID:", proposalID.toString());
    console.log("Description Hash:", descriptionHash.toString());
});

task("proposeModule", "Propose a new module for use with Hypernet Registries.")
  .addParam("address", "Address of the module contract.")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();
    const address = taskArgs.address;

    const govHandle = new hre.ethers.Contract(govAddress(), HG.abi, accounts[0]);
    const factoryHandle = new hre.ethers.Contract(
        factoryAddress(),
        RF.abi,
        accounts[0],
      );

    const proposalDescription = `New Registry Module: ${address}`;
    console.log("Proposal Description:", proposalDescription);
    const descriptionHash = hre.ethers.utils.id(proposalDescription);
    const transferCalldata = factoryHandle.interface.encodeFunctionData(
      "addModule",
      [address],
    );

    const proposalID = await govHandle.hashProposal(
      [factoryHandle.address],
      [0],
      [transferCalldata],
      descriptionHash,
    );

    const tx = await govHandle["propose(address[],uint256[],bytes[],string)"](
      [factoryHandle.address],
      [0],
      [transferCalldata],
      proposalDescription,
    );
    const tx_reciept = await tx.wait();
    console.log("Proposal ID:", proposalID.toString());
    console.log("Description Hash:", descriptionHash.toString());
});

task("proposeRegistry", "Propose a new NonFungibleRegistry via the DAO.")
  .addParam("name", "Name for proposed registry.")
  .addParam("symbol", "Symbol for proposed registry.")
  .addParam("owner", "Address of Owner of proposed registry.")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();

    const govHandle = new hre.ethers.Contract(govAddress(), HG.abi, accounts[0]);
    const factoryHandle = new hre.ethers.Contract(
      factoryAddress(),
      RF.abi,
      accounts[0],
    );

    const proposalDescription = taskArgs.name;
    const descriptionHash = hre.ethers.utils.id(proposalDescription);
    const registrySymbol = taskArgs.symbol;
    const registryOwner = taskArgs.owner;
    const transferCalldata = factoryHandle.interface.encodeFunctionData(
      "createRegistry",
      [proposalDescription, registrySymbol, registryOwner, true],
    );

    const proposalID = await govHandle.hashProposal(
      [factoryAddress()],
      [0],
      [transferCalldata],
      descriptionHash,
    );

    const tx = await govHandle["propose(address[],uint256[],bytes[],string)"](
      [factoryAddress()],
      [0],
      [transferCalldata],
      proposalDescription,
    );
    const tx_reciept = await tx.wait();
    console.log("Proposal ID:", proposalID.toString());
    console.log("Description Hash:", descriptionHash.toString());
});

task("proposeRegistryEntry", "Propose a new NonFungibleRegistry where Governance Contract is owner.")
  .addParam("name", "Name of target Registry where NFI is to be entered.")
  .addParam("label", "NFI label.")
  .addParam("data", "Data to be written to NFI entry.")
  .addParam("recipient", "Recipient address of the NFI.")
  .addParam("tokenid", "desired ID for the NFI")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();
    const registryName = taskArgs.name;
    const NFILabel = taskArgs.label;
    const NFIData = taskArgs.data;
    const NFIRecipient = taskArgs.recipient;
    const tokenid = taskArgs.tokenid;

    const govHandle = new hre.ethers.Contract(govAddress(), HG.abi, accounts[0]);
    const factoryHandle = new hre.ethers.Contract(factoryAddress(), RF.abi, accounts[0]);

    // lookup address for target registry
    const registryAddress = await factoryHandle.nameToAddress(registryName);
    const registryHandle = new hre.ethers.Contract(registryAddress, NFR.abi, accounts[0]);

    // construct proposal
    const proposalDescription = NFILabel; // just name the proposal after the lable of the NonFungibleIdentity
    const descriptionHash = hre.ethers.utils.id(proposalDescription);
    const transferCalldata = registryHandle.interface.encodeFunctionData(
      "register",
      [NFIRecipient, NFILabel, NFIData, tokenid],
    );

    const proposalID = await govHandle.hashProposal(
      [registryAddress],
      [0],
      [transferCalldata],
      descriptionHash,
    );
    // propose a new registry
    const tx = await govHandle["propose(address[],uint256[],bytes[],string)"](
      [registryAddress],
      [0],
      [transferCalldata],
      proposalDescription,
    );
    const tx_reciept = await tx.wait();
    console.log("Proposal ID:", proposalID.toString());
    console.log("Description Hash:", descriptionHash.toString());
});

task("proposePaymentToken", "Propose a new Payment Token for the Hypernet Protocol.")
  .addParam("name", "Name of the Payment token to display in the UI.")
  .addParam("symbol", "Token symbol.")
  .addParam("chainid", "Id of the blockchain.")
  .addParam("address", "Contract address of the token.")
  .addParam("nativetoken", "Boolean indicating if this is a native token to the chain.")
  .addParam("erc20", "Boolean indicated if the token is ERC20.")
  .addParam("decimals", "Number of decimal places supported by the token.")
  .addParam("logourl", "Location to pull token logo for UI.")
  .addParam("tokenid", "Unique id for the NFI.")
  .setAction(async (taskArgs) => {
    const registryName = "Payment Tokens";

    const accounts = await hre.ethers.getSigners();
    
    const name = taskArgs.name;
    const symbol = taskArgs.symbol;
    const chainid = taskArgs.chainid;
    const address = taskArgs.address;
    const nativetoken = (taskArgs.nativetoken == 'true');
    const erc20 = (taskArgs.erc20 == 'true');
    const decimals = taskArgs.decimals;
    const logourl = taskArgs.logourl;
    const tokenid = taskArgs.tokenid; 

    const govHandle = new hre.ethers.Contract(govAddress(), HG.abi, accounts[0]);
    const factoryHandle = new hre.ethers.Contract(factoryAddress(), RF.abi, accounts[0]);

    // lookup address for target registry
    const registryAddress = await factoryHandle.nameToAddress(registryName);
    const registryHandle = new hre.ethers.Contract(registryAddress, NFR.abi, accounts[0]);

    const tokenData = JSON.stringify({
        name: name,
        symbol: symbol,
        chainId: chainid,
        address: address,
        nativeToken: nativetoken,
        erc20: erc20,
        decimals: decimals,
        logoUrl: logourl,
      });

    const tokenLabel = `${chainid}:${name}`;

    // construct proposal
    const proposalDescription = `${tokenLabel}, ${tokenData}, ${tokenid}`; // just name the proposal after the lable of the NonFungibleIdentity
    const descriptionHash = hre.ethers.utils.id(proposalDescription);
    const transferCalldata = registryHandle.interface.encodeFunctionData(
      "register",
      [timelockAddress(), tokenLabel, tokenData, tokenid],
    );

    const proposalID = await govHandle.hashProposal(
      [registryAddress],
      [0],
      [transferCalldata],
      descriptionHash,
    );
    // propose a new registry
    const tx = await govHandle["propose(address[],uint256[],bytes[],string)"](
      [registryAddress],
      [0],
      [transferCalldata],
      proposalDescription,
    );
    const tx_reciept = await tx.wait();
    console.log("Proposal Description:", proposalDescription);
    console.log("Proposal ID:", proposalID.toString());
    console.log("Description Hash:", descriptionHash.toString());
});

task("proposeRegistryParameterUpdate", "Propose updates to a registries parameters.")
  .addParam("name", "Name of target Registry to update.")
  .addParam("schema", "New schema field.")
  .addParam("storageupdate", "Boolean flag to all updating storage.")
  .addParam("labelchange", "Boolean flag to udpate NFI labels")
  .addParam("allowtransfers", "Boolean flag to allow NFI transfers")
  .addParam("registrationtoken", "Address of ERC20 token to use for token-based registration")
  .addParam("registrationfee", "Amount of registration token needed to create an NFI")
  .addParam("burnaddress","Address where burned tokens will be sent")
  .addParam("burnfee", "percentage of registration token to burn (<=10000)")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();
    const registryName = taskArgs.name;
    const schema = (taskArgs.schema.length ? [taskArgs.schema]: []);
    const storageupdate = (taskArgs.storageupdate.length ? [taskArgs.storageupdate == 'true']: []);
    const labelchange = (taskArgs.labelchange.length ? [taskArgs.labelchange == 'true']: []);
    const allowtransfers = (taskArgs.allowtransfers.length ? [taskArgs.allowtransfers == 'true']: []);
    const registrationtoken = (taskArgs.registrationtoken.length ? [taskArgs.registrationtoken] : []);
    const registrationfee = (taskArgs.registrationfee.length ? [taskArgs.registrationfee]: []);
    const burnaddress = (taskArgs.burnaddress.length ? [taskArgs.burnaddress]: []);
    const burnfee = (taskArgs.burnfee.length ? [taskArgs.burnfee]: []);

    const govHandle = new hre.ethers.Contract(govAddress(), HG.abi, accounts[0]);
    const factoryHandle = new hre.ethers.Contract(factoryAddress(), RF.abi, accounts[0]);

    // lookup address for target registry
    const registryAddress = await factoryHandle.nameToAddress(registryName);
    const registryHandle = new hre.ethers.Contract(registryAddress, NFR.abi, accounts[0]);

    // construct proposal
    const proposalDescription = `Registry: ${registryName}, schema: ${schema}, storage: ${storageupdate}, label: ${labelchange}, transfers: ${allowtransfers}, regToken: ${registrationtoken}, regFee: ${registrationfee}, burnAdr: ${burnaddress}, burnfee: ${burnfee}`; 
    const descriptionHash = hre.ethers.utils.id(proposalDescription);
    console.log("Description:", proposalDescription);
    console.log("Description Hash:", descriptionHash);

    const abiCoder = ethers.utils.defaultAbiCoder;

    // construct call data via ABI encoding
    let params = abiCoder.encode(
        [
          "tuple(string[], bool[], bool[], bool[], address[], uint256[], address[], uint256[])",
        ],
        [
            [
            schema, 
            storageupdate, 
            labelchange, 
            allowtransfers, 
            registrationtoken, 
            registrationfee, 
            burnaddress, 
            burnfee
            ]
        ],
      );

    const transferCalldata = registryHandle.interface.encodeFunctionData(
      "setRegistryParameters",
      [params],
    );

    const proposalID = await govHandle.hashProposal(
      [registryAddress],
      [0],
      [transferCalldata],
      descriptionHash,
    );

    const tx = await govHandle["propose(address[],uint256[],bytes[],string)"](
      [registryAddress],
      [0],
      [transferCalldata],
      proposalDescription,
    );
    const tx_reciept = await tx.wait();
    console.log("Proposal ID:", proposalID.toString());
    console.log("Description Hash:", descriptionHash.toString());
});