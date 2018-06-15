module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    test:{
    	host:"https://anupam124jain.github.io/",
    	port:8545,
    	network_id:4,
    	gas:4700000

    }
  }
};
