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

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
  

  export const nft = z.object({
    // singer
    stageName: z.string({
        message: "please enter the artist stage's name"
    }).min(1, {
        message: "please enter a name"
    }),
    description: z.string({
        message: "please enter a short description of the artist"
    }).min(10, 
        {
            message: "please write at least 10 characters :/"
        }
    ),
    genre: z.string({
        message: "please enter the artist genre (eg. trap-shit, rap, cumbia, ...)"
    }).min(1, 
        {
            message: "please enter a genre"
        }),
    image: z
        .any()
        .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
          "Only .jpg, .jpeg, .png formats are supported."
        ) ,
    shareCount: z.coerce.number() // Force it to be a number
    .int() // Make sure it's an integer
    ,
    singerId: z.coerce.number().int(),
    //metadataUrl: z.array(z.string({
    //   message: "please enter the artist stage's name"
    //}).min(1, {
    //  message: "please enter a name"}))
    
    
  })