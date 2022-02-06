pragma solidity >=0.8.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";

// import "@openzeppelin/contracts/access/Ownable.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract WagmiContract {
  struct Listing {
    // address of the NFT contract.
    address tokenAddr;
    // id of the token on the NFT contract.
    uint256 tokenId;
    // address of the owner.
    address ownerAddr;
    // price of the NFT to be sold at.
    uint256 listPrice;
    // commission given to promoters for referring people.
    uint256 promoterReward;
    // discount given to buyers if they are referred.
    uint256 buyerReward;
  }

  // the NFTs that are being sold on Wagmi.
  Listing[] listings;

  // the set of registered promoters. mapping used for O(1) access.
  mapping(address => bool) promoters;

  event NewListing(uint256 listingId);
  event BoughtListing(uint256 listingId);

  /**
   * Gives WagmiContract the authority to manage the owner's NFT.
   */
  function approveWagmi(address tokenAddr, uint256 tokenId) external {}

  /**
   * Lists an NFT on the Wagmi marketplace.
   */
  function listNFT(
    address tokenAddr,
    uint256 tokenId,
    uint256 listPrice,
    uint256 promoterReward,
    uint256 buyerReward
  ) external payable {}

  /**
   * Retrieves the information of a listing on the Wagmi marketplace.
   */
  function getListing(uint256 listingId)
    external
    view
    returns (Listing memory)
  {}

  /**
   * Delist an NFT from the Wagmi marketplace.
   */
  function removeListing(uint256 listingId) external {}

  /**
   * Allow people to sign up as promoters on the Wagmi marketplace.
   */
  function promoterSignUp() external {}

  /**
   * Purchase an NFT.
   */
  function buyNFT(uint256 listingId, address promoterAddr) external payable {}
}
