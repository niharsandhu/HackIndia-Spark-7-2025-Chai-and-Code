const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy NGORegistry
  const NGORegistry = await ethers.getContractFactory("NGORegistry");
  const ngoRegistry = await NGORegistry.deploy();
  await ngoRegistry.deployTransaction.wait();
  console.log("NGORegistry deployed to:", ngoRegistry.address);

  // Deploy AidTracker
  const AidTracker = await ethers.getContractFactory("AidTracker");
  const aidTracker = await AidTracker.deploy();
  await aidTracker.deployTransaction.wait();
  console.log("AidTracker deployed to:", aidTracker.address);

  // Deploy DonationVault with references to the other contracts
  const DonationVault = await ethers.getContractFactory("DonationVault");
  const donationVault = await DonationVault.deploy(ngoRegistry.address, aidTracker.address);
  await donationVault.deployTransaction.wait();
  console.log("DonationVault deployed to:", donationVault.address);

  // Optional: Transfer ownership of AidTracker and NGORegistry to DonationVault
  // Uncomment if you want centralized control through DonationVault
  /*
  await ngoRegistry.transferOwnership(donationVault.address);
  console.log("NGORegistry ownership transferred to DonationVault");
  
  await aidTracker.transferOwnership(donationVault.address);
  console.log("AidTracker ownership transferred to DonationVault");
  */

  console.log("Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });