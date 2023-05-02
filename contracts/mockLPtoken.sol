// MockLPtoken.sol
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract MockLPtoken is ERC721Enumerable {
    constructor() ERC721("Mock LP Token", "MLPT") {}

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }
}
