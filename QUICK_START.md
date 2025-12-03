# 🚀 Quick Start Guide - Fix Registration Error

## Problem

You're getting "Internal JSON-RPC error" because the contract needs to be redeployed to the running Hardhat node.

---

## Solution - Follow These Steps

### Step 1: Restart Hardhat Node

Open a new terminal and run:

```bash
cd /home/cosmic-soul/Desktop/Car-Rental-Blockchain-System
npx hardhat node
```

**Keep this terminal running!** You should see the new accounts listed:
- Account #0: `0x25C6Cb486CcCD1a9EE18fe2A5B3feb1030a98547`
- Account #1: `0x82004CCB876E133CCB24025f6696e28eB2354f5b`
- etc.

---

### Step 2: Deploy the Contract

Open **another terminal** (keep the node running in the first one) and run:

```bash
cd /home/cosmic-soul/Desktop/Car-Rental-Blockchain-System
npx hardhat run scripts/deploy.js --network localhost
```

You should see:
```
✅ CarChain deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

---

### Step 3: Import Account #0 into MetaMask

1. Open MetaMask extension
2. Click the **account icon** (top right circle)
3. Click **"Import Account"**
4. Paste this private key:
   ```
   0x22445ab0008a3668a6601f036867732633809bf3be77d5b8e6c1f4594094974c
   ```
5. Click **"Import"**

You should now see **Account** with **10,000 ETH**

---

### Step 4: Switch MetaMask Network

1. Click the **network dropdown** at the top of MetaMask
2. Select **"Hardhat Local"**
3. Verify it says "Chain ID: 31337"

---

### Step 5: Reset MetaMask Account (Important!)

Since we restarted the blockchain, you need to reset the transaction history:

1. MetaMask → **Settings**
2. **Advanced**
3. Click **"Clear activity tab data"** or **"Reset Account"**
4. Confirm

This prevents "nonce too high" errors.

---

### Step 6: Test the App

1. **Refresh your browser**
2. Click **"Connect Wallet"**
3. Approve the MetaMask connection
4. Fill in your name and click **"Enter Dashboard"**

Should work now! ✅

---

## Troubleshooting

### Still getting "Internal JSON-RPC error"?

Check the Hardhat node terminal for error details. Common issues:

1. **Contract not deployed** → Run deploy script again
2. **Wrong network** → Make sure MetaMask shows "Hardhat Local"
3. **Old transaction data** → Reset MetaMask account (Step 5)

### Can't see the account in MetaMask?

Make sure you:
- Imported the correct private key from `LOCAL_ACCOUNTS.md`
- Are on the "Hardhat Local" network
- See "10,000 ETH" balance

---

## Account Information

All account details are saved in: **`LOCAL_ACCOUNTS.md`**
