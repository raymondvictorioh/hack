pragma solidity >=0.8.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

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
  // Token Image URI
  string resourceUri;
}

library IterableMapping {
  // Iterable mapping from uint to Listing;
  struct Map {
      uint[] keys;
      mapping(uint => Listing) values;
      mapping(uint => uint) indexOf;
      mapping(uint => bool) inserted;
  }

  function get(Map storage map, uint key) public view returns (Listing memory) {
      return map.values[key];
  }

  function getKeyAtIndex(Map storage map, uint index) public view returns (uint) {
      return map.keys[index];
  }

  function size(Map storage map) public view returns (uint) {
      return map.keys.length;
  }

  function set(
      Map storage map,
      uint key,
      Listing memory val
  ) public {
      if (map.inserted[key]) {
          map.values[key] = val;
      } else {
          map.inserted[key] = true;
          map.values[key] = val;
          map.indexOf[key] = map.keys.length;
          map.keys.push(key);
      }
  }

  function remove(Map storage map, uint key) public {
      if (!map.inserted[key]) {
          return;
      }

      delete map.inserted[key];
      delete map.values[key];

      uint index = map.indexOf[key];
      uint lastIndex = map.keys.length - 1;
      uint lastKey = map.keys[lastIndex];

      map.indexOf[lastKey] = index;
      delete map.indexOf[key];

      map.keys[index] = lastKey;
      map.keys.pop();
  }
}

contract WagmiContract is ReentrancyGuard {
  using SafeMath for uint256;
  using IterableMapping for IterableMapping.Map;

  // the NFTs that are being sold on Wagmi.
  uint256 listingId = 0;
  IterableMapping.Map private listingsMap;

  // TODO: Deprecate
  mapping(uint256 => Listing) listings;

  // the set of registered promoters. mapping used for O(1) access.
  mapping(address => bool) promoters;

  event NewListing(uint256 _listingId);
  event BoughtListing(uint256 _listingId);

  /**
   * Gives WagmiContract the authority to manage the owner's NFT.
   * @param _tokenAddr address of the NFT contract.
   * @param _tokenId id of the token on the NFT contract.
   */
  function approveWagmi(address _tokenAddr, uint256 _tokenId) external {
    require(IERC721(_tokenAddr).ownerOf(_tokenId) == msg.sender, "Token is not owned by caller");
    IERC721(_tokenAddr).approve(address(this), _tokenId);
  }

  /**
   * Gets all the listings on the platform
   * TODO: Limit listings
   */
  function getListings() external view returns (Listing[] memory) {
    uint listingsSize = listingsMap.size();
    Listing[] memory allListings = new Listing[](listingsSize);
    
    for (uint i = 0; i < listingsSize; i++) {
      uint key = listingsMap.getKeyAtIndex(i);
      allListings[i] = listingsMap.get(key);
    }

    return allListings;
  }

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
    listingsMap.set(
      listingId,
      Listing({
        exists: true,
        tokenAddr: _tokenAddr,
        tokenId: _tokenId,
        ownerAddr: msg.sender,
        listPrice: _listPrice,
        promoterReward: _promoterReward,
        buyerReward: _buyerReward,
        resourceUri: ERC721(_tokenAddr).tokenURI(_tokenId)
      })
    );
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
    require(listingsMap.get(_listingId).exists == true, "listing does not exist");
    return listingsMap.get(_listingId);
  }

  /**
   * Delist an NFT from the Wagmi marketplace.
   * @param _listingId id of the listing.
   */
  function removeListing(uint256 _listingId) external {
    require(listingsMap.get(_listingId).exists == true, "listing does not exist");
    listingsMap.remove(_listingId);
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
  function buyNFT(uint256 _listingId, address _promoterAddr) external payable nonReentrant {
    require(_listingId <= listingId, "Invalid _listingId");
    
    Listing memory listing = listingsMap.get(_listingId);
    require(listing.exists, "Listing does not exist anymore");
    require(msg.value >= listing.listPrice, "Buyer amount is below listed price");
    
    address tokenOperator = IERC721(listing.tokenAddr).getApproved(listing.tokenId);
    require(tokenOperator == address(this), "Contract is not approved to send NFT"); 

    // Transfer commission
    if (_promoterAddr != address(0)) {
      uint promoterRewardFee = listing.promoterReward.mul(listing.listPrice).div(100);
      uint buyerRewardFee = listing.buyerReward.mul(listing.buyerReward).div(100);

      payable(_promoterAddr).transfer(promoterRewardFee);
      (bool success, ) = msg.sender.call{ value: buyerRewardFee }("");
      require(success, "Sending reward to buyer failed");
    }

    // TODO: Replace with safeTransferFrom by checking ERC721Receiver implementer
    IERC721(listing.tokenAddr).transferFrom(listing.ownerAddr, msg.sender, listing.tokenId);
    payable(listing.ownerAddr).transfer(listing.listPrice);

    emit BoughtListing(_listingId);
  }
}
