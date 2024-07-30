import React from 'react'
import MintComponent from '@/components/createNFT/mint';
import Navbar from '@/components/navbar/page';
import {MintNFT} from '@/components/createNFT/pr';

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