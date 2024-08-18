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
        }),
    initialFee: z.coerce.number() 
    .int() 
    
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


  // Form for selling NFTs

  export const sell = z.object({
    
    amount: z.coerce.number({
        
        required_error: "amount is required",
        invalid_type_error: "amount must be a number"
    }) 
    .int().gte(1,{
        message: "please enter at leat 1 share",
    }),
    price: z.number().multipleOf(0.000001),
    paymentToken: z.string({
        message: "please enter a valid address",
        required_error: "paymentToken is required",
        invalid_type_error: "paymentToken must be a string"
    }).length(42, 
        {
            message: "etherum address are 42 long"
        }),
    
    
  })


   // Form for putting on actuion NFTs

  

   export const auction = z.object({
    
    amount: z.coerce.number({
        
        required_error: "amount is required",
        invalid_type_error: "amount must be a number"
    }) 
    .int().gte(1,{
        message: "please enter at leat 1 share",
    }),
    basePrice: z.coerce.number({
        
        required_error: "basePrice is required",
        invalid_type_error: "basePrice must be a number"
    }) 
    .int().gte(1,{
        message: "please set the basePrice at least at 1 MATIC",
    }),
    minIncrement: z.coerce.number({
        
        required_error: "minIncrement is required",
        invalid_type_error: "minIncrement must be a number"
    }) 
    .int().gte(1,{
        message: "please set the minIncrement at least at 1 MATIC",
    }),
    deadline: z.date({
        required_error: "A deadline is required.",
      }),
    paymentToken: z.string({
        message: "please enter a valid address",
        required_error: "paymentToken is required",
        invalid_type_error: "paymentToken must be a string"
    }).length(42, 
        {
            message: "etherum address are 42 long"
        }),
    
    
  })

  // remove order

  export const removeOrder = z.object({
    
    id: z.coerce.number({
        required_error: "id is required",
        invalid_type_error: "id must be a number"
    }) 
    .int()
    
  })

