'use client'
import React, { useState,useContext } from 'react'
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


import {sell} from "@/backend/schema/deploy"
import {Context} from "./SellButton"
import {TokenContext} from "./NFTcardTwo"
import { Web3DataContext } from '@/context/Web3DataContext'; // Update the path accordingly
import { abi as GenericERC20  } from "@/contracts/out/GenericERC20.sol/GenericERC20.json";
import { abi as NFTAbi } from "@/contracts/out/NFT.sol/NFT.json"
import { ethers} from 'ethers';










function SellForm({setter}:any) {

  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useContext(Context)
  const {signer, provider, marketplace,addressRecord, contractRecord, address} = useContext(Web3DataContext)
  const {tokenID, balance, creator} = useContext(TokenContext)
  const router = useRouter();

  



  const form = useForm({
    resolver: zodResolver(sell),
    defaultValues:{
      amount:0,
      price:0,
      paymentToken:""
    }
  })

  const onSubmit = async (data: z.infer<typeof sell>)=>{
     //tokenID
    //collection

    setLoading(true)
    setter(true)
    setOpen(false)
    console.log(data)
    

    let price_format;
    if(data.paymentToken == process.env.NEXT_PUBLIC_MATIC_ADDRESS ){
      price_format = ethers.utils.parseUnits(data.price.toString(), 18).toString();
 
    }else{
      if(signer){
      const ERC20 = new ethers.Contract(process.env.NEXT_PUBLIC_ERC20_ADDRESS || "", GenericERC20, signer);
      const decimals = await ERC20.decimals()
      price_format = ethers.utils.parseUnits(data.price.toString(), decimals).toString();
      console.log(price_format)
      }
    }

    let res;
    if(address&& creator && marketplace && signer ){
      const record_contract = new ethers.Contract(creator, NFTAbi, signer);
      console.log(record_contract)
      res = await record_contract.isApprovedForAll(address, process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS);
      console.log(res)
        if(!res){
          const tx = await record_contract.setApprovalForAll(process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS, true);
          await tx.wait()
          console.log(tx.hash)

          try{
            const tx = await marketplace.createOrder(creator,tokenID, data.amount, price_format, data.paymentToken  )
            await tx.wait()
            console.log(tx.hash)
            location.reload();
            setter(false)

          }catch(e){
            console.log(e)
            setter(false)
          }

        }else{
          try{
            const tx = await marketplace.createOrder(creator,tokenID, data.amount, price_format, data.paymentToken  )
            await tx.wait()
            console.log(tx.hash)
            location.reload();
            setter(false)

          }catch(e){
            console.log(e)
            setter(false)
          }
        }
    } else{
      alert("please log to metamask")
      setter(false)
    }
    }
  


  return (
    <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="spacce-y-6">
            <div className='space-y-4'>


                
                <FormField

                control={form.control}
                name="amount"
                render={({field})=>(
                    <FormItem>
                      <FormLabel>amount</FormLabel>
                      <FormDescription>
                        You can sell up to {balance} NFTs available.
                      </FormDescription>
                      <FormControl>
                        <Input {...field} type="number" placeholder='1'/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                )}
                
                />
              <FormField

                control={form.control}
                name="price"
                render={({field})=>(
                    <FormItem>
                      <FormLabel>price (eth)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="any"  min="0" placeholder="0.0001" onChange={(e) => field.onChange(parseFloat(e.target.value))}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                )}
                
                />  
                <FormField
                  control={form.control}
                  name="paymentToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Token</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Token" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0x0000000000000000000000000000000000000000">MATIC</SelectItem>
                          <SelectItem value="0x565Dc655Ab6729034116c214BF49862cF41aD7dB">Soldi del Monopoli</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        In order to send the transaction, select on of the available tokens.
                      </FormDescription>
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