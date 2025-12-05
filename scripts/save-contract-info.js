import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

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

    const frontendContractsDir = join(__dirname, "../frontend/src/contracts");

    if (!existsSync(frontendContractsDir)) {
        mkdirSync(frontendContractsDir, { recursive: true });
    }

    const contractPath = join(frontendContractsDir, `${contractName}.json`);
    writeFileSync(contractPath, JSON.stringify(contractInfo, null, 2));

    console.log(`\n📝 Contract info saved to: ${contractPath}`);
    console.log(`   Address: ${address}`);
    console.log(`   Network: ${network}`);
    console.log(`   Chain ID: ${contractInfo.chainId || "N/A"}\n`);
}

export default { saveContractInfo };
