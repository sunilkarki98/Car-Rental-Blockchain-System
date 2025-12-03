
const { ethers, network } = require("hardhat");
const { saveContractInfo } = require("./save-contract-info");
require("dotenv").config();

async function main() {
  console.log("\n🚀 Starting deployment...\n");
  console.log(`Network: ${network.name}`);
  console.log(`Chain ID: ${network.config.chainId}\n`);

  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with account: ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Account balance: ${ethers.formatEther(balance)} ETH\n`);

  const CarChainFactory = await ethers.getContractFactory("CarChain");
  console.log("Deploying CarChain contract...");

  const carChain = await CarChainFactory.deploy();
  await carChain.waitForDeployment();
  const contractAddress = await carChain.getAddress();

  console.log(`✅ CarChain deployed to: ${contractAddress}\n`);

  // Save contract info for frontend
  const fullArtifact = require("../artifacts/contracts/CarChain.sol/CarChain.json");
  saveContractInfo("CarChain", contractAddress, fullArtifact, network.name);

  // Verify on Etherscan if on testnet/mainnet
  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    console.log("⏳ Waiting for block confirmations...");
    await carChain.deploymentTransaction().wait(6);
    await verify(contractAddress, []);
  }

  // Local network instructions
  if (network.name === "localhost" || network.name === "hardhat") {
    console.log("=".repeat(60));
    console.log("🎉 LOCAL DEPLOYMENT SUCCESSFUL!");
    console.log("=".repeat(60));
    console.log("\n📋 Next Steps:\n");
    console.log("1. Configure MetaMask:");
    console.log("   - Network Name: Hardhat Local");
    console.log("   - RPC URL: http://127.0.0.1:8545");
    console.log("   - Chain ID: 31337");
    console.log("   - Currency Symbol: ETH\n");
    console.log("2. Import a test account to MetaMask:");
    console.log("   - Use one of the private keys from Hardhat node output\n");
    console.log("3. Start the frontend:");
    console.log("   - cd frontend && npm start\n");
    console.log("4. Connect your wallet and interact with the contract!\n");
    console.log("=".repeat(60));
  }
}

async function verify(contractAddress, args) {
  console.log("\n🔍 Verifying contract on Etherscan...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
    console.log("✅ Contract verified!");
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("✅ Contract already verified!");
    } else {
      console.log("❌ Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
