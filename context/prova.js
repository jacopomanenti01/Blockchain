// local import
const { ethers } = require("ethers");
const  NFT  = require("../contracts/out/NFT.sol/NFT.json");
const {NFTAddress} = require("./costants")


//Get provider
const provider = new ethers.providers.Web3Provider(window.ethereum)
// Get signer
const signer = provider.getSigner()

const balance = async(add)=>{
     const bal = await provider.getBalance(add)
     console.log(`\ncazzo ${ethers.utils.formatEther(bal)} ETH`)

}

export default balance;