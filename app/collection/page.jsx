"use client"
import React from "react";

//INTERNAL IMPORT
import  { NFTDescription, NFTDetailsImg, NFTTabs }  from "@/components/NFTcardDetails/NFTDetailsIndex";
import Style from "@/components/NFTcardDetails/NFTDetailsPage.module.css";
import Navbar from "@/components/navbar/page";

const Nftpage = () => {
  return (
    <div>
    <Navbar/>
    <div className={Style.NFTDetailsPage}>
      <div className={Style.NFTDetailsPage_box}>
      
      <NFTDetailsImg />
        <NFTDescription />
      </div>
    </div>
  </div>
  );
};

export default Nftpage;
