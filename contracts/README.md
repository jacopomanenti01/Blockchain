## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## How to deploy
In order to deploy the whole setup, you have to first create a .env file and fill it.

```bash
cp .env.example .env
```

Then you can start the deployment by running the following command:
```bash
forge script DeployerScript --rpc-url <RPC_URL>  --broadcast --verify --etherscan-api-key <POLYGONSCAN_API_KEY>
```

## Deployments

### Amoy - 80002
NFTFactory: 0x422761B0B1915c04FFC90511a250627bE1Ec2927  
Marketplace: 0x44B044348a491e2BEdD92c29B5EF02388ea078F5  
Marketplace (0.8.20): 0x27319b5114b637d2bC9f0B2b189896562681262c  
Marketplace (OZ v4, 0.8.19): 0x7d4ae2ca4Ab9887f428Ab929a6F16d80C89D7655  
