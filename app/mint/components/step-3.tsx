"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


const Step3 = () => {
	return (
		<Card className="border-none">
			<CardHeader className="pl-0">
				<CardTitle>That is the end</CardTitle>
				<CardDescription>Click on "Mint" button to mint your NFT album.</CardDescription>
		</CardHeader>
		</Card>
			);
};

export default Step3;