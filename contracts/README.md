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
Factory: 0x5eCBe814CcdE0164472075CE5eDF919eD57D20fc  
Marketplace: 0x1118bcd185fDfe622b32829b5B193EcDCBDf5A8E  


Factory: 0xBcf86D9859291f3A493c36d742428E8097Cc0d1A.
Marketplace: 0x69f2b0aaEd1adF60D6f3c69FF3C35D5564754b61.