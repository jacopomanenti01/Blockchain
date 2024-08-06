"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Step2 = () => {
	const form = useFormContext();
	return (
		<Card className="border-none">
			<CardHeader className="pl-0">
				<CardTitle>Create your NFT Album</CardTitle>
				<CardDescription></CardDescription>
			</CardHeader>
		<FormField
			control={form.control}
			name="title"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Title</FormLabel>
					<FormControl>
						<Input placeholder="Dark side of the moon, ..." {...field} />
					</FormControl>
					<FormDescription>Add the title of the album</FormDescription>
					<FormMessage />
				</FormItem>
			)}
		/>
		<FormField
			control={form.control}
			name="year"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Year</FormLabel>
					<FormControl>
						<Input placeholder="1973" {...field} />
					</FormControl>
					<FormDescription>Add a valid year when the album was issued</FormDescription>
					<FormMessage />
				</FormItem>
			)}
		/>
		<FormField
			control={form.control}
			name="song"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Add songs</FormLabel>
					<FormControl>
						<Input placeholder="Time, Money, ..." {...field} />
					</FormControl>
					<FormDescription>Add all the songs of the album</FormDescription>
					<FormMessage />
				</FormItem>
			)}
		/>
		<FormField
			control={form.control}
			name="singerId"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Select the related singer</FormLabel>
					<FormControl>
						<Input placeholder="Pink floyd, ..." {...field} />
					</FormControl>
					<FormDescription>Select the related artist</FormDescription>
					<FormMessage />
				</FormItem>
			)}
		/>
		<FormField
			control={form.control}
			name="shareCount"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Royalties</FormLabel>
					<FormControl>
						<Input placeholder="30%, ..." {...field} />
					</FormControl>
					<FormDescription>Add a valid number</FormDescription>
					<FormMessage />
				</FormItem>
			)}
		/>
		</Card>
	);
};

export default Step2;