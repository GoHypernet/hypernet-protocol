module.exports = {
  // default applies to all environments
  default: {
    library: 'embarkjs',  // can also be 'web3'

    // order of connections the dapp should connect to
    dappConnection: [
      "$EMBARK",
      "$WEB3",  // uses pre existing web3 object if available (e.g in Mist)
      "ws://localhost:8546",
      "http://localhost:8545"
    ],

    // Automatically call `ethereum.enable` if true.
    // If false, the following code must run before sending any transaction: `await EmbarkJS.enableEthereum();`
    // Default value is true.
    // dappAutoEnable: true,

    gas: "auto",

    // Strategy for the deployment of the contracts:
    // - implicit will try to deploy all the contracts located inside the contracts directory
    //            or the directory configured for the location of the contracts. This is default one
    //            when not specified
    // - explicit will only attempt to deploy the contracts that are explicitly specified inside the
    //            contracts section.
    strategy: 'explicit',

    // minimalContractSize, when set to true, tells Embark to generate contract files without the heavy bytecodes
    // Using filteredFields lets you customize which field you want to filter out of the contract file (requires minimalContractSize: true)
    // minimalContractSize: false,
    // filteredFields: [],

		interfaces: [
			'ForceMoveApp',
			'IAssetHolder',
			'IForceMove',
			'IERC20',
		],

		// Note: these are all intializable, so they don't take any constructors or deploy args.
		// We DO, however, need to call the initialize() function after deploying them!
		// This is done via the onDeploy hooks
    deploy: {

			HypernetProtocolAdjudicator: {

			},

			HypernetProtocolStateMachine: {

			},

			Hypertoken: {

			},

			// Note that even though this does require the addresses of its two depencies to deploy, there is no type checking;
			// Therefore, we can deploy all four contracts, and then call initialize on the three initializable contracts afterwards
			HypertokenAssetHolder: {
				args: [
					'$HypernetProtocolAdjudicator',
					'$Hypertoken'
				]
			}
    },

		afterDeploy: ({contracts, web3, logger}) => {
			contracts.HypernetProtocolAdjudicator.methods.initialize().send({from: web3.eth.defaultAccount});
			contracts.HypernetProtocolStateMachine.methods.initialize().send({from: web3.eth.defaultAccount});
			contracts.Hypertoken.methods.initialize().send({from: web3.eth.defaultAccount});
		}
  },

  // default environment, merges with the settings in default
  // assumed to be the intended environment by `embark run`
  development: {},

  // merges with the settings in default
  // used with "embark run privatenet"
  privatenet: {},

  // you can name an environment with specific settings and then specify with
  // "embark run custom_name" or "embark blockchain custom_name"
  // custom_name: {}
};
