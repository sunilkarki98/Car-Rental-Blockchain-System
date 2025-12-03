const { ethers } = require("ethers");

// Generate a random mnemonic
const wallet = ethers.Wallet.createRandom();
const mnemonic = wallet.mnemonic.phrase;

console.log("\n🔐 Freshly Generated Mnemonic:\n");
console.log(mnemonic);
console.log("\n");

// Show the first 3 accounts that will be generated
console.log("First 3 accounts that will be created:\n");
for (let i = 0; i < 3; i++) {
    const path = `m/44'/60'/0'/0/${i}`;
    const derivedWallet = ethers.HDNodeWallet.fromMnemonic(
        ethers.Mnemonic.fromPhrase(mnemonic),
        path
    );

    console.log(`Account #${i}:`);
    console.log(`  Address: ${derivedWallet.address}`);
    console.log(`  Private Key: ${derivedWallet.privateKey}`);
    console.log(`  Balance: 10000 ETH (on local network)\n`);
}

console.log("⚠️  SAVE THE MNEMONIC SAFELY - You'll need it to access these accounts!");
console.log("⚠️  These are for LOCAL DEVELOPMENT ONLY!\n");
