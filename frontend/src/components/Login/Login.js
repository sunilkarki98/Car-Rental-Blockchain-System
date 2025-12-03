import React from 'react'
import './Login.css'
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { register } from '../../features/register/checkRegistrationSlice';
import { ethers } from 'ethers';

// export default function Login({contract,provider}) {
//   const currentAddress = useSelector((state) => state.currentAddress.address);
//   const dispatch = useDispatch();
//   const [name, setName] = useState('');
//   const [lastName, setLastName] = useState('');

//   const handleRegisterSubmit = async (e) => {
//     e.preventDefault();
//     const addRenter = await contract.addRenter(
//       currentAddress,
//       name,
//       lastName,
//       true,
//       false,
//       0,
//       0,
//       0,
//       0,
//       0
//     );
//     console.log("ffsadas")
//     await addRenter.wait();
//     window.location.reload();
//   };

//   const canRent = async () => {
//     const canRentCar = await contract.canRentCar(currentAddress);
//     const currentRenter = await contract.renters(currentAddress);
//     const name = currentRenter[1];
//     if (canRentCar || name.length > 0) {
//       dispatch(register());
//     }
//   };
//   canRent();

//   return (
//     <div className='container dashboard-form'>
//       <div className='form-container'>
//         <form onSubmit={handleRegisterSubmit}>
//           <input
//             className='name'
//             type='text'
//             placeholder='Name'
//             required
//             onChange={(e) => setName(e.target.value)}
//             value={name}
//           ></input>
//           <input
//             className='lastName'
//             type='text'
//             placeholder='Last Name'
//             required
//             onChange={(e) => setLastName(e.target.value)}
//             value={lastName}
//           ></input>
//           <button className='button-class form-submit-button' type='submit'>
//             Submit
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }
const Login = ({ contract, provider, connectWallet }) => {
  const currentAddress = useSelector((state) => state.currentAddress.address);
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  // Added state for loading to match the new UI, assuming it's for the registration process
  const [loading, setLoading] = useState(false);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!contract) {
      alert('Please connect MetaMask and ensure you are on the correct network');
      return;
    }

    if (!currentAddress) {
      alert('Please connect your wallet first');
      return;
    }

    if (!name.trim() || !lastName.trim()) {
      alert('Please enter both first and last name');
      return;
    }

    setLoading(true); // Start loading
    try {
      console.log("📝 Submitting registration...");
      console.log(`   Name: ${name} ${lastName}`);
      console.log(`   Address: ${currentAddress}`);

      const registerTx = await contract.register(
        name,
        lastName
      );

      console.log("⏳ Transaction submitted, waiting for confirmation...");
      console.log(`   Transaction Hash: ${registerTx.hash}`);

      await registerTx.wait();

      console.log("✅ Registration successful!");
      alert('Registration successful! Redirecting...');
      window.location.reload();
    } catch (error) {
      console.error("❌ Error registering user:", error);

      // User-friendly error messages
      if (error.code === 4001) {
        alert('Transaction rejected. Please approve the transaction in MetaMask to continue.');
      } else if (error.code === -32603) {
        alert('Transaction failed. Please make sure:\n1. You are connected to Hardhat Local network\n2. The contract is deployed\n3. Your account has enough ETH for gas');
      } else if (error.message.includes('user rejected')) {
        alert('Transaction cancelled by user.');
      } else {
        alert(`Registration failed: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false); // End loading
    }
  };

  React.useEffect(() => {
    const canRent = async () => {
      if (contract && currentAddress) { // Ensure both contract and address are available
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const { chainId } = await provider.getNetwork();
          console.log(`🔍 Current MetaMask Network - Chain ID: ${chainId}`);

          if (chainId !== 31337) {
            console.warn(`⚠️ Wrong network detected!`);
            console.warn(`   Expected: Chain ID 31337 (Hardhat Local)`);
            console.warn(`   Current:  Chain ID ${chainId}`);
            console.warn(`   Please switch to Hardhat Local network in MetaMask`);
            return;
          }

          console.log("✅ Connected to Hardhat Local network");

          const canRentCar = await contract.canRentCar(currentAddress);
          const currentRenter = await contract.renters(currentAddress);
          const renterName = currentRenter[1]; // Use a different variable name to avoid conflict with state 'name'
          if (canRentCar || renterName.length > 0) {
            dispatch(register());
          }
        } catch (error) {
          console.error("Error checking renter status:", error);
        }
      }
    };
    canRent();
  }, [contract, currentAddress, dispatch]);

  return (
    <div className="login-page">
      <div className="login-container bg-glass">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Access the decentralized car rental platform</p>
        </div>

        <form className="login-form" onSubmit={handleRegisterSubmit}> {/* Changed onSubmit to handleRegisterSubmit */}
          <div className="input-group">
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="First Name"
              className="modern-input"
              value={name} // Changed firstName to name
              onChange={(e) => setName(e.target.value)} // Changed setFirstName to setName
              required // Added required attribute
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Last Name"
              className="modern-input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required // Added required attribute
            />
          </div>

          {!currentAddress ? ( // Changed 'connected' to '!currentAddress' to reflect wallet connection status
            <button
              className="modern-btn primary-btn"
              type="button"
              onClick={() => {
                console.log("Connect Wallet button clicked");
                if (typeof connectWallet === 'function') {
                  connectWallet();
                } else {
                  console.error("connectWallet prop is not a function:", connectWallet);
                }
              }}
            >
              Connect Wallet
            </button>
          ) : (
            <button className="modern-btn secondary-btn" type="submit" disabled={loading}> {/* Changed onClick to type="submit" and added disabled */}
              {loading ? 'Registering...' : 'Enter Dashboard'} {/* Changed 'handleLogin' to 'Enter Dashboard' as per existing logic */}
            </button>
          )}
        </form>

        <div className="login-footer">
          <p>Powered by Ethereum Blockchain</p>
        </div>
      </div>
    </div>
  )
}

export default Login;
