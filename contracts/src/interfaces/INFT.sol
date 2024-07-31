// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface INFT {
    function recordCompanyFee() external returns (uint256);
    function treasury() external returns (address);
}