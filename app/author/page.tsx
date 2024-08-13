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
import { abi as NFTMarketplace } from "@/contracts/out/Marketplace.sol/Marketplace.json"


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

type Web3Data = {
  address: string |null |undefined,
  signer : ethers.Signer | null,
  provider: ethers.providers.Web3Provider | null,
  marketplace: ethers.Contract | null,
  addressRecord: string | null,
  contractRecord: ethers.Contract | null,
  handleTransactionSuccess: (success: boolean) => void
}

const initialFormData: Web3Data = {
  address: null,
  signer : null,
  provider: null,
  marketplace: null,
  addressRecord: "",
  contractRecord: null,
  handleTransactionSuccess: () => {}
};

export const Web3DataContext = React.createContext<Web3Data>(initialFormData)

function Page() {
  const { address, isConnected } = useAccount();
  const [collectiables, setCollectiables] = useState(true);
  const [created, setCreated] = useState(false);
  const [like, setLike] = useState(false);
  const [follower, setFollower] = useState(false);
  const [following, setFollowing] = useState(false);
  const [marketplace, setMarketplace] = useState<ethers.Contract | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [factory, setFactory] = useState<ethers.Contract | null>(null);
  const [addressRecord, setaddressRecord] = useState<string | null>("");
  const [contractRecord, setcontractRecord] = useState<ethers.Contract | null>(null);
  const [name, setName] = useState<string | null>("");
  const [nftsUri, setNftsUri] = useState<Array<string>>([]);
  const [nftsJSON, setNftsJSON] = useState<Array<NFTData>>([]);
  const [tokenID, setTokenID] = useState<Array<number>>([]);
  const [balance, setBalance] = useState<Array<number>>([]);
  const [transactionSuccess, setTransactionSuccess] = useState(false)


  const handleTransactionSuccess = (res:boolean) => {
    setTransactionSuccess(res)
  };


  useEffect(() => {
    const init = async () => {
      if (isConnected) {
        try {
          const web3prov = new providers.Web3Provider(window.ethereum);
          const web3signer = web3prov.getSigner();
          const web3contract = new ethers.Contract(
            process.env.NEXT_PUBLIC_NFT_FACTORY_ADDRESS || "",
            NFTFactoryAbi,
            web3signer
          );
          const marketpalce_contract = new ethers.Contract(process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || "", NFTMarketplace, web3signer);
          const record_address = await web3contract.associatedNFT(address);
          const record_contract = new ethers.Contract(record_address, NFTAbi, web3signer);

          setProvider(web3prov);
          setSigner(web3signer);
          setFactory(web3contract);
          setcontractRecord(record_contract);
          setaddressRecord(record_address);
          setMarketplace(marketpalce_contract);

          // Get name 
          const name = await record_contract.name();
          setName(name);

          // Get owned NFTs
          const end = await web3contract.nextNFTId();
          const end_format = parseInt(end.toString(), 10);
          const res = await web3contract.batchGetNFTs(address, 0, end_format, 10);
          console.log("this is the res", res)
          console.log("this is record address", record_address)

          // Get sold NFTs
          const numberOrders = await marketpalce_contract.orderCounter()
          const numberOrders_format = parseInt(numberOrders.toString(), 10);
          console.log("Number of orders:", numberOrders_format);
          const orders = await marketpalce_contract.getOrders(0, numberOrders_format, address);
          console.log(orders)






          // Get Balance
          setBalance((prevTokenID) => {
            const newTokenID = res[2]
              .map((bn: any) => parseInt(bn.toString(), 10)) // Convert BigNumbers to integers
          
            // Combine and ensure uniqueness using a Set
            return [...prevTokenID, ...newTokenID];
          });


          // Get orders




            
          // Spread tokens' id
          setTokenID((prevTokenID) => {
            const newTokenID = res[1]
              .map((bn: any) => parseInt(bn.toString(), 10)) // Convert BigNumbers to integers
              .filter((token: number) => !prevTokenID.includes(token)); // Filter out existing tokens
          
            // Combine and ensure uniqueness using a Set
            return Array.from(new Set([...prevTokenID, ...newTokenID]));
          });



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
      for (let i = 0; i < nftsUri.length; i++) {
        const nftUri = nftsUri[i];
        const cid = nftUri.split("/").pop();

        if (cid) {
          const data = await fetchFromIPFS(cid);
          
          // Add tokenID to the data object
          data.tokenID = tokenID[i];
          data.balance= balance[i]

          setNftsJSON((prevdata) => {
            return uniqueById([...prevdata, data]);
          });
        }
      }
    };

    if (nftsUri.length > 0 && tokenID.length >0) {
      fetchDataFromIPFS();
      
    }
  }, [nftsUri, tokenID]);

  useEffect(()=>{console.log(nftsJSON)},[nftsJSON])



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
      <Web3DataContext.Provider value = {{signer, provider, marketplace, addressRecord, contractRecord, address, handleTransactionSuccess}}>
      <AuthorNFTCardBox
        collectiables={collectiables}
        created={created}
        like={like}
        nftJSON={nftsJSON}
      />
      </Web3DataContext.Provider>
    </div>
  );
}

export default Page;
