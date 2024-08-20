"use client"

import React, { useState, useEffect } from 'react'
import AuthorProfileCard from "../../components/author/authorPage"
import AuthorTaps from "../../components/author/authorTabs"
import AuthorNFTCardBox from "../../components/author/authorNFTsBox"
import Banner from "../../components/banner/banner"
import Navbar from '@/components/navbar/page'
import { useAccount } from 'wagmi';
import { ethers, providers, Signer } from 'ethers';
import { abi as NFTFactoryAbi } from "@/contracts/out/NFTFactory.sol/NFTFactory.json"
import { abi as NFTAbi } from "@/contracts/out/NFT.sol/NFT.json"
import { abi as NFTMarketplace } from "@/contracts/out/Marketplace.sol/Marketplace.json"
import { BigNumber } from 'ethers';

import {fetchFromIPFS} from "@/utilis/Fetch"


type NFTData = {
address: string
genre: string
shareCount: number
singerId: number
song: Array<string>
stageName: string
title: string
url_image: string
year: number
id: number[]
};

type Web3Data = {
  address: string | null | undefined;
  signer: ethers.Signer | null;
  provider: ethers.providers.Web3Provider | null;
  marketplace: ethers.Contract | null;
  addressRecord: string | null;
  contractRecord: ethers.Contract | null;
};

const initialFormData: Web3Data = {
  address: null,
  signer: null,
  provider: null,
  marketplace: null,
  addressRecord: "",
  contractRecord: null,
};

export const Web3DataContext = React.createContext<Web3Data>(initialFormData);

function Page() {
  const { address, isConnected } = useAccount();
  const [collectiables, setCollectiables] = useState(true);
  const [created, setCreated] = useState(false);
  const [auction, setAuction] = useState(false);
  const [marketplace, setMarketplace] = useState<ethers.Contract | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [factory, setFactory] = useState<ethers.Contract | null>(null);
  const [addressRecord, setaddressRecord] = useState<string | null>("");
  const [contractRecord, setcontractRecord] = useState<ethers.Contract | null>(null);
  const [name, setName] = useState<string | null>("");

  // Created status
  const [nftsUri, setNftsUri] = useState<Array<string>>([]);
  const [nftsJSON, setNftsJSON] = useState<Array<NFTData>>([]);
  const [tokenID, setTokenID] = useState<Array<number>>([]);
  const [balance, setBalance] = useState<Array<number>>([]);
  const [owners, setOwners] = useState<Array<string>>([]);


  // Order status
  const [idOrder, setIdOrder] = useState<number[]>([]);
  const [balanceOrder, setBalanceOrder] = useState<Array<number>>([]);
  const [orderPrice, setorderPrice] = useState<Array<number>>([]);
  const [tokenIDOrder, setTtokenIDOrder] = useState<Array<number>>([]);
  const [nftsJSONOrder, setnftsJSONOrder] = useState<Array<NFTData>>([]);
  const [nftsUriOrder, setnftsUriOrder] = useState<Array<string>>([]);
  const [collection, setCollection] = useState<Array<string>>([]);


 // const [idOrder, setIdOrder] = useState<{ [key: string]: number[] }>({});

  //Auction state
  const [idAuction, setIdAuction] = useState<number[] >([]);
  const [balanceAuction, setBalanceAuction] = useState<number[] >([]);
  const [basePrice, setbasePrice] = useState<number[] >([]);
  const [deadline, setDeadline] = useState<Date[] >([]);
  const [tokenIDAuction, setTokenIDAuction] = useState<Array<number>>([]);
  const [nftsUriAuction, setnftsUriAuction] = useState<Array<string>>([]);
  const [nftsJSONAuction, setnftsJSONAuction] = useState<Array<NFTData>>([]);
  const [collectionAuction, setCollectionAuction] = useState<Array<string>>([]);








  useEffect(() => {
    const init = async () => {
      if (isConnected) {
        try {
          const web3prov = new providers.Web3Provider(window.ethereum);
          const web3signer = web3prov.getSigner();
          // factory contract instance
          const web3contract = new ethers.Contract(
            process.env.NEXT_PUBLIC_NFT_FACTORY_ADDRESS || "",
            NFTFactoryAbi,
            web3signer
          );
          // marketplace contract instance
          const marketpalce_contract = new ethers.Contract(process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || "", NFTMarketplace, web3signer);

          try {
            const record_address = await web3contract.associatedNFT(address);
            // nft contract instance
            const record_contract = new ethers.Contract(record_address, NFTAbi, web3signer);
            // Get name 
            try {
              const getName = await record_contract.name();
              setName(getName || "");
            } catch (error) {
              console.error("Error fetching name:", error);
              if(address){
              setName(address);
             }
            }
            
            setcontractRecord(record_contract);
            setaddressRecord(record_address);
            
          } catch (error) {
              console.log("user not a record company")
              
          }
          
          // set provider 
          setProvider(web3prov);
          // set signer
          setSigner(web3signer);
          // set factory
          setFactory(web3contract);
          // set marketplace
          setMarketplace(marketpalce_contract);

          
          // Get owned NFTs
          try{
            const end = await web3contract.nextNFTId();
            const end_format = parseInt(end.toString(), 10);
            const res = await web3contract.batchGetNFTs(address, 0, end_format, 10);
            console.log("my nfts", res)
            
             // create control variables
             let tokenOwned = [];
             let balanceOwned : number[] = [];
             let nftsUri = res[3];
             let owners : string[] = [] 
             let effeix = res[1].length

             for (let i=0; i< effeix; i ++){
              const owner = res[0][i]
              const token = res[1][i] ;
              const balance  = res[2][i]
              tokenOwned[i] =  parseInt(token.toString(), 10) 
              balanceOwned[i] = parseInt(balance.toString(), 10);  
              owners[i] = owner
            }
              // set order ids
              setNftsUri(nftsUri)
 
              //set balance
              setBalance(balanceOwned);
  
               // set the token id of each unique nft
               setTokenID(tokenOwned)

               // set owner
               setOwners(owners)

          }catch(e){
            console.log(e)
          }

          // Get sold NFTs
    
          try{
            const numberOrders = await marketpalce_contract.orderCounter()
            const numberOrders_format = parseInt(numberOrders.toString(), 10);
            const orders = await marketpalce_contract.getOrders(0, numberOrders_format, address);
            console.log(orders)

            // create control variables
            let tokenOrder = [];
            let balanceOrder : number[] = [];
            let nftsUriOrder = orders[1];
            let idOrder: number[]= []
            let effIdx  = BigNumber.from(orders[2]).toNumber();
            let orderPrice = [];
            let collectionAddress :string[] = []
            console.log(effIdx)

            //extract values for each variable

            for (let i=0; i< effIdx; i ++){
              const token = orders[0][i][4] ;
              const balance  = orders[0][i][3]  
              const id = orders[0][i][7] 
              const collection = orders[0][i][6]
              const price = orders[0][i][1] 
              tokenOrder[i] =  parseInt(token.toString(), 10) 
              balanceOrder[i] = parseInt(balance.toString(), 10);  
              idOrder[i]= parseInt(id.toString(), 10);
              orderPrice[i] = parseInt(price.toString(), 10);
              collectionAddress[i] = collection
            }

             // set order ids
             setIdOrder(idOrder)

             //set balance
             setBalanceOrder(balanceOrder);
 
              // set the token id of each unique nft
              setTtokenIDOrder(tokenOrder)

              // set uri
              setnftsUriOrder(nftsUriOrder)

              // set price
              setorderPrice(orderPrice)

              // set collection address
              setCollection(collectionAddress)

          }catch(e){
            console.log(e)
          }
          

          // Get acution NFTs
          try{
            const numberAuction = await marketpalce_contract.auctionCounter()
            const numberAuction_format = parseInt(numberAuction.toString(), 10);
            const auctions = await marketpalce_contract.getAuctions(0, numberAuction_format, address, "0x0000000000000000000000000000000000000000");
            console.log("auctions", auctions)

            // create control variables
            let tokenAuction = [];
            let balanceAuction : number[] = [];
            let nftsUriAuction = auctions[1];
            let effIdx  = BigNumber.from(auctions[2]).toNumber();
            let basePrice : number[] = [];
            let deadlines : Date[] = [];
            let idAuction: number[]= [];
            let collectionAddress :string[] = []



            //extract values for each variable

            for (let i=0; i< effIdx; i ++){
              const token = auctions[0][i][0] ;
              const balance  = auctions[0][i][6]  
              const id = auctions[0][i][11] 
              const price = auctions[0][i][2] 
              const deadline = auctions[0][i][4]
              const collection = auctions[0][i][8]

              tokenAuction[i] =  parseInt(token.toString(), 10) 
              balanceAuction[i] = parseInt(balance.toString(), 10);  
              idAuction[i]= parseInt(id.toString(), 10);
              basePrice[i] = parseInt(price.toString(), 10);
              deadlines[i]= new Date(BigNumber.from(deadline).toNumber()* 1000)
              collectionAddress[i] = collection

            }

            // set order ids
            setIdAuction(idAuction)

            //set balance
            setBalanceAuction(balanceAuction);

             // get the token id of each unique nft
             setTokenIDAuction(tokenAuction)

             setnftsUriAuction(nftsUriAuction)    
             
             // set baseprice
             setbasePrice(basePrice)

             // set deadline
             setDeadline(deadlines)

             // set collection
             setCollectionAuction(collectionAddress)


          }catch(e){
            console.log(e)
          }

        } catch (e) {
          console.error("Error in contract interaction:", e);
        }
      }
    };

    init();
  }, [isConnected]);

  // useEffect to handle the updated nftsUri state
  useEffect(() => {
    const fetchDataFromIPFS = async () => {
      for (let i = 0; i < nftsUri.length; i++) {
        const nftUri = nftsUri[i];
        const cid = nftUri.split("/").pop();

        if (cid) {
          const data = await fetchFromIPFS(cid);
          
          // Add tokenID to the data object
          data.tokenID = tokenID[i];
          data.balance= balance[i]
          data.owner= owners[i]

          setNftsJSON((prevdata) => {
            return uniqueById([...prevdata, data]);
          });
        }
      }
    };

    if (nftsUri.length > 0 && tokenID.length >0) {
      fetchDataFromIPFS();
      
    }
  }, [nftsUri, tokenID]);

  // useEffect to handle the updated nftsUri order state
  useEffect(() => {
    
    const fetchDataFromIPFS = async () => {

      let updatNft = []
      
      for (let i = 0; i < nftsUriOrder.length; i++) {
        const nftUri = nftsUriOrder[i];
        const cid = nftUri.split("/").pop();

        if (cid) {
          const data = await fetchFromIPFS(cid);        
          // Add tokenID to the data object
          data.tokenID = tokenIDOrder[i];
          //data.balance= balanceOrder[data.tokenID]
          data.balance= balanceOrder[i]
          data.id = idOrder[i]
          data.price = orderPrice[i]
          data.collection = collection[i]
          //data.id = idOrder[data.tokenID]
          updatNft[i] = data         
        }
        
      }
      setnftsJSONOrder(updatNft)
    };

    if (nftsUriOrder.length > 0 && tokenIDOrder.length >0) {
      fetchDataFromIPFS();
    }
  }, [nftsUriOrder, tokenIDOrder]);

  // useEffect to handle the updated nftsUri auction state
    useEffect(() => {
    
      const fetchDataFromIPFS = async () => {
        for (let i = 0; i < nftsUriAuction.length; i++) {
          const nftUri = nftsUriAuction[i];
          const cid = nftUri.split("/").pop();
  
          if (cid) {
            const data = await fetchFromIPFS(cid);
            
            // Add tokenID to the data object
            data.tokenID = tokenIDAuction[i];
            data.balance= balanceAuction[i]
            data.id = idAuction[i]
            data.basePrice = basePrice[i]
            data.deadline = deadline[i]
            data.collection = collectionAuction[i]

            console.log(data)
  
            if(data.balance){
              setnftsJSONAuction((prevdata) => {
                return uniqueById([...prevdata, data]);
              });
          }
          }
        }
      };
  
      if (nftsUriAuction.length > 0 && tokenIDAuction.length >0) {
        fetchDataFromIPFS();
        
      }
    }, [nftsUriAuction, tokenIDAuction]);

    useEffect(()=>{console.log("ooooo",nftsJSONAuction)},[nftsJSONAuction])
  
  // prevent json duplicates 
  function uniqueById(items:any) {
    const set = new Set();
    return items.filter((item:any) => {
      const isDuplicate = set.has(item.title);
      set.add(item.title);
      return !isDuplicate;
    });
  }

 
  


  return (
    <div>
      <Navbar />
      <Banner bannerImage={"/images/nfts/sfondo.jpg"} />
      <AuthorProfileCard
        setAddress={addressRecord !== "0x0000000000000000000000000000000000000000" ? addressRecord : address}
        name={name}
      />
      <AuthorTaps
        setCollectiables={setCollectiables}
        setCreated={setCreated}
        setAuction={setAuction}
      
        
      />
      <Web3DataContext.Provider value = {{signer, provider, marketplace, addressRecord, contractRecord, address}}>
      <AuthorNFTCardBox
        collectiables={collectiables}
        created={created}
        auction={auction}
        nftJSON={nftsJSON}
        nftJsonOrder={nftsJSONOrder}
        nftJsonAuction= {nftsJSONAuction}
      />
      </Web3DataContext.Provider>
    </div>
  );
}

export default Page;