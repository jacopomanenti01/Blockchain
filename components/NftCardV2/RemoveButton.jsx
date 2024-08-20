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
import { Button } from "../ui/button";

import React, {useState} from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy } from "lucide-react"
import RemoveForm from "./RemoveForm"

export const Context = React.createContext()
  
  function RemoveButton() {
    const [open, setOpen] = useState(false);

    // chiamare la funzione nft.isApprovedForAll(marketplace address

    return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
              <Button className="px-9 py-3 text-lg font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                remove
              </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          {/** Header */}
          <DialogHeader>
            <DialogTitle>Remove your NFT from Marketplace</DialogTitle>

            <DialogDescription>
              Fill the form to remove your album from  Marketplace.
            </DialogDescription>
          </DialogHeader>

          {/** body*/}
          <Context.Provider value = {[open, setOpen]}>
          <div className="flex items-center space-x-2">


            <div className="grid flex-1 gap-2">
              <RemoveForm/>
  
              


            </div>


           


          </div>
          </Context.Provider>

          {/**close*/}
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
  
  export default RemoveButton




