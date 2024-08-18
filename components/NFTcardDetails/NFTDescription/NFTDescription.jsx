import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  MdVerified,
  MdCloudUpload,
  MdTimer,
  MdReportProblem,
  MdOutlineDeleteSweep,
} from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { FaWallet, FaPercentage } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  TiSocialFacebook,
  TiSocialLinkedin,
  TiSocialTwitter,
  TiSocialYoutube,
  TiSocialInstagram,
} from "react-icons/ti";
import { BiTransferAlt, BiDollar } from "react-icons/bi";
import { ethers} from 'ethers';


//INTERNAL IMPORT
import Style from "./NFTDescription.module.css";
import { Button } from "@/components/ui/button"
import { NFTTabs } from "../NFTDetailsIndex";


const NFTDescription = ({title, name, orderID,auctionID, render, marketplace}) => {
  const [social, setSocial] = useState(false);
  const [NFTMenu, setNFTMenu] = useState(false);
  const [history, setHistory] = useState(true);
  const [provanance, setProvanance] = useState(false);
  const [owner, setOwner] = useState(false);
  const [marketOrder, setMarketOrder] = useState([])
  const [marketAuction, setMarketAuction] = useState([])


  useEffect(()=>{
    const init = async ()=>{
      if(marketplace){
        if(render == "order"){
          const orderInstance = await marketplace.orders(orderID)
          setMarketOrder(orderInstance)
          console.log(orderInstance)
          const filter = marketplace.filters.OrderFilled(orderID)
          console.log(filter);
        }
        else if(render == "auction"){
          const auctionInstance = await marketplace.auctions(auctionID)
          setMarketAuction(auctionInstance)
          console.log(auctionInstance)

        }
        else{
          console.log("prova 3")
        }
      }
    }
    init()
  }, [marketplace, render])

  const buy = async()=>{
    try {
      if (marketplace && marketOrder.length > 0) {
        const buyAmountNumber = marketOrder[3].toString()
        const buyAmount = ethers.BigNumber.from(marketOrder[3]); // Assicurati che buyAmount sia un BigNumber
        const unitPrice = ethers.BigNumber.from(marketOrder[1]); // Prezzo per unità in wei
  
        // Calcola il prezzo totale moltiplicando il prezzo unitario per la quantità
        const totalPrice = unitPrice.mul(buyAmount); 
  
        const options = { value: totalPrice,
          gasLimit: 300000000
         };
  
        console.log("Buy amount:", buyAmountNumber);
        console.log("Unit price (in wei):", unitPrice.toString());
        console.log("Total price (in wei):", totalPrice.toString());
  
        // Chiama la funzione buy sul contratto marketplace
        const tx = await marketplace.buy(orderID,buyAmountNumber ,options);
        await tx.wait();
        console.log(`Transaction successful: ${tx.hash}`);
      } else {
        console.log('Marketplace contract or marketOrder is not initialized.');
      }
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  }

  const getLogs = async() => {
    const filter = contract.filters.OrderFilled(orderID)
    /** 
    const logs = await this.provider.getLogs({
      fromBlock: 12794325,
      toBlock: 'latest',
      address: this.Dao.address,
      topics: , //filter
    });
    */
    console.log(filter);
  }

  const historyArray = [
    "/images/logo/logo-2.svg",
    "/images/logo/logo-2.svg",
    "/images/logo/logo-2.svg",
    "/images/logo/logo-2.svg",
    "/images/logo/logo-2.svg",
  ];
  const provananceArray = [
    "/images/logo-1.svg",
    "/images/logo-1.svg",
    "/images/logo-1.svg",
    "/images/logo-1.svg",
    "/images/logo-1.svg",
  ];
  const ownerArray = [
    "/images/logo-1.svg",
    "/images/logo-1.svg",
    "/images/logo-1.svg",
    "/images/logo-1.svg",
    "/images/logo-1.svg",
  ];

  const openTabs = (e) => {
    const btnText = e.target.innerText;

    if (btnText == "Bid History") {
      setHistory(true);
      setProvanance(false);
      setOwner(false);
    } else if (btnText == "Provanance") {
      setHistory(false);
      setProvanance(true);
      setOwner(false);
    }
  };

  const openOwmer = () => {
    if (!owner) {
      setOwner(true);
      setHistory(false);
      setProvanance(false);
    } else {
      setOwner(false);
      setHistory(true);
    }
  };

  return (
    <div className={Style.NFTDescription}>
      <div className={Style.NFTDescription_box}>
        
        {/* //Part TWO */}
        <div className={Style.NFTDescription_box_profile}>
          <h1>{title}</h1>
          <div className={Style.NFTDescription_box_profile_box}>
            <div className={Style.NFTDescription_box_profile_box_left}>
              
              <Avatar>
                <AvatarImage src="/images/icon-analytics.png" width={40}
                height={40} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div className={Style.NFTDescription_box_profile_box_left_info}>
                <small>Creator</small> <br />
                <span>
                  {name} <MdVerified />
                </span>
              </div>
            </div>

          </div>
          {render === "owned" ?  (<div></div>) :
          render === "order" && marketOrder ? (<div>
            <div className={Style.NFTDescription_box_profile_biding_box_price}>
              <div
                className={
                  Style.NFTDescription_box_profile_biding_box_price_bid
                }
              >
                <small>Price</small>
                <p>
                {marketOrder[1] !== undefined ? ethers.utils.formatUnits(marketOrder[1].toString(), 18) + ' ETH': 'N/A'}
                </p>
              </div>

              <span>[{marketOrder[3] !== undefined ? marketOrder[3].toString() : 'N/A'} left]</span>
            </div>
            <div className={Style.NFTDescription_box_profile_biding_box_button}>
              
            <Button
              variant="ghost"
              onClick={()=>{buy()}}
              classStyle={Style.button}
              btnName="Place a bid">
              <FaWallet />
              buy now
            </Button>
           
          </div>

          <div className={Style.NFTDescription_box_profile_biding_box_tabs}>
            <button onClick={(e) => openTabs(e)}>Provanance</button>
            <button onClick={() => openOwmer()}>Owner</button>
          </div>

          {provanance && (
            <div className={Style.NFTDescription_box_profile_biding_box_card}>
              <NFTTabs dataTab={provananceArray} />
            </div>
          )}

          {owner && (
            <div className={Style.NFTDescription_box_profile_biding_box_card}>
              <NFTTabs dataTab={ownerArray} icon=<MdVerified /> />
            </div>
          )}
        </div>) :(

          <div className={Style.NFTDescription_box_profile_biding}>
            <p>
              <MdTimer /> <span>Auction ending in:</span>
            </p>

            <div className={Style.NFTDescription_box_profile_biding_box_timer}>
              <div
                className={
                  Style.NFTDescription_box_profile_biding_box_timer_item
                }
              >
                <p>2</p>
                <span>Days</span>
              </div>
              <div
                className={
                  Style.NFTDescription_box_profile_biding_box_timer_item
                }
              >
                <p>22</p>
                <span>hours</span>
              </div>
              <div
                className={
                  Style.NFTDescription_box_profile_biding_box_timer_item
                }
              >
                <p>45</p>
                <span>mins</span>
              </div>
              <div
                className={
                  Style.NFTDescription_box_profile_biding_box_timer_item
                }
              >
                <p>12</p>
                <span>secs</span>
              </div>
            </div>

            <div className={Style.NFTDescription_box_profile_biding_box_price}>
              <div
                className={
                  Style.NFTDescription_box_profile_biding_box_price_bid
                }
              >
                <small>Current Bid</small>
                <p>
                  1.000 ETH <span>( ≈ $3,221.22)</span>
                </p>
              </div>

              <span>[96 in stock]</span>
            </div>

            <div className={Style.NFTDescription_box_profile_biding_box_button}>
              
              <Button
                variant="ghost"
                handleClick={() => {}}
                classStyle={Style.button}
                btnName="Place a bid">
                <FaWallet />
                buy now
              </Button>
              <Button
                variant="ghost"
                handleClick={() => {}}
                classStyle={Style.button}
                btnName="Make offer">
                <FaPercentage />
                make an offer
              </Button>
              
            </div>

            <div className={Style.NFTDescription_box_profile_biding_box_tabs}>
              <button onClick={(e) => openTabs(e)}>Bid History</button>
              <button onClick={(e) => openTabs(e)}>Provanance</button>
              <button onClick={() => openOwmer()}>Owner</button>
            </div>

            {history && (
              <div className={Style.NFTDescription_box_profile_biding_box_card}>
                <NFTTabs dataTab={historyArray} />
              </div>
            )}
            {provanance && (
              <div className={Style.NFTDescription_box_profile_biding_box_card}>
                <NFTTabs dataTab={provananceArray} />
              </div>
            )}

            {owner && (
              <div className={Style.NFTDescription_box_profile_biding_box_card}>
                <NFTTabs dataTab={ownerArray} icon=<MdVerified /> />
              </div>
            )}
          </div>)}
        </div>
      </div>
    </div>
  );
};

export default NFTDescription;
