"use client"
import React, { useState } from 'react'
import {AiFillHeart, AiOutlineHeart} from "react-icons/ai"
import {BsImages} from "react-icons/bs"
import Image from "next/image"
import style from "./nft.module.css"





function Nftcards() {
    const featureArray = [1,2,3,4,5,6,7,8,9];
    const[like, setLike] = useState(true)


    const likeNFT = () =>{
        if (!like) {
            setLike(true);
        }else{
            setLike(false);
        }
    }

  return (
    <div className={style.NFTcard}>
        {
            featureArray.map((el,i) =>(
                <div className={style.NFTcard_box} key ={i+1} >
                    <div className={style.NFTcard_box_img}> 
                        <Image src = "/images/nfts/Babycoverart.jpg" alt = "Image" 
                        width={600} 
                        height={600} 
                        className={style.NFTcard_box_img_img}
                        />
                    </div>

                <div className={style.NFTcard_box_update}>
                    <div className={style.NFTcard_box_update_left}>
                        <div className={style.NFTcard_box_update_left_like}
                         onClick={() => likeNFT()}>
                            {
                                like ? (
                                    <AiOutlineHeart/>
                                ):(
                                    <AiFillHeart className={style.NFTcard_box_update_left_like_icon}/>
                                )
                            } 
                            {""} 22
                        </div>

                    </div>
                    
                    <div className={style.NFTcard_box_update_right}>
                        <div className={style.NFTcard_box_update_right_info}>
                            <small>Remaining time </small>
                            <p>3h</p>
                        </div>

                    </div>

                </div>
                <div className={style.NFTcard_box_update_details}>
                    <div className={style.NFTcard_box_update_details_price}>
                        <div className={style.NFTcard_box_update_details_price_box}>
                            <h4>babyeee #1771</h4>
                            <div className={style.NFTcard_box_update_details_price_box_box}>
                            
                                <div className={style.NFTcard_box_update_details_price_box_bid}>
                                    <small>current bid

                                    </small>
                                    <p>tot ether</p>
                                
                                </div>
                                <div className={style.NFTcard_box_update_details_price_box_stock}>
                                    <small>x in stock</small>

                                </div>

                            </div>


                        </div>

                    </div>
                    
                    <div className={style.NFTcard_box_update_details_category}>
                        <BsImages />
                    </div>



                </div>

                </div>

            )
        )
        }

    </div>
  )
}

export default Nftcards