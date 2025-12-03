import React from "react";
import { useWallet } from "../hooks/useContract";
import { switchToLocalNetwork } from "../utils/web3";
import "./WalletConnect.css";

export function WalletConnect() {
    const { account, balance, connected, loading, error, connect } = useWallet();

    const handleConnect = async () => {
        try {
            // First switch to local network
            await switchToLocalNetwork();
            // Then connect wallet
            await connect();
        } catch (err) {
            console.error("Connection failed:", err);
            alert(err.message || "Failed to connect wallet");
        }
    };

    if (loading) {
        return (
            <div className="wallet-connect">
                <button className="wallet-button" disabled>
                    Connecting...
                </button>
            </div>
        );
    }

    if (error) {
        return (
            <div className="wallet-connect">
                <button className="wallet-button error" onClick={handleConnect}>
                    ⚠️ {error}
                </button>
            </div>
        );
    }

    if (!connected) {
        return (
            <div className="wallet-connect">
                <button className="wallet-button" onClick={handleConnect}>
                    🦊 Connect MetaMask
                </button>
            </div>
        );
    }

    return (
        <div className="wallet-connect connected">
            <div className="wallet-info">
                <div className="wallet-address">
                    <span className="label">Connected:</span>
                    <span className="address">
                        {account?.slice(0, 6)}...{account?.slice(-4)}
                    </span>
                </div>
                <div className="wallet-balance">
                    <span className="label">Balance:</span>
                    <span className="balance">{parseFloat(balance).toFixed(4)} ETH</span>
                </div>
            </div>
        </div>
    );
}
