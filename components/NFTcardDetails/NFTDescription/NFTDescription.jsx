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
import { abi as GenericERC20  } from "@/contracts/out/GenericERC20.sol/GenericERC20.json";
import { abi as NFTMarketplace } from "@/contracts/out/Marketplace.sol/Marketplace.json"



const NFTDescription = ({title, name, orderID,auctionID, render, marketplace, signer, user}) => {
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
      if (marketOrder.length > 0) {
        const marketplace_contract = new ethers.Contract(
            process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || "", 
            NFTMarketplace, 
            signer
        );
        console.log(marketplace_contract);
        
        const tokenPayment = marketOrder[0];
        const buyAmount = ethers.BigNumber.from(marketOrder[3]); // Quantità da acquistare come BigNumber
        const unitPrice = ethers.BigNumber.from(marketOrder[1]); // Prezzo per unità in wei
        
        // Calcola il prezzo totale moltiplicando il prezzo unitario per la quantità
        const totalPrice = unitPrice.mul(buyAmount);
        
        const options = { 
            value: totalPrice, // Imposta il valore totale in wei come msg.value
            gasLimit: ethers.BigNumber.from('3000000') // Gas limit
        };
        
        console.log("buyAmount:", buyAmount.toString());
        console.log("orderID:", orderID);
        console.log("totalPrice:", totalPrice.toString());
        console.log("totalPrice in ETH:", ethers.utils.formatEther(totalPrice));
        
        // Chiama la funzione buy sul contratto marketplace
        try {
            const tx = await marketplace_contract.buy(orderID, buyAmount, options);
            await tx.wait();
            console.log(`Transaction successful: ${tx.hash}`);
        } catch (error) {
            console.error('Transaction failed:', error);
        }
        /** 

        if(tokenPayment !=process.env.NEXT_PUBLIC_MATIC_ADDRESS && signer){
          const ERC20 = new ethers.Contract(process.env.NEXT_PUBLIC_ERC20_ADDRESS || "", GenericERC20, signer);
          //const decimals = await ERC20.decimals()

          // erc20.allowance (id connesso, marketplace) quanto puo prevelere x
          const res = await ERC20.allowance(marketplace,user )
          // x vs costo totale, se < allora rc20.approve(marketpalce, costototale)

          if(res < totalPrice ){
            const all = await ERC20.approve(marketplace,totalPrice )
            const tx = await marketplace.buy(orderID,buyAmountNumber ,options);
            await tx.wait();
            console.log(`Transaction successful: ${tx.hash}`);

          }else{
            const tx = await marketplace.buy(orderID,buyAmountNumber ,options);
            await tx.wait();
            console.log(`Transaction successful: ${tx.hash}`);
          }
        }else{
        */
          
        
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
