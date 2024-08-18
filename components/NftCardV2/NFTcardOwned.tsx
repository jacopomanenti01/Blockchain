import React, { useState, useContext } from "react";
import Image from "next/image";
import { BsImage } from "react-icons/bs";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { GiMicrophone } from "react-icons/gi";
import RemoveButton from "@/components/NftCardV2/RemoveButton"
import { useRouter } from 'next/navigation';
import { ethers} from 'ethers';




//INTERNAL IMPORT
import Style from "./NFTcardTwo.module.css";
import { Button } from "../ui/button";
import {Web3DataContext} from "@/app/author/page"


/** 
interface FormContext {
  tokenID: number
  balance: number
  ids: number

}


const initialFormData: FormContext = {
  tokenID: 0,
  balance: 0,
  ids: 0

};

export const OrderContext = React.createContext<FormContext>(initialFormData)
*/

interface NFT {
  address: string
  genre: string
  shareCount: number
  singerId: number
  song: Array<string>
  stageName: string
  title: string
  url_image: string
  year: number
  tokenID: number
  balance:number
  id : number
  price: number
  collection: string
  };

interface NFTCardTwoProps {
  NFTData: Array<NFT>; // Use the NFT type here
}



const NFTCardOwned = ({ NFTData }:NFTCardTwoProps) => {

  const [loading, setLoading] = useState(false)
  const {signer, provider, marketplace,addressRecord, contractRecord, address} = useContext(Web3DataContext)
  const router = useRouter();


  
  //fetch image 
  const fetchImage = (nft: any): string => {
    const url_image = nft.url_image;
    if (url_image) {
      const cid = url_image.split("/").pop();
      const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
      return url;
    }
    return     "/images/nfts/Babycoverart.jpg"    ; // Fallback image
  };

  // remove nft from marketplace by id
  const onClick = async (id : any)=>{

    setLoading(true)
    console.log(id)
    if(contractRecord && address && marketplace){
      try{
        const tx = await marketplace.cancel(id)
        await tx.wait()
        console.log(tx.hash)
        location.reload();

      }catch(e){
        console.log(e)
      }
    }else{
      alert("please log to metamask")
    }
  }

  const handleCardClick = (collection:string , id : number, order: number) => {
    router.push(`/NFTdetails/${collection}/${id}?order=${order}`);
  };


  return (
    <div className={Style.NFTCardTwo}>
      
      {NFTData.map((nft, i):any => (
        nft.balance !== undefined && nft.balance !== 0 &&(
          <div
          className={Style.NFTCardTwo_box}
          key={i + 1}
          onClick={() => handleCardClick(nft.collection, nft.tokenID, nft.id)}
        >
          <div className={Style.NFTCardTwo_box_like}>
            <div className={Style.NFTCardTwo_box_like_box}>
              <div className={Style.NFTCardTwo_box_like_box_box}>
                
              </div>
            </div>
          </div>

          <div className={Style.NFTCardTwo_box_img}>
            
            <Image
              src={fetchImage(nft)}
              alt={nft.title}
              width={500}
              height={500}
              objectFit="cover"
              className={Style.NFTCardTwo_box_img_img}
            />
          </div>

          <div className={Style.NFTCardTwo_box_info}>
            <div className={Style.NFTCardTwo_box_info_left}>
              <p>{nft.title}</p>
              <small>Order number #{nft.id}</small>
              
              <small>Order price: {ethers.utils.formatUnits(nft.price.toString(),18)+ ' ETH'}</small>
            </div>
            <small>{nft.balance}</small>
          </div>
          
          <div className={Style.NFTCardTwo_box_price}>
            <div className={Style.NFTCardTwo_box_price_box} onClick={(event) => event.stopPropagation()}>
              <small>click to </small>
              <Button onClick={() => onClick(nft.id)}  type="button" className="w-full">
                   Remove
              </Button>
      
            </div>
            {/** */}
            <p className={Style.NFTCardTwo_box_price_stock}>
              <GiMicrophone /> <span>{nft.stageName} </span>
            </p>
          </div>
        </div>
      )))}
    </div>
  );
};

export default NFTCardOwned;