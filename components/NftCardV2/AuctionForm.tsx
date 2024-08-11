'use client'
import React, { useState, useContext } from 'react'
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"

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



import {auction} from "@/backend/schema/deploy"
import {Context} from "./SellButton"







function AuctionForm() {


  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useContext(Context)



  const form = useForm({
    resolver: zodResolver(auction),
    defaultValues:{

        amount:0,
        basePrice:0,
      paymentToken:"",
      minIncrement:0,
      deadline: new Date("2999-01-01T00:00:00Z")

    }
  })

  const onSubmit = async (data: z.infer<typeof auction>)=>{
    //tokenID
    //collection
    
    setLoading(true)
    setOpen(false)
    console.log(data)
    toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      })
    
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
                name="basePrice"
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
                <FormField

                control={form.control}
                name="minIncrement"
                render={({field})=>(
                    <FormItem>
                      <FormLabel>minIncrement</FormLabel>
                      <FormControl>
                        <Input {...field} type="minIncrement" placeholder='1'/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                )}
                
                /> 
                <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>deadline</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Your date of birth is used to calculate your age.
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

export default AuctionForm