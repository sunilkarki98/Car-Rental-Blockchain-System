import React, { useState, useEffect, useCallback } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import metamaskLogo from '../../assets/metamask.png';
import contractAbi from '../../contracts/CarChain.json';

import { FaHome, FaEthereum } from 'react-icons/fa';
import { MdAccountBalanceWallet, MdPayment } from 'react-icons/md'
import { RiTeamFill } from 'react-icons/ri'
import { AiFillCar } from 'react-icons/ai'
import { CgProfile } from 'react-icons/cg'
import { IoMdRefresh } from 'react-icons/io';
import './Navbar.css'

export default function Navbar({ connectWallet }) {
    const connected = useSelector((state) => state.connector.connected);
    const currentAddress = useSelector((state) => state.currentAddress.address);
    const registered = useSelector((state) => state.registrator.registered);
    const navigate = useNavigate();

    const [balance, setBalance] = useState('0');
    const [due, setDue] = useState('0');
    const [payingDues, setPayingDues] = useState(false);

    const slicedAddress =
        currentAddress.slice(0, 5) + '...' + currentAddress.slice(38, 44);

    const showToast = (message, type) => {
        alert(`${type.toUpperCase()}: ${message}`);
    };

    const fetchBalanceAndDues = useCallback(async () => {
        if (!window.ethereum || !currentAddress || !registered) return;

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                contractAbi.address,
                contractAbi.abi,
                signer
            );

            const balanceData = await contract.balanceOfRenter(currentAddress);
            const balanceFormatted = ethers.utils.formatEther(balanceData);
            setBalance(parseFloat(balanceFormatted).toFixed(4));

            const renterData = await contract.renters(currentAddress);
            const dueData = renterData[6];
            const dueFormatted = ethers.utils.formatEther(dueData);
            setDue(parseFloat(dueFormatted).toFixed(4));
        } catch (err) {
            console.error('Error fetching balance/dues:', err);
        }
    }, [currentAddress, registered]);

    useEffect(() => {
        if (connected && registered) {
            fetchBalanceAndDues();

            const interval = setInterval(fetchBalanceAndDues, 15000);
            return () => clearInterval(interval);
        }
    }, [connected, registered, fetchBalanceAndDues]);

    const handlePayDues = async () => {
        if (!window.ethereum || !currentAddress) return;

        setPayingDues(true);

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                contractAbi.address,
                contractAbi.abi,
                signer
            );

            if (parseFloat(due) <= 0) {
                showToast('You have no pending dues.', 'info');
                setPayingDues(false);
                return;
            }

            const repayTx = await contract.makePayment(currentAddress);
            await repayTx.wait();

            await fetchBalanceAndDues();

            showToast(`Successfully paid ${due} ETH in dues!`, 'success');
        } catch (err) {
            console.error('Pay dues error:', err);

            if (err.message.includes('user rejected')) {
                showToast('Transaction cancelled.', 'info');
            } else if (err.message.includes("You don't have to pay")) {
                showToast('You have no pending dues.', 'info');
            } else if (err.message.includes('Insufficient balance')) {
                showToast('Insufficient balance. Please deposit more funds first.', 'error');
            } else {
                showToast('Failed to process payment. Please try again.', 'error');
            }
        } finally {
            setPayingDues(false);
        }
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    const handleConnectRedirect = () => {
        navigate('/rentacar');
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-glass fixed-top">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/">
                                    <FaHome className="nav-icon" /> Home
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/rentacar">
                                    <AiFillCar className="nav-icon" /> Rent A Car
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/balance">
                                    <MdAccountBalanceWallet className="nav-icon" /> Balance
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/about">
                                    <RiTeamFill className="nav-icon" /> About
                                </NavLink>
                            </li>
                        </ul>
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center gap-2">
                            {connected && registered && (
                                <>
                                    <li className="nav-item">
                                        <div className="balance-display">
                                            <FaEthereum className="eth-icon" />
                                            <span className="balance-text">{balance}</span>
                                        </div>
                                    </li>
                                    {parseFloat(due) > 0 && (
                                        <>
                                            <li className="nav-item">
                                                <div className="dues-badge">
                                                    <span className="dues-label">Due:</span>
                                                    <span className="dues-amount">{due} ETH</span>
                                                </div>
                                            </li>
                                            <li className="nav-item">
                                                <button
                                                    className={`pay-dues-btn ${payingDues ? 'loading' : ''}`}
                                                    onClick={handlePayDues}
                                                    disabled={payingDues}
                                                    title="Pay your dues now"
                                                >
                                                    {payingDues ? (
                                                        'Paying...'
                                                    ) : (
                                                        <>
                                                            <MdPayment className="pay-icon" />
                                                            Pay Now
                                                        </>
                                                    )}
                                                </button>
                                            </li>
                                        </>
                                    )}
                                </>
                            )}
                            <li className="nav-item">
                                <div className="wallet-badge">
                                    <img src={metamaskLogo} alt='MetaMask' className="wallet-icon" />
                                    {!connected ? (
                                        <span className="wallet-text" onClick={handleConnectRedirect} style={{ cursor: 'pointer' }}>Connect Wallet</span>
                                    ) : (
                                        <>
                                            <span className="wallet-text">{slicedAddress}</span>
                                            <IoMdRefresh
                                                className="wallet-text"
                                                size={20}
                                                onClick={handleRefresh}
                                                style={{ cursor: 'pointer' }}
                                                title="Refresh Page"
                                            />
                                        </>
                                    )}
                                </div>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link profile-link" to='/dashboard'>
                                    <CgProfile size={24} />
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}
