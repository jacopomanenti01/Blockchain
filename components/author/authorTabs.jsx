"use client"
import React, { useState } from "react";
import Image from "next/image";
import { TiArrowSortedDown, TiArrowSortedUp, TiTick } from "react-icons/ti";

//INTERNAL IMPORT
import Style from "./authorTabs.module.css";

const AuthorTaps = ({
  setCollectiables,
  setCreated,
  setAuction,
  
}) => {
  const [openList, setOpenList] = useState(false);
  const [activeBtn, setActiveBtn] = useState(1);
  const [selectedMenu, setSelectedMenu] = useState("Most Recent");


 

  const openTab = (e) => {
    const btnText = e.target.innerText;
    console.log(btnText);
    if (btnText == "Listed") {
      setCollectiables(true);
      setCreated(false);
      setAuction(false);
      setActiveBtn(1);
    } else if (btnText == "Owned") {
      setCollectiables(false);
      setCreated(true);
      setAuction(false);
      setActiveBtn(2);
    } 
    else if (btnText == "Auction") {
      setCollectiables(false);
      setCreated(false);
      setAuction(true);
      setActiveBtn(3);
    } 
  };

  return (
    <div className={Style.AuthorTaps}>
      <div className={Style.AuthorTaps_box}>
        <div className={Style.AuthorTaps_box_left}>
          <div className={Style.AuthorTaps_box_left_btn}>
            <button
              className={`${activeBtn == 1 ? Style.active : ""}`}
              onClick={(e) => openTab(e)}
            >
              Listed
            </button>
            <button
              className={`${activeBtn == 2 ? Style.active : ""}`}
              onClick={(e) => openTab(e)}
            >
              Owned
            </button>
            <button
              className={`${activeBtn == 3 ? Style.active : ""}`}
              onClick={(e) => openTab(e)}
            >
              Auction
            </button>
            
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default AuthorTaps;