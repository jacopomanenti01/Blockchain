import React from 'react';
import classNames from 'classnames'; // Aggiungi questa importazione per usare classNames
// import useSigner from ""
// import Mint, { CreationValues } from ""

import Mint from "./create-nft";

function MintComponent() { // Ho rinominato la funzione per rispettare la convenzione PascalCase
    const signer = true;
    // const {signer} = useSigner()
    // const onSubmit = async (values: CreationValues) => { console.log(values)}

    return (
        <div 
            className={classNames("flex h-full w-full flex-col", { // Ho corretto "flex-cole" in "flex-col"
                "items-center justify-center": !signer, // Ho corretto "item-center" in "items-center"
            })}
        >
            {
                signer ? <Mint /> : "connect your wallet"
                // ? <Mint onSubmit = {onSubmit} /> : "connect your wallet"
            }
        </div>
    );
}

export default MintComponent; // Ho aggiornato il nome dell'esportazione per riflettere il nuovo nome della funzione
