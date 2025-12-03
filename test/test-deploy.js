const { assert, expect } = require("chai");
const { ethers } = require("hardhat");

describe("CarChain", function () {
  let carChainFactory;
  let carChain;
  let owner;
  let renter1;
  let renter2;
  let nonOwner;

  beforeEach(async function () {
    // Get signers
    [owner, renter1, renter2, nonOwner] = await ethers.getSigners();

    carChainFactory = await ethers.getContractFactory("CarChain");
    carChain = await carChainFactory.deploy();
    await carChain.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await carChain.i_owner()).to.equal(owner.address);
    });

    it("Contract should start with deposit balance of 0", async function () {
      const currentValue = await carChain.getBalance();
      const expectedValue = "0";
      assert.equal(currentValue.toString(), expectedValue);
    });

    it("Should have correct constants set", async function () {
      const minDeposit = await carChain.MIN_DEPOSIT();
      const rate = await carChain.RATE_PER_2_MINUTES();
      expect(minDeposit).to.equal(ethers.parseEther("0.001"));
      expect(rate).to.equal(ethers.parseEther("0.001"));
    });
  });

  describe("Access Control", function () {
    it("Should allow owner to add renter", async function () {
      await expect(
        carChain.addRenter(
          renter1.address,
          "John",
          "Doe",
          true,
          false,
          0,
          0,
          0,
          0,
          0
        )
      ).to.not.be.reverted;
    });

    it("Should prevent non-owner from adding renter", async function () {
      await expect(
        carChain.connect(nonOwner).addRenter(
          renter1.address,
          "John",
          "Doe",
          true,
          false,
          0,
          0,
          0,
          0,
          0
        )
      ).to.be.revertedWith("Only owner can call this function");
    });

    it("Should reject invalid wallet address", async function () {
      await expect(
        carChain.addRenter(
          ethers.ZeroAddress,
          "John",
          "Doe",
          true,
          false,
          0,
          0,
          0,
          0,
          0
        )
      ).to.be.revertedWith("Invalid wallet address");
    });

    it("Should reject empty first name", async function () {
      await expect(
        carChain.addRenter(
          renter1.address,
          "",
          "Doe",
          true,
          false,
          0,
          0,
          0,
          0,
          0
        )
      ).to.be.revertedWith("First name cannot be empty");
    });

    it("Should reject empty last name", async function () {
      await expect(
        carChain.addRenter(
          renter1.address,
          "John",
          "",
          true,
          false,
          0,
          0,
          0,
          0,
          0
        )
      ).to.be.revertedWith("Last name cannot be empty");
    });
  });

  describe("Events", function () {
    it("Should emit RenterAdded event", async function () {
      await expect(
        carChain.addRenter(
          renter1.address,
          "John",
          "Doe",
          true,
          false,
          0,
          0,
          0,
          0,
          0
        )
      )
        .to.emit(carChain, "RenterAdded")
        .withArgs(renter1.address, "John", "Doe");
    });

    it("Should emit DepositMade event", async function () {
      await carChain.addRenter(
        renter1.address,
        "John",
        "Doe",
        true,
        false,
        0,
        0,
        0,
        0,
        0
      );

      const depositAmount = ethers.parseEther("0.01");
      await expect(
        carChain.connect(renter1).deposit(renter1.address, { value: depositAmount })
      )
        .to.emit(carChain, "DepositMade")
        .withArgs(renter1.address, depositAmount);
    });

    it("Should emit CarPickedUp event", async function () {
      await carChain.addRenter(
        renter1.address,
        "John",
        "Doe",
        true,
        false,
        0,
        0,
        0,
        0,
        0
      );

      const depositAmount = ethers.parseEther("0.01");
      await carChain.connect(renter1).deposit(renter1.address, { value: depositAmount });

      await expect(carChain.connect(renter1).pickUp(renter1.address))
        .to.emit(carChain, "CarPickedUp");
    });
  });

  describe("Renter Management", function () {
    it("Should display total duration 0 for new renter", async function () {
      await carChain.addRenter(
        renter1.address,
        "John",
        "Doe",
        false,
        false,
        2,
        0,
        0,
        0,
        0
      );

      const totalDuration = await carChain.getTotalDuration(renter1.address);
      const balance = await carChain.balanceOfRenter(renter1.address);

      assert.equal(totalDuration, 0, "total duration 0 after renter added");
      assert.equal(balance, 2);
    });

    it("Should display balance 0 for new renter", async function () {
      await carChain.addRenter(
        renter1.address,
        "John",
        "Doe",
        false,
        false,
        0,
        0,
        0,
        0,
        0
      );

      const balance = await carChain.balanceOfRenter(renter1.address);
      assert.equal(balance, 0);
    });
  });

  describe("Deposit Functionality", function () {
    beforeEach(async function () {
      await carChain.addRenter(
        renter1.address,
        "John",
        "Doe",
        true,
        false,
        0,
        0,
        0,
        0,
        0
      );
    });

    it("Should allow deposits", async function () {
      const depositAmount = ethers.parseEther("0.01");
      await carChain.connect(renter1).deposit(renter1.address, { value: depositAmount });

      const balance = await carChain.balanceOfRenter(renter1.address);
      expect(balance).to.equal(depositAmount);
    });

    it("Should reject zero deposits", async function () {
      await expect(
        carChain.connect(renter1).deposit(renter1.address, { value: 0 })
      ).to.be.revertedWith("Deposit amount must be greater than 0");
    });

    it("Should reject deposits for non-existent renters", async function () {
      const depositAmount = ethers.parseEther("0.01");
      await expect(
        carChain.connect(nonOwner).deposit(nonOwner.address, { value: depositAmount })
      ).to.be.revertedWith("Renter does not exist");
    });

    it("Should update contract balance after deposit", async function () {
      const depositAmount = ethers.parseEther("0.01");
      await carChain.connect(renter1).deposit(renter1.address, { value: depositAmount });

      const contractBalance = await carChain.getBalance();
      expect(contractBalance).to.equal(depositAmount);
    });
  });

  describe("Car Rental Flow", function () {
    beforeEach(async function () {
      await carChain.addRenter(
        renter1.address,
        "John",
        "Doe",
        true,
        false,
        0,
        0,
        0,
        0,
        0
      );
    });

    it("Should allow pickup with sufficient deposit", async function () {
      const depositAmount = ethers.parseEther("0.01");
      await carChain.connect(renter1).deposit(renter1.address, { value: depositAmount });

      await expect(carChain.connect(renter1).pickUp(renter1.address)).to.not.be.reverted;

      const renterData = await carChain.renters(renter1.address);
      expect(renterData.active).to.be.true;
      expect(renterData.canRent).to.be.false;
    });

    it("Should reject pickup without sufficient deposit", async function () {
      await expect(
        carChain.connect(renter1).pickUp(renter1.address)
      ).to.be.revertedWith("Please make a deposit first to rent a car");
    });

    it("Should allow dropoff after pickup", async function () {
      const depositAmount = ethers.parseEther("0.01");
      await carChain.connect(renter1).deposit(renter1.address, { value: depositAmount });
      await carChain.connect(renter1).pickUp(renter1.address);

      await expect(carChain.connect(renter1).dropOff(renter1.address)).to.not.be.reverted;

      const renterData = await carChain.renters(renter1.address);
      expect(renterData.active).to.be.false;
    });

    it("Should reject dropoff without pickup", async function () {
      await expect(
        carChain.connect(renter1).dropOff(renter1.address)
      ).to.be.revertedWith("You don't renting car yet");
    });
  });

  describe("Payment Functionality", function () {
    beforeEach(async function () {
      await carChain.addRenter(
        renter1.address,
        "John",
        "Doe",
        true,
        false,
        0,
        0,
        0,
        0,
        0
      );
    });

    it("Should allow payment of dues", async function () {
      const depositAmount = ethers.parseEther("0.01");
      await carChain.connect(renter1).deposit(renter1.address, { value: depositAmount });
      await carChain.connect(renter1).pickUp(renter1.address);

      // Wait a bit to accumulate some rental time
      await ethers.provider.send("evm_increaseTime", [300]); // 5 minutes
      await ethers.provider.send("evm_mine");

      await carChain.connect(renter1).dropOff(renter1.address);

      const renterDataBefore = await carChain.renters(renter1.address);
      expect(renterDataBefore.due).to.be.gt(0);

      await expect(carChain.connect(renter1).makePayment(renter1.address))
        .to.emit(carChain, "PaymentMade");

      const renterDataAfter = await carChain.renters(renter1.address);
      expect(renterDataAfter.due).to.equal(0);
      expect(renterDataAfter.canRent).to.be.true;
    });

    it("Should reject payment without dues", async function () {
      await expect(
        carChain.connect(renter1).makePayment(renter1.address)
      ).to.be.revertedWith("You don't have to pay anything at this time");
    });
  });

  describe("Withdrawal Functionality", function () {
    beforeEach(async function () {
      await carChain.addRenter(
        renter1.address,
        "John",
        "Doe",
        true,
        false,
        0,
        0,
        0,
        0,
        0
      );
    });

    it("Should allow withdrawal when no dues", async function () {
      const depositAmount = ethers.parseEther("0.01");
      await carChain.connect(renter1).deposit(renter1.address, { value: depositAmount });

      const balanceBefore = await ethers.provider.getBalance(renter1.address);

      await expect(carChain.connect(renter1).withdrawMinusDue(renter1.address))
        .to.emit(carChain, "FundsWithdrawn")
        .withArgs(renter1.address, depositAmount);

      const balanceAfter = await ethers.provider.getBalance(renter1.address);
      expect(balanceAfter).to.be.gt(balanceBefore);
    });

    it("Should reject withdrawal with pending dues", async function () {
      const depositAmount = ethers.parseEther("0.01");
      await carChain.connect(renter1).deposit(renter1.address, { value: depositAmount });
      await carChain.connect(renter1).pickUp(renter1.address);

      await ethers.provider.send("evm_increaseTime", [300]);
      await ethers.provider.send("evm_mine");

      await carChain.connect(renter1).dropOff(renter1.address);

      await expect(
        carChain.connect(renter1).withdrawMinusDue(renter1.address)
      ).to.be.revertedWith("Pay the amount due first");
    });

    it("Should reject withdrawal while car is active", async function () {
      const depositAmount = ethers.parseEther("0.01");
      await carChain.connect(renter1).deposit(renter1.address, { value: depositAmount });
      await carChain.connect(renter1).pickUp(renter1.address);

      await expect(
        carChain.connect(renter1).withdrawMinusDue(renter1.address)
      ).to.be.revertedWith("Cannot withdraw while car is rented");
    });

    it("Should reject withdrawal by non-owner of funds", async function () {
      const depositAmount = ethers.parseEther("0.01");
      await carChain.connect(renter1).deposit(renter1.address, { value: depositAmount });

      await expect(
        carChain.connect(renter2).withdrawMinusDue(renter1.address)
      ).to.be.revertedWith("You can't withdraw not yours money");
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await carChain.addRenter(
        renter1.address,
        "John",
        "Doe",
        true,
        false,
        0,
        0,
        0,
        0,
        0
      );
    });

    it("Should return correct canRentCar status", async function () {
      expect(await carChain.canRentCar(renter1.address)).to.be.true;

      const depositAmount = ethers.parseEther("0.01");
      await carChain.connect(renter1).deposit(renter1.address, { value: depositAmount });
      await carChain.connect(renter1).pickUp(renter1.address);

      expect(await carChain.canRentCar(renter1.address)).to.be.false;
    });

    it("Should return correct balance", async function () {
      const depositAmount = ethers.parseEther("0.01");
      await carChain.connect(renter1).deposit(renter1.address, { value: depositAmount });

      const balance = await carChain.balanceOfRenter(renter1.address);
      expect(balance).to.equal(depositAmount);
    });
  });
});
