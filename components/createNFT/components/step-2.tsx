"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
  } from "@/components/ui/select"
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {abi as NFTFactoryAbi} from "@/contracts/out/NFTFactory.sol/NFTFactory.json"
import {abi as NFTAbi} from "@/contracts/out/NFT.sol/NFT.json"
import { ethers, providers, Signer } from 'ethers';
import { useAccount } from 'wagmi';



const Step2 = () => {
	const [files, setFiles] = useState<File[]>([])
	const { address, isConnected } = useAccount();


	const handleUpload = async () => {
		if (files.length) {
		  console.log(files);
		  let CID = "";
	
		  try {
			const formData = new FormData();
			formData.append("file", files[0]); // Append the first file
	
			const res = await fetch("/api/images", {
			  method: "POST",
			  body: formData,
			});
	
			if (!res.ok) {
			  throw new Error('Failed to upload file');
			}
	
			const resData = await res.json();
			CID = resData.IpfsHash;
			console.log(CID)
			return CID
		  } catch (e) {
			console.log(e);
			alert("Trouble uploading file");
		  }
		}
	  }
	

	const [totalSingers, setTotalSingers] = useState<string[]>([])
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop: (acceptedFiles) => setFiles(acceptedFiles),
		maxSize: 1024 * 1000,

	  })


	useEffect(()=>{
		
		const init = async () => {
			try {
			  
			  const web3prov = new providers.Web3Provider(window.ethereum);
			  const web3signer = web3prov.getSigner();
			  const web3contract = new ethers.Contract(process.env.NEXT_PUBLIC_NFT_FACTORY_ADDRESS || "", NFTFactoryAbi, web3signer)
			  const record_address = await web3contract.associatedNFT(address);
			  const record_contract = new ethers.Contract(record_address, NFTAbi, web3signer)
			  
			  const end = await record_contract.singerIdCounter();
			  const end_format = parseInt(end.toString(), 10);
			  const singerArray = await record_contract.getSingers(0,end_format)	
			  const firstElements = singerArray.map((subArray: string[])=> subArray[0]);
    		  setTotalSingers(firstElements);

			} catch (error) {
			  console.error("Error interacting with the contract", error);
			}
		  };
		
		  init();
		}
	  , [])
	
	  

	const form = useFormContext();
	return (
		<Card className="border-none">
			<CardHeader className="pl-0">
				<CardTitle>Create your NFT Album</CardTitle>
				<CardDescription></CardDescription>
			</CardHeader>
			<FormField
        control={form.control}
        name="url_image"
        render={({field}) => (
			<>
            <div {...getRootProps()} className="flex flex-col items-center justify-center gap-4 border-dashed border-2 border-gray-300 p-4 w-full">
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag & drop files here, or click to select files</p>
              )}
            </div>
            <Button
              type="button"
              className="border border-black bg-blue-500 text-white p-2 mt-2"
              onClick={async () => {
				const CID = await handleUpload();
				const url_image = `https://blush-active-cephalopod-524.mypinata.cloud/ipfs/${CID}`
				if (url_image) {
				  field.onChange(url_image);
				}
			  }}
            >
              Upload
            </Button>
          </>
        )}
      />
		
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
		<Card className="border border-black p-4">
		<CardHeader className="pl-0">
				<CardTitle>Add songs to the album</CardTitle>
				<CardDescription></CardDescription>
			</CardHeader>

		<FormField
        control={form.control}
        name="song"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Add Songs</FormLabel>
            {field.value.map((songTitle: string, index: number) => (
                <div key={index} className="mb-2">
                <Input
                  placeholder="Song title"
                  value={songTitle}
                  onChange={(e) => {
                    const newSongs = [...field.value];
                    newSongs[index] = e.target.value;
                    field.onChange(newSongs);
                  }}
				  className="mb-1"
                />
                {field.value.length > 1 && (
                  <button type="button"
				  className="text-xs bg-orange-500 text-black-500 p-1 " 
				  onClick={() => {
                    const newSongs = field.value.filter((_ : any, i: any) => i !== index);
                    field.onChange(newSongs);
                  }}>
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button"
			className="border border-black bg-blue-500 text-white p-2 mt-2"
			 onClick={() => field.onChange([...field.value, ""])}>
              Add Song
            </button>			
            <FormDescription>Add all the songs of the album</FormDescription>
          </FormItem>
        )}
      />
	</Card>

		<FormField
          control={form.control}
          name="singerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Singer</FormLabel>
              <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select one of the artists that you have registered" />
                  </SelectTrigger>
                </FormControl>
				<SelectContent>
                {totalSingers.map((singer, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {singer}
                  </SelectItem>
                ))}
              </SelectContent>
              </Select>
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