import React from 'react'

export const fetchFromIPFS = async (cid: string) => {
  try {
    const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error fetching from IPFS:", error);
  }
};

export const  fetchImage = (url_image : string) => {
  if (url_image) {
    const cid = url_image.split("/").pop();
    const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
    return url;
  }
  return     "/images/nfts/White.jpg"    ; // Fallback image
};





