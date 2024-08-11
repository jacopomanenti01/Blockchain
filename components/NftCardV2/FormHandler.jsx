import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SellForm from "./SellForm"
import AuctionForm from "./AuctionForm"

import React from 'react'

function FormHandler() {
  return (
    <div>
        <Tabs defaultValue="Sell" className="w-[400px]">
            <TabsList>
                <TabsTrigger value="Sell">Sell</TabsTrigger>
                <TabsTrigger value="Auction">Auction</TabsTrigger>
            </TabsList>
            <TabsContent value="Auction">
                <AuctionForm/>
                </TabsContent>
                <TabsContent value="Sell">
                  <SellForm/>
                </TabsContent>
                
        </Tabs>
  </div>
  )
}

export default FormHandler