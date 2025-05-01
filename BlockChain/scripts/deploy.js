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

  // Fund the deployed contract with 10 ETH (Ethers v6 syntax)
  const tx = await deployer.sendTransaction({
    to: contractAddress,
    value: ethers.parseEther("10") // updated for v6
  });

  await tx.wait();
  console.log(`Funded contract at ${contractAddress} with 10 ETH`);

  console.log("Deployment and funding complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during deployment or funding:", error);
    process.exit(1);
  });
