import React from 'react'
import Image from "next/image"
import Link from 'next/link'  // Importa Link da Next.js o React Router


const Logo = () => {
  return (
    <div><Link href="/">
            <Image 
            src = "/Images/logo/next.svg" 
            width={100}
            height={100}
            alt="logo"/>
        </Link>
        
    </div>
  )
}

export default Logo