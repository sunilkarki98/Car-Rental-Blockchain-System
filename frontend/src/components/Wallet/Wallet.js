import React, { useState, useEffect, useCallback } from 'react'
import Display from '../Display/Display'
import './Wallet.css'
import { FaEthereum } from 'react-icons/fa';
import { AiFillCar } from 'react-icons/ai';
import { ethers } from 'ethers';
import { useSelector } from 'react-redux';

export default function Wallet({ contract }) {
  const [ethDepositAmount, setEthDepositAmount] = useState('');
  const [balance, setBalance] = useState('0.0');
  const [due, setDue] = useState('0');
  const [totalDuration, setTotalDuration] = useState('0');
  const [isRented, setIsRented] = useState(false);
  const [loading, setLoading] = useState({ deposit: false, repay: false });
  const [refreshing, setRefreshing] = useState(false);

  const currentAddress = useSelector((state) => state.currentAddress.address);

  const showToast = (message, type) => {
    alert(`${type.toUpperCase()}: ${message}`);
  };

  const fetchRenterData = useCallback(async (isAutoRefresh = false) => {
    if (!contract || !currentAddress) {
      console.log('Wallet: Contract or Address missing', { contract: !!contract, currentAddress });
      return;
    }

    try {
      if (isAutoRefresh) setRefreshing(true);

      const balanceData = await contract.balanceOfRenter(currentAddress);
      const balanceFormatted = ethers.utils.formatEther(balanceData);
      setBalance(balanceFormatted);

      const renterData = await contract.renters(currentAddress);

      // Use named properties if available, otherwise fallback to indices
      const dueData = renterData.due || renterData[6];
      const dueFormatted = ethers.utils.formatEther(dueData);
      setDue(dueFormatted);

      const activeStatus = renterData.active !== undefined ? renterData.active : renterData[4];
      const startTime = renterData.start || renterData[7];

      console.log('Wallet: Status:', { activeStatus, startTime: startTime?.toString() });

      setIsRented(activeStatus);

      if (activeStatus) {
        // Calculate current duration for active rental
        const startTimestamp = startTime.toNumber();
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const durationMinutes = Math.floor((currentTimestamp - startTimestamp) / 60);
        setTotalDuration(durationMinutes.toString());
      } else {
        try {
          const duration = await contract.getTotalDuration(currentAddress);
          setTotalDuration(duration.toString());
        } catch (err) {
          setTotalDuration('0');
        }
      }

      if (isAutoRefresh) setRefreshing(false);
    } catch (err) {
      console.error('Error fetching renter data:', err);
      if (isAutoRefresh) setRefreshing(false);
    }
  }, [contract, currentAddress]);

  useEffect(() => {
    if (contract && currentAddress) {
      fetchRenterData();

      const interval = setInterval(() => {
        fetchRenterData(true);
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [contract, currentAddress, fetchRenterData]);

  const handleDepositEth = async () => {
    if (!contract) {
      showToast('Contract not available. Please refresh the page.', 'error');
      return;
    }

    if (!ethDepositAmount || parseFloat(ethDepositAmount) <= 0) {
      showToast('Please enter a valid deposit amount.', 'error');
      return;
    }

    setLoading({ ...loading, deposit: true });

    try {
      const ethValue = ethers.utils.parseEther(ethDepositAmount);
      const options = { value: ethValue };

      const depositTx = await contract.deposit(currentAddress, options);
      await depositTx.wait();

      await fetchRenterData();

      showToast(`Successfully deposited ${ethDepositAmount} ETH!`, 'success');
      setEthDepositAmount('');
    } catch (err) {
      console.error('Deposit error:', err);

      if (err.message.includes('user rejected')) {
        showToast('Transaction cancelled.', 'info');
      } else if (err.message.includes('insufficient funds')) {
        showToast('Insufficient funds in your wallet.', 'error');
      } else {
        showToast('Failed to deposit. Please try again.', 'error');
      }
    } finally {
      setLoading({ ...loading, deposit: false });
    }
  };

  const handleRepay = async () => {
    if (!contract) {
      showToast('Contract not available. Please refresh the page.', 'error');
      return;
    }

    if (parseFloat(due) <= 0) {
      showToast('You have no pending dues to pay.', 'info');
      return;
    }

    if (parseFloat(balance) < parseFloat(due)) {
      showToast('Insufficient balance to pay dues. Please deposit more funds first.', 'error');
      return;
    }

    setLoading({ ...loading, repay: true });

    try {
      const repayTx = await contract.makePayment(currentAddress);
      await repayTx.wait();

      await fetchRenterData();
      await getTotalDuration();

      showToast(`Successfully paid ${due} ETH in dues!`, 'success');
    } catch (err) {
      console.error('Repay error:', err);

      if (err.message.includes('user rejected')) {
        showToast('Transaction cancelled.', 'info');
      } else if (err.message.includes("You don't have to pay")) {
        showToast('You have no pending dues.', 'info');
      } else {
        showToast('Failed to process payment. Please try again.', 'error');
      }
    } finally {
      setLoading({ ...loading, repay: false });
    }
  };

  const getTotalDuration = async () => {
    if (!contract || !currentAddress) return;

    try {
      const duration = await contract.getTotalDuration(currentAddress);
      setTotalDuration(duration.toString());
    } catch (err) {
      console.log('No rental history');
    }
  };

  console.log('Wallet: Render Cycle - isRented:', isRented);

  return (
    <>
      <div className="container wallet" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 auto', width: '100%', maxWidth: '1200px' }}>
        <div className="wallet-header" style={{ marginTop: '180px', paddingTop: '0', textAlign: 'center', width: '100%' }}>
          <h1 style={{ textAlign: 'center', width: '100%', justifyContent: 'center', display: 'flex', gap: '10px' }}>
            <span>💰</span> Account & Balance Management
          </h1>
          <p className="wallet-subtitle" style={{ textAlign: 'center', width: '100%' }}>Manage your deposits, dues, and rental payments</p>
          {refreshing && <span className="refresh-indicator">Refreshing...</span>}
        </div>

        <div className="stats-container" style={{ justifyContent: 'center', width: '100%', marginTop: '2rem' }}>
          <Display Icon={<FaEthereum />} Title='Balance' Measure={`${balance} ETH`} />
          <Display Icon={<AiFillCar />} Title='Dues' Measure={`${due} ETH`} />
          <Display Icon={<FaEthereum />} Title='Rent Time' Measure={`${totalDuration} min`} />
          <Display
            Icon={<AiFillCar />}
            Title='Status'
            Measure={isRented ? 'CURRENTLY RENTED' : 'NOT RENTED'}
            className={isRented ? 'status-rented' : 'status-available'}
            style={{
              background: 'rgba(30, 41, 59, 0.7)',
              backdropFilter: 'blur(10px)',
              border: isRented ? '1px solid rgba(234, 179, 8, 0.5)' : '1px solid rgba(34, 197, 94, 0.5)',
              color: isRented ? '#facc15' : '#4ade80',
              fontWeight: '700'
            }}
          />
        </div>

        <div className='form-container' style={{ maxWidth: '900px', width: '100%', justifyContent: 'center' }}>
          <div className='form-card'>
            <h2>💰 Deposit Funds</h2>
            <p className="form-description">Add ETH to your account balance</p>
            <input
              className='payment-input'
              type='number'
              placeholder='Amount in ETH (e.g., 0.001)'
              step="0.001"
              min="0"
              required
              onChange={(e) => setEthDepositAmount(e.target.value)}
              value={ethDepositAmount}
              disabled={loading.deposit || loading.repay}
            />
            <button
              className={`button-class form-deposit-button ${loading.deposit ? 'loading' : ''}`}
              type='button'
              onClick={handleDepositEth}
              disabled={loading.deposit || loading.repay || !ethDepositAmount}
            >
              {loading.deposit ? 'Processing...' : 'Deposit'}
            </button>
          </div>

          <div className='form-card'>
            <h2>💳 Pay Dues</h2>
            <p className="form-description">Clear your rental charges</p>
            <input
              className='payment-input'
              type='number'
              placeholder='Due amount'
              required
              disabled
              value={due}
            />
            <button
              className={`button-class form-deposit-button ${loading.repay ? 'loading' : ''}`}
              type='button'
              onClick={handleRepay}
              disabled={loading.deposit || loading.repay || parseFloat(due) <= 0}
            >
              {loading.repay ? 'Processing...' : 'Pay Now'}
            </button>
            {parseFloat(due) <= 0 && (
              <p className="no-dues-message">✓ No pending dues</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
