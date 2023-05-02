
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";



contract TideTreasures is ERC721Enumerable, ReentrancyGuard, IERC721Receiver {

    IERC20 public dyneDollar;
    ERC721Enumerable public lpToken;

    struct Stake {
        uint256 amount;
        uint256 timestamp;
    }

    mapping(address => Stake[]) public stakes;

    event Staked(address indexed user, uint256 amount, uint256 timestamp);
    event Unstaked(address indexed user, uint256 amount, uint256 timestamp);
    event RewardsWithdrawn(address indexed user, uint256 amount);


    constructor(address _dyneDollar, address _lpToken) ERC721("TideTreasures", "TT") {
        // Your constructor code here...
        dyneDollar = IERC20(_dyneDollar);
        lpToken = ERC721Enumerable(_lpToken);
    }

    function onERC721Received(address, address, uint256, bytes calldata) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }

function stake(uint256 tokenId) external nonReentrant {
    lpToken.safeTransferFrom(msg.sender, address(this), tokenId);
    stakes[msg.sender].push(Stake(tokenId, block.timestamp)); // use tokenId directly
    emit Staked(msg.sender, tokenId, block.timestamp); // use tokenId directly
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
    
    lpToken.safeTransferFrom(address(this), msg.sender, tokenId); // use tokenId directly

    userStakes[tokenIndex] = userStakes[userStakes.length - 1];
    userStakes.pop();

    emit Unstaked(msg.sender, tokenId, block.timestamp); // use tokenId directly
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
