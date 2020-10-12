module.exports = {
  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.

		// standard/defaul empty local blockchain
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },

		// Local, forked verison of geth! for this to work, you need to be running
		// ganache-cli forked from a local (or remote) version of geth; the idea
		// is to use a fully-synced node so that you can simulate present-day blockchain conditions
		// Note that you /can/ also use the "development" network via `npx ganache-cli --deterministic`
		// here, but since this blockchain isn't persistent, you will get weird errors on the next
		// run unless you delete the forked.json file that stores deployed contract addresses.
		forked: {
			host: "127.0.0.1",
			port: 8546,
			network_id: "*"
		}
  },

  mocha: {},

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.6.2"		    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  }
}
