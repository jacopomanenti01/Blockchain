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
import { RiAuctionFill } from "react-icons/ri";



//INTERNAL IMPORT
import Style from "./NFTDescription.module.css";
import { Button } from "@/components/ui/button"
import { NFTTabs } from "../NFTDetailsIndex";
import { abi as GenericERC20  } from "@/contracts/out/GenericERC20.sol/GenericERC20.json";
import { abi as NFTMarketplace } from "@/contracts/out/Marketplace.sol/Marketplace.json"
import AuctionButton from "@/components/NFTcardDetails/NFTDescription/auctionButton"



const NFTDescription = ({title, name, orderID,auctionID, render, marketplace, signer, user}) => {
  const [social, setSocial] = useState(false);
  const [NFTMenu, setNFTMenu] = useState(false);
  const [history, setHistory] = useState(true);
  const [provanance, setProvanance] = useState(false);
  const [owner, setOwner] = useState(false);
  const [marketOrder, setMarketOrder] = useState([])
  const [marketAuction, setMarketAuction] = useState([])
  const [data, setData] = useState(null)
  const [expired, setExpired] = useState(false)


  useEffect(()=>{
    const init = async ()=>{
      if(marketplace){
        if(render == "order"){
          const orderInstance = await marketplace.orders(orderID)
          setMarketOrder(orderInstance)
          const filter = marketplace.filters.OrderFilled(orderID)
        }
        else if(render == "auction"){
          const auctionInstance = await marketplace.auctions(auctionID)
          setMarketAuction(auctionInstance)
          console.log("prova", auctionInstance)

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
        const tokenPayment = marketOrder[0];
        const buyAmount = ethers.BigNumber.from(marketOrder[3]); // Quantity to purchase as BigNumber
        const unitPrice = ethers.BigNumber.from(marketOrder[1]); // Unit price in wei
        // Calculate the total price by multiplying the unit price by the quantity
        const totalPrice = unitPrice.mul(buyAmount);

        const options = { 
            value: totalPrice, // Set the total value in wei as msg.value
            gasLimit: 3000000 // Gas limit
        };

        
        if(tokenPayment !=process.env.NEXT_PUBLIC_MATIC_ADDRESS ){
          try {
          const ERC20 = new ethers.Contract(process.env.NEXT_PUBLIC_ERC20_ADDRESS || "", GenericERC20, signer);
          //const decimals = await ERC20.decimals()

          // erc20.allowance (id connesso, marketplace) quanto puo prevelere x
          const res = await ERC20.allowance(user,process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS)
          // x vs costo totale, se < allora rc20.approve(marketpalce, costototale)

          if(res.toString() < totalPrice.toString() ){
            const all = await ERC20.approve(process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS,totalPrice.toString() )
            await all.wait()
            try {
              const tx = await marketplace.buy(orderID,buyAmount.toString() ,options);
              await tx.wait();
              console.log(`Transaction successful: ${tx.hash}`);
              alert("transaction went through")
              location.reload();

              
            } catch (error) {
              console.log("something went wrong, please retry to buy")
            }
          }else{
            try {
              const tx = await marketplace.buy(orderID,buyAmount.toString() ,options);
              await tx.wait();
              console.log(`Transaction successful: ${tx.hash}`);
              alert("transaction went through")
              location.reload();

            } catch (error) {
              console.log("something went wrong, please retry to buy")
            }
          }
          } catch (error) {
                console.log("invalid token")

            }
        
        }else{
        // Call the buy function on the marketplace contract
          try {
            const tx = await marketplace.buy(orderID, buyAmount.toString(), options);
            await tx.wait();
            console.log(`Transaction successful: ${tx.hash}`);
            alert("transaction went through")
            location.reload();


              } catch (error) {
                  console.error('Transaction failed:', error);
              }
            
        }}
        else {
              console.log('Marketplace contract or marketOrder is not initialized.');

        }
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  }

  const auction = async(price)=>{
    try {
      if (marketAuction.length > 0) {
        const tokenPayment = marketAuction[1];
        const buyAmount = ethers.BigNumber.from(marketAuction[6]); // Quantity to purchase as BigNumber
        

        const totalPrice = ethers.utils.parseUnits(price.toString(), 18) // da settare con un form

        const options = { 
            value: totalPrice, // Set the total value in wei as msg.value
            gasLimit: 3000000 // Gas limit
        };

        console.log("price", totalPrice.toString())

        
        if(tokenPayment !=process.env.NEXT_PUBLIC_MATIC_ADDRESS ){
          try {
          const ERC20 = new ethers.Contract(process.env.NEXT_PUBLIC_ERC20_ADDRESS || "", GenericERC20, signer);
          //const decimals = await ERC20.decimals()

          // erc20.allowance (id connesso, marketplace) quanto puo prevelere x
          const res = await ERC20.allowance(user,process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS)
          // x vs costo totale, se < allora rc20.approve(marketpalce, costototale)

          console.log(res.toString() < totalPrice.toString())

          if(res.toString() < totalPrice.toString() ){
            const all = await ERC20.approve(process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS,totalPrice.toString() )
            await all.wait()
            try {
              const tx = await marketplace.bid(auctionID,buyAmount.toString() ,options);
              await tx.wait();
              console.log(`Transaction successful: ${tx.hash}`);
              alert("transaction went through")
              location.reload();

              
            } catch (error) {
              console.log("something went wrong, please retry to bid")
            }
          }else{
            try {
              const tx = await marketplace.bid(auctionID,buyAmount.toString() ,options);
              await tx.wait();
              console.log(`Transaction successful: ${tx.hash}`);
              alert("transaction went through")
              location.reload();

            } catch (error) {
              
            }
          }
          } catch (error) {
                console.log("invalid token")

            }
        
        }else{
        // Call the buy function on the marketplace contract
          try {
            const tx = await marketplace.bid(auctionID, buyAmount.toString(), options);
            await tx.wait();
            console.log(`Transaction successful: ${tx.hash}`);
            alert("transaction went through")
            location.reload();


              } catch (error) {
                  console.error('Transaction failed:', error);
              }
            
        }}
        else {
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

  const formateDate = (date)=>{
    const deadlineTimestamp = date.toNumber() * 1000; // Moltiplica per 1000 per convertire da secondi a millisecondi
    const deadlineDate = new Date(deadlineTimestamp);
    const formattedDeadline = deadlineDate.toLocaleString();
    return formattedDeadline
  }

  const onClick = async (d) => {
    try {
      setData(d);
      // If you perform any async operations here, ensure they are awaited and wrapped in try-catch
    } catch (error) {
      console.error("Error during onClick operation:", error);
      alert("Something went wrong with your action.");
    }
  };

  useEffect(()=>{
    auction(data)
  },[data])

  const end = async ()=>{
    console.log("aoo")
    try {
      const tx = await marketplace.endAuction(auctionID);
      await tx.wait();
      console.log(`Transaction successful: ${tx.hash}`);
      alert("transaction went through")
      location.reload();
        } catch (error) {
            console.error('Transaction failed:', error);
        }
  }

  useEffect(()=>{
    if(marketAuction[4]){
    const deadline =  marketAuction[4].toNumber()* 1000
    const now =  Date.now()
    if(deadline<now){
      setExpired(true)
    }
  }
  })

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
              <MdTimer /> <span>Auction ends on:</span>
            </p>

            <div className={Style.NFTDescription_box_profile_biding_box_timer}>
            {marketAuction[4] !== undefined ? formateDate(marketAuction[4]): 'N/A'}
            </div>

            <div className={Style.NFTDescription_box_profile_biding_box_price}>
              <div
                className={
                  Style.NFTDescription_box_profile_biding_box_price_bid
                }
              >
                <small>Current Bid</small>
                <p>
                  { marketAuction[5] !== undefined ? ethers.utils.formatUnits(marketAuction[5].toString(),18) + 'ETH': 'N/A'} 
                </p>
              </div>

              <span>[{ marketAuction[6] !== undefined ? marketAuction[6].toString(): 'N/A'} ]</span>
            </div>

            <div className={Style.NFTDescription_box_profile_biding_box_button}>
              
              <AuctionButton onClick={onClick} basePrice={marketAuction[2] ? marketAuction[2].toString() : "0"} />
              {
                expired == true ? (<Button
                  variant="ghost"
                  onClick={()=>{end()}}
                  classStyle={Style.button}
                  btnName="Place a bid">
                  <RiAuctionFill />
                  End Auction
                </Button>): (<div></div>)
              }
              
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
