import { ethers } from "ethers";

/**
 * Connect to MetaMask wallet
 * @returns {Promise<{provider, signer, address}>}
 */
export async function connectWallet() {
    if (typeof window.ethereum === "undefined") {
        throw new Error(
            "MetaMask is not installed. Please install MetaMask to use this app."
        );
    }

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);

        return {
            provider,
            signer,
            address,
            balance: ethers.utils.formatEther(balance),
        };
    } catch (error) {
        console.error("Failed to connect wallet:", error);
        throw error;
    }
}

/**
 * Switch to Hardhat local network
 */
export async function switchToLocalNetwork() {
    console.log("🔄 Attempting to switch to Hardhat Local network (Chain ID: 31337)...");
    try {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x7A69" }], // 31337 in hex
        });
        console.log("✅ Successfully switched to Hardhat Local network!");
    } catch (error) {
        // Network doesn't exist, add it
        if (error.code === 4902) {
            console.log("⚠️ Network not found in MetaMask. Adding it now...");
            await addLocalNetwork();
        } else if (error.code === 4001) {
            console.warn("❌ User rejected network switch request");
            throw new Error("User rejected network switch request");
        } else {
            console.error("❌ Failed to switch network:", error);
            throw error;
        }
    }
}

/**
 * Add Hardhat local network to MetaMask
 */
async function addLocalNetwork() {
    console.log("➕ Adding Hardhat Local network to MetaMask...");
    try {
        await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
                {
                    chainId: "0x7A69", // 31337
                    chainName: "Hardhat Local",
                    nativeCurrency: {
                        name: "ETH",
                        symbol: "ETH",
                        decimals: 18,
                    },
                    rpcUrls: ["http://127.0.0.1:8545"],
                    blockExplorerUrls: null,
                },
            ],
        });
        console.log("✅ Hardhat Local network added successfully!");
    } catch (error) {
        if (error.code === 4001) {
            console.warn("❌ User rejected adding the network");
            throw new Error("User rejected adding the network");
        }
        console.error("❌ Failed to add local network:", error);
        throw error;
    }
}

/**
 * Get current network information
 */
export async function getNetworkInfo() {
    if (typeof window.ethereum === "undefined") {
        return null;
    }

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        return {
            name: network.name,
            chainId: network.chainId,
            isLocal: network.chainId === 31337,
        };
    } catch (error) {
        console.error("Failed to get network info:", error);
        return null;
    }
}

/**
 * Listen for account changes
 */
export function onAccountsChanged(callback) {
    if (typeof window.ethereum !== "undefined") {
        window.ethereum.on("accountsChanged", callback);
    }
}

/**
 * Listen for network changes
 */
export function onChainChanged(callback) {
    if (typeof window.ethereum !== "undefined") {
        window.ethereum.on("chainChanged", callback);
    }
}

/**
 * Format ETH amount for display
 */
export function formatEther(value) {
    return ethers.utils.formatEther(value);
}

/**
 * Parse ETH amount from string
 */
export function parseEther(value) {
    return ethers.utils.parseEther(value);
}
