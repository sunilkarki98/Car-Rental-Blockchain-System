import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './Rent.css'
import { GiGearStick, GiCarSeat } from 'react-icons/gi';
import { HiShoppingBag } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';

const Rent = (props) => {
  // Rent Component v2.2 - Added Redirection
  const currentAddress = useSelector((state) => state.currentAddress.address);
  const [loading, setLoading] = useState({ pickup: false, dropoff: false });
  const navigate = useNavigate();

  const MIN_DEPOSIT = '0.001';

  const showToast = (message, type) => {
    alert(`${type.toUpperCase()}: ${message}`);
  };

  const pickUpHandler = async () => {
    console.log('🚗 PickUpHandler Triggered');
    if (!props.contract) {
      showToast('Contract not available. Please refresh the page.', 'error');
      return;
    }

    setLoading({ ...loading, pickup: true });

    try {
      const balance = await props.contract.balanceOfRenter(currentAddress);
      const balanceInEth = ethers.utils.formatEther(balance);

      if (parseFloat(balanceInEth) < parseFloat(MIN_DEPOSIT)) {
        showToast(
          `Insufficient balance! You need at least ${MIN_DEPOSIT} ETH. Please visit the Balance page to deposit funds.`,
          'error'
        );
        setLoading({ ...loading, pickup: false });
        return;
      }

      const renter = await props.contract.renters(currentAddress);
      console.log('📦 Full Renter Object:', renter);

      // Reverting to index-based access as named properties might not be available
      // Struct: [walletAddress, firstName, lastName, canRent, active, balance, due, start, end, withdrawable]
      const canRent = renter[3];
      const isActive = renter[4];
      const due = renter[6];

      console.log('👤 Renter Status (Parsed):', {
        due: due ? due.toString() : 'N/A',
        canRent,
        isActive
      });

      if (isActive) {
        console.log('⚠️ User already has an active rental');
        showToast('You already have an active rental. Please drop off your current car first.', 'warning');
        setLoading({ ...loading, pickup: false });
        return;
      }

      if (due.gt(0)) {
        const dueFormatted = ethers.utils.formatEther(due);
        showToast(
          `You have ${dueFormatted} ETH in pending dues. Please visit the Balance page to pay before renting again.`,
          'warning'
        );
        setLoading({ ...loading, pickup: false });
        return;
      }

      if (!canRent) {
        showToast(
          'Please visit the Balance page and click "Pay Now" to clear your rental history before renting again.',
          'info'
        );
        setLoading({ ...loading, pickup: false });
        return;
      }

      console.log('🚀 Calling contract.pickUp...');
      const pickUp = await props.contract.pickUp(currentAddress);
      console.log('⏳ Waiting for transaction...');
      await pickUp.wait();

      showToast('Car picked up successfully! Enjoy your ride.', 'success');
      setTimeout(() => navigate('/balance'), 1500);
    } catch (err) {
      console.error('Pickup error:', err);

      if (err.message.includes('You can not rent at this time')) {
        showToast('Unable to rent. Please complete any pending payments on the Balance page.', 'error');
      } else if (err.message.includes('user rejected')) {
        showToast('Transaction cancelled.', 'info');
      } else if (err.message.includes('Please make a deposit')) {
        showToast(`Deposit required: ${MIN_DEPOSIT} ETH minimum. Visit the Balance page.`, 'error');
      } else {
        showToast('Failed to pickup car. Please try again or check your Balance page.', 'error');
      }

      setLoading({ ...loading, pickup: false });
    }
  };

  const dropOffHandler = async () => {
    if (!props.contract) {
      showToast('Contract not available. Please refresh the page.', 'error');
      return;
    }

    setLoading({ ...loading, dropoff: true });

    try {
      const dropOff = await props.contract.dropOff(currentAddress);
      await dropOff.wait();

      showToast('Car dropped off successfully! Please pay your dues on the Balance page.', 'success');
      setTimeout(() => navigate('/balance'), 1500);
    } catch (err) {
      console.error('Dropoff error:', err);

      if (err.message.includes("You don't renting car yet")) {
        showToast('You have not picked up a car yet.', 'warning');
      } else if (err.message.includes('user rejected')) {
        showToast('Transaction cancelled.', 'info');
      } else {
        showToast('Failed to drop off car. Please try again.', 'error');
      }

      setLoading({ ...loading, dropoff: false });
    }
  };

  return (
    <>
      <div className='container'>
        <div className='content'>
          <div className='car-name'>
            <h1>{props.cbrand}</h1>
            <h1>{props.cname}</h1>
          </div>

          <div className="ethcount">{props.ethperday}<span></span>etherum/Day</div>

          <div className="functions">
            <ul>
              <li><HiShoppingBag />{props.bagcount} bag</li>
              <li><GiGearStick />{props.geartype}</li>
              <li><GiCarSeat />{props.seatcount} seats</li>
            </ul>

            <img className='car-img img-fluid object-fit rounded' src={props.carimage} alt="car" />

            <div className="d-flex gap-5 justify-content-center">
              <button
                className={`drop ${loading.pickup ? 'loading' : ''}`}
                onClick={pickUpHandler}
                disabled={loading.pickup || loading.dropoff}
              >
                {loading.pickup ? '' : 'Pickup'}
              </button>
              <button
                className={`drop ${loading.dropoff ? 'loading' : ''}`}
                onClick={dropOffHandler}
                disabled={loading.pickup || loading.dropoff}
              >
                {loading.dropoff ? '' : 'Drop off'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Rent;