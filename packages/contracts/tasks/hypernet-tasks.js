const {  HT, HG, RF, NFR, govAddress, factoryAddress, hAddress}  = require("./constants.js");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("sendhypertoken", "Send hypertoken to another account")
  .addParam("recipient", "Address of the recipient")
  .addParam("amount", "Amount of Hypertoken to send")
  .setAction(async (taskArgs) => {
    const [owner] = await hre.ethers.getSigners();

  const hypertoken = new hre.ethers.Contract(hAddress(), HT.abi, owner);
  const recipient = taskArgs.recipient;
  const amount = taskArgs.amount;
  const tx = await hypertoken.transfer(recipient, amount);
  const tx_rcpt = await tx.wait();
  const balR = await hypertoken.balanceOf(recipient);
  const balS = await hypertoken.balanceOf(owner.address);


  console.log("Balance of sender:", balS.toString());
  console.log("Balance of recipient:", balR.toString());
});

task("delegateVote", "Delegate your voting power")
  .addParam("delegate", "Address of the delegate (can be self)")
  .setAction(async (taskArgs) => {
    const [owner] = await hre.ethers.getSigners();

    const hypertoken = new hre.ethers.Contract(hAddress(), HT.abi, owner);
    const delegate = taskArgs.delegate;
    const amount = taskArgs.amount;
    const tx = await hypertoken.delegate(delegate);
    const tx_rcpt = await tx.wait();
    const votePowerDelegate = await hypertoken.getVotes(delegate)
    const votePowerOwner = await hypertoken.getVotes(owner.address)

    console.log("Voting power of Owner:", votePowerOwner.toString());
    console.log("Voting power of Delegate:", votePowerDelegate.toString());
});

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
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

task("createRegistryByToken", "Creates a registry by burning token.")
  .addParam("name", "Name of the target registry.")
  .addParam("symbol", "Symbol to give to the registry.")
  .addParam("registrar", "Address to assign the REGISTRAR_ROLE.")
  .addParam("enumerable", "boolean indicating if the token should be enumerable or not.")
  .setAction(async (taskArgs) => {
    const name = taskArgs.name;
    const symbol = taskArgs.symbol;
    const registrar = taskArgs.registrar;
    const enumerable = taskArgs.enumerable;

    const accounts = await hre.ethers.getSigners();

    const hypertoken = new hre.ethers.Contract(hAddress(), HT.abi, accounts[0]);
    const factoryHandle = new hre.ethers.Contract(factoryAddress(), RF.abi, accounts[0]);

    const regFee =  await factoryHandle.registrationFee();
       
    // approve the registry factory to pull hypertoken from the users wallet
    let tx = await hypertoken.approve(factoryHandle.address, regFee);
    tx.wait();

    tx = await factoryHandle.createRegistryByToken(name, symbol, registrar, enumerable);
    tx.wait();

    const regAddress = await factoryHandle.nameToAddress(name);
    console.log("Registry Deployed to:", regAddress);

});

task("registryParameters", "Prints NFR  parameters.")
  .addParam("name", "Name of the target registry.")
  .setAction(async (taskArgs) => {
    const name = taskArgs.name;

    const accounts = await hre.ethers.getSigners();

    const factoryHandle = new hre.ethers.Contract(factoryAddress(), RF.abi, accounts[0]);
    const registryAddress = await factoryHandle.nameToAddress(name);
    const registryHandle = new hre.ethers.Contract(registryAddress, NFR.abi, accounts[0]);

    const REGISTRAR_ROLE = registryHandle.REGISTRAR_ROLE();
    const registrarAddress = await registryHandle.getRoleMember(REGISTRAR_ROLE,0);
    const symbol = await registryHandle.symbol();
    const numberOfEntries = await registryHandle.totalSupply();
    const registrationToken = await registryHandle.registrationToken();
    const registrationFee = await registryHandle.registrationFee();
    const primaryRegistry = await registryHandle.primaryRegistry();
    console.log("Registry Name:", name);
    console.log("Registry Symbol:", symbol);
    console.log("Registry Address:", registryAddress);
    console.log("Registrar:", registrarAddress);
    console.log("Number of Entries:", numberOfEntries.toString());
    console.log("Registration Token:", registrationToken);
    console.log("Registration Fee:", registrationFee.toString());
    console.log("Primary Registry:", primaryRegistry);
});

task("setRegistryParameters", "Prints NFR  parameters.")
  .addParam("name", "name of the Registry to update.")
  .addParam("regtoken", "address of token to use for registration by token")
  .addParam("primaryreg", "NFR for checking preregistration")
  .setAction(async (taskArgs) => {
    const name = taskArgs.name;
    const tokenAddress = taskArgs.regtoken;
    const primaryreg = taskArgs.primaryreg;

    const accounts = await hre.ethers.getSigners();

    const factoryHandle = new hre.ethers.Contract(factoryAddress(), RF.abi, accounts[0]);
    const registryAddress = await factoryHandle.nameToAddress(name);
    const registryHandle = new hre.ethers.Contract(registryAddress, NFR.abi, accounts[0]);

    const abiCoder = ethers.utils.defaultAbiCoder;

    // construct call data via ABI encoding
    let params = abiCoder.encode(
        [
            "tuple(string[], bool[], bool[], bool[], bool[], address[], uint256[], address[], uint256[], address[])"
        ], 
        [ 
            [
                [], [], [], [], [], [tokenAddress], [], [], [], [primaryreg]
            ] 
        ]);

    const tx = await registryHandle.setRegistryParameters(params);
    tx.wait();

    const symbol = await registryHandle.symbol();
    const numberOfEntries = await registryHandle.totalSupply();
    const registrationToken = await registryHandle.registrationToken();
    const registrationFee = await registryHandle.registrationFee();
    const primaryRegistry = await registryHandle.primaryRegistry();
    console.log("Registry Name:", name);
    console.log("Registry Symbol:", symbol);
    console.log("Registry Address:", registryAddress);
    console.log("Number of Entries:", numberOfEntries.toString());
    console.log("Registration Token:", registrationToken);
    console.log("Registration Fee:", registrationFee.toString());
    console.log("Primary Registry:", primaryRegistry);
});

task("registryEntryByLabel", "Prints NunFungible Identity Data.")
  .addParam("name", "Target NonFungle Registry Name.")
  .addParam("label", "NFI label")
  .setAction(async (taskArgs) => {
    const name = taskArgs.name;
    const label = taskArgs.label;

    const accounts = await hre.ethers.getSigners();

    const factoryHandle = new hre.ethers.Contract(factoryAddress(), RF.abi, accounts[0]);
    const registryAddress = await factoryHandle.nameToAddress(name);
    const registryHandle = new hre.ethers.Contract(registryAddress, NFR.abi, accounts[0]);
    
    const tokenId = await registryHandle.registryMap(label);
    const tokenURI = await registryHandle.tokenURI(tokenId);
    const tokenOwner =  await registryHandle.ownerOf(tokenId);

    console.log("Owner of NFI:", tokenOwner);
    console.log("Token ID:", tokenId.toString());
    console.log("NFI Data:", tokenURI);
});

task("registryEntryByTokenID", "Prints NunFungible Identity Data.")
  .addParam("name", "Target NonFungle Registry Name.")
  .addParam("tokenid", "NFI label")
  .setAction(async (taskArgs) => {
    const name = taskArgs.name;
    const tokenId = taskArgs.tokenid;

    const accounts = await hre.ethers.getSigners();

    const factoryHandle = new hre.ethers.Contract(factoryAddress(), RF.abi, accounts[0]);
    const registryAddress = await factoryHandle.nameToAddress(name);
    const registryHandle = new hre.ethers.Contract(registryAddress, NFR.abi, accounts[0]);

    const tokenURI = await registryHandle.tokenURI(tokenId);
    const tokenOwner =  await registryHandle.ownerOf(tokenId);

    console.log("Owner of NFI:", tokenOwner);
    console.log("Token ID:", tokenId.toString());
    console.log("NFI Data:", tokenURI);
});

task("transferEntryByTokenID", "Transfers a token to a specified participant.")
  .addParam("name", "Target NonFungle Registry Name")
  .addParam("tokenid", "NFI tokenId")
  .addParam("recipient", "Wallet address of the reciever")
  .setAction(async (taskArgs) => {
    const name = taskArgs.name;
    const tokenId = taskArgs.tokenid;
    const recipient = taskArgs.recipient;

    const accounts = await hre.ethers.getSigners();

    const factoryHandle = new hre.ethers.Contract(factoryAddress(), RF.abi, accounts[0]);
    const registryAddress = await factoryHandle.nameToAddress(name);
    const registryHandle = new hre.ethers.Contract(registryAddress, NFR.abi, accounts[0]);

    const tokenOwner =  await registryHandle.ownerOf(tokenId);

    let tx = await registryHandle.transferFrom(tokenOwner, recipient, tokenId)
    tx.wait();

    const newTokenOwner =  await registryHandle.ownerOf(tokenId);

    console.log("New owner of NFI:", newTokenOwner);
});

task("burnRegistryEntry", "Prints NunFungible Identity Data.")
  .addParam("name", "Target NonFungle Registry Name.")
  .addParam("tokenid", "token ID of the NFI.")
  .setAction(async (taskArgs) => {
    const name = taskArgs.name;
    const tokenId = taskArgs.tokenid;

    const accounts = await hre.ethers.getSigners();

    const factoryHandle = new hre.ethers.Contract(factoryAddress(), RF.abi, accounts[0]);
    const registryAddress = await factoryHandle.nameToAddress(name);
    const registryHandle = new hre.ethers.Contract(registryAddress, NFR.abi, accounts[0]);

    const balanceBefore = awaite.registryHandle.balanceOf(accounts[0].address);
    const tx = await registryHandle.burn(tokenId);
    tx.wait();
    const balanceAfter = awaite.registryHandle.balanceOf(accounts[0].address);
    console.log("Balance before: ", balanceBefore);
    console.log("Balance after: ", balanceAfter);
});

task("proposeRegistry", "Propose a new NonFungibleRegistry.")
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
    // propose a new registry
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

task("registerWithToken", "Register an NFI with ERC20 token.")
  .addParam("registry", "Name of target Registry where NFI is to be entered.")
  .addParam("label", "NFI label.")
  .addParam("data", "Data to be written to NFI entry.")
  .addParam("recipient", "Recipient address of the NFI.")
  .addParam("tokenid", "Desired token ID for NFI to be created.")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();

    const registryName = taskArgs.registry;
    const NFILabel = taskArgs.label;
    const NFIData = taskArgs.data;
    const NFIRecipient = taskArgs.recipient;
    const tokenid = taskArgs.tokenid;

    const hypertoken = new hre.ethers.Contract(hAddress(), HT.abi, accounts[0]);
    const factoryHandle = new hre.ethers.Contract(factoryAddress(), RF.abi, accounts[0]);

    const registryAddress = await factoryHandle.nameToAddress(registryName);
    const registryHandle = new hre.ethers.Contract(registryAddress, NFR.abi, accounts[0]);

    // approve the transfer of tokens to the NFR
    const registrationFee = await registryHandle.registrationFee();
    let tx = await hypertoken.approve(registryAddress, registrationFee);
    tx.wait();

    // call registerByToken on the NFR
    tx = await registryHandle.registerByToken(NFIRecipient, NFILabel, NFIData, tokenid);
    tx.wait();

    const tokenId = await registryHandle.registryMap(NFILabel);
    console.log("Token ID:", tokenId.toString());
});

task("burnToken", "Burn a token in the given registry if you are owner or registrar.")
  .addParam("registry", "Name of target Registry where NFI is to be entered.")
  .addParam("tokenid", "tokenID of the NFI (not the index or label)")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();

    const registryName = taskArgs.registry;
    const tokenid = taskArgs.tokenid;

    const factoryHandle = new hre.ethers.Contract(factoryAddress(), RF.abi, accounts[0]);

    const registryAddress = await factoryHandle.nameToAddress(registryName);
    const registryHandle = new hre.ethers.Contract(registryAddress, NFR.abi, accounts[0]);

    const tokenOwner = await registryHandle.ownerOf(tokenid);
    console.log("Owner Address:", tokenOwner);

    // call registerByToken on the NFR
    tx = await registryHandle.burn(tokenid);
    tx.wait();

    const balanceAfter = await registryHandle.balanceOf(tokenOwner);

    console.log("Balance of ", tokenOwner, "after burn is", balanceAfter.toString());
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
    console.log("Proposal Executed:", proposal[8]);
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
    const tx_rcpt = tx.wait();
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
    const tx_rcp = tx.wait();
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
    const tx_rcp = tx.wait();
});

task("cancelProposal", "Cancel a proposal if it is your or if proposer is below proposal threshold.")
  .addParam("id", "ID of an existing proposal.")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();

    const govHandle = new hre.ethers.Contract(govAddress(), HG.abi, accounts[0]);

    const proposalID = taskArgs.id;
    console.log("Cancelling Proposal:", proposalID);
    const tx = await govHandle["cancel(uint256)"](proposalID);
    const tx_rcp = tx.wait();
});