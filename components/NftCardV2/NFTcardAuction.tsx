import React, { useState, useContext } from "react";
import Image from "next/image";
import { BsImage } from "react-icons/bs";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { GiMicrophone } from "react-icons/gi";
import RemoveButton from "@/components/NftCardV2/RemoveButton"
import { useRouter } from 'next/navigation';
import {Web3DataContext} from "@/app/author/page"


//INTERNAL IMPORT
import Style from "./NFTcardTwo.module.css";
import { Button } from "../ui/button";
import {fetchImage} from "@/utilis/Fetch"



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
  basePrice: number
  deadline: Date
  collection: string
  };

interface NFTCardTwoProps {
  NFTData: Array<NFT>; // Use the NFT type here
}



const NFTCardAuction = ({ NFTData }:NFTCardTwoProps) => {

  const [loading, setLoading] = useState(false)
  const {signer, provider, marketplace,addressRecord, contractRecord, address} = useContext(Web3DataContext)
  const router = useRouter();

  
  

  const handleCardClick = (collection:string , id : number, auction: number) => {
    router.push(`/NFTdetails/${collection}/${id}?auction=${auction}`);
  };

  const onClick = async (id : any)=>{

    setLoading(true)
    console.log(id)
    if(contractRecord && address && marketplace){
      try{
        const tx = await marketplace.endAuction(id)
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


  return (
    <div className={Style.NFTCardTwo}>
      {NFTData.map(
        (nft:any, i:any) =>
          nft.balance !== undefined &&
          nft.balance !== 0 && (
            <div className={Style.NFTCardTwo_box} key={i + 1}
            onClick={() => handleCardClick(nft.collection, nft.tokenID, nft.id)}>
              <div className={Style.NFTCardTwo_box_like}>
                <div className={Style.NFTCardTwo_box_like_box}>
                  <div className={Style.NFTCardTwo_box_like_box_box}>
                    {/* Other elements */}
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
                  <p>{nft.title}</p>
                  <small>Auction number #{nft.id}</small>
              
                  <small>Auction baseprice: {nft.basePrice}</small>
                </div>
                <small>{nft.balance}</small>
              </div>

              <div className={Style.NFTCardTwo_box_price}>
                <div className={Style.NFTCardTwo_box_price_box}>
                  <small>Deadline </small>
                  <p>
                    {nft.deadline.toLocaleString()}
                  </p>
                </div>
                <p className={Style.NFTCardTwo_box_price_stock}>
                  <GiMicrophone /> <span>{nft.stageName}</span>
                </p>
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default NFTCardAuction;