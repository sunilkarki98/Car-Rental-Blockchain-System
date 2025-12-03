import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { ethers } from 'ethers';
import Navbar from './Navbar/Navbar'
import Footer from './Footer/Footer'
import About from './About/About'
import Wallet from './Wallet/Wallet'
import RentDetails from './RentDetails/RentDetails'
import Home from './Home/Home'
import Login from './Login/Login';
import { connect } from '../features/connect/checkConnectionSlice';
import { switchToLocalNetwork } from '../utils/web3';
import { updateAddress } from '../features/currentAddress/currentAddresSlice';
import contractAbi from '../contracts/CarChain.json';

export default function Layout() {

  const connected = useSelector((state) => state.connector.connected);
  const registered = useSelector((state) => state.registrator.registered);
  const dispatch = useDispatch();
  const contractAddress = contractAbi.address;

  useEffect(() => {
    checkConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
        const accounts = await provider.send('eth_accounts', []);
        if (accounts.length > 0) {
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          dispatch(connect());
          dispatch(updateAddress(address));
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    }
  };

  const connectWallet = async () => {
    console.log("Layout: connectWallet called");
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');

      // Switch to local network first
      await switchToLocalNetwork();

      // Request account access
      await provider.send('eth_requestAccounts', []);

      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const chainId = await signer.getChainId();

      if (address.length > 0) {
        dispatch(connect());
        dispatch(updateAddress(address));
      }

      console.log('Connected! Address:', address, 'Chain ID:', chainId);
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      if (error.code === -32002) {
        alert('A MetaMask request is already pending. Please open the MetaMask extension to confirm.');
      } else {
        alert(`Failed to connect MetaMask: ${error.message || JSON.stringify(error)}`);
      }
    }
  };

  // Only create contract instance if provider is available
  const getContract = () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
      const signer = provider.getSigner();
      return new ethers.Contract(
        contractAddress,
        contractAbi.abi,
        signer
      );
    }
    return null;
  };

  const contract = getContract();
  const provider = window.ethereum ? new ethers.providers.Web3Provider(window.ethereum, 'any') : null;

  // Always show Navbar and Footer, handle routing based on connection status
  return (
    <>
      <Navbar connectWallet={connectWallet} />
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/rentacar"
          element={
            connected && registered ? (
              <RentDetails contract={contract} />
            ) : (
              <Login contract={contract} provider={provider} connectWallet={connectWallet} />
            )
          }
        />
        <Route
          path="/balance"
          element={
            connected && registered ? (
              <Wallet contract={contract} />
            ) : (
              <Login contract={contract} provider={provider} connectWallet={connectWallet} />
            )
          }
        />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </>
  )
}
