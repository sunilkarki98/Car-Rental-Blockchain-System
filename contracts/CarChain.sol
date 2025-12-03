//SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title CarChain
 * @author Nikhil Gautam
 * @notice A decentralized car rental system with time-based pricing
 * @dev Implements rental management with deposit/withdrawal functionality and reentrancy protection
 */
contract CarChain is ReentrancyGuard {
    //set an owner of contract
    address public immutable i_owner;

    // Constants for pricing and deposits
    uint256 public constant MIN_DEPOSIT = 1000000000000000; // 0.001 ETH
    uint256 public constant RATE_PER_2_MINUTES = 1000000000000000; // 0.001 ETH per 2 minutes

    // Events
    event RenterAdded(
        address indexed renter,
        string firstName,
        string lastName
    );
    event DepositMade(address indexed renter, uint256 amount);
    event FundsWithdrawn(address indexed renter, uint256 amount);
    event CarPickedUp(address indexed renter, uint256 timestamp);
    event CarDroppedOff(
        address indexed renter,
        uint256 duration,
        uint256 due
    );
    event PaymentMade(address indexed renter, uint256 amount);

    constructor() {
        i_owner = msg.sender;
    }

    // Modifier to restrict access to owner only
    modifier onlyOwner() {
        require(msg.sender == i_owner, "Only owner can call this function");
        _;
    }

    /**
     * @notice Struct to store renter information
     * @dev Contains all rental state and financial data for a renter
     */
    struct Renter {
        address payable walletAddress;
        string firstName;
        string lastName;
        bool canRent;
        bool active;
        uint256 balance;
        uint256 due;
        uint256 start;
        uint256 end;
        uint256 withdrawable;
    }

    // key => value
    mapping(address => Renter) public renters;

    /**
     * @notice Add a new renter to the system (owner only)
     * @dev Only the contract owner can register new renters
     * @param walletAddress The wallet address of the renter
     * @param firstName First name of the renter
     * @param lastName Last name of the renter
     * @param canRent Whether the renter is allowed to rent
     * @param active Whether the renter currently has an active rental
     * @param balance Current balance deposited by the renter
     * @param due Amount due for rental
     * @param start Timestamp when rental started
     * @param end Timestamp when rental ended
     * @param withdrawable Amount available for withdrawal
     */
    function addRenter(
        address payable walletAddress,
        string memory firstName,
        string memory lastName,
        bool canRent,
        bool active,
        uint256 balance,
        uint256 due,
        uint256 start,
        uint256 end,
        uint256 withdrawable
    ) public onlyOwner {
        require(walletAddress != address(0), "Invalid wallet address");
        require(bytes(firstName).length > 0, "First name cannot be empty");
        require(bytes(lastName).length > 0, "Last name cannot be empty");

        // add renter to mapping. It is like a push in JS
        renters[walletAddress] = Renter(
            walletAddress,
            firstName,
            lastName,
            canRent,
            active,
            balance,
            due,
            start,
            end,
            withdrawable
        );

        emit RenterAdded(walletAddress, firstName, lastName);
    }

    /**
     * @notice Register a new renter (self-registration)
     * @param firstName First name of the renter
     * @param lastName Last name of the renter
     */
    function register(string memory firstName, string memory lastName) public {
        require(bytes(firstName).length > 0, "First name cannot be empty");
        require(bytes(lastName).length > 0, "Last name cannot be empty");
        require(renters[msg.sender].walletAddress == address(0), "Renter already exists");

        renters[msg.sender] = Renter(
            payable(msg.sender),
            firstName,
            lastName,
            true, // canRent
            false, // active
            0, // balance
            0, // due
            0, // start
            0, // end
            0 // withdrawable
        );

        emit RenterAdded(msg.sender, firstName, lastName);
    }

    /**
     * @notice Deposit ETH to a renter's balance
     * @dev Anyone can deposit to any renter's account
     * @param walletAddress The address of the renter to deposit for
     */
    function deposit(address walletAddress) public payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        require(
            renters[walletAddress].walletAddress != address(0),
            "Renter does not exist"
        );

        renters[walletAddress].balance += msg.value;

        emit DepositMade(walletAddress, msg.value);
    }

    /**
     * @notice Withdraw available funds (balance minus due)
     * @dev Protected against reentrancy attacks
     * @param walletAddress The address of the renter withdrawing funds
     */
    function withdrawMinusDue(address walletAddress)
        public
        payable
        nonReentrant
    {
        require(
            renters[walletAddress].walletAddress == msg.sender,
            "You can't withdraw not yours money"
        );
        require(renters[walletAddress].due == 0, "Pay the amount due first");
        require(
            renters[walletAddress].active == false,
            "Cannot withdraw while car is rented"
        );
        require(
            renters[walletAddress].balance > 0,
            "You have no money to withdraw"
        );

        renters[walletAddress].withdrawable =
            renters[walletAddress].balance -
            renters[walletAddress].due;

        uint256 amountToWithdraw = renters[walletAddress].withdrawable;

        // Update state before external call (checks-effects-interactions pattern)
        renters[walletAddress].balance = renters[walletAddress].due;
        renters[walletAddress].withdrawable = 0;

        // Use call instead of send for safer ETH transfer
        (bool sent, ) = payable(msg.sender).call{value: amountToWithdraw}("");
        require(sent, "Failed to send Ether");

        emit FundsWithdrawn(msg.sender, amountToWithdraw);
    }

    /**
     * @notice Pick up a car to start rental
     * @dev Requires minimum deposit and no pending dues
     * @param walletAddress The address of the renter picking up the car
     */
    function pickUp(address walletAddress) public {
        //require revert transaction before gas is spent
        require(renters[walletAddress].due == 0, "You have pending balance");
        require(
            renters[walletAddress].canRent == true,
            "You can not rent at this time"
        );
        require(
            renters[walletAddress].balance >= MIN_DEPOSIT,
            "Please make a deposit first to rent a car"
        );

        renters[walletAddress].active = true;
        renters[walletAddress].start = block.timestamp;
        renters[walletAddress].canRent = false;

        emit CarPickedUp(walletAddress, block.timestamp);
    }

    /**
     * @notice Drop off the car to end rental
     * @dev Calculates and sets the due amount based on rental duration
     * @param walletAddress The address of the renter dropping off the car
     */
    function dropOff(address walletAddress) public {
        require(
            renters[walletAddress].walletAddress == msg.sender,
            "You can't drop off car you don't picked up"
        );
        require(
            renters[walletAddress].active == true,
            "You don't renting car yet"
        );

        renters[walletAddress].active = false;
        renters[walletAddress].end = block.timestamp;

        //set amount of due
        setDue(walletAddress);

        uint256 duration = getTotalDuration(walletAddress);
        emit CarDroppedOff(
            walletAddress,
            duration,
            renters[walletAddress].due
        );
    }

    /**
     * @notice Calculate total duration of car use
     * @dev Pure function that doesn't read or modify state
     * @param start Start timestamp
     * @param end End timestamp
     * @return Duration in seconds
     */
    function renterTimespan(uint256 start, uint256 end)
        internal
        pure
        returns (uint256)
    {
        return end - start;
    }

    /**
     * @notice Get total rental duration in minutes
     * @dev View function to check rental duration
     * @param walletAddress The address of the renter
     * @return Duration in minutes
     */
    function getTotalDuration(address walletAddress)
        public
        view
        returns (uint256)
    {
        require(
            renters[walletAddress].active == false,
            "You have to drop off car first"
        );
        uint256 timespan = renterTimespan(
            renters[walletAddress].start,
            renters[walletAddress].end
        );
        uint256 timespanInMinutes = timespan / 60;
        return timespanInMinutes;
    }

    /**
     * @notice Get contract balance
     * @dev View function to check total ETH held by contract
     * @return Contract balance in wei
     */
    function getBalance() public view returns (uint256) {
        // this refers to the CONTRACT
        return address(this).balance;
    }

    /**
     * @notice Get renter's balance
     * @dev View function to check a renter's deposited balance
     * @param walletAddress The address of the renter
     * @return Renter's balance in wei
     */
    function balanceOfRenter(address walletAddress)
        public
        view
        returns (uint256)
    {
        return renters[walletAddress].balance;
    }

    /**
     * @notice Set due amount based on rental duration
     * @dev Internal function called after dropoff, charges per 2-minute increments
     * @param walletAddress The address of the renter
     */
    function setDue(address walletAddress) internal {
        uint256 timespanMinutes = getTotalDuration(walletAddress);
        // FIX: Enforce minimum 2-minute charge to prevent 0 due deadlock
        if (timespanMinutes < 2) {
            timespanMinutes = 2;
        }
        uint256 twoMinuteIncrements = timespanMinutes / 2;
        renters[walletAddress].due = twoMinuteIncrements * RATE_PER_2_MINUTES;
    }

    /**
     * @notice Make payment for rental dues
     * @dev Deducts payment from deposited balance
     * @param walletAddress The address of the renter making payment
     */
    function makePayment(address walletAddress) public payable {
        require(
            renters[walletAddress].due > 0,
            "You don't have to pay anything at this time"
        );
        require(
            renters[walletAddress].balance >= renters[walletAddress].due,
            "You don't have enough funds to cover payment. Please make a deposit."
        );

        uint256 paymentAmount = renters[walletAddress].due;

        renters[walletAddress].balance -= renters[walletAddress].due;
        renters[walletAddress].canRent = true;
        renters[walletAddress].due = 0;
        renters[walletAddress].start = 0;
        renters[walletAddress].end = 0;

        emit PaymentMade(walletAddress, paymentAmount);
    }

    /**
     * @notice Check if a renter can rent a car
     * @dev View function to check rental eligibility
     * @param walletAddress The address of the renter
     * @return True if renter can rent, false otherwise
     */
    function canRentCar(address walletAddress) public view returns (bool) {
        return renters[walletAddress].canRent;
    }
}
