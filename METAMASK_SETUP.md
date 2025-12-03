# MetaMask Configuration Guide

## 🦊 Complete MetaMask Setup for Local Development

---

## Adding Hardhat Local Network

### Method 1: Manual Configuration

1. **Open MetaMask** extension in your browser

2. **Click the network dropdown** at the top center

3. **Select "Add network"** → **"Add a network manually"**

4. **Enter network details:**

   ```
   Network Name:     Hardhat Local
   RPC URL:          http://127.0.0.1:8545
   Chain ID:         31337
   Currency Symbol:  ETH
   ```

5. **Click "Save"**

6. **Switch to the new network**

### Method 2: Automatic (via Frontend)

The frontend will automatically prompt you to add the network when you click "Connect MetaMask".

---

## Importing Test Accounts

Hardhat provides 20 pre-funded test accounts. Here are the first 3:

### Account #0 (Default Deployer)
```
Address:     0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
Balance:     10,000 ETH
```

### Account #1
```
Address:     0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
Balance:     10,000 ETH
```

### Account #2
```
Address:     0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
Balance:     10,000 ETH
```

### How to Import

1. **Open MetaMask**
2. **Click account icon** (top right)
3. **Select "Import Account"**
4. **Paste private key** from above
5. **Click "Import"**

> **⚠️ WARNING:** These are test accounts only! Never use these private keys on mainnet or with real funds.

---

## Switching Between Networks

### To Hardhat Local
1. Click network dropdown
2. Select "Hardhat Local"

### To Other Networks
1. Click network dropdown
2. Select desired network (Ethereum Mainnet, Sepolia, etc.)

---

## Resetting Account Data

If you encounter nonce errors or transaction issues:

1. **Open MetaMask**
2. **Go to Settings** → **Advanced**
3. **Scroll to "Clear activity tab data"**
4. **Click "Clear"** and confirm

This resets your transaction history for the current network.

---

## Common MetaMask Issues

### Issue: "Nonce too high" Error

**Cause:** MetaMask's nonce is out of sync with the blockchain

**Solution:**
```
Settings → Advanced → Clear activity tab data → Clear
```

### Issue: Transaction Stuck as "Pending"

**Cause:** Blockchain was restarted but MetaMask still has old transaction

**Solution:**
1. Reset account data (see above)
2. Or speed up/cancel the transaction

### Issue: Can't Connect to Local Network

**Cause:** Hardhat node not running or wrong RPC URL

**Solution:**
1. Ensure `npm run node` is running
2. Verify RPC URL is `http://127.0.0.1:8545`
3. Try switching networks and back

### Issue: Balance Shows 0 ETH

**Cause:** Wrong network or account not imported

**Solution:**
1. Verify you're on "Hardhat Local" network
2. Check you imported the correct private key
3. Restart Hardhat node if needed

---

## Security Best Practices

### ✅ DO:
- Use test accounts only for local development
- Keep different MetaMask profiles for dev/production
- Clear test account data regularly
- Use hardware wallets for mainnet

### ❌ DON'T:
- Use test private keys on mainnet
- Share your real private keys
- Import real accounts to test networks
- Keep large amounts in hot wallets

---

## Multiple Account Testing

To test multi-user scenarios:

1. **Import multiple test accounts** (Account #0, #1, #2, etc.)
2. **Switch between accounts** using MetaMask account dropdown
3. **Test different roles:**
   - Account #0: Contract owner (can add renters)
   - Account #1: Renter 1
   - Account #2: Renter 2

---

## Network Information

### Hardhat Local Network Details

| Property | Value |
|----------|-------|
| **Network Name** | Hardhat Local |
| **RPC URL** | http://127.0.0.1:8545 |
| **Chain ID** | 31337 (0x7A69 in hex) |
| **Currency** | ETH |
| **Block Explorer** | None (local only) |
| **Accounts** | 20 pre-funded accounts |
| **Initial Balance** | 10,000 ETH per account |

---

## Advanced Configuration

### Custom Gas Settings

For local development, you can set custom gas:

1. MetaMask → Settings → Advanced
2. Enable "Advanced gas controls"
3. Set custom gas price when sending transactions

### Enable Test Networks

To see testnets in MetaMask:

1. Settings → Advanced
2. Enable "Show test networks"
3. Now you can switch to Sepolia, Goerli, etc.

---

## Troubleshooting Checklist

Before asking for help, verify:

- [ ] Hardhat node is running (`npm run node`)
- [ ] Contract is deployed (`npm run deploy:local`)
- [ ] MetaMask is on "Hardhat Local" network
- [ ] Account is imported with test private key
- [ ] Account has ETH balance (should show 10,000 ETH)
- [ ] No pending transactions blocking new ones
- [ ] Browser console shows no errors

---

## Quick Reference

### Add Network
```
Name:     Hardhat Local
RPC:      http://127.0.0.1:8545
Chain ID: 31337
Symbol:   ETH
```

### Import Account
```
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### Reset Account
```
Settings → Advanced → Clear activity tab data
```

---

**Need more help?** Check the [Local Setup Guide](./LOCAL_SETUP_GUIDE.md) or [Hardhat Documentation](https://hardhat.org/docs).
