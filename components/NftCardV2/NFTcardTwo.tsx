import React, { useState, useContext } from "react";
import Image from "next/image";
import { BsImage } from "react-icons/bs";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { GiMicrophone } from "react-icons/gi";
import SellButton from "@/components/NftCardV2/SellButton"
import { useRouter } from 'next/navigation';



//INTERNAL IMPORT
import Style from "./NFTcardTwo.module.css";
import { Button } from "../ui/button";
import {Web3DataContext} from "@/app/author/page"
import {fetchImage} from "@/utilis/Fetch"


interface FormContext {
  tokenID: number
  balance: number

}

const initialFormData: FormContext = {
  tokenID: 0,
  balance: 0,

};

export const TokenContext = React.createContext<FormContext>(initialFormData)

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
  owner: string
  };

interface NFTCardTwoProps {
  NFTData: Array<NFT>; // Use the NFT type here
}



const NFTCardTwo = ({ NFTData }:NFTCardTwoProps) => {
  const router = useRouter();
  const {signer, provider, marketplace,addressRecord, contractRecord, address} = useContext(Web3DataContext)

  
  

  const handleCardClick = (collection:string , id : number) => {
    router.push(`/NFTdetails/${collection}/${id}`);
  };


  return (
    <div className={Style.NFTCardTwo}>
      {NFTData.map((nft, i):any => (
        addressRecord !== null &&
        <div className={Style.NFTCardTwo_box} key={i + 1}
        onClick={() => handleCardClick(addressRecord, nft.tokenID)}
>
          <div className={Style.NFTCardTwo_box_like}>
            <div className={Style.NFTCardTwo_box_like_box}>
              <div className={Style.NFTCardTwo_box_like_box_box}>
                
              </div>
            </div>
          </div>

          <div className={Style.NFTCardTwo_box_img}>
            
            <Image
              src={fetchImage(nft.url_image)}
              alt={nft.title}
              width={500}
              height={500}
              objectFit="cover"
              className={Style.NFTCardTwo_box_img_img}
            />
          </div>

          <div className={Style.NFTCardTwo_box_info}>
            <div className={Style.NFTCardTwo_box_info_left}>
              <p>{nft.title}#{i + 1}</p>
            </div>
            <small>{nft.balance}</small>
          </div>
          
          <div className={Style.NFTCardTwo_box_price}>
            <div className={Style.NFTCardTwo_box_price_box} onClick={(event) => event.stopPropagation()} >
              <small>Click to sell</small>
              <TokenContext.Provider value = {{ tokenID: nft.tokenID, balance: nft.balance, creator: nft.owner}}>

              <SellButton />
              </TokenContext.Provider>
            </div>
            {/** */}
            <p className={Style.NFTCardTwo_box_price_stock}>
              <GiMicrophone /> <span>{nft.stageName} </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NFTCardTwo;