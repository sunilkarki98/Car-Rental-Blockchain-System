import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { connectWallet, switchToLocalNetwork, getNetworkInfo } from "../utils/web3";

/**
 * Custom hook for managing contract interactions
 * @param {string} contractAddress - Contract address
 * @param {Array} contractABI - Contract ABI
 */
export function useContract(contractAddress, contractABI) {
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [network, setNetwork] = useState(null);

    const loadContract = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Check if MetaMask is installed
            if (typeof window.ethereum === "undefined") {
                throw new Error("Please install MetaMask to use this app");
            }

            // Get network info
            const networkInfo = await getNetworkInfo();
            setNetwork(networkInfo);

            // Connect wallet
            const { provider, signer, address } = await connectWallet();
            setAccount(address);

            // Create contract instance
            if (contractAddress && contractABI) {
                const contractInstance = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer
                );
                setContract(contractInstance);
            }

            setLoading(false);
        } catch (err) {
            console.error("Failed to load contract:", err);
            setError(err.message);
            setLoading(false);
        }
    }, [contractAddress, contractABI]);

    useEffect(() => {
        loadContract();

        // Listen for account changes
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    loadContract();
                } else {
                    setAccount(null);
                    setContract(null);
                }
            });

            window.ethereum.on("chainChanged", () => {
                loadContract();
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeAllListeners("accountsChanged");
                window.ethereum.removeAllListeners("chainChanged");
            }
        };
    }, [loadContract]);

    return {
        contract,
        account,
        network,
        loading,
        error,
        reload: loadContract,
        switchToLocal: switchToLocalNetwork,
    };
}

/**
 * Hook for managing wallet connection state
 */
export function useWallet() {
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const connect = async () => {
        try {
            setLoading(true);
            setError(null);

            const { address, balance } = await connectWallet();
            setAccount(address);
            setBalance(balance);
            setConnected(true);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const disconnect = () => {
        setAccount(null);
        setBalance(null);
        setConnected(false);
    };

    useEffect(() => {
        // Check if already connected
        if (window.ethereum && window.ethereum.selectedAddress) {
            connect();
        }

        // Listen for account changes
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    connect();
                } else {
                    disconnect();
                }
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeAllListeners("accountsChanged");
            }
        };
    }, []);

    return {
        account,
        balance,
        connected,
        loading,
        error,
        connect,
        disconnect,
    };
}
