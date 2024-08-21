# Easy Music - Democratizing singers music rights via NFT

Blockchain project of Jacopo Manenti, Federico Nardelli and Emanuele Civini.

The goal of Easy Music is to empower small record companies by providing a decentralized platform that enables them to quickly monetize their emerging artists’ music rights by selling them to fans and investors. We aim to create a fair and transparent marketplace leveraging blockchain technology to ensure record companies gain liquidity while offering fans and investors unique and valuable NFTs (album rights) linked to their favorite artist.

## Getting Started

First, clone this repository. Then, install the dependencies:

```bash
npm install
```

Lastly, start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Becoming a record company

Record company can join only via invitation, and the only requirements are:

- the address of the first admin
- the address of the treasury (the address that will receive the royalties generated in the marketplace)
- name of the record company
- royalty fee  

Once these are established, an admin can deploy the smart contract of the record company and thus, from that moment on, they are able to create signers and albums.

## Creating a singer

Any album must have a singer associated, thus creating one is usually the first step.
A record company can create a singer by specifying a few key parameters such as the stage name and genre. The creation of a singer involves a transaction that can only be done by the admins of the record company.

## Creating an album

An album is a collection of songs and is represented by a NFT using the ERC1155 standard. 
A record company can create a new album associated to a singer and a group of songs by sending a transaction to the record company smart contract, which in the end mints the share of the album to the caller (which is an admin).

## Selling the music rights

Once a record company has obtained the music rights, it can sell them by either:

- creating a sell order, in which the first buyer that is willing to pay the specified price will obtain the shares in exchange of MATIC or other payment tokens
- creating an auction, in which the bidder that bids the most within the specified deadline will obtain the shares

## Deployment on Vercel

This project has been deployed on Vercel and can be tested [here](https://blockchain-one-bice.vercel.app/).
It is linked to the smart contracts deployed on Amoy, Polygon's official testnet. The addresses can be found [here](./contracts) in the deployments section.

## Smart contracts

The smart contracts can be found in the [contracts folder](./contracts), alongside a dedicated README.

## Report - Presentation

The report can be found at [https://www.overleaf.com/read/zfqrtfgcpvtg#4bb9ce](https://www.overleaf.com/read/zfqrtfgcpvtg#4bb9ce).  
