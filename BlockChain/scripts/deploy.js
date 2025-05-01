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

  // Optionally send ETH to fund the contract
  const tx = await deployer.sendTransaction({
    to: contractAddress,
    value: ethers.parseEther("10"), // 10 ETH to fund the contract
    gasLimit: 5000000, // Adjust gas limit if needed
    gasPrice: ethers.parseUnits("20", "gwei"), // Adjust gas price if needed
  });

  await tx.wait();
  console.log(`Funded contract at ${contractAddress} with 10 ETH`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during deployment or funding:", error);
    process.exit(1);
  });
