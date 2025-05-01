const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy NGORegistry
  const NGORegistry = await ethers.getContractFactory("NGORegistry");
  const ngoRegistry = await NGORegistry.deploy();
  
  // Wait for the contract to be mined
  await ngoRegistry.waitForDeployment();
  console.log("NGORegistry deployed to:", await ngoRegistry.getAddress());

  // Deploy AidTracker
  const AidTracker = await ethers.getContractFactory("AidTracker");
  const aidTracker = await AidTracker.deploy();
  
  // Wait for the contract to be mined
  await aidTracker.waitForDeployment();
  console.log("AidTracker deployed to:", await aidTracker.getAddress());

  // Deploy DonationVault with references to the other contracts
  const DonationVault = await ethers.getContractFactory("DonationVault");
  const donationVault = await DonationVault.deploy(
    await ngoRegistry.getAddress(), 
    await aidTracker.getAddress()
  );
  
  // Wait for the contract to be mined
  await donationVault.waitForDeployment();
  console.log("DonationVault deployed to:", await donationVault.getAddress());

  // Optional: Transfer ownership of AidTracker and NGORegistry to DonationVault
  /*
  await ngoRegistry.transferOwnership(await donationVault.getAddress());
  console.log("NGORegistry ownership transferred to DonationVault");
  
  await aidTracker.transferOwnership(await donationVault.getAddress());
  console.log("AidTracker ownership transferred to DonationVault");
  */

  console.log("Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
  });