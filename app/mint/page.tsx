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

import {nft} from "@/backend/schema/deploy"
import { useForm } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {z} from "zod"
import { ethers, providers, Signer } from 'ethers';
import {abi as FactoryAbi} from "../../contracts/out/NFTFactory.sol/NFTFactory.json"
import UploadFile from "@/components/createNFT/DropZone"
import FileUploader from "@/components/createNFT/fun1"

function page() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(nft),
    defaultValues:{
      stageName: "",
      description:"",
      genre:"",
      image: null,
      shareCount:0,
      singerId: 0,
      //metadataUrl:[]
    }
  })

  const onSubmit = (data: z.infer<typeof nft> )=>{
    //const provider = new providers.Web3Provider(window.ethereum)
    //const signer = provider.getSigner()
    //const contract = new ethers.Contract("0x995AC5Be6Fff1ffB0707147090642041e06d6928", FactoryAbi, signer);
    //console.log(data)
    //FileUploader(file)
    console.log(data)
  }

  const handleFileSet = (acceptedFiles:any) => {
    console.log("logging drop/selected file", acceptedFiles);
    setFile(acceptedFiles[0]);
  };


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
            name="image"
            render={({field})=>(
              <FormControl>
              <UploadFile onDrop={handleFileSet} file={file}/>
              </FormControl>
            )}
            />

                <FormField

                control={form.control}
                name="stageName"
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
                name="description"
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
                name="genre"
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
                name="shareCount"
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
                name="singerId"
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
                {/** 
                <FormField

                control={form.control}
                name="metadataUrl"
                render={({field})=>(
                    <FormItem>
                      <FormLabel>recordTreasury</FormLabel>
                      <FormControl>
                        <Input {...field} type="recordTreasury" placeholder='0x'/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                )}
                
                />*/}
                
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