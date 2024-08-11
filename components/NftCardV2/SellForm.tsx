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


import {sell} from "@/backend/schema/deploy"
import {Context} from "./SellButton"







function SellForm() {

  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useContext(Context)
 


  const form = useForm({
    resolver: zodResolver(sell),
    defaultValues:{
        tokenID: 0,
        collection:"",
        amount:0,
      price:0,
      paymentToken:""
    }
  })

  const onSubmit = async (data: z.infer<typeof sell>)=>{
     //tokenID
    //collection

    setLoading(true)
    setOpen(false)
    console.log(data)
    
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
                      <FormControl>
                        <Input {...field} type="amount" placeholder='1'/>
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
                      <FormLabel>price</FormLabel>
                      <FormControl>
                        <Input {...field} type="price" placeholder='1'/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                )}
                
                />  
                <FormField

                control={form.control}
                name="paymentToken"
                render={({field})=>(
                    <FormItem>
                      <FormLabel>paymentToken</FormLabel>
                      <FormControl>
                        <Input {...field} type="paymentToken" placeholder='0x'/>
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
    </div>
  )
}

export default SellForm