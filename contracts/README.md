## High level overview

In EasyMusic, a record company is represented by a NFT, which is implemented using the ERC1155 token standard in order to have multiple copies of the same token. To facilitate the operations in the DApp, the factory pattern has been used. In fact, the DApp interacts mainly with the NFTFactory smart contract, which is in charge of deploying new record companies (NFT smart contract).
Additionally, a dedicated smart contract for the marketplace has been developed. In particular, it contains the logic for the orders and the auctions.

Documentation for each function has been added following the NatSpec format and can be found [here](./docs/src/SUMMARY.md). In addition, UML diagrams for each smart contract can be found in the [uml folder](./uml/).

## Dependencies

These smart contracts use the OpenZeppelin v5 library, especially for access control, reentrancy guards, ERC20 and ERC1155 token standards.

## Local development

In order to develop locally, you can start a local node with anvil by running:
```bash
anvil
```

This will start a node reachable at `http://127.0.0.1:8545`

## Test

Each smart contract has been thoroughly tested by using the fuzzing feature of Foundry.
All tests can be found in the [test folder](./test) and can be executed by running:
```bash
forge test
```

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

Factory: 0x7302D435C60975DDF3F353305AA6b1c02AbB9A79  
Marketplace: 0x7E5CE4Eb1Ef392De687972Ef160A1db7fF43c92B  
