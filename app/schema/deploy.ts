import * as z from "zod"

export const deploy = z.object({
    recordName: z.string({
        message: "please enter the Music Record's name"
    }).min(1, {
        message: "please enter your name"
    }),
    recordAddress: z.string({
        message: "please enter the Music Record's wallet address"
    }).length(42, 
        {
            message: "etherum address are 42 long"
        }
    ),
    recordTreasury: z.string({
        message: "please enter the Music Treasury's wallet address"
    }).length(42, 
        {
            message: "etherum address are 42 long"
        })
    
  })
