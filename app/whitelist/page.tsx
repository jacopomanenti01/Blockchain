'use client'
import React, { useState } from 'react'
import Navbar from "@/components/navbar/page";
import HouseRecord from "@/components/houseRecord/HouseRecord"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"

import {deploy} from "../schema/deploy"
import { useForm } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {z} from "zod"
import { ethers, providers, Signer } from 'ethers';
import {abi as FactoryAbi} from "../../contracts/out/NFTFactory.sol/NFTFactory.json"





function page() {

  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(deploy),
    defaultValues:{
      recordName: "",
      recordAddress:"",
      recordTreasury:"",
    }
  })

  const onSubmit = (data: z.infer<typeof deploy>)=>{
    setLoading(true)
    const provider = new providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract("0x995AC5Be6Fff1ffB0707147090642041e06d6928", FactoryAbi, signer);

    async function prova(){
      try{
      const tx = await contract.deployNFT(data.recordName,data.recordAddress,data.recordTreasury)
      await tx.wait()
      console.log(tx.hash)
      setLoading(false)
      }catch{
        alert("nuuuuuuu")
        setLoading(false)
      }
    }
    prova()

  }


  return (
    <div>
        <Navbar/>
        <div className='h-screen flex items-center justify-center'>
        <HouseRecord  label = "go back :(" title="Register" backButtonHrf="./">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="spacce-y-6">
            <div className='space-y-4'>
                <FormField

                control={form.control}
                name="recordName"
                render={({field})=>(
                    <FormItem>
                      <FormLabel>recordName</FormLabel>
                      <FormControl>
                        <Input {...field} type="recordName" placeholder='SuperMusic'/>
                      </FormControl>
                      <FormMessage />

                    
                    </FormItem>
                )}
                
                />
                <FormField

                control={form.control}
                name="recordAddress"
                render={({field})=>(
                    <FormItem>
                      <FormLabel>recordAddress</FormLabel>
                      <FormControl>
                        <Input {...field} type="recordAddress" placeholder='0x'/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                )}
                
                />
                <FormField

                control={form.control}
                name="recordTreasury"
                render={({field})=>(
                    <FormItem>
                      <FormLabel>recordTreasury</FormLabel>
                      <FormControl>
                        <Input {...field} type="recordTreasury" placeholder='0x'/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                )}
                
                />
                
            </div>
            <div className='my-2'>
            <Button type="submit" className="w-full" >
              { loading ? "sending" : "send"
            }
            </Button>
            </div>

          </form>
        </Form>
        </HouseRecord> 
        </div>
    </div>
  )
}

export default page