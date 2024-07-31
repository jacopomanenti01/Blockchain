'use client';

import * as React from 'react';
import { ethers } from "ethers";
import {abi} from "../../contracts/out/NFTFactory.sol/NFTFactory.json"

export function login(){
    let address;
    let signer
    let provider;
    if (window.ethereum == null) {
        console.log("MetaMask not installed; using read-only defaults")
        provider = ethers.getDefaultProvider()
    
    } 
      else {
        provider = new  ethers.providers.Web3Provider(window.ethereum)
        signer = provider.getSigner()
        address = signer.getAddress()
        console.log(address)
    }
}