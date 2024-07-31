import React from 'react'
import MintComponent from '@/components/createNFT/mint';
import Navbar from '@/components/navbar/page';
import {MintNFT} from "../config"

function page() {
  return (
    <div>
        <Navbar/>
        <MintNFT/>
        <MintComponent />
    </div>
  )
}

export default page