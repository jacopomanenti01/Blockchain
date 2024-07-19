import React from 'react'
import { Button } from "@/components/ui/button"
import MyAlertDialog from './myAlertDialog'



function MyButton({main}:{main: React.ReactNode}) {
  return (
    <div>
        <Button variant="outline">
           {main}
        </Button>
    </div>
  )
}

export default MyButton