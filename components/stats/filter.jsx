"use client"

import { useState, useMemo } from "react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext } from "@/components/ui/pagination"

export default function Component() {
  const nftData = [
    {
      id: 1,
      image: "./images/icon-fast.png",
      title: "Cosmic Odyssey",
      description: "Explore the depths of the universe with this captivating NFT.",
      creator: "Galactic Artistry",
      price: 1.2,
    },
    {
      id: 2,
      image: "./images/icon-fast.png",
      title: "Ethereal Bloom",
      description: "Witness the beauty of nature in digital form.",
      creator: "Pixel Botanica",
      price: 0.8,
    },
    {
      id: 3,
      image: "./images/icon-fast.png",
      title: "Cyberpunk Dystopia",
      description: "Dive into a futuristic world of neon and technology.",
      creator: "Neon Architects",
      price: 2.5,
    },
    {
      id: 4,
      image: "./images/icon-fast.png",
      title: "Dreamscape Reverie",
      description: "Escape to a realm of imagination and wonder.",
      creator: "Surreal Visionaries",
      price: 1.7,
    },
    {
      id: 5,
      image: "./images/icon-fast.png",
      title: "Quantum Kaleidoscope",
      description: "Explore the mesmerizing patterns of the digital world.",
      creator: "Pixel Alchemists",
      price: 1.1,
    },
    {
      id: 6,
      image: "./images/icon-fast.png",
      title: "Mythical Menagerie",
      description: "Discover the fantastical creatures of the digital realm.",
      creator: "Pixel Beastmasters",
      price: 0.9,
    },
  ]
  const [sortBy, setSortBy] = useState("newest")
  const [filterBy, setFilterBy] = useState({
    creator: [],
    price: { min: 0, max: 10 },
  })
  const filteredNfts = useMemo(() => {
    return nftData
      .filter((nft) => {
        if (filterBy.creator.length > 0 && !filterBy.creator.includes(nft.creator)) {
          return false
        }
        if (nft.price < filterBy.price.min || nft.price > filterBy.price.max) {
          return false
        }
        return true
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return b.id - a.id
          case "price-low":
            return a.price - b.price
          case "price-high":
            return b.price - a.price
          default:
            return 0
        }
      })
  }, [sortBy, filterBy, nftData])
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
              <Card key={nft.id} className="bg-background rounded-lg shadow-lg overflow-hidden">
                <Link href="#" className="block" prefetch={false}>
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
                  <p className="text-sm text-muted-foreground mb-4">{nft.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{nft.creator}</span>
                    </div>
                    <div className="text-lg font-semibold">{nft.price} ETH</div>
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


function XIcon(props) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}



