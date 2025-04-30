const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Donation Platform System", function () {
  let NGORegistry, AidTracker, DonationVault;
  let ngoRegistry, aidTracker, donationVault;
  let owner, donor1, donor2, ngoWallet1, ngoWallet2;

  beforeEach(async function () {
    // Get signers
    [owner, donor1, donor2, ngoWallet1, ngoWallet2] = await ethers.getSigners();

    // Deploy NGORegistry
    NGORegistry = await ethers.getContractFactory("NGORegistry");
    ngoRegistry = await NGORegistry.deploy();
    await ngoRegistry.deployed(); // Wait for deployment
    console.log("NGORegistry deployed at:", ngoRegistry.address); // Log the address

    // Deploy AidTracker
    AidTracker = await ethers.getContractFactory("AidTracker");
    aidTracker = await AidTracker.deploy();
    await aidTracker.deployed(); // Wait for deployment
    console.log("AidTracker deployed at:", aidTracker.address); // Log the address

    // Log addresses before deploying DonationVault
    console.log("NGORegistry address before DonationVault deployment:", ngoRegistry.address);
    console.log("AidTracker address before DonationVault deployment:", aidTracker.address);

    // Deploy DonationVault
    DonationVault = await ethers.getContractFactory("DonationVault");
    donationVault = await DonationVault.deploy(ngoRegistry.address, aidTracker.address);
    await donationVault.deployed(); // Wait for deployment
    console.log("DonationVault deployed at:", donationVault.address); // Log the address
  });

  describe("NGORegistry", function () {
    it("Should register a new NGO", async function () {
      await ngoRegistry.registerNGO(ngoWallet1.address, "NGO 1", "ipfs://metadata1");

      const ngo = await ngoRegistry.ngos(0);
      expect(ngo.wallet).to.equal(ngoWallet1.address);
      expect(ngo.name).to.equal("NGO 1");
      expect(ngo.metadata).to.equal("ipfs://metadata1");
      expect(ngo.isApproved).to.equal(true);
      expect(ngo.needsFunding).to.equal(false);
    });

    it("Should update NGO status", async function () {
      await ngoRegistry.registerNGO(ngoWallet1.address, "NGO 1", "ipfs://metadata1");
      await ngoRegistry.updateNGOStatus(0, true, true);

      const ngo = await ngoRegistry.ngos(0);
      expect(ngo.isApproved).to.equal(true);
      expect(ngo.needsFunding).to.equal(true);
    });

    it("Should get NGOs in need", async function () {
      await ngoRegistry.registerNGO(ngoWallet1.address, "NGO 1", "ipfs://metadata1");
      await ngoRegistry.registerNGO(ngoWallet2.address, "NGO 2", "ipfs://metadata2");

      await ngoRegistry.updateNGOStatus(0, true, true);
      await ngoRegistry.updateNGOStatus(1, true, false);

      const ngosInNeed = await ngoRegistry.getNGOsInNeed();
      expect(ngosInNeed.length).to.equal(1);
      expect(ngosInNeed[0]).to.equal(0);
    });
  });

  describe("AidTracker", function () {
    it("Should create aid card", async function () {
      await aidTracker.createAidCard("family1", "ipfs://familydata1");

      const aidCard = await aidTracker.aidCards("family1");
      expect(aidCard.beneficiaryId).to.equal("family1");
      expect(aidCard.metadata).to.equal("ipfs://familydata1");
      expect(aidCard.totalReceived).to.equal(0);
      expect(aidCard.isActive).to.equal(true);
    });

    it("Should record aid distribution", async function () {
      await aidTracker.createAidCard("family1", "ipfs://familydata1");
      await aidTracker.recordAidDistribution("family1", 0, 100, "Food packages");

      const distributionCount = await aidTracker.getDistributionCount("family1");
      expect(distributionCount).to.equal(1);

      const distribution = await aidTracker.getDistribution("family1", 0);
      expect(distribution.ngoId).to.equal(0);
      expect(distribution.amount).to.equal(100);
      expect(distribution.details).to.equal("Food packages");

      const aidCard = await aidTracker.aidCards("family1");
      expect(aidCard.totalReceived).to.equal(100);
    });
  });

  describe("DonationVault", function () {
    beforeEach(async function () {
      // Register an NGO
      await ngoRegistry.registerNGO(ngoWallet1.address, "NGO 1", "ipfs://metadata1");
      await ngoRegistry.updateNGOStatus(0, true, true);
    });

    it("Should receive donations", async function () {
      const donationAmount = ethers.parseEther("1.0"); // Updated for ethers v6

      await donor1.sendTransaction({
        to: donationVault.address, // Use address directly
        value: donationAmount
      });

      const stats = await donationVault.getStats();
      expect(stats.balance).to.equal(donationAmount);
      expect(stats.donated).to.equal(donationAmount);
    });

    it("Should fund NGO", async function () {
      // Receive donation
      const donationAmount = ethers.parseEther("1.0"); // Updated for ethers v6
      await donor1.sendTransaction({
        to: donationVault.address, // Use address directly
        value: donationAmount
      });

      // Fund NGO
      const fundingAmount = ethers.parseEther("0.5"); // Updated for ethers v6
      const initialBalance = await ethers.provider.getBalance(ngoWallet1.address);

      await donationVault.fundNGO(0, fundingAmount);

      // Check NGO received the funds
      const newBalance = await ethers.provider.getBalance(ngoWallet1.address);
      expect(newBalance - initialBalance).to.equal(fundingAmount); // BigInt subtraction in ethers v6

      // Check vault stats
      const stats = await donationVault.getStats();
      expect(stats.distributed).to.equal(fundingAmount);
    });

    it("Should record returned funds", async function () {
      // Receive donation and fund NGO
      const donationAmount = ethers.parseEther("1.0"); // Updated for ethers v6
      await donor1.sendTransaction({
        to: donationVault.address, // Use address directly
        value: donationAmount
      });

      const fundingAmount = ethers.parseEther("0.5"); // Updated for ethers v6
      await donationVault.fundNGO(0, fundingAmount);

      // Return some funds
      const returnAmount = ethers.parseEther("0.2"); // Updated for ethers v6
      await donationVault.connect(owner).recordReturnedFunds(0, returnAmount, {
        value: returnAmount
      });

      // Check funding record
      const funding = await donationVault.fundings(0);
      expect(funding.returned).to.equal(returnAmount);

      // Check vault stats
      const stats = await donationVault.getStats();
      expect(stats.returned).to.equal(returnAmount);
    });
  });
});
