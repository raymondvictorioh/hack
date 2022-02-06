import { ethers } from "hardhat";

async function main() {
  const WagmiContract = await ethers.getContractFactory("WagmiContract");
  const wagmiContract = await WagmiContract.deploy();
  await wagmiContract.deployed();
  console.log("WagmiContract deployed to:", wagmiContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
