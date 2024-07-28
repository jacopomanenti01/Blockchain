const Web3 = require('web3');

// Initialize web3 instance
const web3 = new Web3();

// Your address here
const address = '0x5fbdb2315678afecb367f032d93f642f64180aa3';
console.log("Checksummed Address:", web3.utils.toChecksumAddress(address));
