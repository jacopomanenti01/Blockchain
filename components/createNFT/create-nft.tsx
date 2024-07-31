"use client"; // Aggiungi questa riga all'inizio del file

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Container from "../container/Container";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

function Mint() {
  const [file, setFile] = useState<File>();
  const [songs, setSongs] = useState<string[]>([""]);

  const addSong = () => {
    setSongs([...songs, ""]);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const name = form.elements.namedItem('name') as HTMLInputElement;
    const description = form.elements.namedItem('description') as HTMLInputElement;
    const genere = form.elements.namedItem('genere') as HTMLInputElement;
    const royalty = form.elements.namedItem('royalty') as HTMLInputElement;

    if (!file) return; // No file added

    const data = new FormData(); // Create new form data
    data.set("file", file); // Set the file selected
    data.set("name", name.value); // Set the name value
    data.set("description", description.value); // Set the description value
    data.set("genere", genere.value); // Set the genere value

    songs.forEach((_, index) => {
      const song = form.elements.namedItem(`song-${index + 1}`) as HTMLInputElement;
      data.set(`song-${index + 1}`, song.value); // Set the song values
    });

    data.set("royalty", royalty.value); // Set the royalty value

    fetch("/api/upload", { // Fetch request
      method: "POST",
      body: data,
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(text);
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log(data); // Log the response for debugging
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <Container>
      <form onSubmit={onSubmit} className="bg-white border border-slate-200 dark:border-slate-500 rounded p-6 mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Item</CardTitle>
          <CardDescription>Upload your image, add a title and description, and customize your NFT.</CardDescription>
        </CardHeader>
        <div className="grid gap-2">
          <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-muted p-8">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">
                JPG, PNG, SVG. Max 100MB.
              </p>
              <p className="mb-6">
                <input
                  id="image"
                  className="block w-full border-slate-400 rounded focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  type="file"
                  name="image"
                  onChange={(e) => setFile(e.target.files?.[0])}
                  required
                />
              </p>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" type="text" required />
        </div>
        <div className="mb-6">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={3} required />
        </div>
        <div className="mb-6">
          <Label htmlFor="genere">Genere</Label>
          <Input id="genere" name="genere" type="text" required />
        </div>
        <div className="mb-6">
          <Label htmlFor="songs">Songs</Label>
          <div className="grid gap-2">
            {songs.map((_, index) => (
              <Input key={index} id={`song-${index + 1}`} name={`song-${index + 1}`} placeholder={`Song ${index + 1}`} />
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" className="mt-4" onClick={addSong}>
            Add Song
          </Button>
        </div>
        <div className="mb-6">
          <Label htmlFor="royalty">Royalty</Label>
          <div className="flex items-center gap-2">
            <Input id="royalty" name="royalty" type="number" min="0" max="100" placeholder="10" />
            <span>%</span>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Upload</button>
      </form>
    </Container>
  );
}

export default Mint;
