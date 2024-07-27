// call ether in a js file
const { ethers } = require("ethers");
const  NFTmarketplace  = require("../foundry/out/HelloWorld.sol/HelloWorld.json");


//---- connect to the blockchain

// get an etherum node with anvil
/// the client must talk with the node
/// we need the protocol: JSON RPC
/// we need an API/get a local network

const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545")


//---- interact with accounts
//test if this works
/// getBalance
// make the call async
// since it retunrs a big number, we have to format it by using ether.utils.firnatEther

const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"


const balance = async(add)=>{
     const bal = await provider.getBalance(add)
     console.log(`\ncazzo ${ethers.utils.formatEther(bal)} ETH`)

}




//---- Interact with the smart contract

// create an istance of the contract

const NFTmarketplaceAddress = "0x700b6A60ce7EaaEA56F065753d8dcB9653dbAD35";

const NFTmarketplaceABI = NFTmarketplace.abi

const contract = new ethers.Contract(NFTmarketplaceAddress, NFTmarketplaceABI, provider)


const withParameters = async() =>{
    const name = await contract.updateGreeting("ciao")
    console.log(name)

}


//--- transaction

const account1 = "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f"
const account2 = "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"

// take the private key and put in the project

const prk = "0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97" // sender privare key
const wallet = new ethers.Wallet(prk, provider) // now we can sign 

const sendTrnasction = async() =>{

    balance(account1)
    balance(account2)
    // send ether
    const tx = await wallet.sendTransaction({
        to:account2,
        value:  ethers.utils.parseEther("0.025") //send 0.025 eth
    })

    // Fetch transaction
    //we have to await the transaction to be mined
    await tx.wait()
    //console log details
    console.log(tx)

}


const contractSigner = contract.connect(wallet)

const modify = async()=>{
    const tx = await contractSigner.updateGreeting("ciao")
    await tx.wait()
    console.log(tx)
}

const read = async()=>{
    const result = await contract.greet()
    console.log(result)
}

read()

const events = async() =>{
     const event1 = await contract.queryFilter('name_of_the_event')
     console.log(event1)
     // every single events that happens

     
}
