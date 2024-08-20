'use client'

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import MyAvatar from "./avatar";
import { Button } from "@/components/ui/button"


const style = {
  container: `relative before:content-[''] before:bg-red-500 before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[url('https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647')] before:bg-cover before:bg-center before:opacity-90 before:blur before:blur-md before:z-[-1]`,
  contentWrapper: `flex flex-col md:flex-row items-center justify-center pb-10 relative`,
  copyContainer: `p-5 justify-center md:w-1/3 mb-10 md:mb-0`,
  title: `bg-gradient-to-r from-blue-800 to-green-300 bg-clip-text text-transparent text-4xl md:text-6xl font-bold pb-10`,
  description: `text-[#fffff] container-[400px] text-2xl mt-[0.8rem] mb-[2.5rem]`,
  button: `relative text-lg font-semibold px-12 py-4 bg-[#363840] rounded-lg mr-5 text-[#e4e8ea] hover:bg-[#4c505c] cursor-pointer`,
  image: `rounded-xl md:w-2/5 p-4 md:p-0 rounded-[3rem] mt-10 md:mt-0`,
  infoContainer: `h-20 bg-[#313338] p-4 rounded-b-lg flex items-center text-white w-full max-w-full`,
  author: `flex flex-col justify-center ml-4`,
  name: ``,
  accentedButton: `relative text-lg font-semibold px-12 py-4 bg-[#2181e2] rounded-lg mr-5 text-white hover:bg-[#42a0ff] cursor-pointer`,
  ctaContainer: `flex`
};

const SecondSection = () => {
  return (
    <div className={style.container}>
      <div className={style.contentWrapper}>
        <div className={style.copyContainer}>
          <div className={style.title}>
            Access to royalty-generating intellectual property. 
          </div>
          <div className={style.description}>
            More than 2,000 deals completed on Royalty Exchange and new assets added each week.
          </div>
          <div className={style.ctaContainer}>
          <Link className="styled-link"  href="/collection">        
            <Button className={style.accentedButton} variant="ghost">
              Explore
            </Button>
          </Link>
          </div>
        </div>
        <div className={style.image}>
          <img className="rounded-t-lg w-full max-w-full"
            src="https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647" 
            alt=""
          />
          <div className={style.infoContainer}>
            <MyAvatar />           
            <div className={style.author}>
              <div className={style.name}> Lover</div>
              <Link href="/" className='text-[#1868b7]'>
                Taylor Swift
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SecondSection;
