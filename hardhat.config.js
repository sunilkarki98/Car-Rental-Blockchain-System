require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("solidity-coverage");

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || "https://eth-goerli";
const privateKey = process.env.PRIVATE_KEY || "0xkey";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      mining: {
        auto: true,
        interval: 0,
      },
      accounts: {
        mnemonic: "stick expire sort idea trip farm pulp consider valve urge hunt kingdom",
        count: 10,
      },
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      accounts: {
        mnemonic: "stick expire sort idea trip farm pulp consider valve urge hunt kingdom",
        count: 10,
      },
    },
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [privateKey],
      chainId: 5,
    },
  },
  solidity: {
    version: "0.8.16",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
