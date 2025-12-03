import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom';
import About from './About/About'
import { useSelector, useDispatch } from 'react-redux';
import Wallet from './Wallet/Wallet';
import { connect } from '../features/connect/checkConnectionSlice';
import { updateAddress } from '../features/currentAddress/currentAddresSlice';
import { ethers } from 'ethers';
import contractAbi from '../contracts/CarChain.json';
import Login from './Login/Login';
import RentDetails from './RentDetails/RentDetails';
import Home from './Home/Home';


export default function Dashboard() {
    // const {name,authentication}= useParams();
    const [address, setAddress] = useState('');
    // const [chainId, setChainId] = useState('');
    const connected = useSelector((state) => state.connector.connected);
    const registered = useSelector((state) => state.registrator.registered);
    const currentAddress = useSelector((state) => state.currentAddress.address);
    const dispatch = useDispatch();
    const contractAddress = contractAbi.address;

    useEffect(() => {
        // Only auto-connect if user hasn't connected yet
        if (window.ethereum && !connected) {
            connectWallet().catch(console.error);
        }
    }, []); // Run only once on mount

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('Please install MetaMask!');
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');

            // Request account access
            await provider.send('eth_requestAccounts', []);

            const signer = provider.getSigner();
            const address = await signer.getAddress();
            const chainId = await signer.getChainId();

            if (address.length > 0) {
                setAddress(address);
                dispatch(connect());
                dispatch(updateAddress(address));
            }

            console.log('Connected! Address:', address, 'Chain ID:', chainId);
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
            alert('Failed to connect MetaMask. Please try again.');
        }
    };


    const [contract, setContract] = useState(null);
    const [provider, setProvider] = useState(null);

    useEffect(() => {
        if (window.ethereum) {
            const newProvider = new ethers.providers.Web3Provider(window.ethereum, 'any');
            const signer = newProvider.getSigner();
            const newContract = new ethers.Contract(
                contractAddress,
                contractAbi.abi,
                signer
            );

            setProvider(newProvider);
            setContract(newContract);
        }
    }, [contractAddress]);

    return (
        <div className="dashboard">
            {!connected || !registered ? (
                <Login contract={contract} provider={provider} />
            ) : (
                <Home />
            )}
        </div>
    )
}   
