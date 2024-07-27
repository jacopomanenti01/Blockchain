// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract HelloWorld {
  string private greeting;
  uint public version = 0;
  
  constructor (string memory _greeting) {
    greeting = _greeting;
  }

  function greet() public view returns(string memory, uint ) {
    return (greeting,version);
  }

  function updateGreeting(string memory _greeting) public {
    version += 1;
    greeting = _greeting;
  }
}