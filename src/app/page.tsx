"use client"

import Image from "next/image";
import MyAccordion from "./shadcn/myAccordion";
import MyAlert from "./shadcn/myAlert";
import { useSearchParams } from "next/navigation";
import MyAlertDialog from "./shadcn/myAlertDialog";
import MyButton from "./shadcn/myButton";
import MyAscpetRatio from "./shadcn/myAscpetRatio";
import MyAvatar from "./shadcn/myAvatar";
import MyCollapsible from "./shadcn/myCollapsible";

function Page() {
  const Params = useSearchParams()
  const balance = Params.get("balance")
  return (
    <div className="w-80">
      {
        balance == '0' ?  <MyAlert /> : ""
      }
      <MyAccordion />
      <MyButton main ={<MyAlertDialog trigger = "prova" title= "prova" content= {<MyAccordion />}  /> } />
      <MyAscpetRatio />
      <MyAvatar />
      <MyCollapsible />
    </div>
  );
}

export default Page
