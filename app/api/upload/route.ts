const API_KEY = "b4e85c943d48b915406f"
const API_KEY_SECRET = "9a180608ba21e3c6de80d36a06ac98ecde4df041bb4bc16922ee937a4a8e9576";
const pinataSDK = require('@pinata/sdk');
const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjZjk5ODQzNC1mOWIxLTRlNzEtOTZkNy00Njk0MTdiODA4YTMiLCJlbWFpbCI6ImphY29wb21hbmVudGkwMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYjRlODVjOTQzZDQ4YjkxNTQwNmYiLCJzY29wZWRLZXlTZWNyZXQiOiI5YTE4MDYwOGJhMjFlM2M2ZGU4MGQzNmEwNmFjOThlY2RlNGRmMDQxYmI0YmMxNjkyMmVlOTM3YTRhOGU5NTc2IiwiZXhwIjoxNzU0MTQ2ODYyfQ.4uEscG1GPQVa34Z0VoMvQT5mXDwV8F2wtckfIMpVWfo'; // Sostituisci con il tuo JWT

export async function POST(request: Request){
    
    try {

        const data = await request.formData();

        const file: File | null = data.get("file") as unknown as File;

        data.append("file", file);

        data.append("pinataMetadata", JSON.stringify({ name: "File to upload" }));

        // fetch
        const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${JWT}`,
          },
          body: data,
        });
        const { IpfsHash } = await res.json();
        console.log(IpfsHash);
    
        return NextResponse.json(
            { IpfsHash }, { status: 200 }
        );
        } catch (e) 
        {
        console.log(e);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
      }
}
