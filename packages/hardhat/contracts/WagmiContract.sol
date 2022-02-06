pragma solidity >=0.8.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";

// import "@openzeppelin/contracts/access/Ownable.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract WagmiContract {
  struct Listing {
    address tokenAddr;
    uint256 tokenId;
    address ownerAddr;
    uint256 listPrice;
    uint256 promoterReward;
    uint256 buyerReward;
  }

  Listing[] listings;
  mapping(address => bool) promoters;

  event NewListing(uint256 listingId);
  event BoughtListing(uint256 listingId);

  function approveWagmi(address tokenAddr, uint256 tokenId) external {}

  function listNFT(
    address tokenAddr,
    uint256 tokenId,
    uint256 listPrice,
    uint256 promoterReward,
    uint256 buyerReward
  ) external payable {}

  function getListing(uint256 listingId)
    external
    view
    returns (Listing memory)
  {}

  function removeListing(uint256 listingId) external {}

  function promoterSignUp() external {}

  function buyNFT(uint256 listingId, address promoterAddr) external payable {}
}
