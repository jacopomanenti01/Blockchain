import React, { useState, useEffect } from 'react'
import { ethers, providers, Signer } from 'ethers';

type Web3Data = {
    address: string | null | undefined;
    signer: ethers.Signer | null;
    provider: ethers.providers.Web3Provider | null;
    marketplace: ethers.Contract | null;
    addressRecord: string | null;
    contractRecord: ethers.Contract | null;
  };
  
  const initialFormData: Web3Data = {
    address: null,
    signer: null,
    provider: null,
    marketplace: null,
    addressRecord: "",
    contractRecord: null,
  };

export const Web3DataContext = React.createContext<Web3Data>(initialFormData);


