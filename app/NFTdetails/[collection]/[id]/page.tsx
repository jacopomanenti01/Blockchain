"use client"
import React, {useEffect, useState} from "react";
import { useAccount } from 'wagmi';
import { ethers, providers, Signer } from 'ethers';

//INTERNAL IMPORT
import  { NFTDescription}  from "@/components/NFTcardDetails/NFTDetailsIndex";
import NFTDetailsImg from "@/components/NFTcardDetails/NFTDetailsImg/NFTDetailsImg"
import Style from "@/components/NFTcardDetails/NFTDetailsPage.module.css";
import Navbar from "@/components/navbar/page";
import { useParams, useSearchParams   } from 'next/navigation';
import { abi as NFTAbi } from "@/contracts/out/NFT.sol/NFT.json"
import {abi as IERC20} from '@/contracts/out/IERC1155MetadataURI.sol/IERC1155MetadataURI.json'
import { abi as NFTMarketplace } from "@/contracts/out/Marketplace.sol/Marketplace.json"
import {fetchFromIPFS} from "@/utilis/Fetch"
import { nft } from "@/backend/schema/deploy";


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
  description : string
  };

type Singer = {
  stageName: string
  description: string
  genre: string
  imageUrl: string
  exists: string
  initialFee: number
  };


const Nftpage = () => {
  const {collection, id} = useParams() 
  const searchParams = useSearchParams();
  
  const order = searchParams.get('order');
  const auction = searchParams.get('auction');

  const collectionAddress = Array.isArray(collection) ? collection[0] : collection ;

  const [render, setRender] = useState<string>("")

  const { address, isConnected } = useAccount();
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contractIERC20, setContractIERC20] = useState<ethers.Contract | null>(null);
  const [nftContract, setNftContract] = useState<ethers.Contract | null>(null);
  const [marketplace, setMarketplace] = useState<ethers.Contract | null>(null);
  const [nftUri, setNftUri] = useState<string| null>(null);
  const [nftData, setNftData] = useState<NFTData | null>(null)
  const [name, setName] = useState<Singer | null>(null)
  const [initialFee, setInitialFee] = useState<Singer | null>(null)





   
  useEffect(()=>{
    const init = async () => {
      if (isConnected) {
        try {
          const web3prov = new providers.Web3Provider(window.ethereum);
          const web3signer = web3prov.getSigner();
          const contractIERC20Instance = new ethers.Contract(
            collectionAddress,
            IERC20,
            web3signer
          );
          const contractNftInstance = new ethers.Contract(
            collectionAddress,
            NFTAbi,
            web3signer
          );
          const uri = await contractIERC20Instance.uri(id)

          if(uri){
            const fetchDataFromIPFS = async () => {
              const cid = uri.split("/").pop();
              if (cid) {
                const data = await fetchFromIPFS(cid);  
                setNftData(data)
              }
            }
            fetchDataFromIPFS();
          };
          setProvider(web3prov);
          setSigner(web3signer);
          setContractIERC20(contractIERC20Instance);
          setNftUri(uri);
          setNftContract(contractNftInstance)
          
          if(order != null){
          const marketpalce_contract = new ethers.Contract(process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || "", NFTMarketplace, web3signer);
          setMarketplace(marketpalce_contract);
          setRender("order")
        }else if (auction != null){
          const marketpalce_contract = new ethers.Contract(process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || "", NFTMarketplace, web3signer);
          setMarketplace(marketpalce_contract);
          setRender("auction")

        }else{
          setRender("owned")
        }


        }catch(e){
          console.log(e)
        }
        
        }
    }
    init()
  }, []
)

useEffect(()=>{
  const getSigner = async ()=>{
    let name; 
    let initialFee;
    if(nftContract){
      name = await nftContract.name()
      initialFee = await nftContract.recordCompanyFee()
    }
    setName(name)
    setInitialFee(initialFee)
  }
  getSigner()
  console.log("render", render)
  console.log(nftData)
  console.log("auction", auction)
  
},[nftData])







  return (
    <div>
    <Navbar/>
    <div className={Style.NFTDetailsPage}>
      <div className={Style.NFTDetailsPage_box}>
      
        <NFTDetailsImg descr={nftData?.description} genre ={nftData?.genre} image = {nftData?.url_image} address = {collectionAddress} id = {id} royalties = {initialFee} songs = {nftData?.song}/>
        <NFTDescription title = {nftData?.title} name = {name}  render = {render} marketplace ={marketplace} orderID={order} auctionID = {auction} signer ={signer} user = {address}/>
      </div>
    </div>
  </div>
  );
};

export default Nftpage;
