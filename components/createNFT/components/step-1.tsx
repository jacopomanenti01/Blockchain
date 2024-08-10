"use client";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

const Step1 = () => {
    const { control } = useFormContext();

    return (
        <Card className="border-none">
            <CardHeader className="pl-0">
                <CardTitle>Create your artist</CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>

            <FormField
                control={control}
                name="stageName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Artist&apos;s Name</FormLabel> {/* Escaped the apostrophe */}
                        <FormControl>
                            <Input placeholder="Katy Perry, Kanye West..." {...field} />
                        </FormControl>
                        <FormDescription>Add the Art Name of the Artist</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Input placeholder="Katy Perry is one of the most famous..." {...field} />
                        </FormControl>
                        <FormDescription>Add a short description about the artist</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="genre"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Genre</FormLabel> {/* Corrected the typo */}
                        <FormControl>
                            <Input placeholder="Pop, Rap, ..." {...field} />
                        </FormControl>
                        <FormDescription>Add the genre of the artist</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </Card>
    );
};

export default Step1;
