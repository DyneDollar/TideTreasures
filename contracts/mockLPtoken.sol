// MockLPtoken.sol
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockLPtoken is ERC721 {
    constructor() ERC721("Mock LP Token", "MLPT") {}

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }
}
