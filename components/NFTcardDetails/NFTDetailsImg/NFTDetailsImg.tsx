import React, { useState, useEffect } from "react";
import Image from "next/image";
import { BsImages } from "react-icons/bs";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import {fetchImage} from "@/utilis/Fetch"


//INTERNAL IMPORT
import Style from "./NFTDetailsImg.module.css";
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/NFTcardDetails/datatable"
  



type pr = {
  title : string
}

const columns: ColumnDef<pr>[] = [
  {
    accessorKey: "title",
    header: "Title",
  }
]


const NFTDetailsImg = ( {descr, image, address,id, royalties, songs}: any) => {
  const [description, setDescription] = useState(true);
  const [details, setDetails] = useState(true);
  const [tracks, setTracks] = useState(true);
  const [like, setLike] = useState(false);

  const openDescription = () => {
    if (!description) {
      setDescription(true);
    } else {
      setDescription(false);
    }
  };

  const openDetails = () => {
    if (!details) {
      setDetails(true);
    } else {
      setDetails(false);
    }
  };

  const openTracks = () => {
    if (!tracks) {
      setTracks(true);
    } else {
      setTracks(false);
    }
  };

  const getData = () => {
    let data : any[] = []; 
    if(songs){
      data = songs.map((song : string) => {
        return { title: song }; 
      });
    }
    return data; 
  };

  useEffect(
    ()=>{
      console.log(songs)
    }
  )
  
  return (
    <div className={Style.NFTDetailsImg}>
      <div className={Style.NFTDetailsImg_box}>
        <div className={Style.NFTDetailsImg_box_NFT}>
          <div className={Style.NFTDetailsImg_box_NFT_like}>
            <BsImages className={Style.NFTDetailsImg_box_NFT_like_icon} />
            
          </div>

          <div className={Style.NFTDetailsImg_box_NFT_img}>
            <Image
              src={fetchImage(image)}
              className={Style.NFTDetailsImg_box_NFT_img_img}
              alt="NFT image"
              width={700}
              height={800}
              objectFit="cover"
            />
          </div>
        </div>

        <div
          className={Style.NFTDetailsImg_box_description}
          onClick={() => openDescription()}
        >
          <p>Description</p>
          {description ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
        </div>

        {description && (
          <div className={Style.NFTDetailsImg_box_description_box}>
            <p>
              {descr}
            </p>
          </div>
        )}

        <div
          className={Style.NFTDetailsImg_box_details}
          onClick={() => openDetails()}
        >
          <p>Details</p>
          {details ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
        </div>

        {details && (
          <div className={Style.NFTDetailsImg_box_details_box}>
            <small>2000 x 2000 px.IMAGE(685KB)</small>
            <p>
              <small>Contract Address: {address} </small>               
              <br></br>
            </p>
            <p>
              <small>Token ID: {id}</small>
            </p>
            <p>
              <small>Chain: Polygon</small>
            </p>
            <p>
              <small>Royalties : {royalties}</small>
            </p>
          </div>
        )}

        <div
          className={Style.NFTDetailsImg_box_details}
          onClick={() => openTracks()}
        >
          <p>Included Tracks</p>
          {tracks ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
        </div>

        {tracks && (
          <div className={Style.NFTDetailsImg_box_details_box}>
            <p>
            <DataTable columns={columns} data={getData()} />
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTDetailsImg;
