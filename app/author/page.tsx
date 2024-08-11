"use client"
import React, { useState, useEffect } from 'react'
import AuthorProfileCard from "../../components/author/authorPage"
import AuthorTaps from "../../components/author/authorTabs"
import AuthorNFTCardBox from "../../components/author/authorNFTsBox"
import Banner from "../../components/banner/banner"
import Navbar from '@/components/navbar/page'
import { useAccount } from 'wagmi';
import { ethers, providers, Signer } from 'ethers';
import { abi as NFTFactoryAbi } from "@/contracts/out/NFTFactory.sol/NFTFactory.json"
import { abi as NFTAbi } from "@/contracts/out/NFT.sol/NFT.json"

type NFTData = {
address: string
genre: string
shareCount: number
singerId: number
song: Array<string>
stageName: string
title: string
url_image: string
year: number
};

function Page() {
  const { address, isConnected } = useAccount();
  const [collectiables, setCollectiables] = useState(true);
  const [created, setCreated] = useState(false);
  const [like, setLike] = useState(false);
  const [follower, setFollower] = useState(false);
  const [following, setFollowing] = useState(false);

  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [factory, setFactory] = useState<ethers.Contract | null>(null);
  const [addressRecord, setaddressRecord] = useState<string | null>("");
  const [contractRecord, setcontractRecord] = useState<ethers.Contract | null>(null);
  const [name, setName] = useState<string | null>("");
  const [nftsUri, setNftsUri] = useState<Array<string>>([]);
  const [nftsJSON, setNftsJSON] = useState<Array<NFTData>>([]);


  useEffect(() => {
    const init = async () => {
      if (isConnected) {
        try {
          const web3prov = new providers.Web3Provider(window.ethereum);
          const web3signer = web3prov.getSigner();
          const web3contract = new ethers.Contract(
            "0xF098618BD96db59Ee34A1DE2f12A94B3dF317765",
            NFTFactoryAbi,
            web3signer
          );
          const record_address = await web3contract.associatedNFT(address);
          const record_contract = new ethers.Contract(record_address, NFTAbi, web3signer);

          setProvider(web3prov);
          setSigner(web3signer);
          setFactory(web3contract);
          setcontractRecord(record_contract);
          setaddressRecord(record_address);

          console.log("Contract initialized:", web3contract);

          // Get name 
          const name = await record_contract.name();
          setName(name);

          // Get NFTs
          const end = await web3contract.nextNFTId();
          const end_format = parseInt(end.toString(), 10);
          console.log("Next NFT ID:", end_format);
          const res = await web3contract.batchGetNFTs(address, 0, end_format, 10);
          console.log(res)

          // Spread the elements of res into the nfts state
          setNftsUri((prevNfts) => {
            // Prevent duplicates
            const newNfts = res[3].filter((nft: string) => !prevNfts.includes(nft));
            // push uris
            return [...prevNfts, ...newNfts];
          });

        } catch (e) {
          console.error("Error in contract interaction:", e);
        }
      }
    };

    init();
  }, [isConnected]);

  // useEffect to handle the updated nftsUri state
  useEffect(() => {
    const fetchDataFromIPFS = async () => {
      // get cid for each nft
      for (const nftUri of nftsUri) {
        const cid = nftUri.split("/").pop();
        console.log(cid);
        if (cid) {
          // return json for each nft
          const data = await fetchFromIPFS(cid);
          setNftsJSON((prevdata) =>  {
            return uniqueById([...prevdata, data])})
          
        }
      }
    };

    if (nftsUri.length > 0) {
      fetchDataFromIPFS();
    }
  }, [nftsUri]);


  //test
  useEffect(()=>{
      console.log(nftsJSON[0])
  
  },[nftsJSON])

  // prevent json duplicates 
  function uniqueById(items:any) {
    const set = new Set();
    return items.filter((item:any) => {
      const isDuplicate = set.has(item.title);
      set.add(item.title);
      return !isDuplicate;
    });
  }


  //fetch json file from IPFS
  const fetchFromIPFS = async (cid: string) => {
    try {
      const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      const data = await response.json();
      return data;

    } catch (error) {
      console.error("Error fetching from IPFS:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <Banner bannerImage={"/images/nfts/Babycoverart.jpg"} />
      <AuthorProfileCard
        setAddress={addressRecord}
        name={name}
      />
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
        nftJSON={nftsJSON}
      />
    </div>
  );
}

export default Page;
