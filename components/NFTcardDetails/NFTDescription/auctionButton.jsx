import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose 
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import {z} from "zod"
import {bid} from "@/backend/schema/deploy"
import { useForm } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { ethers} from 'ethers';



import React, {useState} from 'react'

export const Context = React.createContext()
  
  function AuctionButton({onClick, basePrice}) {
    const [open, setOpen] = useState(false);

    const form = useForm({
      resolver: zodResolver(bid),
      defaultValues:{
        price:0,
      }
    })

    // chiamare la funzione nft.isApprovedForAll(marketplace address

    const onSubmit = async (data) => {
      try {
        console.log(data);
        onClick(data.price);
        setOpen(false);
      } catch (error) {
        console.error("Error during form submission:", error);
      }
    };


    return (
       <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="px-9 py-3 text-lg font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600">
            Make an offer
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Fill to bid</DialogTitle>
            <DialogDescription>
              Set a higher bid than the current one and {ethers.utils.formatUnits(basePrice,18)+ 'ETH'} to make a valid bid.
            </DialogDescription>
          </DialogHeader>
          <Context.Provider value={[open, setOpen]}>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className='space-y-4'>
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bid (ETH)</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" step="any" min="0" placeholder="0.0001" onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='my-2'>
                      <Button type="submit" className="w-full">
                        Send
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </Context.Provider>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
        )
  }
  
  export default AuctionButton




