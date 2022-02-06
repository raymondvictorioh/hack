const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("WagmiContract", function () {
  let contract;
  it("Should deploy WagmiContract", async function () {
    const WagmiContract = await ethers.getContractFactory("WagmiContract");
    contract = await WagmiContract.deploy();
  });
});
