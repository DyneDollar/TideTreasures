require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require('dotenv').config()

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    sepolia: {
      url: "https://sepolia.gateway.tenderly.co/5E0lyl9cbTPRzK1sBUrYaB",
      accounts: [`0x${process.env.RPC_PRIVATE_KEY}`], 
      gasPrice: 15000000
    },
    goerli: {
      url: `https://goerli.gateway.tenderly.co/5E0lyl9cbTPRzK1sBUrYaB`,
      accounts: [process.env.RPC_PRIVATE_KEY],
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com/",
      accounts: [`0x${process.env.RPC_PRIVATE_KEY}`],
      chainId: 80001,
      gasPrice: 20000000000,  // You can adjust this value according to the network status
    }
  },
  solidity: {
    version: "0.8.1",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
