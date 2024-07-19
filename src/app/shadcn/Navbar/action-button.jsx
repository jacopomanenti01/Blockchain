
import { Button } from "@/components/ui/button";

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
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger>
                    <AlignJustify />
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetDescription>
                            <div className="flex flex-col space-y-4 items-start w-full text-lg text-black mt-10">
                                <Link
                                href="/"
                                >
                                    Sign in 
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
            <div className="hidden sm:visible">
                <Button className="text-md" variant="ghost">
                    prova
                </Button>

            </div>


            
 

    </div> 
    );
}
 
export default ActionButtons;