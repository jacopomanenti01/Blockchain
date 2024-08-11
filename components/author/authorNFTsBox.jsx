"use client"
import React, { useState } from "react";

//INTERNAL IMPORT
import Style from "./authorNFTsBox.module.css";
;
import  NFTCardTwo  from "../NftCardV2/NFTcardTwo";

const AuthorNFTCardBox = ({
  collectiables,
  created,
  like,
  nftJSON
}) => {

  //
  const collectiablesArray = [
    "/images/nfts/Babycoverart.jpg",
    "/images/nfts/Babycoverart.jpg",
    "/images/nfts/Babycoverart.jpg",
    "/images/nfts/Babycoverart.jpg",
    "/images/nfts/Babycoverart.jpg"
  ];

  const createdArray = [
    "/images/nfts/Babycoverart.jpg",
    "/images/nfts/Babycoverart.jpg",
    "/images/nfts/Babycoverart.jpg",
    "/images/nfts/Babycoverart.jpg"
  ];

  const likeArray = [
    "/images/nfts/Babycoverart.jpg",
    "/images/nfts/Babycoverart.jpg",
    "/images/nfts/Babycoverart.jpg",
    "/images/nfts/Babycoverart.jpg"
  ];


  return (
    <div className={Style.AuthorNFTCardBox}>
      {collectiables && <NFTCardTwo NFTData={collectiablesArray} />}
      {created && <NFTCardTwo NFTData={nftJSON} />}

      {/**modify */}
      {like && <NFTCardTwo NFTData={likeArray} />}
    </div>
  );
};

export default AuthorNFTCardBox;