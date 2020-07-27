const { scripts, ConfigManager } = require('@openzeppelin/cli');
const { add, push, create } = scripts;

async function deploy(options) {
	add({ contractsData: [{ name: 'Hypertoken', alias: 'Hypertoken' }] })
	await push(options);
	await create(Object.assign({ contractAlias: 'Hypertoken' }, options));
}

module.exports = function(deployer, networkName, accounts) {
	deployer.then(async () => {
		const { network, txParams } = await ConfigManager.initNetworkConfiguration({ network: networkName, from: accounts[0] })
		await deploy({ network, txParams })
	})
}
