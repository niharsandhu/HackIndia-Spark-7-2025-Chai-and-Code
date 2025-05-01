const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy DonationVault
  const DonationVault = await ethers.getContractFactory("DonationVault");
  const donationVault = await DonationVault.deploy();

  // Wait for the contract to be deployed
  await donationVault.waitForDeployment();
  const contractAddress = await donationVault.getAddress();
  console.log("DonationVault deployed to:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during deployment or funding:", error);
    process.exit(1);
  });
