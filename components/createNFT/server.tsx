
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Container from "../container/Container";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import {join} from 'path'

export function ServerMint() {
    async function upload(data: FormData){
        "use server"

        const file: File |null = data.get('file') as unknown as File 
    
        if (!file){
            return NextResponse.json({success: false})
        }
    
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
    
        const path = join('/', 'tmp', file.name)
        await writeFile(path, buffer)
        console.log(`open ${path} to see the upload file`)
    
        return NextResponse.json({success:true})
        
    }

  return (
    <Container>
      <h2 className="text-xl font-bold mb-4">Add a New Image</h2>
      <form action={upload} className="bg-white border border-slate-200 dark:border-slate-500 rounded p-6 mb-6">
        <p className="mb-6">
          <input
            id="image"
            className="block w-full border-slate-400 rounded focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            type="file"
            name="image"
            required
          />
        </p>
        <button type="submit" className="btn btn-primary">Upload</button>
      </form>
    </Container>
  );
}

export default ServerMint;
