import type { Form, UseMultiStepFormTypeOptions } from "../../../app/types/multi-step-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import Step1 from "./step-1";
import Step2 from "./step-2";
import { ethers, providers, Signer } from 'ethers';
import buildMultiStepForm from "@/lib/multi-step-form/index";
import {abi as NFTFactoryAbi} from "@/contracts/out/NFTFactory.sol/NFTFactory.json"
import {abi as NFTAbi} from "@/contracts/out/NFT.sol/NFT.json"
import { useAccount } from 'wagmi';




//  1 - Define the full fields for the entire form
export const CampaignFormSchema = z.object({
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
	title: z.string({
			message: "please enter the title of the album (eg. dark side of the moon, ...)"
		}).min(1, 
			{
				message: "please enter a title"
			}),
	year: z.coerce.number({
		message: "please enter a valid year"
	}) // Force it to be a number
    .int() // Make sure it's an integer
    ,
	song: z.array(z.string().min(1, { message: "Please enter a valid song" })),

	shareCount: z.coerce.number() // Force it to be a number
    .int() // Make sure it's an integer
    ,
    singerId: z.coerce.number().int(),  
	url_image: z.string(),
});

//  2 - create the type
export type CampaignFormType = z.infer<typeof CampaignFormSchema>;

//  3 - Initial Data for fields
export const initialFormData: CampaignFormType = {
	stageName: "",
    description:"",
    genre:"",
	shareCount: 0,
	singerId:0,
	title: "",
	year: 0, 
	song: [""],
	url_image: ""
};



//  4 - Define the final end step submit function
const saveFormData: SubmitHandler<CampaignFormType> = async (values, address) => {
	console.log("Your custom save function");
	console.log(values);

	const web3prov = new providers.Web3Provider(window.ethereum)
	const web3signer = web3prov.getSigner()
	const web3contract = new ethers.Contract(process.env.NEXT_PUBLIC_NFT_FACTORY_ADDRESS || "", NFTFactoryAbi, web3signer)
	const record_address = await web3contract.associatedNFT(address);
	const record_contract = new ethers.Contract(record_address, NFTAbi, web3signer)	
	let CID = ""
	const percentage = ethers.utils.parseUnits(values.shareCount.toString(), 6).toString();


	try {
		const formData = new FormData();
		// Create blob dal JSON
		const jsonBlob = new Blob([JSON.stringify(values)], { type: 'application/json' });
		formData.append("file", jsonBlob, "file.json");  
		const res = await fetch("/api/upload", {
		  method: "POST",
		  body: formData,
		});

		const resData = await res.json();		
		CID = resData.IpfsHash;
	  } catch (e) {
		console.log(e);
		alert("Trouble uploading file");
	  } 
	  try{ 
		const tx = await record_contract.createAlbum(percentage, values.singerId, `https://blush-active-cephalopod-524.mypinata.cloud/ipfs/${CID}`)
		await tx.wait()
		console.log(tx.hash)
    } catch (e) {
      console.log(e);
      alert("Trouble uploading file");
    } 
	
};



//  5 - Define the steps and sub-forms and each field for step
export const forms: Form<CampaignFormType>[] = [
	{ id: 1, label: "Artist", form: Step1, fields: ["stageName", "description", "genre"] },
	{ id: 2, label: "Album", form: Step2, fields: ["title","year" , "song", "shareCount", "singerId"] },
];

//  6 - Define initial Form Options
const initialFormOptions: UseMultiStepFormTypeOptions<CampaignFormType> = {
	schema: CampaignFormSchema,
	currentStep: 0,
	setCurrentStep: (value) => {},
	forms,
	saveFormData,
	address: null,
};

// 7 - Build the Context and Provider
export const { FormContext: CampaignFormContext, FormProvider: CampaignProvider } = buildMultiStepForm(
	initialFormOptions,
	CampaignFormSchema,
	initialFormData,
);