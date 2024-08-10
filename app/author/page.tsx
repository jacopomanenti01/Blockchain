"use client"
import React, { useState } from 'react'
import AuthorProfileCard from "../../components/author/authorPage"
import AuthorTaps from "../../components/author/authorTabs"
import AuthorNFTCardBox from "../../components/author/authorNFTsBox"
import Banner from "../../components/banner/banner"
import Navbar from '@/components/navbar/page'


function Page() {
    const [collectiables, setCollectiables] = useState(true);
    const [created, setCreated] = useState(false);
    const [like, setLike] = useState(false);
    const [follower, setFollower] = useState(false);
    const [following, setFollowing] = useState(false);

  return (
    

    <div >
        <Navbar />
        <Banner bannerImage={"/images/nfts/Babycoverart.jpg"}/>
        <AuthorProfileCard/>
        <AuthorTaps
        setCollectiables={setCollectiables}
        setCreated={setCreated}
        setLike={setLike}
        setFollower={setFollower}
        setFollowing={setFollowing}
      />
       <AuthorNFTCardBox
        collectiables={collectiables}
        created={created}
        like={like}
      />
    </div>
  )
}

export default Page