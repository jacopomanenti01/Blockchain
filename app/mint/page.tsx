import Navbar from "@/components/navbar/page";
import MultiStepCampaign from "../../components/createNFT/components/multi-step-campaign";

const Campaign = () => {
	return (
		<div>
			<Navbar/>
		<div className="flex flex-col w-full min-h-screen items-center justify-center">
      
			<MultiStepCampaign />
		</div>
		</div>
	);
};

export default Campaign;