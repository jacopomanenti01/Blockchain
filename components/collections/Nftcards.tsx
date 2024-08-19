"use client"
import React, { useState } from 'react'
import {AiFillHeart, AiOutlineHeart} from "react-icons/ai"
import {BsImages} from "react-icons/bs"
import Image from "next/image"
import style from "./nft.module.css"
import { FaWallet } from "react-icons/fa";
import { MdAlbum } from "react-icons/md";
import { FaWpforms, FaMoneyBillTransfer  } from "react-icons/fa6";
import { GiLoveSong } from "react-icons/gi";
import { RiNftFill } from "react-icons/ri";










function Tutorial() {
        return (
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="space-y-4 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform simplifies the exchange of album royalties and the deployment of your nft album. Here’s how it works.
                </p>
              </div>
              <div className="grid gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <FaWallet className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Sign Up</h3>
                  <p className="text-muted-foreground">Sign in with Metamask and get started with our platform in minutes.</p>
                </div>
                <div className="rounded-lg border p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <MdAlbum className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Mint your album</h3>
                  <p className="text-muted-foreground">If you are a whitelisted record company, click on "mint" section and fill the dedicated form.</p>
                </div>
                <div className="rounded-lg border p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <FaWpforms className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Fill the form</h3>
                  <p className="text-muted-foreground">
                  In the "Mint" section, simply fill out the forms with a few clicks to create your artist profile and associated album. Set the desired royalt amount for your album. Once complete, your album will be securely deployed to our infrastructure. The royalty percentage for each sale will match the amount you specified during the whitelisting process.                  </p>
                </div>
                <div className="rounded-lg border p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <FaMoneyBillTransfer  className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Monitor,  Sell or put up for auction</h3>
                  <p className="text-muted-foreground">Click on the user icon and start manage your albums. You can sell them, put up for auction or remove them from the marketplace if needed.</p>
                </div>
                <div className="rounded-lg border p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <GiLoveSong className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Explore the marketplace</h3>
                  <p className="text-muted-foreground">
                  Navigate to the "Listing" section to explore the latest featured albums in our marketplace. Start trading the associated royalties with our seamless service.
                  </p>
                </div>
                <div className="rounded-lg border p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <RiNftFill className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">See album details</h3>
                  <p className="text-muted-foreground">
                  Click on an album's card to view details such as the release year, genre, related songs, and the specific royalties associated with it.                  </p>
                </div>
              </div>
            </div>
          </section>
       
  )
}

export default Tutorial