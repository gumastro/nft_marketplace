// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {

    // State variables
    address payable public immutable feeAccount; // receives fees
    uint public immutable feePercent; // fee percentage on sales
    uint public itemCount;
    
    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;
    }

    mapping(uint => Item) public items;

    constructor (uint _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }
}