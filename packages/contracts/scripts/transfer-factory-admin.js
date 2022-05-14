
const hre = require("hardhat");


async function transfer(governor, factory, to) {
    // TODO
}

async function main() {

    const [owner] = await hre.ethers.getSigners();
    newOwner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

    const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    const tokenDef = require("../artifacts/contracts/governance/Hypertoken.sol/Hypertoken.json")
    const token = new web3.eth.Contract(tokenDef.abi, tokenAddress)

    factoryAddress = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788"
    const factoryDef = require("../artifacts/contracts/identity/UpgradeableRegistryFactory.sol/UpgradeableRegistryFactory.json")
    const factory = new web3.eth.Contract(factoryDef.abi, factoryAddress)

    const factory2 = await ethers.getContractAt("UpgradeableRegistryFactory", factoryAddress)

    transferCallData = factory2.interface.encodeFunctionData("grantRole", ["0x0000000000000000000000000000000000000000000000000000000000000000", newOwner])
    console.log("transferCallData:", transferCallData)
  

    governorAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
    const governorDef = require("../artifacts/contracts/governance/HypernetGovernor.sol/HypernetGovernor.json")

    const governor = await ethers.getContractAt("HypernetGovernor", governorAddress)

    proposalDesc = "Transfer factory admin to deployer 16"

    governor.on("ProposalQueued", async (proposalId, eta) => {
        console.log("ProposalQueued ", proposalId, eta)
        console.log("Queue successful. Executing proposal")

        const descriptionHash = ethers.utils.id(proposalDesc);
        const result = await governor.execute(
            [factoryAddress],
            [0],
            [transferCallData],
            descriptionHash

        )
    })
    governor.on("ProposalExecuted", async (proposalId) => {
        console.log("ProposalExecutedProposalExecuted ", proposalId)
    })

    governor.on("ProposalCreated", async (proposalId) => {
        console.log("proposal id is and executing vote", proposalId)

        // cast my vote

        await governor.castVote(proposalId, 1)
        

        // const castVote = await governor.castVote(proposalId, 1)

        var state = await governor.state(proposalId)
        // console.log(state)

        while (state == 0 || state == 1) {

            console.log("waiting 10 seconds for voting to complete, current state:", state)
            await new Promise(resolve => setTimeout(resolve, 10000));
            state = await governor.state(proposalId)
        }

        if (state == 4) {
            console.log("voting successful. Queuing proposal")
            const descriptionHash = ethers.utils.id(proposalDesc);
            const result = await governor.queue(
                [factoryAddress],
                [0],
                [transferCallData],
                descriptionHash

            )
        } else {
            console.log("something bad happened with state", state)

        }



    })


    const result = await governor.propose(
        [factoryAddress],
        [0],
        [transferCallData],
        proposalDesc

    )

    const receipt = await result.wait()


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });