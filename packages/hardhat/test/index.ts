import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, use } from "chai";
import { MockContract } from "ethereum-waffle";
import { ethers, waffle } from "hardhat";
import ERC721 from "../artifacts/@openzeppelin/contracts/token/ERC721/ERC721.sol/ERC721.json";
import { WagmiContract } from "../typechain";

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

    mockErc721Contract = await deployMockContract(deployer, ERC721.abi);
    mockErc721Contract.mock.tokenURI.returns("ipfs://abcd");
  });

  beforeEach(async () => {
    const WagmiContract = await ethers.getContractFactory("WagmiContract");
    contract = await WagmiContract.deploy();
    await contract.deployed();
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

  it("should revert if deposit value is wrong", async () => {
    await expect(createNewListing({ depositValue: 0 })).to.be.revertedWith(
      "Expected deposit is wrong"
    );
  });
});
