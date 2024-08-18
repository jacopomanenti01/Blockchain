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
  address: string |null |undefined,
  signer : ethers.Signer | null,
  provider: ethers.providers.Web3Provider | null,
  marketplace: ethers.Contract | null,
  addressRecord: string | null,
  contractRecord: ethers.Contract | null,
}

const initialFormData: Web3Data = {
  address: null,
  signer : null,
  provider: null,
  marketplace: null,
  addressRecord: "",
  contractRecord: null,
};

export const Web3DataContext = React.createContext<Web3Data>(initialFormData)

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







  useEffect(() => {
    const init = async () => {
      if (isConnected) {
        try {
          const web3prov = new providers.Web3Provider(window.ethereum);
          const web3signer = web3prov.getSigner();
          const web3contract = new ethers.Contract(
            process.env.NEXT_PUBLIC_NFT_FACTORY_ADDRESS || "",
            NFTFactoryAbi,
            web3signer
          );
          const marketpalce_contract = new ethers.Contract(process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || "", NFTMarketplace, web3signer);
          const record_address = await web3contract.associatedNFT(address);
          const record_contract = new ethers.Contract(record_address, NFTAbi, web3signer);

          setProvider(web3prov);
          setSigner(web3signer);
          setFactory(web3contract);
          setcontractRecord(record_contract);
          setaddressRecord(record_address);
          setMarketplace(marketpalce_contract);

          // Get name 
          const name = await record_contract.name();
          setName(name);

          // Get owned NFTs
          try{
            const end = await web3contract.nextNFTId();
            const end_format = parseInt(end.toString(), 10);
            const res = await web3contract.batchGetNFTs(address, 0, end_format, 10);
            console.log("my nfts", res)

            // Get Balance
            setBalance((prevBalance) => {
              const newBalance = res[2]
                .map((bn: any) => parseInt(bn.toString(), 10)) // Convert BigNumbers to integers
              // Combine and ensure uniqueness using a Set
              return [...prevBalance, ...newBalance];
            });
        
            
            // Spread tokens' id
            pushTokenID(
              setTokenID,
              res[1],
              (bn :any) => parseInt(bn.toString(), 10) // Converter function
            );
          
            // Spread the elements of res into the nfts state
            pushUris(setNftsUri, res[3])
            
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


            /** 
      
            // create a map of id orders for each token
            const tokenToIdMap = tokenOrder.reduce((acc, token, index) => {
              if (!acc[token]) {
                acc[token] = [];
              }
              acc[token].push(idOrder[index]);
              return acc;
            }, {});
            
            // set order ids
            setIdOrder(tokenToIdMap)
            
            // get the balance of each unique nft
            let updatedBalance = []; 
              for (let i = 0; i < tokenOrder.length; i++) {
                const token = tokenOrder[i];
                const balance = balanceOrder[i]
            
                // If the token already exists, sum the balance, otherwise set the initial balance
                if (updatedBalance[token] !== undefined) {
                  updatedBalance[token] += balance;
                } else {
                  updatedBalance[token] = balance;
                }
                console.log("update balance", updatedBalance)
              }

              // create a map of balance for each token
              const tokenToBalanceMap = tokenOrder.reduce((acc: { [key: number]: number }, token, index) => {
                acc[token] = updatedBalance[index];
                return acc;
              }, {});

              //set balance
              setBalanceOrder(updatedBalance);

            // get the token id of each unique nft
             pushTokenID(
              setTtokenIDOrder,
              tokenOrder,
              (bn :any) => parseInt(bn.toString(), 10) // Converter function
            );
             
            //spred orderds' uris
            setnftsUriOrder(prevItems => {
              const uniqueUris = Array.from(new Set([...prevItems, ...nftsUriOrder]));
              return uniqueUris;
            });
            */

          }catch(e){
            console.log(e)
          }
          

          // Get acution NFTs
          try{
            const numberAuction = await marketpalce_contract.auctionCounter()
            const numberAuction_format = parseInt(numberAuction.toString(), 10);
            const auctions = await marketpalce_contract.getAuctions(0, numberAuction_format, address, "0x0000000000000000000000000000000000000000");

            // create control variables
            let tokenAuction = [];
            let balanceAuction : number[] = [];
            let nftsUriAuction = auctions[1];
            let effIdx  = BigNumber.from(auctions[2]).toNumber();
            let basePrice : number[] = [];
            let deadlines : Date[] = [];
            let idAuction: number[]= [];


            //extract values for each variable

            for (let i=0; i< effIdx; i ++){
              const token = auctions[0][i][9] ;
              const balance  = auctions[0][i][6]  
              const id = auctions[0][i][11] 
              const price = auctions[0][i][2] 
              const deadline = auctions[0][i][4]
              tokenAuction[i] =  parseInt(token.toString(), 10) 
              balanceAuction[i] = parseInt(balance.toString(), 10);  
              idAuction[i]= parseInt(id.toString(), 10);
              basePrice[i] = parseInt(price.toString(), 10);
              deadlines[i]= new Date(BigNumber.from(deadline).toNumber()* 1000)
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

  function pushTokenID<T, U>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    newItems: U[],
    converter: (item: U) => T
  ) {
    setter((prevItems) => {
      const uniqueItems = newItems
        .map(converter)
        .filter((item) => !prevItems.includes(item));
  
      return Array.from(new Set([...prevItems, ...uniqueItems]));
    });
  }

  function pushUris<T>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    newItems: T[]
  ) {
    setter((prevItems) => {
      // Prevent duplicates by filtering out items already present in the previous state
      const uniqueItems = newItems.filter((item) => !prevItems.includes(item));
      // Return a new array with previous items and the new unique items
      return [...prevItems, ...uniqueItems];
    });
  }

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

    useEffect(()=>{console.log(nftsJSONAuction)},[nftsJSONAuction])
  
  // prevent json duplicates 
  function uniqueById(items:any) {
    const set = new Set();
    return items.filter((item:any) => {
      const isDuplicate = set.has(item.title);
      set.add(item.title);
      return !isDuplicate;
    });
  }

  //fetch json file from IPFS
  const fetchFromIPFS = async (cid: string) => {
    try {
      const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      const data = await response.json();
      return data;

    } catch (error) {
      console.error("Error fetching from IPFS:", error);
    }
  };


  return (
    <div>
      <Navbar />
      <Banner bannerImage={"/images/nfts/Babycoverart.jpg"} />
      <AuthorProfileCard
        setAddress={addressRecord}
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