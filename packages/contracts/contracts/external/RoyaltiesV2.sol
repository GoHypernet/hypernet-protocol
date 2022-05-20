// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/interfaces/IERC2981Upgradeable.sol";

abstract contract LibRoyalties2981 {
    uint96 ROYALTY_FEE;    
    address ROYALTY_RECIPIENT;

    bytes4 constant _INTERFACE_ID_ROYALTIES = 0xcad96cca;
    bytes32 public constant PART_TYPE_HASH = keccak256("Part(address account,uint96 value)");

    event RoyaltiesSet(uint256 tokenId, Part[] royalties);

    struct Part {
        address payable account;
        uint96 value;
    }

    function hash(Part memory part) internal pure returns (bytes32) {
        return keccak256(abi.encode(PART_TYPE_HASH, part.account, part.value));
    }

    /*Method for converting amount to percent and forming LibPart*/
    function calculateRoyalties(address to, uint256 amount) internal view returns (Part[] memory) {
        Part[] memory result;
        
        if (amount == 0) return result;

        uint256 percent = (amount * 100 / ROYALTY_FEE) * 100;
        
        require(percent < 10000, "Royalty cannot be higher than 100%");
        
        result = new Part[](1);
        result[0].account = payable(to);
        result[0].value = uint96(percent);

        return result;
    }
}

abstract contract RoyaltiesV2Impl is LibRoyalties2981, IERC2981Upgradeable {
    function getRaribleV2Royalties(uint256) external view virtual returns (Part[] memory info) {
        info = new Part[](1);

        info[0].account = payable(ROYALTY_RECIPIENT);
        info[0].value = ROYALTY_FEE;
    }

    function _onRoyaltiesSet(uint256 id, Part[] memory _royalties) internal {
        emit RoyaltiesSet(id, _royalties);
    }

    function royaltyInfo(uint256, uint256 _salePrice) external view virtual returns (address receiver, uint256 royaltyAmount) {
        return (ROYALTY_RECIPIENT, ROYALTY_FEE * _salePrice / 10000);
    }
}

