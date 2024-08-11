const API_KEY = "b4e85c943d48b915406f"
const API_KEY_SECRET = "9a180608ba21e3c6de80d36a06ac98ecde4df041bb4bc16922ee937a4a8e9576";
const pinataSDK = require('@pinata/sdk');
const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjZjk5ODQzNC1mOWIxLTRlNzEtOTZkNy00Njk0MTdiODA4YTMiLCJlbWFpbCI6ImphY29wb21hbmVudGkwMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYjRlODVjOTQzZDQ4YjkxNTQwNmYiLCJzY29wZWRLZXlTZWNyZXQiOiI5YTE4MDYwOGJhMjFlM2M2ZGU4MGQzNmEwNmFjOThlY2RlNGRmMDQxYmI0YmMxNjkyMmVlOTM3YTRhOGU5NTc2IiwiZXhwIjoxNzU0MTQ2ODYyfQ.4uEscG1GPQVa34Z0VoMvQT5mXDwV8F2wtckfIMpVWfo'; // Sostituisci con il tuo JWT
const PINATABASEURL = 'https://blush-active-cephalopod-524.mypinata.cloud/ipfs/'

import { NextResponse } from "next/server"
import { NextRequest } from 'next/server';

const pinata = new pinataSDK(API_KEY, API_KEY_SECRET);

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const cid = searchParams.get('cid');

    if (!cid) {
        return NextResponse.json({ error: "CID is required" }, { status: 400 });
    }

    try {
        // URL to access the file via Pinata
        const url = `${PINATABASEURL}${cid}`;

        // HTTP request to retrieve the file
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch data from IPFS: HTTP status ${response.status}`);
        }

        const data = await response.json();

        // Return the JSON data
        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to retrieve the file from IPFS" }, { status: 500 });
    }
}