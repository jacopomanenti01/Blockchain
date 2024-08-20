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
