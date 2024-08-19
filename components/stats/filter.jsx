"use client"

import { useState, useMemo, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext } from "@/components/ui/pagination"
import { useAccount } from "wagmi"
import { abi as NFTMarketplace } from "@/contracts/out/Marketplace.sol/Marketplace.json"
import { ethers, providers, Signer } from 'ethers';
import { formatEther } from "viem"
import { useRouter } from 'next/navigation';

import {fetchFromIPFS} from "@/utilis/Fetch"


export default function Component() {
  

  const router = useRouter();
  const [nftData, setNftData] = useState([]);
  const [auctionData, setAuctionData] = useState([]);
  const { account, isConnected } = useAccount();
  const [sortBy, setSortBy] = useState("newest")
  const [filterBy, setFilterBy] = useState({
    creator: [],
    price: { min: 0, max: 10 },
    type: [],
    genre: []
  })

  useEffect(() => {
    async function getNFTs() {
      const web3prov = new providers.Web3Provider(window.ethereum);
      const web3signer = web3prov.getSigner();
      const marketplace = new ethers.Contract(process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || "", NFTMarketplace, web3signer);

      const end = await  marketplace.orderCounter();
      const aEnd = await  marketplace.auctionCounter();
      try {
        const [orders, uris, size] = await marketplace.getOrders(0, end, ethers.constants.AddressZero);
      console.log("uri", uris)
      console.log("size", size.toString())
      console.log("nft", orders)
        
      } catch (error) {
        console.log(error)
        
      }
      try {
        const [auctions, aUris, aSize] = await marketplace.getAuctions(0, aEnd, ethers.constants.AddressZero,ethers.constants.AddressZero);
        console.log("sizea", aSize.toString())
        
      } catch (error) {
        console.log("no auction")
        
      }
      
      
      const aData = []
      const data = [];
      //change index
      try {
        console.log("cazzo", size.toString)
        for (let i = 0; i < size.toString(); i++) {
        const nftUri = uris[i];
        // Check if the URI is a valid non-empty string and starts with "https://"
        if (nftUri && nftUri.startsWith("https://blush-active-cephalopod-524.mypinata.cloud")) {

        const cid = nftUri.split("/").pop();
        const metadata = await fetchFromIPFS(cid);

        console.log("metadata", metadata);

        data.push({
          tokenID: Number(orders[i].tokenId.toString()),
          image: metadata.url_image,
          title: metadata.title,
          description: metadata.description,
          creator: metadata.stageName,
          price: formatEther(orders[i].price),
          orderID: i,
          collection: orders[i].collection,
          type: "buy",
          genre: metadata.genre
        })
      }else{
        console.error("Failed to fetch NFTs:");
      }
    }
        
      } catch (error) {
        console.log("nft order error")
        
      }
      try {
        console.log("uffa", aSize.toString)

      for (let i = 0; i < aSize.toString(); i++) {
        const nftUri = aUris[i];
        if (nftUri && nftUri.startsWith("https://blush-active-cephalopod-524.mypinata.cloud")) {
        const cid = nftUri.split("/").pop();
        const metadata = await fetchFromIPFS(cid);

        const deadlineTimestamp = auctions[i].deadline.toNumber() * 1000; // Moltiplica per 1000 per convertire da secondi a millisecondi
        const deadlineDate = new Date(deadlineTimestamp);
        const formattedDeadline = deadlineDate.toLocaleString(); 

        console.log("metadata", metadata);

        aData.push({
          tokenID: Number(auctions[i].tokenId.toString()),
          image: metadata.url_image,
          title: metadata.title,
          description: metadata.description,
          creator: metadata.stageName,
          price: formatEther(auctions[i].highestBid),
          auctionID: i,
          collection: auctions[i].collection,
          deadline: formattedDeadline,
          type: "bid",
          genre: metadata.genre
        })
      }
    }
        
      } catch (error) {
        console.log("nft acution error")
      }
        
  
    
  

      setNftData(data);
      setAuctionData(aData)
    }

    if (isConnected) {
      getNFTs().then();
    }
  }, [account])

  useEffect(()=>{
    console.log(auctionData)
  },[auctionData])

  const handleCardClick = (collection , id, order) => {
    router.push(`/NFTdetails/${collection}/${id}?order=${order}`);
  };

  const handleCardClickAuction = (collection , id, auction) => {
    router.push(`/NFTdetails/${collection}/${id}?auction=${auction}`);
  };


  const filteredNfts = useMemo(() => {
    // Combina nftData e auctionData
    const combinedData = [...nftData, ...auctionData];

    return combinedData
      .filter((item) => {
        if (filterBy.creator.length > 0 && !filterBy.creator.includes(item.creator)) {
          return false;
        }
        if (item.price < filterBy.price.min || item.price > filterBy.price.max) {
          return false;
        }
        if (filterBy.type.length > 0 && !filterBy.type.includes(item.type)) {
          return false;
        }
        if (filterBy.genre.length > 0 && !filterBy.type.includes(item.genre)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return b.tokenID - a.tokenID; // Assumendo che l'ID più alto sia il più nuovo
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          default:
            return 0;
        }
      });
  }, [sortBy, filterBy, nftData, auctionData]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        <div className="bg-background rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="grid gap-4">
            <div>
              <h3 className="text-base font-medium mb-2">Creator</h3>
              <div className="grid gap-2">
                {[...new Set(nftData.map((nft) => nft.creator))].map((creator) => (
                  <Label key={creator} className="flex items-center gap-2 font-normal">
                    <Checkbox
                      checked={filterBy.creator.includes(creator)}
                      onCheckedChange={() => {
                        setFilterBy((prevState) => ({
                          ...prevState,
                          creator: prevState.creator.includes(creator)
                            ? prevState.creator.filter((c) => c !== creator)
                            : [...prevState.creator, creator],
                        }))
                      }}
                    />
                    {creator}
                  </Label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-base font-medium mb-2">Type</h3>
              <div className="grid gap-2">
                {['buy', 'bid'].map((type) => (
                  <Label key={type} className="flex items-center gap-2 font-normal">
                    <Checkbox
                      checked={filterBy.type.includes(type)}
                      onCheckedChange={() => {
                        setFilterBy((prevState) => ({
                          ...prevState,
                          type: prevState.type.includes(type)
                            ? prevState.type.filter((t) => t !== type)
                            : [...prevState.type, type],
                        }))
                      }}
                    />
                    {type === 'buy' ? 'Buy' : 'Bid'}
                  </Label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-base font-medium mb-2">Genre</h3>
              <div className="grid gap-2">
                {[...new Set(nftData.map((nft) => nft.genre))].map((genre) => (
                  <Label key={genre} className="flex items-center gap-2 font-normal">
                    <Checkbox
                      checked={filterBy.genre.includes(genre)}
                      onCheckedChange={() => {
                        setFilterBy((prevState) => ({
                          ...prevState,
                          genre: prevState.genre.includes(genre)
                            ? prevState.genre.filter((g) => g !== genre)
                            : [...prevState.genre, genre],
                        }))
                      }}
                    />
                    {genre}
                  </Label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-base font-medium mb-2">Price</h3>
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="price-min" className="flex-1">
                    Min
                  </Label>
                  <Input
                    id="price-min"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={filterBy.price.min}
                    onChange={(e) =>
                      setFilterBy((prevState) => ({
                        ...prevState,
                        price: { ...prevState.price, min: parseFloat(e.target.value) },
                      }))
                    }
                    className="w-24"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="price-max" className="flex-1">
                    Max
                  </Label>
                  <Input
                    id="price-max"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={filterBy.price.max}
                    onChange={(e) =>
                      setFilterBy((prevState) => ({
                        ...prevState,
                        price: { ...prevState.price, max: parseFloat(e.target.value) },
                      }))
                    }
                    className="w-24"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">NFT Marketplace</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <ListOrderedIcon className="w-4 h-4" />
                  Sort by:{" "}
                  {sortBy === "newest"
                    ? "Newest"
                    : sortBy === "price-low"
                    ? "Price: Low to High"
                    : "Price: High to Low"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                  <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="price-low">Price: Low to High</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="price-high">Price: High to Low</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredNfts.map((nft) => (
<Card 
  key={nft.id} 
  className="bg-background rounded-lg shadow-lg overflow-hidden"
  onClick={() => 
    nft.type === 'buy' 
      ? handleCardClick(nft.collection, nft.tokenID, nft.orderID) 
      : handleCardClickAuction(nft.collection, nft.tokenID, nft.auctionID)
  }
>                <Link href="#" className="block" prefetch={false}>
                  <img
                    src={nft.image}
                    alt={nft.title}
                    width={400}
                    height={400}
                    className="w-full h-64 object-cover"
                  />
                </Link>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{nft.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{nft.type}</p>
                  {nft.type === 'bid' && (
                    <p className="text-sm text-muted-foreground mb-4">
                      Deadline: {nft.deadline}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{nft.creator}</span>
                    </div>
                    {nft.type === "buy"? (<div className="text-lg font-semibold">{nft.price} ETH</div>):(<div className="text-lg font-semibold">Bid: {nft.price} ETH</div>) }
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
        </div>
      </div>
    </div>
  )
}

function ListOrderedIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="10" x2="21" y1="6" y2="6" />
      <line x1="10" x2="21" y1="12" y2="12" />
      <line x1="10" x2="21" y1="18" y2="18" />
      <path d="M4 6h1v4" />
      <path d="M4 10h2" />
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </svg>
  )
}


function UserIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
