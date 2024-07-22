import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import React from 'react'

const MyAvatar = () => {
  return (
    <div>
        <Avatar>
        <AvatarImage src="/images/logo/logo-2.svg" />
        <AvatarFallback>CN</AvatarFallback>
        </Avatar>
  </div>
  )
}

export default MyAvatar

