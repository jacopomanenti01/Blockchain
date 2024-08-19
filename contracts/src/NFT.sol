// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin-contracts/contracts/access/AccessControl.sol";
import "openzeppelin-contracts/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

import "./interfaces/INFT.sol";
import "./interfaces/INFTFactory.sol";

contract NFT is ERC1155Supply, AccessControl, INFT {

    uint public constant PERCENT_DIVIDER = 1000000;  // percentage divider, 6 decimals

    struct Singer {
        string stageName;
        string description;
        string genre;
        string imageUrl;
        bool exists;
    }

    struct Album {
        uint256 shareCount;
        uint256 singerId;
        string metadataUrl;
    }

    bytes32 public constant RECORD_COMPANY_ROLE = keccak256("RECORD_COMPANY_ROLE");

    mapping(uint256 => Singer) public singers;
    mapping(uint256 => Album) public albums;
    mapping(string => bool) private singerExists;

    uint256 public singerIdCounter;
    uint256 public albumIdCounter;
    uint256 public recordCompanyFee;

    string public name;

    address public treasury;

    INFTFactory public factory;

    constructor(string memory _name, address _recordCompanyAdmin, address _treasury, uint _initialFee) ERC1155("") ERC1155Supply() { 
        _grantRole(DEFAULT_ADMIN_ROLE, tx.origin); // tx.origin since facotry is deploying this
        _grantRole(RECORD_COMPANY_ROLE, _recordCompanyAdmin);
        _setRoleAdmin(RECORD_COMPANY_ROLE, RECORD_COMPANY_ROLE); // Only record company can manage its accounts

        treasury = _treasury;
        name = _name;
        recordCompanyFee = _initialFee;

        factory = INFTFactory(msg.sender);
    }

    /**
     * @notice create a new singer
     * @param _stageName stage name of the singer
     * @param _description description of the singer
     * @param _genre main genre of the singer
     * @param _imageUrl url of the cover image of the singer
     */
    function createSinger(
        string memory _stageName,
        string memory _description,
        string memory _genre,
        string memory _imageUrl
    ) external onlyRole(RECORD_COMPANY_ROLE) {
        require(! singerExists[_stageName] , "Singer already exists");

        Singer storage singer = singers[singerIdCounter];
        singer.stageName = _stageName;
        singer.description = _description;
        singer.genre = _genre;
        singer.imageUrl = _imageUrl;
        singer.exists = true;

        singerExists[_stageName] = true;

        singerIdCounter++;
    }

    /**
     * @notice create a new album (represented by a NFT)
     * @param _shareCount number of shares
     * @param _singerId id of the singer
     * @param _metadataUrl url of the metadata of the NFT
     */
    function createAlbum(
        uint256 _shareCount,
        uint256 _singerId,
        string memory _metadataUrl
    ) external onlyRole(RECORD_COMPANY_ROLE) {
        require(singers[_singerId].exists, "Singer does not exist");

        Album storage album = albums[albumIdCounter];
        album.metadataUrl = _metadataUrl;
        album.singerId = _singerId;
        album.shareCount = _shareCount;

        _mint(msg.sender, albumIdCounter, _shareCount, "");

        albumIdCounter++;
    }

    /**
     * @notice return an array with the singers in the specified range
     * @param _start starting index (inclusive)
     * @param _end ending index (exclusive)
     */
    function getSingers(uint _start, uint _end) public view returns (Singer[] memory) {
        require(_end <= singerIdCounter, "Invalid end");
        require(_end >= _start, "Invalid parameters");

        Singer[] memory array = new Singer[](_end - _start);
        for (uint i = _start; i < _end; i++) {
            array[i - _start] = singers[i];
        }
        return array;
    }

    /**
     * @notice update the record company fee
     * @param _newFee new fee
     */
    function updateRecordCompanyFee(uint256 _newFee) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_newFee <= PERCENT_DIVIDER, "Fee over 100%");

        recordCompanyFee = _newFee;
    }

    /**
     * @notice update the record company treasury address
     * @param _treasury new treasury address
     */
    function updateRecordTreasury(address _treasury) external onlyRole(RECORD_COMPANY_ROLE) {
        treasury = _treasury;
    }

    /**
     * @notice return the uri of the specified token
     * @param _id id of the token
     */
    function uri(uint256 _id) public view override returns (string memory) {
        require(exists(_id), "Nonexistent token");
        return albums[_id].metadataUrl;
    }

    /**
     * @notice assign role _role to _account. If _role is the record company role, than it also associates _account to this NFT
     * @param _role role to add
     * @param _account account that receives the role
     */
    function grantRole(bytes32 _role, address _account) public override onlyRole(getRoleAdmin(_role)) {
        _grantRole(_role, _account);

        if (_role == RECORD_COMPANY_ROLE) {
            factory.setAssociatedNFT(_account, address(this));
        }
    }

    /**
     * @notice revoke role _role from _account. If _role is the record company role, than it also 
                removes the association of _account from this NFT
     * @param _role role to remove
     * @param _account account that looses the role
     */
    function revokeRole(bytes32 _role, address _account) public override onlyRole(getRoleAdmin(_role)) {
        _revokeRole(_role, _account);

        if (_role == RECORD_COMPANY_ROLE) {
            factory.setAssociatedNFT(_account, address(0));
        }
    }

    // Needed to combine the interfaces for AccessControl and ERC1155
    function supportsInterface(bytes4 _interfaceId) public view virtual override(AccessControl, ERC1155) returns (bool) {
        return super.supportsInterface(_interfaceId);
    }

}
