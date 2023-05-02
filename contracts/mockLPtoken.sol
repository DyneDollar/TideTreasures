// SPDX-License-Identifier: MIT

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockLPtoken is ERC721 {
    uint256 private _tokenIdCounter;

    constructor() ERC721("MockLPtoken", "mLPT") {}

    function mint(address to) public {
        _mint(to, _tokenIdCounter);
        _tokenIdCounter++;
    }
}
