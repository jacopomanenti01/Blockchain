"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import MultiStepForm from "@/components/ui/extension/multi-step-form";
import MultiStepNavButtons from "@/components/ui/extension/multi-step-nav-buttons";
import MultiStepNavbar from "@/components/ui/extension/multi-step-navbar";
import { containerCampaignForm as container } from "./framer-motion";
import { useMultiStepForm } from "./multi-step-form";
import { motion } from "framer-motion";
import { CampaignFormContext } from "./multi-step-campaign-config";
import { useEffect, useState } from "react";
import {abi as NFTAbi} from "@/contracts/out/NFT.sol/NFT.json"
import { ethers, providers, Signer } from 'ethers';



const CampaignForm = () => {
	const { CurrentForm, currentStep, form } = useMultiStepForm(CampaignFormContext);
	const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
    const [contract, setContract] = useState<ethers.Contract | null>(null);


	useEffect(()=>{
		const web3prov = new providers.Web3Provider(window.ethereum)
		const web3signer = web3prov.getSigner()
		const web3contract = new ethers.Contract("0x243d7046ADd1354e40284e306D5268a80Cba868e", NFTAbi, web3signer)
		setProvider(web3prov)
		setSigner(web3signer)
		setContract(web3contract)
	  },[])


	const handleNext = async () => {
		if (currentStep === 0) {
			const formData = form.getValues();
			if(contract){
				try{
					const tx = await contract.createSinger(formData.stageName,formData.description,formData.genre, "htttps://" )
					await tx.wait()
					console.log(tx.hash)
				}catch(err){
					console.log(err)
				}
		}
			;
		}
		form.trigger(); // Trigger validation before moving to the next step
	};

	return (
		<MultiStepForm title="NFT" description="Mint your NFT album">
			<MultiStepNavbar context={CampaignFormContext} />
			<div className="flex flex-col flex-1 border p-2 min-w-fit">
				<motion.div variants={container} className="flex flex-col gap-2" initial="hidden" animate="visible" exit="exit">
					<CurrentForm />
				</motion.div>
				<MultiStepNavButtons
					context={CampaignFormContext}
					previousLabel="Previous"
					nextLabel="Next"
					endStepLabel="Mint"
					onNext={handleNext}
				/>
			</div>
		</MultiStepForm>
	);
};

export default CampaignForm;
