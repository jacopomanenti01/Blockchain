import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SellForm from "./SellForm"
import AuctionForm from "./AuctionForm"
import React, { useState, useEffect } from 'react'

function FormHandler({setter}) {
  const [selling, setSelling] = useState(false)
  const [putting, setPutting] = useState(false)

  useEffect(() => {
    if (selling || putting) {
      setter(true);
    } else{
      setter(false);
    }
  }, [selling, putting]);

  return (
    <div>
        <Tabs defaultValue="Sell" className="w-[400px]">
            <TabsList>
                <TabsTrigger value="Sell">{selling == true ? "Selling":"Sell"}</TabsTrigger>
                <TabsTrigger value="Auction">{putting == true ? "Putting":"Auction"}</TabsTrigger>
            </TabsList>
            <TabsContent value="Auction">
                <AuctionForm setter = {setPutting}/>
                </TabsContent>
                <TabsContent value="Sell">
                  <SellForm setter = {setSelling}/>
                </TabsContent>
                
        </Tabs>
  </div>
  )
}

export default FormHandler