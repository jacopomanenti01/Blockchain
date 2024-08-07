import Navbar from "@/components/navbar/page";
import MultiStepCampaign from "./components/multi-step-campaign";

const Campaign = () => {
	return (

		<div className="flex flex-col w-full min-h-screen items-center justify-center">
      <Navbar/>
			<MultiStepCampaign />
		</div>
	);
};

export default Campaign;