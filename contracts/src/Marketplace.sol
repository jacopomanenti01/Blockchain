// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin-contracts/contracts/token/ERC721/IERC721.sol";
import "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import "openzeppelin-contracts/contracts/access/AccessControl.sol";
import "openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import "openzeppelin-contracts/contracts/utils/Strings.sol";

import "./interfaces/IMarketplace.sol";

contract Marketplace is AccessControl, ReentrancyGuard, IMarketplace {
    using SafeERC20 for IERC20;

    uint256 public constant PERCENT_DIVIDER = 1000000;  // percentage divider, 6 decimals

    struct Order {
        uint256 id;     // order ID, starting from 1
        address paymentToken; // if token is address(0), it means native coin
        uint256 price; // sell price for single token
        uint256 amount; // 1 for ERC721, 1 or more for ERC1155
        uint256 tokenId;
        address owner; // address that creates the listing
        address collection;  // erc721 or erc1155 address
    }

    // Marketplace variables
    address public mpFeesCollector;
    // MarketPlace Fee 
    uint256 public mpFeesPercentage;

    mapping(uint256 => bool) public usedOrderIds;

    /**
     * @notice Initializer
     * @param _mpFeesCollector Address that collects marketplace fees
     * @param _mpFeesPercentage marketplace fees percentage (scaled by 10^6)
     */
    constructor(address _mpFeesCollector, uint256 _mpFeesPercentage) {
        mpFeesCollector = _mpFeesCollector;
        mpFeesPercentage = _mpFeesPercentage;

        // add deployer as admin
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    /**
     * @notice set a new address to collect marketplace fees (DEFAULT_ADMIN_ROLE)
     * @param _newMPFeesCollector new treasury address
     */
    function setNewTreasury(address _newMPFeesCollector) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_newMPFeesCollector != address(0), "Address not allowed");
        mpFeesCollector = _newMPFeesCollector;
    }

    /**
     * @notice set a new marketplace fees (scaled by 1000000) (DEFAULT_ADMIN_ROLE)
     * @param _newMPFeesPercentage new marketplace fees percentage (scaled by 10^6)
     */
    function setMarketPlaceFee(uint256 _newMPFeesPercentage) external onlyRole(DEFAULT_ADMIN_ROLE) {
        mpFeesPercentage = _newMPFeesPercentage;
        emit NewMPFees(mpFeesPercentage);
    }

    /**
     * @dev builds a prefixed hash to mimic the behavior of eth_sign.
     * @param _string hashed message
     * @return hash prefixed hashed message
     */
    function msgHash(string memory _string) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_string));
    }

    /**
     * @dev builds a prefixed hash to mimic the behavior of eth_sign.
     * @param _hash hashed message
     * @return hash prefixed hashed message
     */
    function ethMsgHash(bytes32 _hash) public pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _hash));
    }

    /**
     * @dev recover the original address that signed a prefixed message
     * @param _ethHash prefixed hashed message
     * @param _sig message signature
     * @return address signature signed address
     */
    function recover(bytes32 _ethHash, bytes calldata _sig) public pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSig(_sig);
        return ecrecover(_ethHash, v, r, s);
    }

    /**
     * @dev split a signature in r, s, and v components
     * @param _sig message signature
     * @return r signature component
     * @return s signature component
     * @return v signature component
     */
    function splitSig(bytes memory _sig) internal pure returns(bytes32 r, bytes32 s, uint8 v) {
        require(_sig.length == 65, "Invalid sig length");
        assembly {
            r := mload(add(_sig, 0x20))
            s := mload(add(_sig, 0x40))
            v := byte(0, mload(add(_sig, 0x60)))
        }
        // return (r,s,v);
    }

    /**
     * @dev convert an address to string
     * @param account account to be converted in string
     * @return account account converted in lowercase string
     */
    function address2String(address account) public pure returns(string memory) {
        return Strings.toHexString(account);
    }

    /**
     * @dev convert an uint256 to string
     * @param value value to be converted in string
     * @return value value converted in lowercase string
     */
    function value2String(uint256 value) public pure returns(string memory) {
        return Strings.toString(value);
    }

    /**
     * @dev convert an order structure to string
     * @param _order order struct to be converted in string
     * @return originalMsg order converted in lowercase string
     */
    function restoreMsg(Order calldata _order) public pure returns (string memory) {
        string memory originalMsg = string.concat(value2String(_order.id), address2String(_order.paymentToken), value2String(_order.price), value2String(_order.amount),
                value2String(_order.tokenId), address2String(_order.owner), address2String(_order.collection));
        return originalMsg;
    }
    
    // INTERNAL METHODS
    /**
     * @notice process native token payment
     * @param _price price to be paid
     * @param _seller seller address
     */
    function processNativePayment(uint256 _price, address _seller) internal {
        require (msg.value >= _price, "Not enough funds");

        // Platform Fees
        bool success;
        uint256 platformFee;
        if (mpFeesPercentage > 0) {
            platformFee = _price * mpFeesPercentage / PERCENT_DIVIDER;
            // process platform fee payment
            (success, ) = (mpFeesCollector).call{value: platformFee}("");
            require(success, "Transfer failed to mpFeesCollector.");
            // payable(mpFeesCollector).transfer(platformFee);
        }

        // transfer payment
        uint256 sellerAmount = _price - platformFee;
        (success, ) = (_seller).call{value: sellerAmount}("");
        require(success, "Transfer failed to seller.");
        // payable(_seller).transfer(sellerAmount);

        // Refund excess funds
        uint256 remainingFunds = msg.value - _price;
        if (remainingFunds > 0) {
            (success, ) = (_msgSender()).call{value: remainingFunds}("");
            require(success, "Transfer failed to buyer.");
            // payable(_msgSender()).transfer(remainingFunds);
        }
    }

    /**
     * @notice process other tokens payment
     * @param _token payment token address
     * @param _price price to be paid
     * @param _seller seller address
     */
    function processPayment(address _token, uint256 _price, address _seller) internal {
        IERC20(_token).safeTransferFrom(_msgSender(), address(this), _price);

        // Fees
        uint256 platformFee;
        if (mpFeesPercentage > 0) {
            platformFee = _price * mpFeesPercentage / PERCENT_DIVIDER;
            // process fee payment
            IERC20(_token).safeTransfer(mpFeesCollector, platformFee);
        }

        // transfer payment
        uint256 sellerAmount = _price - platformFee;
        IERC20(_token).safeTransfer(_seller, sellerAmount);
    }
}
