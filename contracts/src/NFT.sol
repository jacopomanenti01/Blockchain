/*TODO:

Props del NFT
Standard? ERC1155 
Cosa rappresenta? Rappresenta tutti gli album gestiti da una casa discografica (ogni casa ha la sua copia di questo contratto). 
                     Aggiungere AccessControl in modo che la casa discografica possa operarci sopra. Due ruoli: "casa discografica" e "Noi"
Quando la casa discografica vuole aggiungere canzoni per un cantante, la prima volta fa il deploy di questo contratto e poi può aggiungere canzoni a piacimento.  
Ci sono delle royalties? si, solo per la casa discografica 
     Se si, le gestiamo qui o nel marketplace? le impostiamo qui, e vengono riprese nel marketplace, che farà anche lo split automaticamente.
     Le fee vanno prese (anche dal marketplace) ad ogni scambio e sono cumulative (royalty casa discografica + fee nostra)
Che operazioni si devono fare? 
     - creazione di un cantante (nome d'arte, descrizione, genere, url immagine) -> ID (controlla duplicati in base al nome d'arte)
     - creazione di un album (# di share, ID cantante, url metadati) 
             -> mint (inoltre whitelista il marketplace ad operare su questa collezione)
             -> crea associazione tra cantante e token id (album) 
     - aggiornamento della fee della casa discografica (questo dobbiamo gestirlo noi come "startup")
Metadati devono contenere:
     - nome dell'album
     - nome del cantante
     - lista delle canzoni
     - nome della casa discografica
     - url dell'immagine dell'album*/


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "openzeppelin-contracts/contracts/access/AccessControl.sol";
import "openzeppelin-contracts/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract NFT is ERC1155Supply, AccessControl {
    struct Singer {
        string stageName;
        string description;
        string genre;
        string imageUrl;
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

    uint256 private singerIdCounter;
    uint256 private albumIdCounter;
    uint256 private recordCompanyFee;

    constructor(string memory _name) ERC1155(_name) ERC1155Supply() { 
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(RECORD_COMPANY_ROLE, msg.sender);
    }

    function createSinger(
        string memory _stageName,
        string memory _description,
        string memory _genre,
        string memory _imageUrl
    ) external onlyRole(RECORD_COMPANY_ROLE) {
        require(!singerExists[_stageName], "Singer already exists");
        singerIdCounter++;
        singers[singerIdCounter] = Singer(_stageName, _description, _genre, _imageUrl);
        singerExists[_stageName] = true;
    }

    function createAlbum(
        uint256 _shareCount,
        uint256 _singerId,
        string memory _metadataUrl
    ) external onlyRole(RECORD_COMPANY_ROLE) {
        require(bytes(singers[_singerId].stageName).length > 0, "Singer does not exist");
        albumIdCounter++;
        albums[albumIdCounter] = Album(_shareCount, _singerId, _metadataUrl);
        _mint(msg.sender, albumIdCounter, _shareCount, "");
        // Add the marketplace address to the whitelist
        // Marketplace contract address should be passed and managed appropriately
    }

    function updateRecordCompanyFee(uint256 _newFee) external onlyRole(DEFAULT_ADMIN_ROLE) {
        recordCompanyFee = _newFee;
    }

    function uri(uint256 _id) public view override returns (string memory) {
        require(exists(_id), "Nonexistent token");
        return albums[_id].metadataUrl;
    }

    function supportsInterface(bytes4 _interfaceId) public view virtual override(AccessControl, ERC1155) returns (bool) {
       return super.supportsInterface(_interfaceId);
    }

}
