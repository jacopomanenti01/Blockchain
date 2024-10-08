
import { Button } from "@/components/ui/button";
import { IoWalletOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
  
  import { AlignJustify } from "lucide-react";

  import Link from "next/link";


const ActionButtons = () => {
    return ( 
    <div>
        <div className="md:hidden inline-flex space-x-4">
            <div className="inline-flex items-center border-0 bg-inherit text-[70%] bg-[#d1cfcf] md:max-w-xs lg:max-w-sm">
                <ConnectButton/>
            </div>
            <Sheet>
                <SheetTrigger>
                    <AlignJustify />
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetDescription>
                            <div className="flex flex-col space-y-4 items-start w-full text-lg text-black mt-10">
                                <Link className="styled-link"
                                href="/"
                                >
                                    Listing 
                                </Link>
                                <Link
                                href="/"
                                >
                                   Get Started
                                </Link>
                                <Link
                                href="/"
                                >
                                    Pricing
                                </Link>
                                <Link
                                href="/"
                                >
                                    Contact
                                </Link>
                                <Link
                                href="/"
                                >
                                   About
                                </Link>
                           
                       
                            </div>
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
            </div>


            <div className="hidden md:flex md:space-x-4">
                <div className="inline-flex items-center border-0 bg-inherit text-[70%] bg-[#d1cfcf] md:max-w-xs lg:max-w-sm">
                <ConnectButton/>
                </div>
                
                <Link href="/author">
                <Button
                className="text-md bg-blue-500">
                    <CgProfile className="text-3xl" />
                </Button>
                </Link>

            </div>
 

    </div> 
    );
}
 
export default ActionButtons;