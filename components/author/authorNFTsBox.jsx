"use client"
import React, { useState } from "react";

//INTERNAL IMPORT
import Style from "./authorNFTsBox.module.css";
;
import  NFTCardOwned  from "@/components/NftCardV2/NFTcardOwned";
import  NFTCardAuction  from "@/components/NftCardV2/NFTcardAuction";


import  NFTCardTwo  from "../NftCardV2/NFTcardTwo";

const AuthorNFTCardBox = ({
  collectiables,
  created,
  auction, 
  nftJSON,
  nftJsonOrder,
  nftJsonAuction
}) => {


  return (
    <div className={Style.AuthorNFTCardBox}>
      {collectiables && <NFTCardOwned NFTData={nftJsonOrder} />}
      {created && <NFTCardTwo NFTData={nftJSON} />}
      {auction && <NFTCardAuction NFTData={nftJsonAuction} />}
    </div>
  );
};

export default AuthorNFTCardBox;