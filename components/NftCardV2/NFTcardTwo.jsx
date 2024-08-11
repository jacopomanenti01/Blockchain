import React, { useState } from "react";
import Image from "next/image";
import { BsImage } from "react-icons/bs";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { GiMicrophone } from "react-icons/gi";
import SellButton from "@/components/NftCardV2/SellButton"


//INTERNAL IMPORT
import Style from "./NFTcardTwo.module.css";
import { Button } from "../ui/button";

const NFTCardTwo = ({ NFTData }) => {

  //delate
  const [like, setLike] = useState(false);
  const [likeInc, setLikeInc] = useState(21);

  const likeNFT = () => {
    if (!like) {
      setLike(true);
      setLikeInc(23);
    } else {
      setLike(false);
      setLikeInc(23 + 1);
    }
  };

  //fetch image 
  const fetchImage =  (nft) => {
    const url_image = nft.url_image
    if (url_image){
      const cid = url_image.split("/").pop();
      const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
      return url
    }
  };

  return (
    <div className={Style.NFTCardTwo}>
      {NFTData.map((nft, i) => (
        <div className={Style.NFTCardTwo_box} key={i + 1}>
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
              <p>{nft.title}#{i + 1}</p>
            </div>
            <small>{nft.shareCount}</small>
          </div>
          
          <div className={Style.NFTCardTwo_box_price}>
            <div className={Style.NFTCardTwo_box_price_box}>
              <small>Click to sell</small>
              <SellButton/>
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