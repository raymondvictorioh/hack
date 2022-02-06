pragma solidity >=0.8.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract WagmiContract {
  using SafeMath for uint256;

  struct Listing {
    // a boolean to check that the listing exists.
    bool exists;
    // address of the NFT contract.
    address tokenAddr;
    // id of the token on the NFT contract.
    uint256 tokenId;
    // address of the owner.
    address ownerAddr;
    // price of the NFT to be sold at, in base 10^18.
    uint256 listPrice;
    // commission given to promoters for referring people, in base 10^2.
    uint256 promoterReward;
    // discount given to buyers if they are referred, in base 10^2.
    uint256 buyerReward;
  }

  // the NFTs that are being sold on Wagmi.
  uint256 listingId = 0;
  mapping(uint256 => Listing) listings;

  // the set of registered promoters. mapping used for O(1) access.
  mapping(address => bool) promoters;

  event NewListing(uint256 _listingId);
  event BoughtListing(uint256 _listingId);

  /**
   * Gives WagmiContract the authority to manage the owner's NFT.
   * @param tokenAddr address of the NFT contract.
   * @param tokenId id of the token on the NFT contract.
   */
  function approveWagmi(address tokenAddr, uint256 tokenId) external {}

  /**
   * Lists an NFT on the Wagmi marketplace.
   * @param _tokenAddr address of the NFT contract.
   * @param _tokenId id of the token on the NFT contract.
   * @param _listPrice price of the NFT to be sold at.
   * @param _promoterReward commission given to promoters for referring people.
   * @param _buyerReward discount given to buyers if they are referred.
   * todo: ensure that msg.sender is owner of NFT.
   */
  function listNFT(
    address _tokenAddr,
    uint256 _tokenId,
    uint256 _listPrice,
    uint256 _promoterReward,
    uint256 _buyerReward
  ) external payable returns (uint256) {
    uint256 expectedDeposit = _listPrice.mul(
      _promoterReward.add(_buyerReward).div(100)
    );
    require(msg.value == expectedDeposit, "Expected deposit is wrong");

    listings[listingId] = Listing({
      exists: true,
      tokenAddr: _tokenAddr,
      tokenId: _tokenId,
      ownerAddr: msg.sender,
      listPrice: _listPrice,
      promoterReward: _promoterReward,
      buyerReward: _buyerReward
    });
    emit NewListing(listingId);
    return listingId++;
  }

  /**
   * Retrieves the information of a listing on the Wagmi marketplace.
   * @param _listingId id of the listing.
   * @return the information of the listing.
   */
  function getListing(uint256 _listingId)
    external
    view
    returns (Listing memory)
  {
    require(listings[_listingId].exists == true, "listing does not exist");
    return listings[_listingId];
  }

  /**
   * Delist an NFT from the Wagmi marketplace.
   * @param _listingId id of the listing.
   */
  function removeListing(uint256 _listingId) external {
    require(listings[_listingId].exists == true, "listing does not exist");
    delete listings[_listingId];
  }

  /**
   * Allow people to sign up as promoters on the Wagmi marketplace.
   */
  function promoterSignUp() external {
    promoters[msg.sender] = true;
  }

  /**
   * Purchase an NFT.
   * @param _listingId id of the listing.
   * @param _promoterAddr address of the referrer. the null address (0x0)
   * is used if the NFT is bought without a promoter address.
   */
  function buyNFT(uint256 _listingId, address _promoterAddr) external payable {}
}
