const fs = require("fs");
const path = require("path");

/**
 * Save contract deployment information for frontend use
 */
function saveContractInfo(contractName, address, artifact, network) {
    const contractInfo = {
        address: address,
        abi: artifact.abi,
        network: network,
        chainId: network === "localhost" || network === "hardhat" ? 31337 : undefined,
        deployedAt: new Date().toISOString(),
    };

    const frontendContractsDir = path.join(__dirname, "../frontend/src/contracts");

    if (!fs.existsSync(frontendContractsDir)) {
        fs.mkdirSync(frontendContractsDir, { recursive: true });
    }

    const contractPath = path.join(frontendContractsDir, `${contractName}.json`);
    fs.writeFileSync(contractPath, JSON.stringify(contractInfo, null, 2));

    console.log(`\n📝 Contract info saved to: ${contractPath}`);
    console.log(`   Address: ${address}`);
    console.log(`   Network: ${network}`);
    console.log(`   Chain ID: ${contractInfo.chainId || "N/A"}\n`);
}

module.exports = { saveContractInfo };
