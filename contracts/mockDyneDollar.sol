// SPDX-License-Identifier: MIT

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockDyneDollar is ERC20 {
    constructor() ERC20("MockDyneDollar", "mDYNE") {
        _mint(msg.sender, 1000000 * 10**18); // Mint 1,000,000 mDYNE tokens to deployer
    }
}
