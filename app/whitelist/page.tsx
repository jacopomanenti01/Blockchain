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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {deploy} from "@/backend/schema/deploy"
import { useForm } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {z} from "zod"
import { ethers, providers} from 'ethers';
import {abi as FactoryAbi} from "@/contracts/out/NFTFactory.sol/NFTFactory.json"





function Page() {

  const [loading, setLoading] = useState(false)
  const [cid, setCid] = useState("");


  const form = useForm({
    resolver: zodResolver(deploy),
    defaultValues:{
      recordName: "",
      recordAddress:"",
      recordTreasury:"",
      initialFee:0,
    }
  })

  const onSubmit = async (data: z.infer<typeof deploy>)=>{
    
    setLoading(true)
    const provider = new providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_NFT_FACTORY_ADDRESS || "", FactoryAbi, signer);
      try{
      const tx = await contract.deployNFT(data.recordName,data.recordAddress,data.recordTreasury, data.initialFee)
      await tx.wait()
      console.log(tx.hash)
      setLoading(false)
      }catch{
        alert("nuuuuuuu")
        setLoading(false)
      }
    
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
              <FormField

                control={form.control}
                name="initialFee"
                render={({field})=>(
                    <FormItem>
                      <FormLabel>Initial Fee</FormLabel>
                      <FormControl>
                        <Input {...field} type="initialFee" placeholder='10'/>
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

export default Page