import React from 'react'
import MintComponent from '@/components/createNFT/mint';
import Navbar from '@/components/navbar/page';

function page() {
  return (
    <div>
        <Navbar/>
        <MintComponent />
    </div>
  )
}

export default page