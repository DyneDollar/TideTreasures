pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721Holder.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract TideTreasures is ERC721Holder, ReentrancyGuard {
    IERC20 public dyneDollar;
    IERC721 public lpToken;

    struct Stake {
        uint256 amount;
        uint256 timestamp;
    }

    mapping(address => Stake[]) public stakes;

    event Staked(address indexed user, uint256 amount, uint256 timestamp);
    event Unstaked(address indexed user, uint256 amount, uint256 timestamp);
    event RewardsWithdrawn(address indexed user, uint256 amount);

    constructor(address _dyneDollar, address _lpToken) {
        dyneDollar = IERC20(_dyneDollar);
        lpToken = IERC721(_lpToken);
    }

    function stake(uint256 tokenId) external nonReentrant {
        lpToken.safeTransferFrom(msg.sender, address(this), tokenId);
        stakes[msg.sender].push(Stake(lpToken.tokenOfOwnerByIndex(address(this), tokenId), block.timestamp));
        emit Staked(msg.sender, lpToken.tokenOfOwnerByIndex(address(this), tokenId), block.timestamp);
    }

    function unstake(uint256 tokenId) external nonReentrant {
        Stake[] storage userStakes = stakes[msg.sender];
        uint256 tokenIndex;
        bool found = false;

        for (uint256 i = 0; i < userStakes.length; i++) {
            if (userStakes[i].amount == tokenId) {
                tokenIndex = i;
                found = true;
                break;
            }
        }

        require(found, "No such staked token");
        
        uint256 tokenAmount = userStakes[tokenIndex].amount;

        lpToken.safeTransferFrom(address(this), msg.sender, tokenId);

        userStakes[tokenIndex] = userStakes[userStakes.length - 1];
        userStakes.pop();

        emit Unstaked(msg.sender, tokenAmount, block.timestamp);
    }

    function withdrawRewards() external nonReentrant {
        Stake[] storage userStakes = stakes[msg.sender];
        uint256 totalRewards = 0;

        for (uint256 i = 0; i < userStakes.length; i++) {
            uint256 duration = block.timestamp - userStakes[i].timestamp;
            totalRewards += userStakes[i].amount * duration;
        }

        require(dyneDollar.balanceOf(address(this)) >= totalRewards, "Not enough rewards");

        dyneDollar.transfer(msg.sender, totalRewards);

        emit RewardsWithdrawn(msg.sender, totalRewards);
    }
}
