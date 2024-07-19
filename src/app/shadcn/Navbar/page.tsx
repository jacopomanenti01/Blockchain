import React from 'react'
import Logo from './myLogo'
import NavigationBar from './nav-bar'
import ActionButtons from './action-button'



const Navbar = ()=> {
  return (
    <div className = "w-screen px-[1.2rem] py-[0.3rem] flex items-center justify-between">
        <Logo />
        <NavigationBar />
        <ActionButtons />
    </div>
  )
}

export default Navbar