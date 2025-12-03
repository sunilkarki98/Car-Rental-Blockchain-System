# Local Development Setup Guide

## 🚀 Quick Start

Follow these steps to run the Car Rental Blockchain System locally with MetaMask integration.

---

## Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- ✅ **MetaMask** browser extension - [Install](https://metamask.io/)
- ✅ **Git** (optional) - For cloning the repository

---

## Step 1: Install Dependencies

### Backend Dependencies

```bash
# Navigate to project root
cd Car-Rental-Blockchain-System

# Install Hardhat and dependencies
npm install
```

### Frontend Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install React and Web3 dependencies
npm install

# Return to project root
cd ..
```

---

## Step 2: Start Local Blockchain

Open a **new terminal** and run:

```bash
npm run node
```

You should see output like this:

```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

...
```

> **⚠️ IMPORTANT:** Keep this terminal running! This is your local blockchain.

**Save one of the private keys** - you'll need it for MetaMask in Step 4.

---

## Step 3: Deploy Smart Contract

Open a **second terminal** and run:

```bash
npm run deploy:local
```

You should see:

```
🚀 Starting deployment...

Network: localhost
Chain ID: 31337

Deploying contracts with account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Account balance: 10000.0 ETH

Deploying CarChain contract...
✅ CarChain deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3

📝 Contract info saved to: frontend/src/contracts/CarChain.json
```

> **✅ Success!** The contract is now deployed and the ABI is automatically saved for the frontend.

---

## Step 4: Configure MetaMask

### Add Hardhat Local Network

1. Open **MetaMask** extension
2. Click the **network dropdown** (top center)
3. Click **"Add network"** → **"Add a network manually"**
4. Enter the following details:

   | Field | Value |
   |-------|-------|
   | **Network Name** | `Hardhat Local` |
   | **RPC URL** | `http://127.0.0.1:8545` |
   | **Chain ID** | `31337` |
   | **Currency Symbol** | `ETH` |

5. Click **"Save"**
6. **Switch to Hardhat Local network**

### Import Test Account

1. In MetaMask, click the **account icon** (top right)
2. Select **"Import Account"**
3. Paste one of the **private keys** from Step 2
4. Click **"Import"**

> **🎉 You now have 10,000 test ETH!**

---

## Step 5: Start Frontend

Open a **third terminal** and run:

```bash
npm run frontend
```

The React app will start at: **http://localhost:3000**

---

## Step 6: Connect and Interact

1. **Open your browser** to http://localhost:3000
2. **Click "Connect MetaMask"** button
3. **Approve the connection** in MetaMask popup
4. **Start interacting** with the contract!

---

## 🎯 Available Actions

Once connected, you can:

- ✅ **Add Renter** (Owner only)
- ✅ **Deposit ETH**
- ✅ **Pick Up Car**
- ✅ **Drop Off Car**
- ✅ **Make Payment**
- ✅ **Withdraw Funds**

---

## 📝 Useful Commands

| Command | Description |
|---------|-------------|
| `npm run node` | Start local blockchain |
| `npm run deploy:local` | Deploy to local network |
| `npm run deploy:hardhat` | Deploy to Hardhat network (in-memory) |
| `npm run frontend` | Start React frontend |
| `npm run compile` | Compile contracts |
| `npm test` | Run contract tests |

---

## 🔄 Workflow Summary

```
Terminal 1: npm run node          → Local blockchain running
Terminal 2: npm run deploy:local  → Contract deployed
Terminal 3: npm run frontend      → Frontend running
Browser:    http://localhost:3000 → Connect MetaMask & interact!
```

---

## 🐛 Troubleshooting

### MetaMask shows "Nonce too high" error

**Solution:** Reset your account:
1. MetaMask → Settings → Advanced
2. Scroll down to "Clear activity tab data"
3. Click "Clear" and confirm

### Contract not found error

**Solution:** Redeploy the contract:
```bash
# Stop the node (Ctrl+C in Terminal 1)
# Restart it
npm run node

# Redeploy (in Terminal 2)
npm run deploy:local
```

### Frontend can't connect to contract

**Solution:** Check that:
1. Hardhat node is running (Terminal 1)
2. Contract is deployed (Terminal 2)
3. MetaMask is on "Hardhat Local" network
4. File `frontend/src/contracts/CarChain.json` exists

### MetaMask not detecting network

**Solution:** 
1. Make sure Hardhat node is running
2. Try switching to another network and back
3. Restart MetaMask extension

---

## 🎓 Next Steps

- ✅ Test all contract functions
- ✅ Try with multiple accounts
- ✅ Monitor events in browser console
- ✅ Deploy to testnet (Sepolia/Goerli)

---

## 📚 Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [MetaMask Documentation](https://docs.metamask.io/)
- [Ethers.js Documentation](https://docs.ethers.io/)
- [React Documentation](https://react.dev/)

---

**Happy Building! 🚀**
