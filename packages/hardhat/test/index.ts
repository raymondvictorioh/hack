import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, use } from "chai";
import { MockContract } from "ethereum-waffle";
import { ethers, waffle } from "hardhat";
import IERC721 from "../artifacts/@openzeppelin/contracts/token/ERC721/IERC721.sol/IERC721.json";
import { IERC721 as ERC721Interface, WagmiContract } from "../typechain";

const { solidity, deployMockContract } = waffle;
const provider = waffle.provider;
use(solidity);

describe("WagmiContract", function () {
  let contract: WagmiContract;
  let mockErc721Contract: MockContract;
  let deployer: SignerWithAddress;
  let nftOwner: SignerWithAddress;
  let promoter: SignerWithAddress;
  let buyer: SignerWithAddress;

  async function createNewListing({
    tokenId = 1,
    listPrice = 1,
    promoterReward = 10,
    buyerReward = 10,
    depositValue = 0.2,
  }) {
    return contract
      .connect(nftOwner)
      .listNFT(
        mockErc721Contract.address,
        tokenId,
        ethers.utils.parseEther(listPrice.toString()),
        promoterReward,
        buyerReward,
        { value: ethers.utils.parseEther(depositValue.toString()) }
      );
  }

  before(async () => {
    [deployer, nftOwner, promoter, buyer] = await ethers.getSigners();
  });

  // redeploy on every test.
  beforeEach(async () => {
    const WagmiContract = await ethers.getContractFactory("WagmiContract");
    contract = await WagmiContract.deploy();
    await contract.deployed();

    mockErc721Contract = await deployMockContract(deployer, IERC721.abi);
  });

  it("should list a new NFT", async () => {
    await expect(createNewListing({}))
      .to.emit(contract, "NewListing")
      .withArgs(0);
  });

  it("should have unique listingIds on consecutive listings", async () => {
    await expect(createNewListing({}))
      .to.emit(contract, "NewListing")
      .withArgs(0);
    await expect(createNewListing({}))
      .to.emit(contract, "NewListing")
      .withArgs(1);
  });

  // it("should revert if deposit value is wrong", async () => {
  //   await expect(createNewListing({ depositValue: 0 })).to.be.revertedWith(
  //     contract,
  //     "NewListing"
  //   );
  // });
});
