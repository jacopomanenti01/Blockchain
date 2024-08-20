/** 
'use client'
import React, { useState,useContext, useEffect } from 'react'
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
import { useForm } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {z} from "zod"
import { useRouter } from "next/navigation";


import {removeOrder} from "@/backend/schema/deploy"
import {Context} from "./RemoveButton"
import {OrderContext} from "./NFTcardOwned"
import {Web3DataContext} from "@/app/author/page"
import { abi as GenericERC20  } from "@/contracts/out/GenericERC20.sol/GenericERC20.json";
import { ethers} from 'ethers';

  








function SellForm() {

  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useContext(Context)
  const {signer, provider, marketplace,addressRecord, contractRecord, address, handleTransactionSuccess} = useContext(Web3DataContext)
  const {tokenID, balance, ids} = useContext(OrderContext)


  useEffect(()=>{console.log(ids)})

  const form = useForm({
    resolver: zodResolver(removeOrder),
    defaultValues:{
      id:0,
    }
  })

  const onSubmit = async (data: z.infer<typeof removeOrder>)=>{

    setLoading(true)
    setOpen(false)
    if(contractRecord && address && marketplace){
      try{
        const tx = await marketplace.cancel( data.id  )
        await tx.wait()
        console.log(tx.hash)
        location.reload();

      }catch(e){
        console.log(e)
      }
    }else{
      alert("please log to metamask")
    }

    }
  

  return (
    <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="spacce-y-6">
            <div className='space-y-4'>
  
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Id Order</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}  // Convert the selected value back to a number
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an ID" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ids.map((id, index) => (
                        <SelectItem key={index} value={id.toString()}>  
                          {id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
    </div>
  )
}

export default SellForm

*/